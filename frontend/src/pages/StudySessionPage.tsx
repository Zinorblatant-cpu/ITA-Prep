import { motion } from "framer-motion";
import { useState } from "react";
import { ActiveSessionTimer } from "../components/study-session/ActiveSessionTimer";
import { FinishSessionForm } from "../components/study-session/FinishSessionForm";
import { PomodoroTimer } from "../components/study-session/PomodoroTimer";
import { SessionHistoryTable } from "../components/study-session/SessionHistoryTable";
import { StartSessionForm } from "../components/study-session/StartSessionForm";
import { useActiveSessionTimer } from "../hooks/useActiveSessionTimer";

export function StudySessionPage() {
  const { session, mode, pomodoro, elapsedSeconds, startTracking, stopTracking, skipPomodoroPhase, pausePomodoro, resumePomodoro } =
    useActiveSessionTimer();
  const [showFinishForm, setShowFinishForm] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-ink">Sessão de Estudo</h1>
        <p className="text-sm text-ink-subtle">Registre seu tempo de estudo com precisão — no cronômetro livre ou no método Pomodoro — tudo é salvo automaticamente ao finalizar.</p>
      </div>

      {!session && <StartSessionForm onStarted={startTracking} />}

      {session && !showFinishForm && mode === "pomodoro" && pomodoro && (
        <PomodoroTimer
          pomodoro={pomodoro}
          onSkipPhase={skipPomodoroPhase}
          onFinishClick={() => setShowFinishForm(true)}
          onPause={pausePomodoro}
          onResume={resumePomodoro}
        />
      )}

      {session && !showFinishForm && mode === "livre" && (
        <ActiveSessionTimer session={session} elapsedSeconds={elapsedSeconds} onFinishClick={() => setShowFinishForm(true)} />
      )}

      {session && showFinishForm && (
        <FinishSessionForm
          session={session}
          onFinished={() => {
            stopTracking();
            setShowFinishForm(false);
          }}
        />
      )}

      <SessionHistoryTable />
    </motion.div>
  );
}
