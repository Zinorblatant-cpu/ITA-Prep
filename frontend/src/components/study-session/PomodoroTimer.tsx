import { motion } from "framer-motion";
import { Coffee, Pause, Play, SkipForward, Square, Timer } from "lucide-react";
import { useEffect, useRef } from "react";
import type { PomodoroConfig, PomodoroPhase } from "../../hooks/useActiveSessionTimer";
import { cn } from "../../utils/cn";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { useToast } from "../ui/Toast";

const PHASE_LABEL: Record<PomodoroPhase, string> = {
  work: "Foco",
  short_break: "Pausa curta",
  long_break: "Pausa longa",
};

function playPhaseChangeSound() {
  try {
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.4);
    oscillator.onended = () => ctx.close();
  } catch {
    // Web Audio indisponível neste navegador — ignora silenciosamente
  }
}

function formatMMSS(totalSeconds: number): string {
  const m = Math.floor(Math.max(totalSeconds, 0) / 60);
  const s = Math.max(totalSeconds, 0) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface PomodoroTimerProps {
  pomodoro: PomodoroConfig & { phase: PomodoroPhase; cyclesCompleted: number; secondsLeft: number; paused: boolean };
  onSkipPhase: () => void;
  onFinishClick: () => void;
  onPause: () => void;
  onResume: () => void;
}

export function PomodoroTimer({ pomodoro, onSkipPhase, onFinishClick, onPause, onResume }: PomodoroTimerProps) {
  const { toast } = useToast();
  const previousPhase = useRef(pomodoro.phase);

  useEffect(() => {
    if (previousPhase.current !== pomodoro.phase) {
      previousPhase.current = pomodoro.phase;
      playPhaseChangeSound();
      toast({
        title: pomodoro.phase === "work" ? "Hora de focar!" : "Hora da pausa!",
        description: PHASE_LABEL[pomodoro.phase],
        variant: "info",
      });
    }
  }, [pomodoro.phase, toast]);

  const isWork = pomodoro.phase === "work";
  const totalDurationSeconds =
    phaseMinutes(pomodoro) * 60;
  const progress = totalDurationSeconds > 0 ? ((totalDurationSeconds - pomodoro.secondsLeft) / totalDurationSeconds) * 100 : 0;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <motion.div
          animate={pomodoro.paused ? { scale: 1 } : { scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full",
            isWork ? "bg-accent/10 text-accent" : "bg-emerald-500/10 text-emerald-500",
          )}
        >
          {isWork ? <Timer size={28} /> : <Coffee size={28} />}
        </motion.div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">
            {PHASE_LABEL[pomodoro.phase]}
            {pomodoro.paused && " · Pausado"}
          </p>
          <p className="mt-1 text-4xl font-bold tabular-nums tracking-tight text-ink">{formatMMSS(pomodoro.secondsLeft)}</p>
          <p className="mt-1 text-xs text-ink-subtle">
            Pomodoro {pomodoro.cyclesCompleted + (isWork ? 1 : 0)} · {pomodoro.workMinutes}min foco / {pomodoro.breakMinutes}min pausa
          </p>
        </div>
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-surface-subtle">
          <div
            className={cn("h-full rounded-full transition-all", isWork ? "bg-accent" : "bg-emerald-500")}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {pomodoro.paused ? (
            <Button variant="secondary" onClick={onResume}>
              <Play size={14} /> Retomar
            </Button>
          ) : (
            <Button variant="secondary" onClick={onPause}>
              <Pause size={14} /> Pausar
            </Button>
          )}
          <Button variant="secondary" onClick={onSkipPhase}>
            <SkipForward size={14} /> Pular fase
          </Button>
          <Button variant="destructive" onClick={onFinishClick}>
            <Square size={14} /> Finalizar sessão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function phaseMinutes(pomodoro: PomodoroConfig & { phase: PomodoroPhase }): number {
  if (pomodoro.phase === "work") return pomodoro.workMinutes;
  if (pomodoro.phase === "long_break") return pomodoro.longBreakMinutes;
  return pomodoro.breakMinutes;
}
