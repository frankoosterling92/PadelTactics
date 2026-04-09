import React from 'react'
import type { Zone } from '../data/scenarios'

interface ZoneHighlightProps {
  zone: Zone
}

export const ZoneHighlight: React.FC<ZoneHighlightProps> = ({ zone }) => {
  return (
    <g className="zone-highlight">
      <rect
        x={zone.x}
        y={zone.y}
        width={zone.width}
        height={zone.height}
        fill={zone.color}
        opacity={zone.opacity ?? 0.15}
        rx="4"
      />
      <rect
        x={zone.x}
        y={zone.y}
        width={zone.width}
        height={zone.height}
        fill="none"
        stroke={zone.color}
        strokeWidth="1"
        opacity={0.4}
        rx="4"
        strokeDasharray="4 2"
      />
      {zone.label && (
        <text
          x={zone.x + zone.width / 2}
          y={zone.y + zone.height / 2 + 3}
          textAnchor="middle"
          fontSize="8"
          fill={zone.color}
          opacity={0.7}
          fontWeight="bold"
        >
          {zone.label}
        </text>
      )}
    </g>
  )
}
