import { useCallback, useEffect, useState } from "react";
import type { StudySessionDTO } from "@ita/shared-types";

const STORAGE_KEY = "ita-active-session";

export type SessionMode = "livre" | "pomodoro";
export type PomodoroPhase = "work" | "short_break" | "long_break";

export interface PomodoroConfig {
  workMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  cyclesBeforeLongBreak: number;
}

interface PomodoroRuntimeState {
  phase: PomodoroPhase;
  phaseEndAt: string;
  cyclesCompleted: number;
  paused: boolean;
  pausedSecondsLeft?: number;
}

type StoredPomodoro = PomodoroConfig & PomodoroRuntimeState;

interface StoredSession {
  session: StudySessionDTO;
  mode: SessionMode;
  pomodoro?: StoredPomodoro;
}

function readStored(): StoredSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
}

function persist(value: StoredSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function phaseDurationMinutes(phase: PomodoroPhase, config: PomodoroConfig): number {
  if (phase === "work") return config.workMinutes;
  if (phase === "long_break") return config.longBreakMinutes;
  return config.breakMinutes;
}

function advancePhase(
  current: PomodoroPhase,
  cyclesCompleted: number,
  config: PomodoroConfig,
): { phase: PomodoroPhase; cyclesCompleted: number } {
  if (current === "work") {
    const newCycles = cyclesCompleted + 1;
    const isLongBreak = newCycles % config.cyclesBeforeLongBreak === 0;
    return { phase: isLongBreak ? "long_break" : "short_break", cyclesCompleted: newCycles };
  }
  return { phase: "work", cyclesCompleted };
}

export function useActiveSessionTimer() {
  const [stored, setStored] = useState<StoredSession | null>(readStored);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [pomodoroSecondsLeft, setPomodoroSecondsLeft] = useState(0);

  useEffect(() => {
    if (!stored) return;
    const startedAt = new Date(stored.session.startedAt).getTime();

    const tick = () => {
      setElapsedSeconds(Math.max(Math.floor((Date.now() - startedAt) / 1000), 0));

      if (stored.mode === "pomodoro" && stored.pomodoro) {
        if (stored.pomodoro.paused) {
          setPomodoroSecondsLeft(stored.pomodoro.pausedSecondsLeft ?? 0);
          return;
        }

        const phaseEndAt = new Date(stored.pomodoro.phaseEndAt).getTime();
        const remaining = Math.round((phaseEndAt - Date.now()) / 1000);

        if (remaining <= 0) {
          setStored((prev) => {
            if (!prev?.pomodoro) return prev;
            const { phase, cyclesCompleted } = advancePhase(prev.pomodoro.phase, prev.pomodoro.cyclesCompleted, prev.pomodoro);
            const next: StoredSession = {
              ...prev,
              pomodoro: {
                ...prev.pomodoro,
                phase,
                cyclesCompleted,
                phaseEndAt: new Date(Date.now() + phaseDurationMinutes(phase, prev.pomodoro) * 60_000).toISOString(),
              },
            };
            persist(next);
            return next;
          });
        } else {
          setPomodoroSecondsLeft(remaining);
        }
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [stored]);

  const startTracking = useCallback(
    (newSession: StudySessionDTO, mode: SessionMode = "livre", pomodoroConfig?: PomodoroConfig) => {
      const initial: StoredSession = {
        session: newSession,
        mode,
        pomodoro:
          mode === "pomodoro" && pomodoroConfig
            ? {
                ...pomodoroConfig,
                phase: "work",
                cyclesCompleted: 0,
                phaseEndAt: new Date(Date.now() + pomodoroConfig.workMinutes * 60_000).toISOString(),
                paused: false,
              }
            : undefined,
      };
      persist(initial);
      setStored(initial);
    },
    [],
  );

  const stopTracking = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStored(null);
    setElapsedSeconds(0);
    setPomodoroSecondsLeft(0);
  }, []);

  const skipPomodoroPhase = useCallback(() => {
    setStored((prev) => {
      if (!prev?.pomodoro) return prev;
      const { phase, cyclesCompleted } = advancePhase(prev.pomodoro.phase, prev.pomodoro.cyclesCompleted, prev.pomodoro);
      const next: StoredSession = {
        ...prev,
        pomodoro: {
          ...prev.pomodoro,
          phase,
          cyclesCompleted,
          phaseEndAt: new Date(Date.now() + phaseDurationMinutes(phase, prev.pomodoro) * 60_000).toISOString(),
        },
      };
      persist(next);
      return next;
    });
  }, []);

  const pausePomodoro = useCallback(() => {
    setStored((prev) => {
      if (!prev?.pomodoro || prev.pomodoro.paused) return prev;
      const remaining = Math.max(
        Math.round((new Date(prev.pomodoro.phaseEndAt).getTime() - Date.now()) / 1000),
        0,
      );
      const next: StoredSession = {
        ...prev,
        pomodoro: { ...prev.pomodoro, paused: true, pausedSecondsLeft: remaining },
      };
      persist(next);
      return next;
    });
  }, []);

  const resumePomodoro = useCallback(() => {
    setStored((prev) => {
      if (!prev?.pomodoro || !prev.pomodoro.paused) return prev;
      const remaining = prev.pomodoro.pausedSecondsLeft ?? 0;
      const next: StoredSession = {
        ...prev,
        pomodoro: {
          ...prev.pomodoro,
          paused: false,
          phaseEndAt: new Date(Date.now() + remaining * 1000).toISOString(),
        },
      };
      persist(next);
      return next;
    });
  }, []);

  return {
    session: stored?.session ?? null,
    mode: stored?.mode ?? "livre",
    elapsedSeconds,
    pomodoro: stored?.pomodoro ? { ...stored.pomodoro, secondsLeft: pomodoroSecondsLeft } : null,
    startTracking,
    stopTracking,
    skipPomodoroPhase,
    pausePomodoro,
    resumePomodoro,
  };
}
