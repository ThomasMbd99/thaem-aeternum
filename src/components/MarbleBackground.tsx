interface Props {
  colors: [string, string, string];
  seed: number;
  opacity?: number;
}

const MarbleBackground = ({ colors, seed, opacity = 0.18 }: Props) => {
  const id = `marble-${seed}`;
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity }}
    >
      <defs>
        <filter id={id} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.012 0.025"
            numOctaves="6"
            seed={seed}
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="3 0 0 0 -0.5  0 3 0 0 -0.5  0 0 3 0 -0.5  0 0 0 18 -7"
            in="noise"
            result="threshold"
          />
          <feComposite in="threshold" in2="SourceGraphic" operator="over" result="comp" />
        </filter>

        <linearGradient id={`g1-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="50%" stopColor={colors[1]} />
          <stop offset="100%" stopColor={colors[2]} />
        </linearGradient>

        <linearGradient id={`g2-${seed}`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors[2]} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors[0]} stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Base fluid blobs via turbulence */}
      <rect width="100%" height="100%" fill={`url(#g1-${seed})`} filter={`url(#${id})`} />

      {/* Overlay gradient pour profondeur */}
      <rect width="100%" height="100%" fill={`url(#g2-${seed})`} style={{ mixBlendMode: 'multiply' }} />

      {/* Bulles décoratives (comme sur les images) */}
      {[
        { cx: '20%', cy: '30%', r: '8%' },
        { cx: '70%', cy: '15%', r: '5%' },
        { cx: '50%', cy: '60%', r: '10%' },
        { cx: '80%', cy: '70%', r: '6%' },
        { cx: '30%', cy: '75%', r: '7%' },
        { cx: '60%', cy: '40%', r: '4%' },
        { cx: '15%', cy: '55%', r: '3.5%' },
        { cx: '85%', cy: '40%', r: '9%' },
      ].map((b, i) => (
        <circle
          key={i}
          cx={b.cx}
          cy={b.cy}
          r={b.r}
          fill={colors[i % 3]}
          fillOpacity="0.25"
          stroke={colors[2]}
          strokeWidth="0.5"
          strokeOpacity="0.3"
          filter={`url(#${id})`}
        />
      ))}
    </svg>
  );
};

export default MarbleBackground;
