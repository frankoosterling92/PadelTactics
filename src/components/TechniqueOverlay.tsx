import React from 'react'
import type { TechniqueInfo, BallTrajectory } from '../data/scenarios'

interface TechniqueOverlayProps {
  technique: TechniqueInfo
  animationStep: number
  showMovement: boolean
}

const arcHeights: Record<string, number> = {
  flat: 10,
  medium: 30,
  high: 50,
  lob: 70,
}

function getTrajectoryPath(t: BallTrajectory): string {
  const height = arcHeights[t.arc]
  const midX = (t.fromX + t.toX) / 2
  const midY = (t.fromY + t.toY) / 2 - height
  return `M ${t.fromX} ${t.fromY} Q ${midX} ${midY} ${t.toX} ${t.toY}`
}

function getSpinLabel(spin?: string): string {
  switch (spin) {
    case 'topspin': return 'Topspin'
    case 'backspin': return 'Backspin / Slice'
    case 'sidespin-left': return 'Side-spin (links)'
    case 'sidespin-right': return 'Side-spin (rechts)'
    case 'flat': return 'Flat (geen spin)'
    default: return ''
  }
}

function getSpinIcon(spin?: string): React.ReactNode {
  const cx = 0
  const cy = 0

  switch (spin) {
    case 'topspin':
      return (
        <g>
          <circle cx={cx} cy={cy} r="7" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d={`M ${cx + 4} ${cy - 6} L ${cx + 7} ${cy - 3} L ${cx + 3} ${cy - 3}`} fill="#4ade80" />
        </g>
      )
    case 'backspin':
      return (
        <g>
          <circle cx={cx} cy={cy} r="7" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d={`M ${cx - 4} ${cy + 6} L ${cx - 7} ${cy + 3} L ${cx - 3} ${cy + 3}`} fill="#f97316" />
        </g>
      )
    case 'sidespin-left':
      return (
        <g>
          <circle cx={cx} cy={cy} r="7" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d={`M ${cx - 6} ${cy - 4} L ${cx - 3} ${cy - 7} L ${cx - 3} ${cy - 3}`} fill="#a78bfa" />
        </g>
      )
    case 'sidespin-right':
      return (
        <g>
          <circle cx={cx} cy={cy} r="7" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d={`M ${cx + 6} ${cy - 4} L ${cx + 3} ${cy - 7} L ${cx + 3} ${cy - 3}`} fill="#a78bfa" />
        </g>
      )
    default:
      return null
  }
}

const TrajectoryLine: React.FC<{ t: BallTrajectory; index: number }> = ({ t, index }) => {
  const path = getTrajectoryPath(t)
  const color = t.color ?? '#FFD700'
  const midX = (t.fromX + t.toX) / 2
  const midY = (t.fromY + t.toY) / 2 - arcHeights[t.arc]

  return (
    <g className="trajectory-line" style={{ animationDelay: `${index * 0.2}s` }}>
      {/* Trajectory shadow */}
      <path
        d={path}
        fill="none"
        stroke="rgba(0,0,0,0.4)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Trajectory path */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="6 3"
        className="trajectory-path"
      />
      {/* Landing zone pulse */}
      <circle cx={t.toX} cy={t.toY} r="6" fill={color} opacity={0.3} className="landing-pulse" />
      <circle cx={t.toX} cy={t.toY} r="3" fill={color} opacity={0.6} />

      {/* Label at midpoint */}
      {t.label && (
        <g>
          <rect
            x={midX - 35}
            y={midY - 10}
            width="70"
            height="20"
            rx="5"
            fill="rgba(0,0,0,0.8)"
            stroke={color}
            strokeWidth="1"
          />
          <text
            x={midX}
            y={midY + 4}
            textAnchor="middle"
            fontSize="8"
            fill={color}
            fontWeight="bold"
          >
            {t.label}
          </text>
        </g>
      )}

      {/* Spin indicator at midpoint */}
      {t.spin && t.spin !== 'flat' && (
        <g transform={`translate(${midX + 38}, ${midY})`}>
          {getSpinIcon(t.spin)}
        </g>
      )}
    </g>
  )
}

