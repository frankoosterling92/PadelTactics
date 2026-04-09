import React from 'react'
import type { PatternInfo, PatternStep } from '../data/scenarios'

interface PatternOverlayProps {
  pattern: PatternInfo
  animationStep: number
  showMovement: boolean
}

const arcHeights: Record<string, number> = {
  flat: 10,
  medium: 30,
  high: 50,
  lob: 70,
}

const hitterColors: Record<string, string> = {
  you: '#00BFFF',
  partner: '#32CD32',
  opponent: '#ff6b6b',
}

function getPath(step: PatternStep): string {
  const height = arcHeights[step.arc]
  const midX = (step.ballFrom.x + step.ballTo.x) / 2
  const midY = (step.ballFrom.y + step.ballTo.y) / 2 - height
  return `M ${step.ballFrom.x} ${step.ballFrom.y} Q ${midX} ${midY} ${step.ballTo.x} ${step.ballTo.y}`
}

const StepLine: React.FC<{ step: PatternStep; isActive: boolean }> = ({ step, isActive }) => {
  const color = hitterColors[step.hitter]
  const path = getPath(step)
  const midX = (step.ballFrom.x + step.ballTo.x) / 2
  const midY = (step.ballFrom.y + step.ballTo.y) / 2 - arcHeights[step.arc]

  // Don't draw trajectory for pure movement steps
  const isMovementOnly = step.ballFrom.x === step.ballTo.x && step.ballFrom.y === step.ballTo.y

  return (
    <g className="pattern-step" opacity={isActive ? 1 : 0.2}>
      {/* Ball trajectory */}
      {!isMovementOnly && (
        <>
          <path
            d={path}
            fill="none"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="6 3"
            className={isActive ? 'trajectory-path' : undefined}
          />
          {/* Landing dot */}
          <circle cx={step.ballTo.x} cy={step.ballTo.y} r="4" fill={color} opacity={0.6} />
        </>
      )}

      {/* Step number at start */}
      <g>
        <circle
          cx={step.ballFrom.x}
          cy={step.ballFrom.y - 18}
          r="10"
          fill="rgba(0,0,0,0.85)"
          stroke={color}
          strokeWidth="2"
        />
        <text
          x={step.ballFrom.x}
          y={step.ballFrom.y - 14}
          textAnchor="middle"
          fontSize="10"
          fill="white"
          fontWeight="bold"
        >
          {step.step + 1}
        </text>
      </g>

      {/* Shot type label at midpoint */}
      {!isMovementOnly && (
        <g>
          <rect
            x={midX - 38}
            y={midY - 10}
            width="76"
            height="20"
            rx="5"
            fill="rgba(0,0,0,0.85)"
            stroke={color}
            strokeWidth="1"
          />
          <text
            x={midX}
            y={midY + 4}
            textAnchor="middle"
            fontSize="7.5"
            fill={color}
            fontWeight="bold"
          >
            {step.shotType}
          </text>
        </g>
      )}

      {/* Player movement arrows */}
      {isActive && step.playerMoves?.map((move, i) => {
        const moveColor = move.who === 'you' ? '#00BFFF' : '#32CD32'
        return (
          <g key={i}>
            <line
              x1={move.who === 'you' ? 145 : 55}
              y1={350}
              x2={move.toX}
              y2={move.toY}
              stroke={moveColor}
              strokeWidth="2"
              strokeDasharray="4 3"
              markerEnd="url(#arrowhead)"
              opacity={0.6}
            />
            <text
              x={move.toX}
              y={move.toY + 24}
              textAnchor="middle"
              fontSize="7"
              fill={moveColor}
              opacity={0.8}
            >
              {move.who === 'you' ? 'Loop!' : 'Mee!'}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export const PatternOverlay: React.FC<PatternOverlayProps> = ({
  pattern,
  animationStep,
  showMovement,
}) => {
  if (!showMovement) return null

  return (
    <g className="pattern-overlay">
      {pattern.steps.map((step, i) => (
        <StepLine
          key={i}
          step={step}
          isActive={animationStep >= step.step}
        />
      ))}
    </g>
  )
}

// Pattern details panel for the sidebar
export const PatternPanel: React.FC<{
  pattern: PatternInfo
  animationStep: number
  maxSteps: number
  onStepChange: (step: number) => void
}> = ({ pattern, animationStep, maxSteps, onStepChange }) => {
  const difficultyColors: Record<string, string> = {
    beginner: '#4ade80',
    gevorderd: '#f59e0b',
    expert: '#ef4444',
  }
  const difficultyLabels: Record<string, string> = {
    beginner: 'Beginner',
    gevorderd: 'Gevorderd',
    expert: 'Expert',
  }

  return (
    <div className="pattern-panel">
      {/* Header */}
      <div className="pattern-header-card">
        <div className="pattern-meta">
          <span
            className="pattern-difficulty"
            style={{ color: difficultyColors[pattern.difficulty], borderColor: difficultyColors[pattern.difficulty] }}
          >
            {difficultyLabels[pattern.difficulty]}
          </span>
        </div>
        <div className="pattern-info-row">
          <span className="pattern-info-label">Doel:</span>
          <span>{pattern.goal}</span>
        </div>
        <div className="pattern-info-row">
          <span className="pattern-info-label">Wanneer:</span>
          <span>{pattern.when}</span>
        </div>
      </div>

      {/* Step-by-step timeline */}
      <div className="pattern-timeline">
        <h4 className="pattern-section-title">Stap voor stap</h4>
        {pattern.steps.map((step, i) => {
          const isActive = animationStep >= step.step
          const isCurrent = animationStep === step.step
          const color = hitterColors[step.hitter]

          return (
            <button
              key={i}
              className={`pattern-step-card ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
              onClick={() => onStepChange(step.step)}
            >
              <div className="step-indicator" style={{ borderColor: color, background: isActive ? color : 'transparent' }}>
                <span style={{ color: isActive ? '#fff' : color }}>{step.step + 1}</span>
              </div>
              <div className="step-content">
                <h5 className="step-title">{step.title}</h5>
                <p className="step-desc">{step.description}</p>
                <span className="step-shot-badge" style={{ color, borderColor: color }}>
                  {step.shotType}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Step controls for quick navigation */}
      <div className="pattern-nav">
        <button
          className="pattern-nav-btn"
          onClick={() => onStepChange(Math.max(0, animationStep - 1))}
          disabled={animationStep <= 0}
        >
          {'\u2190'} Vorige
        </button>
        <span className="pattern-nav-count">
          {Math.min(animationStep + 1, maxSteps + 1)} / {maxSteps + 1}
        </span>
        <button
          className="pattern-nav-btn"
          onClick={() => onStepChange(Math.min(maxSteps, animationStep + 1))}
          disabled={animationStep >= maxSteps}
        >
          Volgende {'\u2192'}
        </button>
      </div>

      {/* Variations */}
      {pattern.variations && pattern.variations.length > 0 && (
        <div className="pattern-variations">
          <h4 className="pattern-section-title">Variaties & trucs</h4>
          {pattern.variations.map((v, i) => (
            <div key={i} className="variation-item">
              <span className="variation-icon">{'\u{1F4A1}'}</span>
              <p>{v}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
