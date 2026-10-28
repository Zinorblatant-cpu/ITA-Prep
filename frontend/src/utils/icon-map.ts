import {
  Atom,
  BookOpen,
  CheckCircle,
  Clipboard,
  ClipboardList,
  Clock,
  FlaskConical,
  Flame,
  HelpCircle,
  Languages,
  ListChecks,
  Sigma,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  sigma: Sigma,
  atom: Atom,
  "flask-conical": FlaskConical,
  "book-open": BookOpen,
  languages: Languages,
  flame: Flame,
  clock: Clock,
  "list-checks": ListChecks,
  "clipboard-list": ClipboardList,
  "check-circle": CheckCircle,
  clipboard: Clipboard,
};

export function resolveIcon(name: string | undefined | null): LucideIcon {
  if (!name) return HelpCircle;
  return ICON_MAP[name] ?? HelpCircle;
}
