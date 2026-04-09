import React, { useMemo } from 'react'
import type { Scenario } from '../data/scenarios'

interface PlaybackSliderProps {
  scenario: Scenario
  animationStep: number
  maxSteps: number
  onStepChange: (step: number) => void
  showMovement: boolean
  onToggleMovement: () => void
}

function getStepLabel(scenario: Scenario, step: number): string {
  if (scenario.pattern) {
    const patternStep = scenario.pattern.steps.find(s => s.step === step)
    if (patternStep) return patternStep.title
  }
  if (scenario.technique) {
    const traj = scenario.technique.trajectories.find(t => (t.step ?? 0) === step)
    if (traj?.label) return traj.label
  }
  if (scenario.movements) {
    const mov = scenario.movements.find(m => (m.step ?? 0) === step)
    if (mov?.label) return mov.label
  }
  return `Stap ${step + 1}`
}

export const PlaybackSlider: React.FC<PlaybackSliderProps> = ({
  scenario,
  animationStep,
  maxSteps,
  onStepChange,
  showMovement,
  onToggleMovement,
}) => {
  const hasSteps = maxSteps > 0
  const hasContent = !!(scenario.movements?.length || scenario.technique?.trajectories?.length || scenario.pattern?.steps?.length)

  const currentLabel = useMemo(() => {
    if (!hasSteps) return scenario.name
    const clamped = Math.min(animationStep, maxSteps)
    return getStepLabel(scenario, clamped)
  }, [scenario, animationStep, maxSteps, hasSteps])

  if (!hasContent) return null

  return (
    <div className="playback-slider">
      {/* Title showing current step */}
      <div className="playback-info">
        <span className="playback-scenario-name">{scenario.name}</span>
        {hasSteps && showMovement && (
          <span className="playback-step-label">{currentLabel}</span>
        )}
      </div>

      {/* Controls row */}
      <div className="playback-controls">
        {/* Toggle visibility */}
        <button
          className={`playback-toggle ${showMovement ? 'active' : ''}`}
          onClick={onToggleMovement}
          title={showMovement ? 'Verberg' : 'Toon'}
        >
          {showMovement ? '\u{1F441}' : '\u{1F441}\u{200D}\u{1F5E8}'}
        </button>

        {hasSteps && showMovement && (
          <>
            {/* Previous */}
            <button
              className="playback-btn"
              onClick={() => onStepChange(Math.max(0, animationStep - 1))}
              disabled={animationStep <= 0}
            >
              {'\u25C0'}
            </button>

            {/* Slider */}
            <input
              type="range"
              className="playback-range"
              min={0}
              max={maxSteps}
              value={Math.min(animationStep, maxSteps)}
              onChange={e => onStepChange(Number(e.target.value))}
            />

            {/* Next */}
            <button
              className="playback-btn"
              onClick={() => onStepChange(Math.min(maxSteps, animationStep + 1))}
              disabled={animationStep >= maxSteps}
            >
              {'\u25B6'}
            </button>

            {/* Step counter */}
            <span className="playback-counter">
              {Math.min(animationStep + 1, maxSteps + 1)}/{maxSteps + 1}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
