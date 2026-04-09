import React from 'react'

interface BallMarkerProps {
  x: number
  y: number
}

export const BallMarker: React.FC<BallMarkerProps> = ({ x, y }) => {
  return (
    <g className="ball-marker">
      {/* Ball glow */}
      <circle cx={x} cy={y} r="8" fill="#FFFF00" opacity={0.2} />
      {/* Ball */}
      <circle cx={x} cy={y} r="5" fill="#FFFF00" stroke="#DAA520" strokeWidth="1" />
      {/* Ball seam */}
      <path
        d={`M ${x - 3} ${y - 3} Q ${x} ${y - 1} ${x + 3} ${y - 3}`}
        fill="none"
        stroke="#DAA520"
        strokeWidth="0.5"
      />
      <path
        d={`M ${x - 3} ${y + 3} Q ${x} ${y + 1} ${x + 3} ${y + 3}`}
        fill="none"
        stroke="#DAA520"
        strokeWidth="0.5"
      />
    </g>
  )
}