export const TechniqueOverlay: React.FC<TechniqueOverlayProps> = ({
  technique,
  animationStep,
  showMovement,
}) => {
  if (!showMovement) return null

  const visibleTrajectories = technique.trajectories.filter(
    t => animationStep >= (t.step ?? 0)
  )

  return (
    <g className="technique-overlay">
      {/* Contact point highlight */}
      <g className="contact-point">
        {/* Outer ring */}
        <circle
          cx={technique.hitPosition.x}
          cy={technique.hitPosition.y}
          r="18"
          fill="none"
          stroke="#FFD700"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity={0.5}
          className="contact-ring"
        />
        {/* Inner glow */}
        <circle
          cx={technique.hitPosition.x}
          cy={technique.hitPosition.y}
          r="10"
          fill="#FFD700"
          opacity={0.08}
        />

        {/* Racket face indicator */}
        {technique.bodyAngle !== undefined && (
          <g transform={`translate(${technique.hitPosition.x}, ${technique.hitPosition.y}) rotate(${technique.bodyAngle})`}>
            {/* Racket line */}
            <line x1="0" y1="-14" x2="0" y2="-26" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
            {/* Racket head */}
            <ellipse cx="0" cy="-29" rx="6" ry="4" fill="none" stroke="#FFD700" strokeWidth="1.5" />
            {/* Direction indicator */}
            <line x1="0" y1="-33" x2="0" y2="-38" stroke="#FFD700" strokeWidth="1" opacity="0.5" />
          </g>
        )}

        {/* Contact height label */}
        <text
          x={technique.hitPosition.x + 22}
          y={technique.hitPosition.y + 4}
          fontSize="7"
          fill="#FFD700"
          opacity={0.7}
        >
          {technique.contactHeight === 'overhead' ? '\u2191 Overhead' :
           technique.contactHeight === 'high' ? '\u2191 Hoog' :
           technique.contactHeight === 'medium' ? '\u2194 Midden' :
           '\u2193 Laag'}
        </text>
      </g>

      {/* Ball trajectories */}
      {visibleTrajectories.map((t, i) => (
        <TrajectoryLine key={i} t={t} index={i} />
      ))}
    </g>
  )
}

export const TechniquePanel: React.FC<{ technique: TechniqueInfo }> = ({ technique }) => {
  return (
    <div className="technique-panel">
      {/* Racket & grip info */}
      <div className="technique-detail-card">
        <h4 className="technique-detail-title">Grip & Racketface</h4>
        <div className="technique-grip-info">
          <div className="grip-visual">
            <span className="grip-icon">
              {technique.racketFace === 'open' ? '\u{1F3F8}' :
               technique.racketFace === 'closed' ? '\u{1F3CF}' :
               technique.racketFace === 'continental' ? '\u{1F528}' : '\u{1F3D3}'}
            </span>
            <span className="grip-name">
              {technique.racketFace === 'open' ? 'Open racketface' :
               technique.racketFace === 'closed' ? 'Gesloten racketface' :
               technique.racketFace === 'continental' ? 'Continental grip' : 'Flat racketface'}
            </span>
          </div>
          <div className="contact-height-info">
            <span className="contact-icon">
              {technique.contactHeight === 'overhead' ? '\u2B06' :
               technique.contactHeight === 'high' ? '\u2197' :
               technique.contactHeight === 'medium' ? '\u27A1' : '\u2198'}
            </span>
            Contact: {technique.contactHeight === 'overhead' ? 'boven het hoofd' :
                      technique.contactHeight === 'high' ? 'schouderhoogte' :
                      technique.contactHeight === 'medium' ? 'heuphoogte' : 'kniehoogte'}
          </div>
        </div>
      </div>

      {/* Swing path */}
      <div className="technique-detail-card">
        <h4 className="technique-detail-title">Swing & Beweging</h4>
        <p className="swing-path-text">{technique.swingPath}</p>
      </div>

      {/* Key points */}
      <div className="technique-detail-card">
        <h4 className="technique-detail-title">Belangrijkste punten</h4>
        <ul className="key-points-list">
          {technique.keyPoints.map((point, i) => (
            <li key={i} className="key-point-item">
              <span className="key-point-check">{'\u2713'}</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Common mistakes */}
      <div className="technique-detail-card mistakes-card">
        <h4 className="technique-detail-title">Veelgemaakte fouten</h4>
        <ul className="mistakes-list">
          {technique.commonMistakes.map((mistake, i) => (
            <li key={i} className="mistake-item">
              <span className="mistake-icon">{'\u2717'}</span>
              {mistake}
            </li>
          ))}
        </ul>
      </div>

      {/* Spin legend */}
      {technique.trajectories.some(t => t.spin && t.spin !== 'flat') && (
        <div className="technique-detail-card">
          <h4 className="technique-detail-title">Spin type</h4>
          <div className="spin-legend">
            {[...new Set(technique.trajectories.map(t => t.spin).filter(Boolean))].map(spin => (
              <div key={spin} className="spin-legend-item">
                <span className="spin-badge" data-spin={spin}>
                  {spin === 'topspin' ? '\u21BB' :
                   spin === 'backspin' ? '\u21BA' :
                   spin === 'sidespin-left' ? '\u21B0' :
                   spin === 'sidespin-right' ? '\u21B1' : '\u2192'}
                </span>
                {getSpinLabel(spin)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
