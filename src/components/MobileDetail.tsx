import React, { useState } from 'react'
import type { Scenario } from '../data/scenarios'

interface MobileDetailProps {
  scenario: Scenario
  animationStep: number
  maxSteps: number
  onStepChange: (step: number) => void
}

export const MobileDetail: React.FC<MobileDetailProps> = ({
  scenario,
  animationStep,
  maxSteps,
  onStepChange,
}) => {
  const [expanded, setExpanded] = useState(false)
  const pattern = scenario.pattern
  const technique = scenario.technique
  const currentStep = pattern?.steps.find(s => s.step === animationStep)

  return (
    <div className="m-detail">
      {/* Current step card for patterns */}
      {pattern && currentStep && (
        <div className="m-card">
          <div className="m-step-row">
            <span className="m-step-badge">{currentStep.step + 1}</span>
            <span className="m-step-title">{currentStep.title}</span>
          </div>
          <p className="m-body">{currentStep.description}</p>
          <span className="m-tag">{currentStep.shotType}</span>
        </div>
      )}

      {/* Technique summary */}
      {technique && (
        <div className="m-card">
          <div className="m-step-row">
            <span className="m-tag">
              {technique.contactHeight === 'overhead' ? 'Overhead' :
               technique.contactHeight === 'high' ? 'Schouderhoogte' :
               technique.contactHeight === 'medium' ? 'Heuphoogte' : 'Kniehoogte'}
            </span>
            <span className="m-tag">{technique.racketFace === 'open' ? 'Open face' : technique.racketFace === 'closed' ? 'Gesloten face' : 'Continental'}</span>
          </div>
          <p className="m-body">{technique.swingPath}</p>
        </div>
      )}

      {/* Description for positioning scenarios */}
      {!pattern && !technique && (
        <div className="m-card">
          <p className="m-body">{scenario.description}</p>
        </div>
      )}

      {/* Pattern navigation */}
      {pattern && maxSteps > 0 && (
        <div className="m-nav">
          <button className="m-nav-btn" disabled={animationStep <= 0} onClick={() => onStepChange(animationStep - 1)}>
            {'\u25C0'}
          </button>
          <span className="m-nav-label">Stap {Math.min(animationStep + 1, maxSteps + 1)} van {maxSteps + 1}</span>
          <button className="m-nav-btn" disabled={animationStep >= maxSteps} onClick={() => onStepChange(animationStep + 1)}>
            {'\u25B6'}
          </button>
        </div>
      )}

      {/* Expandable tips */}
      <button className="m-expand" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Verberg tips' : `${scenario.tips.length} tips bekijken`}
        <span className="m-expand-arrow">{expanded ? '\u25B2' : '\u25BC'}</span>
      </button>

      {expanded && (
        <div className="m-tips">
          {scenario.tips.map((tip, i) => (
            <div key={i} className="m-tip-row">
              <span className="m-tip-num">{i + 1}</span>
              <p className="m-tip-text">{tip}</p>
            </div>
          ))}

          {pattern?.variations && (
            <>
              <div className="m-section-title">Variaties</div>
              {pattern.variations.map((v, i) => (
                <div key={i} className="m-tip-row">
                  <span className="m-tip-bullet">{'\u{1F4A1}'}</span>
                  <p className="m-tip-text">{v}</p>
                </div>
              ))}
            </>
          )}

          {technique && (
            <>
              <div className="m-section-title">Belangrijkste punten</div>
              {technique.keyPoints.map((p, i) => (
                <div key={i} className="m-tip-row">
                  <span className="m-tip-check">{'\u2713'}</span>
                  <p className="m-tip-text">{p}</p>
                </div>
              ))}
              <div className="m-section-title">Veelgemaakte fouten</div>
              {technique.commonMistakes.map((m, i) => (
                <div key={i} className="m-tip-row">
                  <span className="m-tip-x">{'\u2717'}</span>
                  <p className="m-tip-text">{m}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
