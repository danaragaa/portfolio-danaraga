import { NextResponse } from "next/server";
import { evaluateContactGuard, recordContactDeliverySuccess } from "@/lib/contactGuard";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
  formStartedAt?: number;
};

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 4;
const COOLDOWN_MS = 60 * 1000;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const MIN_FORM_FILL_MS = 3000;
const MAX_MESSAGE_LENGTH = 1200;
const RESEND_TIMEOUT_MS = 10000;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getAllowedOrigin() {
  return process.env.SITE_URL?.trim().replace(/\/$/, "") ?? "";
}

function isRequestOriginAllowed(request: Request) {
  const allowedOrigin = getAllowedOrigin();
  if (!allowedOrigin) {
    return true;
  }

  const originHeader = request.headers.get("origin");
  const refererHeader = request.headers.get("referer");

  if (originHeader) {
    return originHeader.replace(/\/$/, "") === allowedOrigin;
  }

  if (refererHeader) {
    return refererHeader.startsWith(`${allowedOrigin}/`) || refererHeader === allowedOrigin;
  }

  return true;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  try {
    if (!isRequestOriginAllowed(request)) {
      return NextResponse.json({ message: "Origin request tidak diizinkan." }, { status: 403 });
    }

    const now = Date.now();
    const clientIp = getClientIp(request);

    const payload = (await request.json()) as ContactPayload;
    const name = payload.name?.trim() ?? "";
    const email = payload.email?.trim() ?? "";
    const message = payload.message?.trim() ?? "";
    const website = payload.website?.trim() ?? "";
    const formStartedAt = Number(payload.formStartedAt ?? 0);

    if (website) {
      return NextResponse.json({ message: "Pesan berhasil dikirim." });
    }

    if (!formStartedAt || now - formStartedAt < MIN_FORM_FILL_MS) {
      return NextResponse.json({ message: "Permintaan terdeteksi tidak valid." }, { status: 429 });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ message: "Semua field wajib diisi." }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Format email tidak valid." }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { message: `Pesan terlalu panjang. Maksimal ${MAX_MESSAGE_LENGTH} karakter.` },
        { status: 400 },
      );
    }

    const fingerprint = `${email.toLowerCase()}::${message.toLowerCase()}`;
    const guardResult = await evaluateContactGuard({
      clientIp,
      fingerprint,
      now,
      rateLimitWindowMs: RATE_LIMIT_WINDOW_MS,
      maxRequestsPerWindow: MAX_REQUESTS_PER_WINDOW,
      cooldownMs: COOLDOWN_MS,
      duplicateWindowMs: DUPLICATE_WINDOW_MS,
    });
    if (!guardResult.allowed) {
      return NextResponse.json(
        { message: guardResult.message },
        { status: guardResult.status },
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactToEmail = process.env.CONTACT_TO_EMAIL;
    const contactFromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!resendApiKey || !contactToEmail || !contactFromEmail) {
      return NextResponse.json(
        { message: "Konfigurasi email belum lengkap di environment variables." },
        { status: 500 },
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: contactFromEmail,
        to: [contactToEmail],
        subject: `Pesan portfolio dari ${name}`,
        reply_to: email,
        text: `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      console.error("[contact-api] resend delivery failed", {
        status: resendResponse.status,
        body: errorBody,
      });
      return NextResponse.json(
        { message: "Gagal mengirim email. Silakan coba lagi dalam beberapa saat." },
        { status: 502 },
      );
    }

    await recordContactDeliverySuccess({
      clientIp,
      fingerprint,
      now,
      rateLimitWindowMs: RATE_LIMIT_WINDOW_MS,
      maxRequestsPerWindow: MAX_REQUESTS_PER_WINDOW,
      cooldownMs: COOLDOWN_MS,
      duplicateWindowMs: DUPLICATE_WINDOW_MS,
    });

    return NextResponse.json({ message: "Pesan berhasil dikirim." });
  } catch (error) {
    console.error("[contact-api] unexpected error", error);

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { message: "Waktu kirim pesan habis. Coba lagi beberapa saat." },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan saat memproses permintaan." },
      { status: 500 },
    );
  }
}
