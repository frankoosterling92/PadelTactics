import React from 'react'
import type { Scenario } from '../data/scenarios'
import type { PlayerSide } from '../App'
import { categoryLabels } from '../data/scenarios'
import { TechniquePanel } from './TechniqueOverlay'
import { PatternPanel } from './PatternOverlay'

interface TipsPanelProps {
  scenario: Scenario
  showMovement: boolean
  onToggleMovement: () => void
  animationStep: number
  maxSteps: number
  onStepChange: (step: number) => void
  playerSide: PlayerSide
}

const categoryColors: Record<string, string> = {
  defensive: '#00BFFF',
  offensive: '#FFD700',
  transition: '#FF8C00',
  serve: '#32CD32',
  technique: '#a78bfa',
  pattern: '#f59e0b',
}

export const TipsPanel: React.FC<TipsPanelProps> = ({
  scenario,
  showMovement,
  onToggleMovement,
  animationStep,
  maxSteps,
  onStepChange,
  playerSide,
}) => {
  const sideLabel = playerSide === 'right' ? 'rechterspeler' : 'linkerspeler'
  const catColor = categoryColors[scenario.category]

  return (
    <div className="tips-panel">
      <div className="tips-header" style={{ borderLeftColor: catColor }}>
        <span className="tips-category" style={{ color: catColor }}>
          {categoryLabels[scenario.category]}
        </span>
        <h2 className="tips-title">{scenario.name}</h2>
        <p className="tips-description">{scenario.description}</p>
      </div>

      {/* Movement / trajectory controls (not for patterns — those have their own nav) */}
      {!scenario.pattern && (scenario.movements?.length || scenario.technique?.trajectories?.length) ? (
        <div className="movement-controls">
          <button
            className={`toggle-movement ${showMovement ? 'active' : ''}`}
            onClick={onToggleMovement}
          >
            {scenario.technique
              ? (showMovement ? 'Verberg trajecten' : 'Toon baltrajecten')
              : (showMovement ? 'Verberg bewegingen' : 'Toon bewegingen')}
          </button>
          {showMovement && maxSteps > 0 && (
            <div className="step-controls">
              <span className="step-label">{scenario.technique ? 'Traject:' : 'Stap:'}</span>
              {Array.from({ length: maxSteps + 1 }, (_, i) => (
                <button
                  key={i}
                  className={`step-button ${animationStep >= i ? 'active' : ''}`}
                  onClick={() => onStepChange(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className={`step-button step-all ${animationStep >= maxSteps ? 'active' : ''}`}
                onClick={() => onStepChange(maxSteps)}
              >
                Alle
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Pattern step-by-step panel */}
      {scenario.pattern && (
        <PatternPanel
          pattern={scenario.pattern}
          animationStep={animationStep}
          maxSteps={maxSteps}
          onStepChange={onStepChange}
        />
      )}

      {/* Tips list */}
      <div className="tips-list">
        <h3 className="tips-list-title">Tips voor jou ({sideLabel})</h3>
        {scenario.tips.map((tip, i) => (
          <div key={i} className="tip-item">
            <span className="tip-number">{i + 1}</span>
            <p className="tip-text">{tip}</p>
          </div>
        ))}
      </div>

      {/* Technique details */}
      {scenario.technique && (
        <TechniquePanel technique={scenario.technique} />
      )}

      {/* Legend */}
      <div className="court-legend">
        <h4>Legenda</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#00BFFF' }}></span>
            Jij ({playerSide === 'right' ? 'rechts' : 'links'})
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#32CD32' }}></span>
            Partner ({playerSide === 'right' ? 'links' : 'rechts'})
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#ff6b6b' }}></span>
            Tegenstanders
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#FFFF00' }}></span>
            Bal
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#FFD700', border: '1px dashed #FFD700' }}></span>
            Bewegingslijnen
          </div>
        </div>
      </div>
    </div>
  )
}
