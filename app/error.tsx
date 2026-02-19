"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="state-page" role="alert">
      <div className="state-card">
        <p className="state-eyebrow">Terjadi Kendala</p>
        <h1>Oops, ada masalah saat memuat halaman.</h1>
        <p className="muted">Silakan coba refresh halaman atau kembali ke beranda.</p>
        <div className="state-actions">
          <button type="button" className="btn btn-primary" onClick={reset}>
            Coba Lagi
          </button>
          <Link href="/" className="btn btn-ghost">
            Kembali ke Home
          </Link>
        </div>
      </div>
    </main>
  );
}
