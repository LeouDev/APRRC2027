const COLORS = ["#F5A623", "#4FB477", "#3B8FD6", "#E8467D", "#F5D33C", "#3B8FD6", "#E8467D", "#4FB477"];

export function BuntingFlags({ className = "" }: { className?: string }) {
  const flags = Array.from({ length: 16 });
  return (
    <svg
      viewBox="0 0 960 60"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M0 4 Q 480 44 960 4" fill="none" stroke="#cbd5e1" strokeWidth="2" />
      {flags.map((_, i) => {
        const x = (960 / (flags.length - 1)) * i;
        const t = i / (flags.length - 1);
        const y = 4 + Math.sin(t * Math.PI) * 20;
        const color = COLORS[i % COLORS.length];
        return (
          <path
            key={i}
            d={`M ${x - 12} ${y} L ${x + 12} ${y} L ${x} ${y + 26} Z`}
            fill={color}
            opacity={0.95}
          />
        );
      })}
    </svg>
  );
}
