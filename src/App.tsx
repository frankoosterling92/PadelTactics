import { useState, useMemo } from 'react'
import { PadelCourt } from './components/PadelCourt'
import { ScenarioSelector } from './components/ScenarioSelector'
import { TipsPanel } from './components/TipsPanel'
import { scenarios, type Scenario } from './data/scenarios'
import { mirrorScenario } from './utils/mirrorScenario'

export type PlayerSide = 'right' | 'left'

function App() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0])
  const [showMovement, setShowMovement] = useState(true)
  const [animationStep, setAnimationStep] = useState(10)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [playerSide, setPlayerSide] = useState<PlayerSide>('right')
  const [mobileTab, setMobileTab] = useState<'court' | 'scenarios' | 'tips'>('court')

  // Mirror the scenario if playing from the left side
  const displayScenario = useMemo(() => {
    return playerSide === 'left' ? mirrorScenario(selectedScenario) : selectedScenario
  }, [selectedScenario, playerSide])

  const maxSteps = useMemo(() => {
    const movementSteps = selectedScenario.movements
      ? Math.max(...selectedScenario.movements.map(m => m.step ?? 0))
      : 0
    const trajectorySteps = selectedScenario.technique?.trajectories
      ? Math.max(...selectedScenario.technique.trajectories.map(t => t.step ?? 0))
      : 0
    const patternSteps = selectedScenario.pattern?.steps
      ? Math.max(...selectedScenario.pattern.steps.map(s => s.step))
      : 0
    return Math.max(movementSteps, trajectorySteps, patternSteps)
  }, [selectedScenario])

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario)
    setShowMovement(true)
    setAnimationStep(scenario.pattern ? 0 : 10)
    // On mobile, switch to court view after selecting
    setMobileTab('court')
  }

  const sideLabel = playerSide === 'right' ? 'rechterspeler' : 'linkerspeler'

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <button
            className="menu-toggle desktop-only"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Verberg menu' : 'Toon menu'}
          >
            {sidebarOpen ? '\u2715' : '\u2630'}
          </button>
          <h1 className="app-title">
            <span className="title-icon">{'\u{1F3BE}'}</span>
            <span className="title-text">PadelTactics</span>
          </h1>
        </div>
        <div className="header-right">
          <div className="side-toggle">
            <button
              className={`side-btn ${playerSide === 'left' ? 'active' : ''}`}
              onClick={() => setPlayerSide('left')}
            >
              Links
            </button>
            <button
              className={`side-btn ${playerSide === 'right' ? 'active' : ''}`}
              onClick={() => setPlayerSide('right')}
            >
              Rechts
            </button>
          </div>
          <p className="app-subtitle desktop-only">Tactiek voor de {sideLabel}</p>
        </div>
      </header>

      {/* Mobile tab bar */}
      <nav className="mobile-tabs mobile-only">
        <button
          className={`mobile-tab ${mobileTab === 'scenarios' ? 'active' : ''}`}
          onClick={() => setMobileTab('scenarios')}
        >
          {'\u{1F4CB}'} Scenario's
        </button>
        <button
          className={`mobile-tab ${mobileTab === 'court' ? 'active' : ''}`}
          onClick={() => setMobileTab('court')}
        >
          {'\u{1F3BE}'} Baan
        </button>
        <button
          className={`mobile-tab ${mobileTab === 'tips' ? 'active' : ''}`}
          onClick={() => setMobileTab('tips')}
        >
          {'\u{1F4A1}'} Tips
        </button>
      </nav>

      <div className="app-content">
        {/* Sidebar with scenario selector */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'} ${mobileTab === 'scenarios' ? 'mobile-visible' : 'mobile-hidden'}`}>
          <ScenarioSelector
            selectedId={selectedScenario.id}
            onSelect={handleSelectScenario}
          />
        </aside>

        {/* Main content */}
        <main className={`main-content ${mobileTab === 'court' ? 'mobile-visible' : 'mobile-hidden'}`}>
          <div className="court-container">
            <PadelCourt
              scenario={displayScenario}
              showMovement={showMovement}
              animationStep={animationStep}
              playerSide={playerSide}
            />
          </div>
        </main>

        {/* Tips panel */}
        <aside className={`tips-sidebar ${mobileTab === 'tips' ? 'mobile-visible' : 'mobile-hidden'}`}>
          <TipsPanel
            scenario={displayScenario}
            showMovement={showMovement}
            onToggleMovement={() => setShowMovement(!showMovement)}
            animationStep={animationStep}
            maxSteps={maxSteps}
            onStepChange={setAnimationStep}
            playerSide={playerSide}
          />
        </aside>
      </div>
    </div>
  )
}

export default App
