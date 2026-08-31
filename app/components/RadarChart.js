'use client'

export default function RadarChart({ scores, size = 200, labels }) {
  const center = size / 2
  const radius = size * 0.38
  const keys = labels || Object.keys(scores)
  const n = keys.length
  const angleStep = (2 * Math.PI) / n

  function polarToCartesian(angle, r) {
    return {
      x: center + r * Math.cos(angle - Math.PI / 2),
      y: center + r * Math.sin(angle - Math.PI / 2)
    }
  }

  // Grilles
  const grids = [0.25, 0.5, 0.75, 1].map(scale => {
    const points = keys.map((_, i) => {
      const p = polarToCartesian(i * angleStep, radius * scale)
      return `${p.x},${p.y}`
    }).join(' ')
    return points
  })

  // Axes
  const axes = keys.map((_, i) => {
    const end = polarToCartesian(i * angleStep, radius)
    return { x1: center, y1: center, x2: end.x, y2: end.y }
  })

  // Valeurs
  const valuePoints = keys.map((key, i) => {
    const val = (scores[key] || 0) / 100
    const p = polarToCartesian(i * angleStep, radius * val)
    return `${p.x},${p.y}`
  }).join(' ')

  // Labels
  const labelPositions = keys.map((key, i) => {
    const p = polarToCartesian(i * angleStep, radius * 1.28)
    return { x: p.x, y: p.y, label: key }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grilles */}
      {grids.map((points, i) => (
        <polygon key={i} points={points}
          fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
      ))}

      {/* Axes */}
      {axes.map((ax, i) => (
        <line key={i} x1={ax.x1} y1={ax.y1} x2={ax.x2} y2={ax.y2}
          stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
      ))}

      {/* Zone de valeurs */}
      <polygon points={valuePoints}
        fill="rgba(245,158,11,0.15)"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinejoin="round" />

      {/* Points */}
      {keys.map((key, i) => {
        const val = (scores[key] || 0) / 100
        const p = polarToCartesian(i * angleStep, radius * val)
        return (
          <circle key={i} cx={p.x} cy={p.y} r="3.5"
            fill="#F59E0B" stroke="white" strokeWidth="1.5" />
        )
      })}

      {/* Labels */}
      {labelPositions.map((lp, i) => (
        <text key={i} x={lp.x} y={lp.y}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fontFamily="sans-serif"
          fill="#374151" fontWeight="500">
          {lp.label.length > 8 ? lp.label.substring(0, 7) + '…' : lp.label}
        </text>
      ))}

      {/* Centre */}
      <circle cx={center} cy={center} r="2" fill="#F59E0B" opacity="0.4" />
    </svg>
  )
}
