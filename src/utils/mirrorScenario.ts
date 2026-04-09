import type { Scenario } from '../data/scenarios'

const COURT_WIDTH = 200

// Mirror an x-coordinate to flip left ↔ right
function mx(x: number): number {
  return COURT_WIDTH - x
}

/**
 * Mirrors all positions in a scenario so a left-side player
 * sees the same tactical view but from their perspective.
 * - Player marked `isYou` moves to the left half
 * - Partner moves to the right half
 * - All x-coordinates are flipped: x → 200 - x
 * - Labels for "Jij" stay, positions swap
 */
export function mirrorScenario(scenario: Scenario): Scenario {
  return {
    ...scenario,
    players: scenario.players.map(p => ({
      ...p,
      x: mx(p.x),
      ghostX: p.ghostX !== undefined ? mx(p.ghostX) : undefined,
    })),
    movements: scenario.movements?.map(m => ({
      ...m,
      fromX: mx(m.fromX),
      toX: mx(m.toX),
    })),
    zones: scenario.zones?.map(z => ({
      ...z,
      // Zone x needs to flip: new x = COURT_WIDTH - (old x + width)
      x: COURT_WIDTH - z.x - z.width,
    })),
    ball: scenario.ball ? { x: mx(scenario.ball.x), y: scenario.ball.y } : undefined,
    technique: scenario.technique ? {
      ...scenario.technique,
      hitPosition: { x: mx(scenario.technique.hitPosition.x), y: scenario.technique.hitPosition.y },
      bodyAngle: scenario.technique.bodyAngle !== undefined ? -scenario.technique.bodyAngle : undefined,
      trajectories: scenario.technique.trajectories.map(t => ({
        ...t,
        fromX: mx(t.fromX),
        toX: mx(t.toX),
      })),
    } : undefined,
    pattern: scenario.pattern ? {
      ...scenario.pattern,
      steps: scenario.pattern.steps.map(s => ({
        ...s,
        ballFrom: { x: mx(s.ballFrom.x), y: s.ballFrom.y },
        ballTo: { x: mx(s.ballTo.x), y: s.ballTo.y },
        playerMoves: s.playerMoves?.map(pm => ({
          ...pm,
          toX: mx(pm.toX),
        })),
      })),
    } : undefined,
  }
}
