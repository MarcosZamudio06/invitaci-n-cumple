import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useCountdown } from "../hooks/useCountdown";
function NumberBlock({
  value,
  label,
  disabled,
}: {
  value: number;
  label: string;
  disabled: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  useGSAP(
    () => {
      if (previous.current !== value && !disabled) {
        gsap.fromTo(
          ref.current,
          { yPercent: 30, opacity: 0.35 },
          { yPercent: 0, opacity: 1, duration: 0.22, ease: "power3.out" },
        );
      }
      previous.current = value;
    },
    { dependencies: [value, disabled], scope: ref, revertOnUpdate: true },
  );
  return (
    <div className="countdown-unit">
      <span className="number-mask">
        <span ref={ref} className="countdown-number">
          {String(value).padStart(2, "0")}
        </span>
      </span>
      <span className="countdown-label">{label}</span>
    </div>
  );
}
export function Countdown({
  targetDate,
  disabled,
}: {
  targetDate: Date | string | null;
  disabled: boolean;
}) {
  const remaining = useCountdown(targetDate);
  const scope = useRef<HTMLElement>(null);
  const celebrated = useRef(false);
  useGSAP(
    () => {
      if (!remaining?.started || celebrated.current || disabled) return;
      celebrated.current = true;
      gsap.fromTo(
        ".celebration-drop",
        { y: -12, opacity: 0, scale: 0.9 },
        {
          y: 24,
          opacity: 0,
          keyframes: [
            { opacity: 1, duration: 0.25 },
            { y: 24, opacity: 0, duration: 0.65 },
          ],
          stagger: 0.04,
          ease: "power2.out",
        },
      );
    },
    {
      scope,
      dependencies: [remaining?.started, disabled],
      revertOnUpdate: true,
    },
  );
  return (
    <section
      id="countdown"
      ref={scope}
      className="countdown-section"
      aria-label="Cuenta regresiva para el cumpleaños"
    >
      <div className="countdown-heading">
        <span className="small-cross" aria-hidden="true">
          +
        </span>
        <h2>
          {remaining?.started ? "¡HOY ES EL GRAN DÍA!" : "¡YA CASI ES EL DÍA!"}
        </h2>
        <p>
          {remaining?.started
            ? "La espera terminó. ¡A celebrar!"
            : "Cuenta los días. Nosotros ponemos el plan."}
        </p>
      </div>
      {remaining && !remaining.started ? (
        <div className="countdown" aria-live="off">
          {(["days", "hours", "minutes", "seconds"] as const).map((key, i) => (
            <NumberBlock
              key={key}
              value={remaining[key]}
              label={["DÍAS", "HORAS", "MINUTOS", "SEGUNDOS"][i]}
              disabled={disabled}
            />
          ))}
        </div>
      ) : !remaining ? (
        <p className="countdown-pending">
          La cuenta regresiva estará disponible cuando se configure una fecha
          válida.
        </p>
      ) : (
        <div className="countdown-finale" role="status">
          ¡Nos vemos en la fiesta!
          {Array.from({ length: 8 }, (_, i) => (
            <i
              key={i}
              className="celebration-drop"
              style={{ left: `${12 + i * 11}%` }}
              aria-hidden="true"
            />
          ))}
        </div>
      )}
      <span className="countdown-footnote">
        UN DÍA ESPECIAL MERECE UNA GRAN CELEBRACIÓN
      </span>
    </section>
  );
}
