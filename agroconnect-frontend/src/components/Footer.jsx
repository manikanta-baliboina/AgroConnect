export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/40 bg-white/55 backdrop-blur-md">
      <div className="page-shell app-footer-shell flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-slate-500">
        <div className="app-footer-brand flex items-center gap-3">
          <span className="font-semibold text-slate-800">AgroConnect</span>
          <span className="badge">Farm to table</span>
        </div>
        <div className="app-footer-links flex items-center gap-4">
          <span>Secure payments</span>
          <span>Fresh produce</span>
          <span>Trusted farmers</span>
        </div>
        <div className="app-footer-copy">© 2026 AgroConnect</div>
      </div>
    </footer>
  );
}
