import React from 'react'
import { scenarios, categoryLabels, categoryDescriptions, type Scenario } from '../data/scenarios'

interface ScenarioSelectorProps {
  selectedId: string
  onSelect: (scenario: Scenario) => void
}

const categories = ['defensive', 'offensive', 'transition', 'serve', 'technique', 'pattern'] as const

const categoryIcons: Record<string, string> = {
  defensive: '\u{1F6E1}',
  offensive: '\u{2694}',
  transition: '\u{1F504}',
  serve: '\u{1F3BE}',
  technique: '\u{1F3AF}',
  pattern: '\u{1F9E0}',
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="scenario-selector">
      {categories.map(cat => {
        const catScenarios = scenarios.filter(s => s.category === cat)
        return (
          <div key={cat} className="category-group">
            <div className="category-header">
              <span className="category-icon">{categoryIcons[cat]}</span>
              <div>
                <h3 className="category-title">{categoryLabels[cat]}</h3>
                <p className="category-desc">{categoryDescriptions[cat]}</p>
              </div>
            </div>
            <div className="scenario-list">
              {catScenarios.map(scenario => (
                <button
                  key={scenario.id}
                  className={`scenario-button ${selectedId === scenario.id ? 'active' : ''}`}
                  onClick={() => onSelect(scenario)}
                >
                  {scenario.name}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
