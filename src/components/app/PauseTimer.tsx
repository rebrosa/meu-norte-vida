import { useEffect, useState } from "react";
import { formatCountdown, PAUSE_MINUTES } from "@/lib/dates";

export function PauseTimer() {
  const total = PAUSE_MINUTES * 60;
  const [remaining, setRemaining] = useState(total);

  useEffect(() => {
    const endsAt = Date.now() + total * 1000;
    const tick = () => setRemaining(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));
    const interval = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("focus", tick);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener("focus", tick);
    };
  }, [total]);

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <p role="timer" aria-label="Tempo restante da pausa" className="font-display text-7xl tabular-nums text-primary">{formatCountdown(remaining)}</p>
      <progress aria-label="Progresso da pausa" max={total} value={total - remaining} className="pause-progress h-3 w-full overflow-hidden rounded-full" />
      <p role="status" className="text-center text-lg text-muted-foreground">
        {remaining === 0 ? "Os 15 minutos terminaram. Como você está agora?" : "Sua pausa está em andamento. Um momento de cada vez."}
      </p>
    </div>
  );
}