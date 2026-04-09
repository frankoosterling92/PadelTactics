import { useState, useMemo } from 'react'
import { PadelCourt } from './components/PadelCourt'
import { ScenarioSelector } from './components/ScenarioSelector'
import { ScenarioDropdown } from './components/ScenarioDropdown'
import { TipsPanel } from './components/TipsPanel'
import { PlaybackSlider } from './components/PlaybackSlider'
import { MobileDetail } from './components/MobileDetail'
import { scenarios, type Scenario } from './data/scenarios'
import { mirrorScenario } from './utils/mirrorScenario'

export type PlayerSide = 'right' | 'left'

function App() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0])
  const [showMovement, setShowMovement] = useState(true)
  const [animationStep, setAnimationStep] = useState(10)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [playerSide, setPlayerSide] = useState<PlayerSide>('right')

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
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <button
            className="menu-toggle desktop-only"
            onClick={() => setSidebarOpen(!sidebarOpen)}
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
            >L</button>
            <button
              className={`side-btn ${playerSide === 'right' ? 'active' : ''}`}
              onClick={() => setPlayerSide('right')}
            >R</button>
          </div>
          <p className="app-subtitle desktop-only">
            Tactiek voor de {playerSide === 'right' ? 'rechterspeler' : 'linkerspeler'}
          </p>
        </div>
      </header>

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="mobile-layout mobile-only">
        {/* Scenario dropdown */}
        <ScenarioDropdown selected={selectedScenario} onSelect={handleSelectScenario} />

        {/* Court */}
        <div className="mobile-court">
          <PadelCourt
            scenario={displayScenario}
            showMovement={showMovement}
            animationStep={animationStep}
            playerSide={playerSide}
          />
        </div>

        {/* Slider */}
        <PlaybackSlider
          scenario={displayScenario}
          animationStep={animationStep}
          maxSteps={maxSteps}
          onStepChange={setAnimationStep}
          showMovement={showMovement}
          onToggleMovement={() => setShowMovement(!showMovement)}
        />

        {/* Compact detail + expandable tips */}
        <MobileDetail
          scenario={displayScenario}
          animationStep={animationStep}
          maxSteps={maxSteps}
          onStepChange={setAnimationStep}
        />
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="desktop-layout desktop-only">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <ScenarioSelector selectedId={selectedScenario.id} onSelect={handleSelectScenario} />
        </aside>

        <main className="main-content">
          <div className="court-and-slider">
            <div className="court-container">
              <PadelCourt
                scenario={displayScenario}
                showMovement={showMovement}
                animationStep={animationStep}
                playerSide={playerSide}
              />
            </div>
            <PlaybackSlider
              scenario={displayScenario}
              animationStep={animationStep}
              maxSteps={maxSteps}
              onStepChange={setAnimationStep}
              showMovement={showMovement}
              onToggleMovement={() => setShowMovement(!showMovement)}
            />
          </div>
        </main>

        <aside className="tips-sidebar">
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
