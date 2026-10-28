import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border px-6 py-12 text-center">
      {Icon && (
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-surface-subtle text-ink-subtle">
          <Icon size={20} />
        </div>
      )}
      <p className="text-sm font-medium text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-subtle">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
