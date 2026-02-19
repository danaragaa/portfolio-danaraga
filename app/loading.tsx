export default function Loading() {
  return (
    <main className="state-page state-loading" aria-busy="true" aria-live="polite">
      <div className="state-card">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line short" />
        <div className="state-actions">
          <div className="skeleton skeleton-button" />
          <div className="skeleton skeleton-button ghost" />
        </div>
      </div>
    </main>
  );
}
