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

// Padel court: 20m x 10m
// Scale: 1m = 20 units
// ViewBox content: 200 x 400
const CW = 200  // court width (10m)
const CH = 400  // court height (20m)
const NET = CH / 2  // net at center (200)
const SL = 61       // service line: 3.05m from net
const WALL_GLASS = 60   // glass back wall: 3m high (visual thickness = 6)
const WALL_SIDE_GLASS = 80 // side glass: 4m from each back wall
const PAD = 16 // padding around court

export const PadelCourt: React.FC<PadelCourtProps> = ({ scenario, showMovement, animationStep, playerSide }) => {
  const leftLabel = playerSide === 'left' ? 'JOUW KANT' : 'PARTNER'
  const rightLabel = playerSide === 'right' ? 'JOUW KANT' : 'PARTNER'

  return (
    <svg
      viewBox={`${-PAD} ${-PAD} ${CW + PAD * 2} ${CH + PAD * 2}`}
      className="padel-court-svg"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{ aspectRatio: `${CW + PAD * 2} / ${CH + PAD * 2}` }}
    >
      <defs>
        <linearGradient id="court-surface" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1565a8" />
          <stop offset="100%" stopColor="#1259a0" />
        </linearGradient>
        <linearGradient id="service-box" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1872b8" />
          <stop offset="100%" stopColor="#1668ac" />
        </linearGradient>
        <filter id="player-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Net pattern - crosshatch */}
        <pattern id="net-pattern" x="0" y="0" width="6" height="4" patternUnits="userSpaceOnUse">
          <rect width="6" height="4" fill="none" />
          <line x1="0" y1="0" x2="6" y2="4" stroke="white" strokeWidth="0.3" opacity="0.5" />
          <line x1="6" y1="0" x2="0" y2="4" stroke="white" strokeWidth="0.3" opacity="0.5" />
        </pattern>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#FFD700" />
        </marker>
        <marker id="arrowhead-opponent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#ff6b6b" />
        </marker>
      </defs>

      {/* === SURROUNDING AREA === */}
      <rect x={-PAD} y={-PAD} width={CW + PAD * 2} height={CH + PAD * 2} fill="#0a2240" rx="4" />

      {/* === COURT SURFACE === */}
      {/* Main court */}
      <rect x="0" y="0" width={CW} height={CH} fill="url(#court-surface)" />

      {/* Service boxes - slightly different shade to distinguish */}
      <rect x="0" y={NET - SL} width={CW / 2} height={SL} fill="url(#service-box)" opacity="0.6" />
      <rect x={CW / 2} y={NET - SL} width={CW / 2} height={SL} fill="url(#service-box)" opacity="0.6" />
      <rect x="0" y={NET} width={CW / 2} height={SL} fill="url(#service-box)" opacity="0.6" />
      <rect x={CW / 2} y={NET} width={CW / 2} height={SL} fill="url(#service-box)" opacity="0.6" />

      {/* === WALLS === */}
      {/* Back walls - glass (3m high, thicker visual) */}
      <rect x="-6" y="-6" width={CW + 12} height="6" fill="#5ba3d9" opacity="0.45" rx="1" />
      <rect x="-6" y={CH} width={CW + 12} height="6" fill="#5ba3d9" opacity="0.45" rx="1" />

      {/* Side walls - glass section (4m from each back corner) */}
      <rect x="-6" y="-6" width="6" height={WALL_SIDE_GLASS + 6} fill="#5ba3d9" opacity="0.4" rx="1" />
      <rect x={CW} y="-6" width="6" height={WALL_SIDE_GLASS + 6} fill="#5ba3d9" opacity="0.4" rx="1" />
      <rect x="-6" y={CH - WALL_SIDE_GLASS} width="6" height={WALL_SIDE_GLASS + 6} fill="#5ba3d9" opacity="0.4" rx="1" />
      <rect x={CW} y={CH - WALL_SIDE_GLASS} width="6" height={WALL_SIDE_GLASS + 6} fill="#5ba3d9" opacity="0.4" rx="1" />

      {/* Side walls - wire fence (middle section) - dashed to show it's open mesh */}
      <line x1="-3" y1={WALL_SIDE_GLASS} x2="-3" y2={CH - WALL_SIDE_GLASS} stroke="#5ba3d9" strokeWidth="2" strokeDasharray="4 3" opacity="0.25" />
      <line x1={CW + 3} y1={WALL_SIDE_GLASS} x2={CW + 3} y2={CH - WALL_SIDE_GLASS} stroke="#5ba3d9" strokeWidth="2" strokeDasharray="4 3" opacity="0.25" />

      {/* Door openings (center of fence sections) */}
      <rect x="-6" y={NET - 15} width="6" height="30" fill="#0a2240" opacity="0.6" rx="1" />
      <rect x={CW} y={NET - 15} width="6" height="30" fill="#0a2240" opacity="0.6" rx="1" />

      {/* === COURT LINES === */}
      {/* Outer boundary */}
      <rect x="0" y="0" width={CW} height={CH} fill="none" stroke="white" strokeWidth="2" />

      {/* Net */}
      <rect x="0" y={NET - 2} width={CW} height="4" fill="url(#net-pattern)" />
      <line x1="0" y1={NET} x2={CW} y2={NET} stroke="white" strokeWidth="2.5" />
      {/* Net posts */}
      <circle cx="-3" cy={NET} r="3.5" fill="#aaa" stroke="#777" strokeWidth="1.5" />
      <circle cx={CW + 3} cy={NET} r="3.5" fill="#aaa" stroke="#777" strokeWidth="1.5" />
      {/* Net cable */}
      <line x1="-3" y1={NET} x2={CW + 3} y2={NET} stroke="#ccc" strokeWidth="0.8" />

      {/* Service lines */}
      <line x1="0" y1={NET - SL} x2={CW} y2={NET - SL} stroke="white" strokeWidth="1.5" />
      <line x1="0" y1={NET + SL} x2={CW} y2={NET + SL} stroke="white" strokeWidth="1.5" />

      {/* Center service lines */}
      <line x1={CW / 2} y1={NET - SL} x2={CW / 2} y2={NET} stroke="white" strokeWidth="1.5" />
      <line x1={CW / 2} y1={NET} x2={CW / 2} y2={NET + SL} stroke="white" strokeWidth="1.5" />

      {/* === METER MARKINGS (subtle) === */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(m => (
        <React.Fragment key={m}>
          {/* Your side */}
          <line x1={-2} y1={NET + m * 20} x2={2} y2={NET + m * 20} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
          {/* Opponent side */}
          <line x1={-2} y1={NET - m * 20} x2={2} y2={NET - m * 20} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
        </React.Fragment>
      ))}
      {/* Key distance labels */}
      <text x={-10} y={NET + SL + 3} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="6">3m</text>
      <text x={-10} y={CH - 2} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="6">10m</text>
      <text x={-10} y={NET + 4} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6">net</text>

      {/* === LABELS === */}
      <text x={CW / 2} y={CH - 8} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="11" fontWeight="bold">
        JOUW KANT
      </text>
      <text x={CW / 2} y={14} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="11" fontWeight="bold">
        TEGENSTANDER
      </text>
      <text x="30" y={CH - 22} textAnchor="middle" fill={playerSide === 'left' ? 'rgba(0,191,255,0.35)' : 'rgba(255,255,255,0.12)'} fontSize="8" fontWeight={playerSide === 'left' ? 'bold' : 'normal'}>
        {leftLabel}
      </text>
      <text x={CW - 30} y={CH - 22} textAnchor="middle" fill={playerSide === 'right' ? 'rgba(0,191,255,0.35)' : 'rgba(255,255,255,0.12)'} fontSize="8" fontWeight={playerSide === 'right' ? 'bold' : 'normal'}>
        {rightLabel}
      </text>

      {/* === SCENARIO OVERLAYS === */}
      {scenario.zones?.map((zone, i) => (
        <ZoneHighlight key={i} zone={zone} />
      ))}

      {showMovement && scenario.movements?.map((movement, i) => (
        <MovementArrow key={i} movement={movement} visible={animationStep >= (movement.step ?? 0)} />
      ))}

      {scenario.pattern && (
        <PatternOverlay pattern={scenario.pattern} animationStep={animationStep} showMovement={showMovement} />
      )}

      {scenario.technique && (
        <TechniqueOverlay technique={scenario.technique} animationStep={animationStep} showMovement={showMovement} />
      )}

      {scenario.ball && (
        <BallMarker x={scenario.ball.x} y={scenario.ball.y} />
      )}

      {scenario.players.map((player, i) => (
        <PlayerMarker key={i} player={player} />
      ))}
    </svg>
  )
}
