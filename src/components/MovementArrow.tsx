import React from 'react'
import type { Movement } from '../data/scenarios'

interface MovementArrowProps {
  movement: Movement
  visible: boolean
}

export const MovementArrow: React.FC<MovementArrowProps> = ({ movement, visible }) => {
  if (!visible) return null

  const isOpponent = movement.team === 'opponent'
  const color = isOpponent ? '#ff6b6b' : '#FFD700'
  const markerEnd = isOpponent ? 'url(#arrowhead-opponent)' : 'url(#arrowhead)'

  // Calculate midpoint for label
  const midX = (movement.fromX + movement.toX) / 2
  const midY = (movement.fromY + movement.toY) / 2

  // Calculate path
  let pathD: string
  if (movement.curved) {
    // Create a curved path using quadratic bezier
    const dx = movement.toX - movement.fromX
    const dy = movement.toY - movement.fromY
    // Control point perpendicular to the line
    const cpX = midX - dy * 0.2
    const cpY = midY + dx * 0.2
    pathD = `M ${movement.fromX} ${movement.fromY} Q ${cpX} ${cpY} ${movement.toX} ${movement.toY}`
  } else {
    pathD = `M ${movement.fromX} ${movement.fromY} L ${movement.toX} ${movement.toY}`
  }

  return (
    <g className="movement-arrow">
      {/* Arrow shadow */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="4"
        strokeDasharray="8 4"
        markerEnd={markerEnd}
      />
      {/* Arrow */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeDasharray="8 4"
        markerEnd={markerEnd}
        className="arrow-path"
      />
      {/* Label */}
      {movement.label && (
        <g>
          <rect
            x={midX - 30}
            y={midY - 8}
            width="60"
            height="16"
            rx="4"
            fill="rgba(0,0,0,0.7)"
          />
          <text
            x={midX}
            y={midY + 4}
            textAnchor="middle"
            fontSize="8"
            fill={color}
            fontWeight="bold"
          >
            {movement.label}
          </text>
        </g>
      )}
    </g>
  )
}
