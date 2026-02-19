import { Redis } from "@upstash/redis";

type GuardInput = {
  clientIp: string;
  fingerprint: string;
  now: number;
  rateLimitWindowMs: number;
  maxRequestsPerWindow: number;
  cooldownMs: number;
  duplicateWindowMs: number;
};

type GuardResult =
  | { allowed: true }
  | { allowed: false; message: string; status: number };

const ipRequestHistory = new Map<string, number[]>();
const lastSentByIp = new Map<string, number>();
const lastFingerprintSubmission = new Map<string, number>();

let cachedRedis: Redis | null | undefined;

function toKeySafe(value: string) {
  return Buffer.from(value).toString("base64url");
}

function getRedisClient() {
  if (cachedRedis !== undefined) {
    return cachedRedis;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    cachedRedis = null;
    return cachedRedis;
  }

  cachedRedis = new Redis({ url, token });
  return cachedRedis;
}

function cleanupMemoryEntries(now: number, rateLimitWindowMs: number, duplicateWindowMs: number) {
  for (const [ip, timestamps] of ipRequestHistory.entries()) {
    const recentTimestamps = timestamps.filter((timestamp) => now - timestamp <= rateLimitWindowMs);
    if (recentTimestamps.length === 0) {
      ipRequestHistory.delete(ip);
    } else {
      ipRequestHistory.set(ip, recentTimestamps);
    }
  }

  for (const [fingerprint, timestamp] of lastFingerprintSubmission.entries()) {
    if (now - timestamp > duplicateWindowMs) {
      lastFingerprintSubmission.delete(fingerprint);
    }
  }
}

export async function evaluateContactGuard(input: GuardInput): Promise<GuardResult> {
  const {
    clientIp,
    fingerprint,
    now,
    rateLimitWindowMs,
    maxRequestsPerWindow,
    cooldownMs,
    duplicateWindowMs,
  } = input;

  const redis = getRedisClient();

  if (redis) {
    const ipKey = toKeySafe(clientIp);
    const fpKey = toKeySafe(fingerprint);
    const rateKey = `contact:rate:${ipKey}`;
    const cooldownKey = `contact:cooldown:${ipKey}`;
    const duplicateKey = `contact:dup:${fpKey}`;

    const [rateCountRaw, lastIpSubmissionRaw, duplicateRaw] = await redis.mget<[
      number | string | null,
      number | string | null,
      number | string | null,
    ]>([rateKey, cooldownKey, duplicateKey]);

    const rateCount = Number(rateCountRaw ?? 0);
    if (rateCount >= maxRequestsPerWindow) {
      return {
        allowed: false,
        message: "Terlalu banyak percobaan. Coba lagi beberapa saat.",
        status: 429,
      };
    }

    const lastIpSubmission = Number(lastIpSubmissionRaw ?? 0);
    if (lastIpSubmission && now - lastIpSubmission < cooldownMs) {
      return {
        allowed: false,
        message: "Tunggu sebentar sebelum mengirim pesan berikutnya.",
        status: 429,
      };
    }

    const duplicateAt = Number(duplicateRaw ?? 0);
    if (duplicateAt && now - duplicateAt < duplicateWindowMs) {
      return {
        allowed: false,
        message: "Pesan serupa sudah diterima. Mohon tunggu sebelum mengirim ulang.",
        status: 429,
      };
    }

    return { allowed: true };
  }

  cleanupMemoryEntries(now, rateLimitWindowMs, duplicateWindowMs);

  const ipHistory = ipRequestHistory.get(clientIp) ?? [];
  const recentIpHistory = ipHistory.filter((timestamp) => now - timestamp <= rateLimitWindowMs);
  if (recentIpHistory.length >= maxRequestsPerWindow) {
    return {
      allowed: false,
      message: "Terlalu banyak percobaan. Coba lagi beberapa saat.",
      status: 429,
    };
  }

  const lastIpSubmission = lastSentByIp.get(clientIp);
  if (lastIpSubmission && now - lastIpSubmission < cooldownMs) {
    return {
      allowed: false,
      message: "Tunggu sebentar sebelum mengirim pesan berikutnya.",
      status: 429,
    };
  }

  const duplicateAt = lastFingerprintSubmission.get(fingerprint);
  if (duplicateAt && now - duplicateAt < duplicateWindowMs) {
    return {
      allowed: false,
      message: "Pesan serupa sudah diterima. Mohon tunggu sebelum mengirim ulang.",
      status: 429,
    };
  }

  return { allowed: true };
}

export async function recordContactDeliverySuccess(input: GuardInput) {
  const {
    clientIp,
    fingerprint,
    now,
    rateLimitWindowMs,
    cooldownMs,
    duplicateWindowMs,
  } = input;

  const redis = getRedisClient();

  if (redis) {
    const ipKey = toKeySafe(clientIp);
    const fpKey = toKeySafe(fingerprint);
    const rateKey = `contact:rate:${ipKey}`;
    const cooldownKey = `contact:cooldown:${ipKey}`;
    const duplicateKey = `contact:dup:${fpKey}`;

    await redis
      .pipeline()
      .incr(rateKey)
      .expire(rateKey, Math.ceil(rateLimitWindowMs / 1000))
      .set(cooldownKey, now, { ex: Math.ceil(cooldownMs / 1000) })
      .set(duplicateKey, now, { ex: Math.ceil(duplicateWindowMs / 1000) })
      .exec();

    return;
  }

  const ipHistory = ipRequestHistory.get(clientIp) ?? [];
  const recentIpHistory = ipHistory.filter((timestamp) => now - timestamp <= rateLimitWindowMs);
  ipRequestHistory.set(clientIp, [...recentIpHistory, now]);
  lastSentByIp.set(clientIp, now);
  lastFingerprintSubmission.set(fingerprint, now);
}
