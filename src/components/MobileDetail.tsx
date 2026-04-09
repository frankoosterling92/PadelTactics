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

  // Current step info for patterns
  const currentStep = pattern?.steps.find(s => s.step === animationStep)

  return (
    <div className="mobile-detail">
      {/* Step description for patterns */}
      {pattern && currentStep && (
        <div className="mobile-step-info">
          <div className="mobile-step-header">
            <span className="mobile-step-num">{currentStep.step + 1}</span>
            <span className="mobile-step-title">{currentStep.title}</span>
            <span className="mobile-step-shot">{currentStep.shotType}</span>
          </div>
          <p className="mobile-step-desc">{currentStep.description}</p>
        </div>
      )}

      {/* Technique quick info */}
      {technique && (
        <div className="mobile-step-info">
          <div className="mobile-step-header">
            <span className="mobile-step-shot">
              {technique.contactHeight === 'overhead' ? '\u2B06 Overhead' :
               technique.contactHeight === 'high' ? '\u2197 Hoog' :
               technique.contactHeight === 'medium' ? '\u27A1 Midden' : '\u2198 Laag'}
            </span>
            <span className="mobile-step-shot">{technique.swingPath.split('—')[0]}</span>
          </div>
        </div>
      )}

      {/* Description (always visible) */}
      {!pattern && !technique && (
        <p className="mobile-desc">{scenario.description}</p>
      )}

      {/* Expandable tips */}
      <button className="mobile-expand-btn" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Verberg tips \u25B2' : `Bekijk ${scenario.tips.length} tips \u25BC`}
      </button>

      {expanded && (
        <div className="mobile-tips-list">
          {scenario.tips.map((tip, i) => (
            <div key={i} className="mobile-tip">
              <span className="mobile-tip-num">{i + 1}</span>
              <span>{tip}</span>
            </div>
          ))}

          {/* Pattern variations */}
          {pattern?.variations && (
            <div className="mobile-variations">
              <div className="mobile-var-title">{'\u{1F4A1}'} Variaties</div>
              {pattern.variations.map((v, i) => (
                <div key={i} className="mobile-tip">
                  <span className="mobile-tip-num">{'\u2022'}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Technique key points + mistakes */}
          {technique && (
            <>
              <div className="mobile-var-title">{'\u2713'} Techniek</div>
              {technique.keyPoints.map((p, i) => (
                <div key={i} className="mobile-tip"><span className="mobile-tip-check">{'\u2713'}</span><span>{p}</span></div>
              ))}
              <div className="mobile-var-title">{'\u2717'} Vermijd</div>
              {technique.commonMistakes.map((m, i) => (
                <div key={i} className="mobile-tip"><span className="mobile-tip-x">{'\u2717'}</span><span>{m}</span></div>
              ))}
            </>
          )}

          {/* Pattern step navigation */}
          {pattern && maxSteps > 0 && (
            <div className="mobile-step-nav">
              <button
                className="mobile-nav-btn"
                disabled={animationStep <= 0}
                onClick={() => onStepChange(animationStep - 1)}
              >{'\u25C0'} Vorige</button>
              <span>{Math.min(animationStep + 1, maxSteps + 1)} / {maxSteps + 1}</span>
              <button
                className="mobile-nav-btn"
                disabled={animationStep >= maxSteps}
                onClick={() => onStepChange(animationStep + 1)}
              >Volgende {'\u25B6'}</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
