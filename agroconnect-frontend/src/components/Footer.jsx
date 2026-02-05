export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90">
      <div className="page-shell py-6 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">AgroConnect</span>
          <span className="badge">Farm to table</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Secure payments</span>
          <span>Fresh produce</span>
          <span>Trusted farmers</span>
        </div>
        <div>© 2026 AgroConnect</div>
      </div>
    </footer>
  );
}
