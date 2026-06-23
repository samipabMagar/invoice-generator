import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} InvoiceGen. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm font-medium text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">Generator</Link>
          <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
          <Link href="/profile" className="hover:text-slate-900 transition-colors">Settings</Link>
        </div>
      </div>
    </footer>
  );
}
