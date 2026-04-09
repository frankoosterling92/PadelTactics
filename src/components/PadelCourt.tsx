import React from 'react'
import type { Scenario } from '../data/scenarios'
import type { PlayerSide } from '../App'
import { PlayerMarker } from './PlayerMarker'
import { MovementArrow } from './MovementArrow'
import { BallMarker } from './BallMarker'
import { ZoneHighlight } from './ZoneHighlight'
import { TechniqueOverlay } from './TechniqueOverlay'
import { PatternOverlay } from './PatternOverlay'

interface PadelCourtProps {
  scenario: Scenario
  showMovement: boolean
  animationStep: number
  playerSide: PlayerSide
}

// Court dimensions: 20m x 10m, scaled to SVG viewBox
// We use a viewBox of 200x400 (1 unit = 0.05m)
const COURT_WIDTH = 200
const COURT_HEIGHT = 400

export const PadelCourt: React.FC<PadelCourtProps> = ({ scenario, showMovement, animationStep, playerSide }) => {
  const leftLabel = playerSide === 'left' ? 'JOUW KANT' : 'PARTNER'
  const rightLabel = playerSide === 'right' ? 'JOUW KANT' : 'PARTNER'
  return (
    <svg
      viewBox={`-20 -20 ${COURT_WIDTH + 40} ${COURT_HEIGHT + 40}`}
      className="padel-court-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glass wall pattern */}
        <pattern id="glass-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="transparent" />
          <line x1="0" y1="0" x2="10" y2="10" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        </pattern>

        {/* Court surface gradient */}
        <linearGradient id="court-surface" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a6b3c" />
          <stop offset="50%" stopColor="#1d7a44" />
          <stop offset="100%" stopColor="#1a6b3c" />
        </linearGradient>

        {/* Glow filter for highlighted player */}
        <filter id="player-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Arrow marker */}
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#FFD700" />
        </marker>
        <marker id="arrowhead-opponent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#ff6b6b" />
        </marker>
      </defs>

      {/* Court background (outside area) */}
      <rect x="-20" y="-20" width={COURT_WIDTH + 40} height={COURT_HEIGHT + 40} fill="#0d3d1f" rx="4" />

      {/* Court surface */}
      <rect x="0" y="0" width={COURT_WIDTH} height={COURT_HEIGHT} fill="url(#court-surface)" />

      {/* Glass walls - back walls (full) */}
      <rect x="-4" y="-4" width={COURT_WIDTH + 8} height="4" fill="#4a90d9" opacity="0.3" />
      <rect x="-4" y={COURT_HEIGHT} width={COURT_WIDTH + 8} height="4" fill="#4a90d9" opacity="0.3" />

      {/* Glass walls - side walls (partial - first 4m from back = 80 units) */}
      <rect x="-4" y="-4" width="4" height="84" fill="#4a90d9" opacity="0.3" />
      <rect x={COURT_WIDTH} y="-4" width="4" height="84" fill="#4a90d9" opacity="0.3" />
      <rect x="-4" y={COURT_HEIGHT - 80} width="4" height="84" fill="#4a90d9" opacity="0.3" />
      <rect x={COURT_WIDTH} y={COURT_HEIGHT - 80} width="4" height="84" fill="#4a90d9" opacity="0.3" />

      {/* Wire fence - side walls (middle section) */}
      <rect x="-4" y="80" width="4" height={COURT_HEIGHT - 160} fill="#4a90d9" opacity="0.1" />
      <rect x={COURT_WIDTH} y="80" width="4" height={COURT_HEIGHT - 160} fill="#4a90d9" opacity="0.1" />

      {/* Court lines */}
      {/* Outer boundary */}
      <rect x="0" y="0" width={COURT_WIDTH} height={COURT_HEIGHT} fill="none" stroke="white" strokeWidth="2" />

      {/* Center line (net) */}
      <line x1="0" y1={COURT_HEIGHT / 2} x2={COURT_WIDTH} y2={COURT_HEIGHT / 2} stroke="white" strokeWidth="3" />

      {/* Net posts */}
      <circle cx="-2" cy={COURT_HEIGHT / 2} r="3" fill="#888" stroke="#666" strokeWidth="1" />
      <circle cx={COURT_WIDTH + 2} cy={COURT_HEIGHT / 2} r="3" fill="#888" stroke="#666" strokeWidth="1" />

      {/* Service lines - 3m from net = 60 units from center */}
      <line x1="0" y1={COURT_HEIGHT / 2 - 60} x2={COURT_WIDTH} y2={COURT_HEIGHT / 2 - 60} stroke="white" strokeWidth="1.5" />
      <line x1="0" y1={COURT_HEIGHT / 2 + 60} x2={COURT_WIDTH} y2={COURT_HEIGHT / 2 + 60} stroke="white" strokeWidth="1.5" />

      {/* Center service lines */}
      <line x1={COURT_WIDTH / 2} y1={COURT_HEIGHT / 2 - 60} x2={COURT_WIDTH / 2} y2={COURT_HEIGHT / 2} stroke="white" strokeWidth="1.5" />
      <line x1={COURT_WIDTH / 2} y1={COURT_HEIGHT / 2} x2={COURT_WIDTH / 2} y2={COURT_HEIGHT / 2 + 60} stroke="white" strokeWidth="1.5" />

      {/* Side labels */}
      <text x={COURT_WIDTH / 2} y={COURT_HEIGHT - 10} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="12" fontWeight="bold">
        JOUW KANT
      </text>
      <text x={COURT_WIDTH / 2} y="15" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="12" fontWeight="bold">
        TEGENSTANDER
      </text>

      {/* Left/Right labels */}
      <text x="25" y={COURT_HEIGHT - 25} textAnchor="middle" fill={playerSide === 'left' ? 'rgba(0,191,255,0.3)' : 'rgba(255,255,255,0.15)'} fontSize="9" fontWeight={playerSide === 'left' ? 'bold' : 'normal'}>
        {leftLabel}
      </text>
      <text x={COURT_WIDTH - 25} y={COURT_HEIGHT - 25} textAnchor="middle" fill={playerSide === 'right' ? 'rgba(0,191,255,0.3)' : 'rgba(255,255,255,0.15)'} fontSize="9" fontWeight={playerSide === 'right' ? 'bold' : 'normal'}>
        {rightLabel}
      </text>

      {/* Zone highlights */}
      {scenario.zones?.map((zone, i) => (
        <ZoneHighlight key={i} zone={zone} />
      ))}

      {/* Movement arrows */}
      {showMovement && scenario.movements?.map((movement, i) => (
        <MovementArrow key={i} movement={movement} visible={animationStep >= (movement.step ?? 0)} />
      ))}

      {/* Pattern overlay (step-by-step sequences) */}
      {scenario.pattern && (
        <PatternOverlay
          pattern={scenario.pattern}
          animationStep={animationStep}
          showMovement={showMovement}
        />
      )}

      {/* Technique overlay (trajectories, contact point, spin) */}
      {scenario.technique && (
        <TechniqueOverlay
          technique={scenario.technique}
          animationStep={animationStep}
          showMovement={showMovement}
        />
      )}

      {/* Ball position */}
      {scenario.ball && (
        <BallMarker x={scenario.ball.x} y={scenario.ball.y} />
      )}

      {/* Player positions */}
      {scenario.players.map((player, i) => (
        <PlayerMarker key={i} player={player} />
      ))}
    </svg>
  )
}
