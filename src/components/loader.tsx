export default function Loader({ size: _size, color }: { color?: string; size?: number }) {
  const size = _size || 50;

  return (
    <div style={{ position: 'relative', height: size, width: size }}>
      <div className="loader" style={{ height: size, width: size }}>
        <svg className="circular" style={{ height: size, width: size }}>
          <circle
            className="path"
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={size / 2 - size / 10}
            stroke={color || '#6366f1'}
            strokeMiterlimit="10"
            strokeWidth={size / 10}
          />
        </svg>
      </div>
    </div>
  );
}
