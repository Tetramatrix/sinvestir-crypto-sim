import { TrendingUp } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border-custom bg-surface/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <TrendingUp size={20} className="text-primary" />
          </div>
          <div>
            <div className="font-semibold text-sm leading-tight">
              S&apos;investir
            </div>
            <div className="text-xs text-muted">Simulateur Crypto</div>
          </div>
        </div>
        <a
          href="https://sinvestir.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost text-xs"
        >
          sinvestir.fr
        </a>
      </div>
    </header>
  );
}
