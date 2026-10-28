import {
  BarChart3,
  BookX,
  Calendar,
  ClipboardList,
  Compass,
  Flag,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Menu,
  RotateCcw,
  Settings,
  Timer,
  Trophy,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/subjects", label: "Disciplinas", icon: Compass },
  { to: "/study-session", label: "Sessão de Estudo", icon: Timer },
  { to: "/reviews", label: "Revisões", icon: RotateCcw },
  { to: "/error-notebook", label: "Caderno de Erros", icon: BookX },
  { to: "/questions", label: "Questões", icon: ListChecks },
  { to: "/goals", label: "Metas", icon: Flag },
  { to: "/statistics", label: "Estatísticas", icon: BarChart3 },
  { to: "/mock-exams", label: "Simulados", icon: ClipboardList },
  { to: "/gamification", label: "Gamificação", icon: Trophy },
  { to: "/calendar", label: "Calendário", icon: Calendar },
  { to: "/settings", label: "Configurações", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-fg">
          <GraduationCap size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold leading-none text-ink">ITA 2028</p>
          <p className="text-xs text-ink-subtle">Painel de estudos</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-ink-muted hover:bg-surface-subtle hover:text-ink",
              )
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface md:block">
        <SidebarContent />
      </aside>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface shadow-subtle md:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={18} />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border bg-surface shadow-card">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md text-ink-muted hover:bg-surface-subtle"
              aria-label="Fechar menu"
            >
              <X size={16} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
