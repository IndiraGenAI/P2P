interface GaugeChartProps {
  value: number;
  size?: 'md' | 'lg';
}

export function GaugeChart({ value, size = 'md' }: GaugeChartProps) {
  const radius = size === 'lg' ? 100 : 80;
  const strokeWidth = size === 'lg' ? 22 : 18;
  const circumference = Math.PI * radius;
  const progress = (value / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <svg
      width={svgSize}
      height={svgSize / 2 + strokeWidth}
      viewBox={`0 0 ${svgSize} ${svgSize / 2 + strokeWidth}`}
    >
      <defs>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <path
        d={`M ${strokeWidth} ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${
          svgSize - strokeWidth
        } ${radius + strokeWidth}`}
        fill="none"
        stroke="#ECFDF5"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d={`M ${strokeWidth} ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${
          svgSize - strokeWidth
        } ${radius + strokeWidth}`}
        fill="none"
        stroke="url(#gaugeGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
      />
    </svg>
  );
}
