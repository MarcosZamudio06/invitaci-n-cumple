/** Original geometric poolside graphics, not personal photography. */
export function PoolRing({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="120" cy="120" r="78" stroke="currentColor" strokeWidth="48" />
      <path
        d="M61 69l30 25M149 146l31 26M68 180l26-31M146 91l27-31"
        stroke="var(--ivory)"
        strokeWidth="35"
      />
      <circle
        cx="120"
        cy="120"
        r="101"
        stroke="var(--deep-teal)"
        strokeOpacity=".12"
        strokeWidth="2"
      />
      <circle
        cx="120"
        cy="120"
        r="54"
        stroke="var(--deep-teal)"
        strokeOpacity=".12"
        strokeWidth="2"
      />
    </svg>
  );
}
export function WaterLines({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 400"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {[0, 1, 2, 3, 4].map((n) => (
        <path
          key={n}
          d={`M-50 ${65 + n * 65}C120 ${-60 + n * 65} 220 ${180 + n * 65} 400 ${65 + n * 65}S680 ${-40 + n * 65} 850 ${65 + n * 65}`}
          stroke="currentColor"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}
export function PoolGraphic() {
  return (
    <div
      className="pool-graphic"
      role="img"
      aria-label="Ilustración original de una alberca con un flotador y ondas de agua"
    >
      <div className="pool-rim">
        <div className="pool-water">
          <WaterLines />
          <PoolRing className="graphic-ring" />
          <span className="graphic-bubble bubble-one" />
          <span className="graphic-bubble bubble-two" />
        </div>
      </div>
      <div className="graphic-label">
        <span>GOOD TIMES</span>
        <span>BY THE POOL.</span>
      </div>
      <span className="graphic-caption">UN PLAN PARA DISFRUTAR JUNTOS</span>
    </div>
  );
}
