interface SparklineProps {
  data: number[];
  positive?: boolean;
  width?: number;
  height?: number;
}

export function Sparkline({
  data,
  positive = true,
  width = 80,
  height = 32,
}: SparklineProps) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const color = positive ? "oklch(0.70 0.20 145)" : "oklch(0.65 0.22 25)";
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      role="img"
    >
      <title>Price sparkline</title>
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
