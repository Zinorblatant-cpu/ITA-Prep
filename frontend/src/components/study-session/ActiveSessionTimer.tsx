import { motion } from "framer-motion";
import { Square, Timer } from "lucide-react";
import type { StudySessionDTO } from "@ita/shared-types";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { formatDuration } from "../../utils/format";

interface ActiveSessionTimerProps {
  session: StudySessionDTO;
  elapsedSeconds: number;
  onFinishClick: () => void;
}

export function ActiveSessionTimer({ session, elapsedSeconds, onFinishClick }: ActiveSessionTimerProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent"
        >
          <Timer size={28} />
        </motion.div>
        <div>
          <p className="text-4xl font-bold tabular-nums tracking-tight text-ink">
            {formatDuration(elapsedSeconds)}
          </p>
          <p className="mt-1 text-sm text-ink-subtle">Sessão em andamento desde {new Date(session.startedAt).toLocaleTimeString("pt-BR")}</p>
        </div>
        <Button variant="destructive" onClick={onFinishClick}>
          <Square size={14} /> Finalizar sessão
        </Button>
      </CardContent>
    </Card>
  );
}
