import Link from "next/link";

export default function NotFound() {
  return (
    <main className="state-page">
      <div className="state-card">
        <p className="state-eyebrow">404</p>
        <h1>Halaman tidak ditemukan.</h1>
        <p className="muted">URL yang kamu akses mungkin sudah dipindah atau tidak tersedia.</p>
        <div className="state-actions">
          <Link href="/" className="btn btn-primary">
            Kembali ke Home
          </Link>
        </div>
      </div>
    </main>
  );
}
