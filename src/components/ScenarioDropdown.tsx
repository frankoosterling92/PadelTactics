import React, { useState, useRef, useEffect } from 'react'
import { scenarios, categoryLabels, type Scenario, type ScenarioCategory } from '../data/scenarios'

interface ScenarioDropdownProps {
  selected: Scenario
  onSelect: (scenario: Scenario) => void
}

const categories: ScenarioCategory[] = ['defensive', 'offensive', 'transition', 'serve', 'technique', 'pattern']

const categoryIcons: Record<string, string> = {
  defensive: '\u{1F6E1}',
  offensive: '\u{2694}',
  transition: '\u{1F504}',
  serve: '\u{1F3BE}',
  technique: '\u{1F3AF}',
  pattern: '\u{1F9E0}',
}

export const ScenarioDropdown: React.FC<ScenarioDropdownProps> = ({ selected, onSelect }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="scenario-dropdown" ref={ref}>
      <button className="dropdown-trigger" onClick={() => setOpen(!open)}>
        <span className="dropdown-icon">{categoryIcons[selected.category]}</span>
        <span className="dropdown-label">{selected.name}</span>
        <span className="dropdown-chevron">{open ? '\u25B2' : '\u25BC'}</span>
      </button>

      {open && (
        <div className="dropdown-panel">
          {categories.map(cat => {
            const items = scenarios.filter(s => s.category === cat)
            return (
              <div key={cat} className="dropdown-group">
                <div className="dropdown-group-title">
                  {categoryIcons[cat]} {categoryLabels[cat]}
                </div>
                {items.map(s => (
                  <button
                    key={s.id}
                    className={`dropdown-item ${s.id === selected.id ? 'active' : ''}`}
                    onClick={() => { onSelect(s); setOpen(false) }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
