import React from 'react'
import type { PlayerPosition } from '../data/scenarios'

interface PlayerMarkerProps {
  player: PlayerPosition
}

const teamColors = {
  you: '#00BFFF',
  partner: '#32CD32',
  opponent: '#ff6b6b',
}

export const PlayerMarker: React.FC<PlayerMarkerProps> = ({ player }) => {
  const color = teamColors[player.team]
  const radius = player.isYou ? 14 : 12

  return (
    <g>
      {/* Ghost position (where player was before) */}
      {player.ghostX !== undefined && player.ghostY !== undefined && (
        <>
          <circle
            cx={player.ghostX}
            cy={player.ghostY}
            r={radius}
            fill={color}
            opacity={0.2}
            strokeDasharray="4 2"
            stroke={color}
            strokeWidth="1"
          />
          <text
            x={player.ghostX}
            y={player.ghostY + 4}
            textAnchor="middle"
            fontSize="8"
            fill="white"
            opacity={0.3}
          >
            was
          </text>
        </>
      )}

      {/* Player circle */}
      <circle
        cx={player.x}
        cy={player.y}
        r={radius}
        fill={color}
        stroke="white"
        strokeWidth={player.isYou ? 3 : 2}
        filter={player.isYou ? 'url(#player-glow)' : undefined}
        className={player.isYou ? 'player-you' : undefined}
      />

      {/* Player icon (simple person shape) */}
      <circle cx={player.x} cy={player.y - 3} r={3} fill="white" opacity={0.9} />
      <line
        x1={player.x}
        y1={player.y}
        x2={player.x}
        y2={player.y + 5}
        stroke="white"
        strokeWidth="1.5"
        opacity={0.9}
      />

      {/* Label */}
      <text
        x={player.x}
        y={player.y + (player.team === 'opponent' ? -20 : 25)}
        textAnchor="middle"
        fontSize={player.isYou ? '10' : '9'}
        fill="white"
        fontWeight={player.isYou ? 'bold' : 'normal'}
        className="player-label"
      >
        {player.label}
      </text>

      {/* "You" indicator star */}
      {player.isYou && (
        <text
          x={player.x + 18}
          y={player.y - 10}
          fontSize="12"
          fill="#FFD700"
        >
          ★
        </text>
      )}
    </g>
  )
}
