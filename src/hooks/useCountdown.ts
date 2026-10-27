import { useEffect, useState } from "react";
import { countdown } from "../utils/event";

/** Wall-clock based, not decrement based: background tabs never accumulate drift. */
export function useCountdown(targetDate: Date | string | null) {
  const parsed =
    targetDate instanceof Date
      ? targetDate.getTime()
      : targetDate
        ? Date.parse(targetDate)
        : NaN;
  const target = Number.isFinite(parsed) ? parsed : null;
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    if (target === null) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      const current = Date.now();
      setNow(current);
      if (current >= target && timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
      }
    };
    update();
    if (Date.now() < target) timer = setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    return () => {
      if (timer !== undefined) clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, [target]);

  return countdown(target === null ? null : new Date(target), now);
}
