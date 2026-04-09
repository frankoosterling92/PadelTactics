export interface PlayerPosition {
  x: number
  y: number
  label: string
  team: 'you' | 'partner' | 'opponent'
  isYou?: boolean
  // Optional: ghost position showing where the player was
  ghostX?: number
  ghostY?: number
}

export interface Movement {
  fromX: number
  fromY: number
  toX: number
  toY: number
  team: 'you' | 'partner' | 'opponent'
  label?: string
  curved?: boolean
  step?: number
}

export interface Zone {
  x: number
  y: number
  width: number
  height: number
  color: string
  label?: string
  opacity?: number
}

export interface BallPosition {
  x: number
  y: number
}

export interface BallTrajectory {
  fromX: number
  fromY: number
  toX: number
  toY: number
  arc: 'flat' | 'medium' | 'high' | 'lob'
  spin?: 'topspin' | 'backspin' | 'sidespin-left' | 'sidespin-right' | 'flat'
  label?: string
  color?: string
  step?: number
}

export interface TechniqueInfo {
  name: string
  racketFace: 'open' | 'closed' | 'flat' | 'continental'
  contactHeight: 'low' | 'medium' | 'high' | 'overhead'
  swingPath: string
  keyPoints: string[]
  commonMistakes: string[]
  trajectories: BallTrajectory[]
  // Position on court where you'd typically hit this shot
  hitPosition: { x: number; y: number }
  // Ideal stance/body orientation angle in degrees (0 = facing net)
  bodyAngle?: number
}

export interface PatternStep {
  step: number
  title: string
  description: string
  ballFrom: { x: number; y: number }
  ballTo: { x: number; y: number }
  arc: 'flat' | 'medium' | 'high' | 'lob'
  shotType: string
  hitter: 'you' | 'partner' | 'opponent'
  playerMoves?: { who: 'you' | 'partner'; toX: number; toY: number }[]
}

export interface PatternInfo {
  name: string
  difficulty: 'beginner' | 'gevorderd' | 'expert'
  goal: string
  when: string
  steps: PatternStep[]
  variations?: string[]
}

export type ScenarioCategory = 'defensive' | 'offensive' | 'transition' | 'serve' | 'technique' | 'pattern'

export interface Scenario {
  id: string
  name: string
  category: ScenarioCategory
  description: string
  tips: string[]
  players: PlayerPosition[]
  movements?: Movement[]
  zones?: Zone[]
  ball?: BallPosition
  technique?: TechniqueInfo
  pattern?: PatternInfo
}

// Court constants (viewBox 200x400, scale: 1m = 20 units)
// Your side = bottom half (y: 200-400)
// Opponent side = top half (y: 0-200)
// Net = y: 200
// Service line your side = y: 339 (6.95m from net, 3.05m from back wall)
// Service line opponent = y: 61
// Right side = x: 100-200 (YOUR side, since you play right)
// Left side = x: 0-100

export const scenarios: Scenario[] = [
  // =====================
  // DEFENSIVE SCENARIOS
  // =====================
  {
    id: 'def-base',
    name: 'Verdedigende basispositie',
    category: 'defensive',
    description: 'De fundamentele verdedigende opstelling wanneer de tegenstanders aan het net staan. Beide spelers staan achter de servicelijn, klaar om te reageren.',
    tips: [
      'Sta op ongeveer 1 meter voor de achterwand — zo kun je ballen van de muur spelen',
      'Jij (rechts) dekt de rechterhelft van de baan inclusief de zijwand',
      'Houd je racket voor je lichaam, klaar voor een reactie',
      'Blijf in beweging — kleine pasjes houden je alert',
      'Communiceer met je partner wie de bal neemt bij ballen in het midden',
    ],
    players: [
      { x: 145, y: 330, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 330, label: 'Partner', team: 'partner' },
      { x: 145, y: 90, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 90, label: 'Tegenstander L', team: 'opponent' },
    ],
    zones: [
      { x: 100, y: 260, width: 100, height: 140, color: '#00BFFF', label: 'Jouw zone', opacity: 0.12 },
      { x: 0, y: 260, width: 100, height: 140, color: '#32CD32', label: 'Partner zone', opacity: 0.12 },
    ],
  },
  {
    id: 'def-lob-recovery',
    name: 'Herstel na lob over je heen',
    category: 'defensive',
    description: 'De tegenstander lobde over je hoofd. Je moet snel naar achteren om de bal van de achterwand te spelen. Je partner schuift mee.',
    tips: [
      'Draai je direct om en sprint naar de achterwand — kijk NIET naar de bal terwijl je loopt',
      'Speel de bal ná de stuit van de achterwand — dit geeft je meer tijd',
      'Probeer een hoge lob terug te spelen om tijd te kopen',
      'Je partner schuift naar het midden/rechts om de open ruimte te dekken',
      'Na je return: neem direct je verdedigende positie weer in',
    ],
    players: [
      { x: 145, y: 370, label: 'Jij', team: 'you', isYou: true, ghostX: 145, ghostY: 280 },
      { x: 80, y: 330, label: 'Partner', team: 'partner', ghostX: 55, ghostY: 330 },
      { x: 145, y: 90, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 90, label: 'Tegenstander L', team: 'opponent' },
    ],
    movements: [
      { fromX: 145, fromY: 280, toX: 145, toY: 370, team: 'you', label: 'Sprint terug', step: 0 },
      { fromX: 55, fromY: 330, toX: 80, toY: 330, team: 'partner', label: 'Schuif mee', step: 0 },
    ],
    ball: { x: 150, y: 385 },
    zones: [
      { x: 100, y: 340, width: 100, height: 60, color: '#FF6347', label: 'Herstelzone', opacity: 0.15 },
    ],
  },
  {
    id: 'def-cross-court',
    name: 'Verdediging tegen cross-court aanval',
    category: 'defensive',
    description: 'De tegenstander speelt een scherpe cross-court volley naar jouw hoek. Positionering en anticipatie zijn cruciaal.',
    tips: [
      'Anticipeer op de cross door iets meer naar de zijwand te bewegen',
      'Gebruik de zijwand als hulp — laat de bal stuiteren en speel hem daarna',
      'Speel bij voorkeur een lob diagonaal terug (cross-court lob)',
      'Als de bal te laag komt: speel een zachte return naar het midden',
      'Houd de bandeja/víbora als optie in gedachten als je de bal hoog kunt nemen',
    ],
    players: [
      { x: 170, y: 320, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 330, label: 'Partner', team: 'partner' },
      { x: 130, y: 80, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 90, label: 'Tegenstander L', team: 'opponent' },
    ],
    movements: [
      { fromX: 130, fromY: 80, toX: 185, toY: 310, team: 'opponent', label: 'Cross volley', curved: true, step: 0 },
    ],
    ball: { x: 185, y: 310 },
    zones: [
      { x: 150, y: 280, width: 50, height: 80, color: '#FF6347', label: 'Gevaarzone', opacity: 0.15 },
    ],
  },
  {
    id: 'def-middle-ball',
    name: 'Bal door het midden — wie neemt hem?',
    category: 'defensive',
    description: 'De tegenstander speelt de bal door het midden. Dit is een veelvoorkomende bron van verwarring. De vuistregel: degene met de forehand naar het midden neemt de bal.',
    tips: [
      'Als rechterspeler heb jij de backhand naar het midden — je partner (links) heeft de forehand',
      'Vuistregel: de speler met de FOREHAND naar het midden neemt de bal',
      'Dus bij ballen door het midden: laat je partner deze meestal nemen!',
      'Communiceer! Roep "jij" of "mijn" — stilte leidt tot gemiste ballen',
      'Uitzondering: als jij duidelijk dichterbij staat, neem jij de bal ongeacht forehand/backhand',
    ],
    players: [
      { x: 130, y: 330, label: 'Jij', team: 'you', isYou: true },
      { x: 70, y: 330, label: 'Partner', team: 'partner' },
      { x: 145, y: 90, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 90, label: 'Tegenstander L', team: 'opponent' },
    ],
    movements: [
      { fromX: 100, fromY: 90, toX: 100, toY: 320, team: 'opponent', label: 'Bal midden', step: 0 },
      { fromX: 70, fromY: 330, toX: 95, toY: 320, team: 'partner', label: 'Forehand!', step: 1 },
    ],
    ball: { x: 100, y: 320 },
    zones: [
      { x: 75, y: 280, width: 50, height: 100, color: '#FFD700', label: 'Twijfelzone', opacity: 0.15 },
    ],
  },
  {
    id: 'def-wall-play',
    name: 'Bal via de zijwand (rechts)',
    category: 'defensive',
    description: 'De bal komt via de rechter zijwand. Als rechterspeler moet je leren deze ballen te lezen en goed te positioneren.',
    tips: [
      'Stap weg van de wand om ruimte te creëren — sta niet te dicht op de muur',
      'Wacht tot de bal van de wand komt en sla hem dan — niet ervóór',
      'De bal verandert van richting na de wand: oefen dit herkennen',
      'Speel bij voorkeur een hoge lob diagonaal terug',
      'Bij een snelle bal: gebruik een korte backswing en blokkeer de bal richting midden',
    ],
    players: [
      { x: 160, y: 320, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 330, label: 'Partner', team: 'partner' },
      { x: 145, y: 90, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 90, label: 'Tegenstander L', team: 'opponent' },
    ],
    movements: [
      { fromX: 145, fromY: 90, toX: 200, toY: 300, team: 'opponent', label: 'Slag richting wand', step: 0 },
      { fromX: 200, fromY: 300, toX: 165, toY: 320, team: 'opponent', label: 'Via wand', step: 1 },
    ],
    ball: { x: 195, y: 305 },
    zones: [
      { x: 170, y: 280, width: 30, height: 80, color: '#FF6347', label: 'Wandzone', opacity: 0.15 },
      { x: 140, y: 290, width: 30, height: 60, color: '#00BFFF', label: 'Ideale positie', opacity: 0.15 },
    ],
  },

  // =====================
  // OFFENSIVE SCENARIOS
  // =====================
  {
    id: 'off-net-position',
    name: 'Aanvallende netpositie',
    category: 'offensive',
    description: 'De ideale positie wanneer jullie aan het net staan. Samen als een muur, klaar om te volleyen.',
    tips: [
      'Sta op 1-2 meter van het net, centraal in jouw helft',
      'Jij en je partner vormen een "muur" — beweeg samen als een blok',
      'Als je partner naar links beweegt, schuif jij mee naar links',
      'Houd je racket HOOG — op schouderhoogte, klaar voor een volley',
      'De afstand tussen jou en je partner moet ongeveer 2-3 meter zijn',
    ],
    players: [
      { x: 145, y: 230, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 230, label: 'Partner', team: 'partner' },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    zones: [
      { x: 100, y: 200, width: 100, height: 60, color: '#FFD700', label: 'Jouw netzone', opacity: 0.15 },
      { x: 0, y: 200, width: 100, height: 60, color: '#32CD32', label: 'Partner netzone', opacity: 0.15 },
    ],
  },
  {
    id: 'off-volley-angles',
    name: 'Volley hoeken vanuit rechts',
    category: 'offensive',
    description: 'Vanuit je netpositie rechts: welke hoeken kun je aanvallen? Leer de effectiefste volley-richtingen.',
    tips: [
      'De MEEST effectieve volley is naar de voeten van de tegenstander',
      'Cross-court volley (naar links-achter) is de veiligste optie',
      'Volley door het midden creëert verwarring bij tegenstanders',
      'Chiquita (zachte drop shot) als de tegenstander te ver achter staat',
      'Vermijd de lijnvolley langs rechts tenzij je zeker bent — te risicovol',
    ],
    players: [
      { x: 145, y: 225, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 230, label: 'Partner', team: 'partner' },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    movements: [
      { fromX: 145, fromY: 225, toX: 40, toY: 60, team: 'you', label: 'Cross volley', curved: true, step: 0 },
      { fromX: 145, fromY: 225, toX: 100, toY: 120, team: 'you', label: 'Door midden', step: 1 },
      { fromX: 145, fromY: 225, toX: 155, toY: 140, team: 'you', label: 'Naar voeten', step: 2 },
    ],
    zones: [
      { x: 20, y: 40, width: 40, height: 50, color: '#32CD32', label: 'Veilig', opacity: 0.15 },
      { x: 80, y: 100, width: 40, height: 50, color: '#FFD700', label: 'Effectief', opacity: 0.15 },
      { x: 140, y: 110, width: 30, height: 50, color: '#FF6347', label: 'Risicovol', opacity: 0.12 },
    ],
  },
  {
    id: 'off-bandeja',
    name: 'Bandeja / Víbora vanuit rechts',
    category: 'offensive',
    description: 'Na een lob van de tegenstander speel je een bandeja (geslicte overhead) of víbora (met side-spin). Dit is DE slag om te beheersen als rechterspeler.',
    tips: [
      'Bandeja: geslicte overhead met backspin — de bal blijft laag na de stuit',
      'Víbora: met side-spin, trekt naar de zijwand — agressiever dan bandeja',
      'Richt op de voeten van de tegenstander of naar het midden',
      'Na de bandeja: BLIJF aan het net, ga niet terug',
      'Beweeg naar voren tijdens de slag, niet achteruit',
      'Als rechterspeler met backhand: víbora naar de linkerkant is zeer effectief',
    ],
    players: [
      { x: 145, y: 235, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 230, label: 'Partner', team: 'partner' },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    movements: [
      { fromX: 145, fromY: 235, toX: 60, toY: 110, team: 'you', label: 'Bandeja cross', curved: true, step: 0 },
      { fromX: 145, fromY: 235, toX: 140, toY: 120, team: 'you', label: 'Bandeja lijn', step: 1 },
    ],
    ball: { x: 145, y: 240 },
    zones: [
      { x: 30, y: 90, width: 60, height: 50, color: '#32CD32', label: 'Ideale landing', opacity: 0.15 },
    ],
  },
  {
    id: 'off-poach',
    name: 'Poachen (bal van je partner overnemen)',
    category: 'offensive',
    description: 'Als de tegenstander een voorspelbare return speelt, kun je "poachen" — de bal van je partners kant overnemen voor een winnende volley.',
    tips: [
      'Poach alleen als je ZEKER bent dat je de bal kunt afmaken',
      'Timing is alles: beweeg pas op het moment dat de tegenstander slaat',
      'Na de poach: je partner moet jouw kant dekken (wisselspel)',
      'Richt op de open ruimte of op de voeten van de tegenstander',
      'Als de poach mislukt: snel terug naar je positie, je partner dekt tijdelijk',
      'Signaleer je partner VAN TEVOREN dat je gaat poachen (achter je rug)',
    ],
    players: [
      { x: 90, y: 220, label: 'Jij', team: 'you', isYou: true, ghostX: 145, ghostY: 230 },
      { x: 145, y: 240, label: 'Partner', team: 'partner', ghostX: 55, ghostY: 230 },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    movements: [
      { fromX: 145, fromY: 230, toX: 90, toY: 220, team: 'you', label: 'Poach!', step: 0 },
      { fromX: 55, fromY: 230, toX: 145, toY: 240, team: 'partner', label: 'Dekt jouw kant', step: 1 },
    ],
    ball: { x: 85, y: 225 },
  },

  // =====================
  // TRANSITION SCENARIOS
  // =====================
  {
    id: 'trans-back-to-net',
    name: 'Van achter naar het net',
    category: 'transition',
    description: 'Het cruciale moment: van verdediging naar aanval. Na een goede lob of diep return, bewegen jullie samen naar het net.',
    tips: [
      'Beweeg SAMEN naar voren — nooit alleen, altijd als team',
      'Het ideale moment: na een diepe lob of een lage return naar de voeten',
      'Stop op de "split-step positie" net achter de servicelijn als tussenstap',
      'Doe een split-step (klein sprongetje) net voordat de tegenstander slaat',
      'Als de tegenstander een goede return speelt: stop en ga eventueel terug',
      'De transitie duurt meestal 2-3 slagen — haast je niet in één keer naar het net',
    ],
    players: [
      { x: 145, y: 265, label: 'Jij', team: 'you', isYou: true, ghostX: 145, ghostY: 330 },
      { x: 55, y: 265, label: 'Partner', team: 'partner', ghostX: 55, ghostY: 330 },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    movements: [
      { fromX: 145, fromY: 330, toX: 145, toY: 265, team: 'you', label: 'Naar voren', step: 0 },
      { fromX: 55, fromY: 330, toX: 55, toY: 265, team: 'partner', label: 'Samen op', step: 0 },
    ],
    zones: [
      { x: 0, y: 250, width: 200, height: 30, color: '#FFD700', label: 'Split-step zone', opacity: 0.15 },
    ],
  },
  {
    id: 'trans-net-to-back',
    name: 'Gedwongen terug van het net',
    category: 'transition',
    description: 'De tegenstander speelt een goede lob en je moet terug. Hoe doe je dit zonder de controle te verliezen?',
    tips: [
      'Ga ALLEBEI terug — niet één speler aan het net en één achter',
      'De speler boven wie de lob gaat, draait en sprint achteruit',
      'De andere speler schuift naar het midden en gaat ook terug',
      'Speel een hoge lob terug om tijd te kopen en weer positie in te nemen',
      'Pas als je allebei achter staat en de bal onder controle is: zoek opnieuw het net',
    ],
    players: [
      { x: 145, y: 330, label: 'Jij', team: 'you', isYou: true, ghostX: 145, ghostY: 230 },
      { x: 55, y: 330, label: 'Partner', team: 'partner', ghostX: 55, ghostY: 230 },
      { x: 145, y: 90, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 90, label: 'Tegenstander L', team: 'opponent' },
    ],
    movements: [
      { fromX: 145, fromY: 230, toX: 145, toY: 330, team: 'you', label: 'Terug!', step: 0 },
      { fromX: 55, fromY: 230, toX: 55, toY: 330, team: 'partner', label: 'Samen terug', step: 0 },
    ],
    ball: { x: 155, y: 360 },
  },

  // =====================
  // SERVE SCENARIOS
  // =====================
  {
    id: 'serve-right',
    name: 'Service vanuit rechts',
    category: 'serve',
    description: 'Jij serveert vanuit de rechterkant. Waar richt je, en waar positioneer je je daarna?',
    tips: [
      'Serveer richting de T (midden) voor een veilige service',
      'Serveer naar het lichaam van de returner om hem te verrassen',
      'Service naar de zijwand (breed) creëert een moeilijke return',
      'Na de service: beweeg DIRECT naar het net (niet blijven staan!)',
      'Je partner staat al aan het net aan de linkerkant — sluit aan',
      'De service in padel is NIET om een ace te slaan, maar om het net te veroveren',
    ],
    players: [
      { x: 155, y: 310, label: 'Jij (server)', team: 'you', isYou: true },
      { x: 55, y: 230, label: 'Partner (net)', team: 'partner' },
      { x: 55, y: 100, label: 'Returner', team: 'opponent' },
      { x: 145, y: 170, label: 'Tegenstander (net)', team: 'opponent' },
    ],
    movements: [
      { fromX: 155, fromY: 310, toX: 75, toY: 130, team: 'you', label: 'Serveer cross', curved: true, step: 0 },
      { fromX: 155, fromY: 310, toX: 145, toY: 240, team: 'you', label: 'Loop naar net', step: 1 },
    ],
    zones: [
      { x: 0, y: 140, width: 100, height: 60, color: '#32CD32', label: 'Service vak', opacity: 0.1 },
    ],
  },
  {
    id: 'serve-return-right',
    name: 'Return van service (jij returnt)',
    category: 'serve',
    description: 'De tegenstander serveert naar jou (rechts). Hoe positioneer je je voor de return?',
    tips: [
      'Sta op 1 meter achter de servicelijn, iets rechts van het midden van je vak',
      'De return is het BELANGRIJKSTE moment — een slechte return = instant punt verlies',
      'Speel de return LAAG: bij de voeten van de server die naar het net komt',
      'Chiquita (laag over het net, met topspin) is de ideale return',
      'Lob als veilige optie als je onder druk staat',
      'Na de return: neem je verdedigende positie in (achter de servicelijn)',
    ],
    players: [
      { x: 145, y: 295, label: 'Jij (returner)', team: 'you', isYou: true },
      { x: 55, y: 330, label: 'Partner', team: 'partner' },
      { x: 55, y: 90, label: 'Server', team: 'opponent' },
      { x: 145, y: 170, label: 'Tegenstander (net)', team: 'opponent' },
    ],
    movements: [
      { fromX: 55, fromY: 90, toX: 140, toY: 280, team: 'opponent', label: 'Service', curved: true, step: 0 },
      { fromX: 145, fromY: 295, toX: 70, toY: 180, team: 'you', label: 'Chiquita return', curved: true, step: 1 },
    ],
    ball: { x: 140, y: 280 },
    zones: [
      { x: 120, y: 275, width: 50, height: 40, color: '#00BFFF', label: 'Return positie', opacity: 0.12 },
    ],
  },

  // =====================
  // TECHNIQUE SCENARIOS
  // =====================
  {
    id: 'tech-bandeja',
    name: 'De Bandeja',
    category: 'technique',
    description: 'De bandeja is een geslicte overhead slag met backspin. Het is DE slag om te beheersen vanuit de netpositie. Je speelt hem wanneer de tegenstander een lob slaat die niet diep genoeg is om je van het net te verdrijven.',
    tips: [
      'Gebruik een CONTINENTAL grip (hammergrip) — dezelfde grip als bij een service',
      'Draai je lichaam zijwaarts — schouder naar het net, niet je borst',
      'Contactpunt: op schouderhoogte of net erboven, VOOR je lichaam',
      'Swing van hoog naar laag met een "snijdende" beweging — dit geeft backspin',
      'Follow-through is KORT — stop het racket op heup/navel hoogte',
      'Richt op de voeten van de tegenstander of diep cross-court',
      'Na de slag: direct weer klaar aan het net, racket omhoog',
    ],
    players: [
      { x: 145, y: 230, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 230, label: 'Partner', team: 'partner' },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    ball: { x: 148, y: 225 },
    zones: [
      { x: 30, y: 90, width: 60, height: 50, color: '#32CD32', label: 'Ideaal: cross', opacity: 0.15 },
      { x: 80, y: 110, width: 50, height: 40, color: '#FFD700', label: 'Midden', opacity: 0.12 },
      { x: 130, y: 100, width: 40, height: 40, color: '#FF6347', label: 'Lijn (risico)', opacity: 0.1 },
    ],
    technique: {
      name: 'Bandeja',
      racketFace: 'open',
      contactHeight: 'overhead',
      swingPath: 'Hoog naar laag, van achter naar voren met slice-beweging',
      keyPoints: [
        'Continental grip (V tussen duim en wijsvinger op bovenste rand)',
        'Zijwaartse stand — linkervoet voor (als rechtshändig)',
        'Niet-slaande hand wijst naar de bal voor balans',
        'Contactpunt: boven en VOOR het lichaam',
        'Polsbeweging: van pronatie naar supinatie (snijden)',
        'Korte follow-through — racket stopt bij navel',
        'Gewichtstransfer: van achterste naar voorste voet',
      ],
      commonMistakes: [
        'Te hard slaan — de bandeja is controle, geen power',
        'Contactpunt te ver achter het hoofd',
        'Geen zijwaartse stand innemen (te frontaal)',
        'Na de slag achteruit lopen in plaats van positie houden',
        'Eastern grip gebruiken in plaats van continental',
      ],
      trajectories: [
        { fromX: 148, fromY: 225, toX: 55, toY: 105, arc: 'medium', spin: 'backspin', label: 'Cross (veilig)', color: '#32CD32', step: 0 },
        { fromX: 148, fromY: 225, toX: 100, toY: 120, arc: 'medium', spin: 'backspin', label: 'Midden', color: '#FFD700', step: 1 },
        { fromX: 148, fromY: 225, toX: 145, toY: 110, arc: 'flat', spin: 'backspin', label: 'Lijn', color: '#FF6347', step: 2 },
      ],
      hitPosition: { x: 148, y: 225 },
      bodyAngle: -45,
    },
  },
  {
    id: 'tech-vibora',
    name: 'De Víbora',
    category: 'technique',
    description: 'De víbora is de agressievere variant van de bandeja. Met side-spin trekt de bal naar de zijwand, waardoor de tegenstander een lastige return van de muur moet spelen. Ideale slag voor de rechterspeler!',
    tips: [
      'Continental grip, maar iets meer naar eastern backhand gedraaid',
      'Meer polsactie dan bij de bandeja — "zweep" de bal',
      'Contactpunt: naast/boven het hoofd, iets meer naar de zijkant',
      'De swing gaat van hoog-rechts naar laag-links (voor rechtshändigen)',
      'De bal krijgt side-spin richting de zijwand van de tegenstander',
      'Richt op de zijwand aan de tegenstander kant — de bal springt lastig weg',
      'Gebruik meer wanneer je zelfvertrouwen groeit — het is een aanvallende slag',
    ],
    players: [
      { x: 145, y: 235, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 230, label: 'Partner', team: 'partner' },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    ball: { x: 150, y: 228 },
    zones: [
      { x: 0, y: 80, width: 30, height: 60, color: '#32CD32', label: 'Zijwand!', opacity: 0.2 },
      { x: 30, y: 90, width: 50, height: 50, color: '#FFD700', label: 'Via wand', opacity: 0.12 },
    ],
    technique: {
      name: 'Víbora',
      racketFace: 'open',
      contactHeight: 'overhead',
      swingPath: 'Van hoog-rechts naar laag-links met polsrotatie voor side-spin',
      keyPoints: [
        'Iets meer gesloten grip dan bandeja (richting eastern backhand)',
        'Meer explosieve polsbeweging — "sweep" het racket langs de bal',
        'Contactpunt iets meer naar de zijkant van het lichaam',
        'Pronatie van de onderarm creëert de side-spin',
        'De bal moet de zijwand van de tegenstander raken',
        'Meer voorwaarts momentum dan bij bandeja — loop door de slag heen',
        'Follow-through gaat naar de andere heup',
      ],
      commonMistakes: [
        'Te veel arm, te weinig pols — de spin komt uit de polsrotatie',
        'Bal te hoog over het net — dan verliest de spin zijn effect',
        'Alleen side-spin zonder voorwaartse snelheid',
        'Niet doorlopen na de slag — je verliest je netpositie',
        'Te vaak gebruiken — wissel af met bandeja om onvoorspelbaar te zijn',
      ],
      trajectories: [
        { fromX: 150, fromY: 228, toX: 10, toY: 100, arc: 'medium', spin: 'sidespin-left', label: 'Naar zijwand', color: '#32CD32', step: 0 },
        { fromX: 150, fromY: 228, toX: 50, toY: 115, arc: 'medium', spin: 'sidespin-left', label: 'Cross met spin', color: '#FFD700', step: 1 },
      ],
      hitPosition: { x: 150, y: 228 },
      bodyAngle: -30,
    },
  },
  {
    id: 'tech-chiquita',
    name: 'De Chiquita',
    category: 'technique',
    description: 'De chiquita is een zachte, lage bal met topspin die net over het net gaat en bij de voeten van de tegenstander landt. Het is de perfecte return-slag en dé manier om het net te veroveren.',
    tips: [
      'Eastern forehand grip of semi-western voor meer topspin',
      'Contactpunt: LAAG — op knie- tot heup-hoogte',
      'Swing van laag naar hoog — dit geeft de topspin',
      'De bal moet NET over het net gaan — zo laag mogelijk',
      'Richt op de voeten van de tegenstander aan het net',
      'Na de chiquita: loop DIRECT naar voren om het net te claimen',
      'Timing: speel de chiquita op het moment dat de tegenstander naar het net loopt',
    ],
    players: [
      { x: 145, y: 300, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 320, label: 'Partner', team: 'partner' },
      { x: 145, y: 170, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 100, label: 'Tegenstander L', team: 'opponent' },
    ],
    ball: { x: 140, y: 290 },
    zones: [
      { x: 110, y: 195, width: 60, height: 15, color: '#32CD32', label: 'Voeten!', opacity: 0.25 },
      { x: 50, y: 195, width: 60, height: 15, color: '#FFD700', label: 'Voeten partner', opacity: 0.15 },
      { x: 70, y: 170, width: 60, height: 20, color: '#00BFFF', label: 'Midden laag', opacity: 0.12 },
    ],
    technique: {
      name: 'Chiquita',
      racketFace: 'closed',
      contactHeight: 'low',
      swingPath: 'Van laag naar hoog — korte compacte swing met polsflick',
      keyPoints: [
        'Eastern of semi-western grip voor topspin',
        'Buig door je knieën — ga LAAG bij de bal',
        'Korte backswing — het is een touch-slag, geen power-slag',
        'Pols "flick" op het contactmoment voor topspin',
        'De bal stijgt net over het net en daalt dan snel',
        'Contactpunt voor je lichaam — niet naast je',
        'Zachte handen — ontspan je grip op het contactmoment',
      ],
      commonMistakes: [
        'Te hard slaan — de chiquita is finesse, niet kracht',
        'Te hoog over het net — dan is het een cadeautje voor de tegenstander',
        'Niet door je knieën buigen — je speelt de bal dan te hoog',
        'Na de slag blijven staan — je moet direct naar het net',
        'Altijd dezelfde richting spelen — varieer cross en lijn',
      ],
      trajectories: [
        { fromX: 140, fromY: 290, toX: 140, toY: 195, arc: 'flat', spin: 'topspin', label: 'Naar voeten R', color: '#32CD32', step: 0 },
        { fromX: 140, fromY: 290, toX: 80, toY: 195, arc: 'flat', spin: 'topspin', label: 'Cross naar voeten', color: '#FFD700', step: 1 },
        { fromX: 140, fromY: 290, toX: 100, toY: 180, arc: 'flat', spin: 'topspin', label: 'Door midden', color: '#00BFFF', step: 2 },
      ],
      hitPosition: { x: 140, y: 290 },
      bodyAngle: 0,
    },
  },
  {
    id: 'tech-lob',
    name: 'De Lob (Globo)',
    category: 'technique',
    description: 'De lob is de belangrijkste verdedigende slag in padel. Een goede lob koopt tijd, dwingt de tegenstander van het net, en geeft jou de kans om het net te veroveren.',
    tips: [
      'Eastern forehand grip — hetzelfde als bij de chiquita',
      'Contactpunt: op heup-hoogte, voor je lichaam',
      'Open racketface — het racket wijst naar boven bij contact',
      'Swing van laag naar hoog met een LANGE follow-through',
      'Richt op de achterwand van de tegenstander — diep is beter dan hoog',
      'Cross-court lob is veiliger dan een lob langs de lijn',
      'Na de lob: beweeg samen met je partner naar voren als de lob diep genoeg is',
    ],
    players: [
      { x: 145, y: 340, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 340, label: 'Partner', team: 'partner' },
      { x: 145, y: 80, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 80, label: 'Tegenstander L', team: 'opponent' },
    ],
    ball: { x: 145, y: 330 },
    zones: [
      { x: 10, y: 10, width: 80, height: 40, color: '#32CD32', label: 'Ideaal: diep cross', opacity: 0.15 },
      { x: 110, y: 10, width: 80, height: 40, color: '#FFD700', label: 'Diep lijn', opacity: 0.12 },
      { x: 40, y: 60, width: 120, height: 30, color: '#FF6347', label: 'Te kort = smash!', opacity: 0.1 },
    ],
    technique: {
      name: 'Lob (Globo)',
      racketFace: 'open',
      contactHeight: 'medium',
      swingPath: 'Van laag naar hoog met lange opwaartse follow-through',
      keyPoints: [
        'Eastern forehand grip — open racketface',
        'Knieën gebogen, laag zwaartepunt',
        'Backswing onder de bal — swing van laag naar hoog',
        'Contactpunt voor het lichaam, op heup-hoogte',
        'Lange follow-through richting het plafond',
        'De bal moet HOOG en DIEP gaan — over de tegenstander heen',
        'Gebruik topspin voor extra diepte (bal accelereert na de stuit)',
      ],
      commonMistakes: [
        'Niet diep genoeg — een korte lob is een smash-kans voor de tegenstander',
        'Alleen maar hoog slaan zonder diepte',
        'Flat slaan — topspin maakt de lob veel effectiever',
        'Niet naar voren bewegen na een diepe lob',
        'Altijd langs de lijn lobben — cross-court is veiliger',
      ],
      trajectories: [
        { fromX: 145, fromY: 330, toX: 40, toY: 20, arc: 'lob', spin: 'topspin', label: 'Cross lob (veilig)', color: '#32CD32', step: 0 },
        { fromX: 145, fromY: 330, toX: 150, toY: 20, arc: 'lob', spin: 'topspin', label: 'Lob langs lijn', color: '#FFD700', step: 1 },
      ],
      hitPosition: { x: 145, y: 330 },
      bodyAngle: 0,
    },
  },
  {
    id: 'tech-volley',
    name: 'De Volley (forehand & backhand)',
    category: 'technique',
    description: 'De volley is je brood-en-boter slag aan het net. Als rechterspeler gebruik je de forehand volley voor ballen aan de rechterkant en de backhand volley voor ballen naar het midden/links.',
    tips: [
      'Continental grip voor BEIDE volleys — wissel niet van grip',
      'Korte backswing — het is een blokkeerbeweging, geen zwaai',
      'Contactpunt: VOOR je lichaam, met gestrekte arm',
      'Step forward — stap altijd NAAR de bal toe bij een volley',
      'Racket boven polshoogte — laat het racket niet zakken',
      'Bij lage volleys: buig door je knieën, NIET met je rug',
      'Richt op de open ruimte of op de voeten van de tegenstander',
    ],
    players: [
      { x: 145, y: 220, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 220, label: 'Partner', team: 'partner' },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    ball: { x: 160, y: 215 },
    zones: [
      { x: 20, y: 95, width: 50, height: 45, color: '#32CD32', label: 'Cross (veilig)', opacity: 0.15 },
      { x: 80, y: 110, width: 40, height: 35, color: '#FFD700', label: 'Midden', opacity: 0.12 },
      { x: 130, y: 105, width: 40, height: 35, color: '#FF6347', label: 'Lijn', opacity: 0.1 },
    ],
    technique: {
      name: 'Volley',
      racketFace: 'continental',
      contactHeight: 'medium',
      swingPath: 'Kort en compact — blokkeer/duw de bal, geen grote swing',
      keyPoints: [
        'Continental grip — ALTIJD, voor forehand EN backhand',
        'Split-step net voordat de tegenstander slaat',
        'Racket HOOG houden — op schouderhoogte of hoger',
        'Korte of geen backswing — punch de bal naar voren',
        'Stap naar de bal toe met de tegenovergestelde voet',
        'Contactpunt ver voor je lichaam — armen gestrekt',
        'Stevig polsgewricht — de pols mag niet meegeven',
        'Follow-through richting het doel — kort en gericht',
      ],
      commonMistakes: [
        'Te grote swing — je hebt geen tijd voor een backswing aan het net',
        'Racket laten zakken tussen volleys — altijd HOOG houden',
        'Achteruit leunen in plaats van naar voren stappen',
        'Slappe pols bij contact — het racket draait weg',
        'Grip wisselen tussen forehand en backhand volley',
        'De bal willen "slaan" in plaats van blokkeren/sturen',
      ],
      trajectories: [
        { fromX: 160, fromY: 215, toX: 40, toY: 100, arc: 'flat', spin: 'flat', label: 'FH cross', color: '#32CD32', step: 0 },
        { fromX: 160, fromY: 215, toX: 100, toY: 120, arc: 'flat', spin: 'flat', label: 'FH midden', color: '#FFD700', step: 1 },
        { fromX: 120, fromY: 215, toX: 50, toY: 105, arc: 'flat', spin: 'flat', label: 'BH cross', color: '#00BFFF', step: 2 },
      ],
      hitPosition: { x: 155, y: 215 },
      bodyAngle: -15,
    },
  },
  {
    id: 'tech-smash',
    name: 'De Smash (Remate)',
    category: 'technique',
    description: 'De smash is de afmakende slag in padel. Anders dan in tennis wil je de bal vaak via de achterwand uit laten springen (por tres). Timing en plaatsing zijn belangrijker dan rauwe kracht.',
    tips: [
      'Continental grip — hetzelfde als bij service en bandeja',
      'Draai volledig zijwaarts en wijs met je vrije hand naar de bal',
      'Contactpunt: zo HOOG mogelijk, met gestrekte arm boven je hoofd',
      'Richt op 3/4 kracht — controle is belangrijker dan power',
      'Platte smash: richt op de voeten of het lichaam van de tegenstander',
      'Por tres (via achterwand eruit): richt op de achterwand, bal moet over het hek springen',
      'Na een smash: wees klaar dat de bal terugkomt — het is padel!',
    ],
    players: [
      { x: 145, y: 225, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 225, label: 'Partner', team: 'partner' },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    ball: { x: 148, y: 218 },
    zones: [
      { x: 110, y: 105, width: 50, height: 35, color: '#32CD32', label: 'Naar voeten R', opacity: 0.15 },
      { x: 70, y: 105, width: 50, height: 35, color: '#FFD700', label: 'Naar lichaam', opacity: 0.12 },
      { x: 100, y: 0, width: 100, height: 15, color: '#FF6347', label: 'Por tres!', opacity: 0.2 },
    ],
    technique: {
      name: 'Smash (Remate)',
      racketFace: 'flat',
      contactHeight: 'overhead',
      swingPath: 'Volledig van achteren naar voren, boven het hoofd — als een service',
      keyPoints: [
        'Continental grip — net als bij service',
        'Volledige lichaamsrotatie — schouders draaien mee',
        'Vrije hand wijst naar de bal voor timing en balans',
        'Contactpunt: zo hoog mogelijk, arm volledig gestrekt',
        'Pronatie van de onderarm op het contactmoment',
        'Bij platte smash: richt naar beneden, op de tegenstander',
        'Bij por tres: meer voorwaartse kracht, richt op achterwand',
        'Gewichtstransfer van achterbeen naar voorbeen',
      ],
      commonMistakes: [
        'Te hard willen slaan — 3/4 kracht met controle is beter',
        'Bal niet hoog genoeg raken — dan gaat hij in het net',
        'Niet klaar zijn voor de return — een smash is vaak niet het einde',
        'Alleen maar plat slaan — gebruik de por tres als wapen',
        'Geen split-step na de smash — je moet klaar zijn voor de volgende bal',
        'Proberen te smashen bij een diepe lob — speel dan liever een bandeja',
      ],
      trajectories: [
        { fromX: 148, fromY: 218, toX: 140, toY: 115, arc: 'flat', spin: 'flat', label: 'Plat naar voeten', color: '#32CD32', step: 0 },
        { fromX: 148, fromY: 218, toX: 90, toY: 115, arc: 'flat', spin: 'flat', label: 'Naar lichaam', color: '#FFD700', step: 1 },
        { fromX: 148, fromY: 218, toX: 155, toY: 5, arc: 'medium', spin: 'topspin', label: 'Por tres!', color: '#FF6347', step: 2 },
      ],
      hitPosition: { x: 148, y: 218 },
      bodyAngle: -60,
    },
  },

  // =====================
  // PATTERN SCENARIOS
  // =====================
  {
    id: 'pat-chiquita-net',
    name: 'Chiquita + Net veroveren',
    category: 'pattern',
    description: 'Het meest fundamentele patroon in padel: speel een chiquita (lage bal bij de voeten) en loop direct naar het net. Dit is hoe je van verdediging naar aanval gaat.',
    tips: [
      'Stap 1: Speel de chiquita laag bij de voeten van de tegenstander',
      'Stap 2: Loop DIRECT naar voren na je slag — niet wachten',
      'Stap 3: Je partner loopt tegelijk mee naar voren',
      'Stap 4: Split-step net voordat de tegenstander de bal raakt',
      'De chiquita dwingt de tegenstander omhoog te spelen → jij staat klaar voor de volley',
      'Dit patroon werkt het best na een return of wanneer de tegenstander even uit positie is',
    ],
    players: [
      { x: 145, y: 310, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 320, label: 'Partner', team: 'partner' },
      { x: 145, y: 90, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 90, label: 'Tegenstander L', team: 'opponent' },
    ],
    pattern: {
      name: 'Chiquita + Net',
      difficulty: 'beginner',
      goal: 'Het net veroveren vanuit verdedigende positie',
      when: 'Na een return, of wanneer de tegenstander een bal speelt die je op heuphoogte kunt nemen',
      steps: [
        {
          step: 0,
          title: 'Chiquita spelen',
          description: 'Speel een lage bal met topspin richting de voeten van de tegenstander aan het net',
          ballFrom: { x: 145, y: 310 },
          ballTo: { x: 140, y: 195 },
          arc: 'flat',
          shotType: 'Chiquita',
          hitter: 'you',
        },
        {
          step: 1,
          title: 'Naar voren lopen',
          description: 'Direct na de chiquita loop je naar voren. Je partner komt mee — jullie bewegen als één blok.',
          ballFrom: { x: 140, y: 195 },
          ballTo: { x: 140, y: 195 },
          arc: 'flat',
          shotType: 'Loopactie',
          hitter: 'you',
          playerMoves: [
            { who: 'you', toX: 145, toY: 240 },
            { who: 'partner', toX: 55, toY: 240 },
          ],
        },
        {
          step: 2,
          title: 'Split-step + Volley',
          description: 'Doe een split-step net voor de tegenstander slaat. Hij moet omhoog spelen → jij volleyt af.',
          ballFrom: { x: 140, y: 195 },
          ballTo: { x: 100, y: 240 },
          arc: 'medium',
          shotType: 'Gedwongen omhoog',
          hitter: 'opponent',
        },
        {
          step: 3,
          title: 'Afmaken!',
          description: 'Volley de hoge bal af naar de open ruimte of de voeten van de tegenstander.',
          ballFrom: { x: 100, y: 240 },
          ballTo: { x: 60, y: 120 },
          arc: 'flat',
          shotType: 'Winnende volley',
          hitter: 'you',
        },
      ],
      variations: [
        'Chiquita cross in plaats van recht → verrassingseffect',
        'Na de chiquita een lob als de tegenstander te snel naar voren komt',
        'Dubbele chiquita: als de eerste niet laag genoeg was, speel er nog een',
      ],
    },
    zones: [
      { x: 110, y: 190, width: 60, height: 15, color: '#32CD32', label: 'Chiquita zone', opacity: 0.15 },
      { x: 0, y: 225, width: 200, height: 25, color: '#FFD700', label: 'Split-step lijn', opacity: 0.1 },
    ],
  },
  {
    id: 'pat-3-ball-middle',
    name: '3-ballen druk door het midden',
    category: 'pattern',
    description: 'Speel drie keer achter elkaar door het midden. Dit creëert verwarring bij de tegenstanders over wie de bal neemt, en opent ruimte aan de zijkanten.',
    tips: [
      'Het midden is de "twijfelzone" — tegenstanders communiceren hier vaak slecht',
      'Na 2-3 ballen door het midden opent er ruimte aan de zijkanten',
      'Wissel af: soms iets meer naar rechts-midden, soms links-midden',
      'Dit patroon werkt extra goed als tegenstanders niet goed communiceren',
      'Na de 3e bal door het midden: verras met een scherpe hoek',
      'Let op de lichaamshouding van de tegenstanders — wie aarzelt, die is kwetsbaar',
    ],
    players: [
      { x: 145, y: 225, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 225, label: 'Partner', team: 'partner' },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    pattern: {
      name: '3x Midden',
      difficulty: 'beginner',
      goal: 'Verwarring creëren en ruimte openen aan de zijkanten',
      when: 'Wanneer jullie aan het net staan en de tegenstanders aarzelen wie de bal pakt',
      steps: [
        {
          step: 0,
          title: 'Eerste bal: midden',
          description: 'Volley richting het midden, tussen de twee tegenstanders in. Let op wie de bal neemt.',
          ballFrom: { x: 145, y: 225 },
          ballTo: { x: 105, y: 120 },
          arc: 'flat',
          shotType: 'Volley midden',
          hitter: 'you',
        },
        {
          step: 1,
          title: 'Return tegenstander',
          description: 'De tegenstander speelt een return — let op of hij naar links of rechts moest bewegen.',
          ballFrom: { x: 105, y: 120 },
          ballTo: { x: 120, y: 230 },
          arc: 'medium',
          shotType: 'Return',
          hitter: 'opponent',
        },
        {
          step: 2,
          title: 'Tweede bal: midden (iets verschoven)',
          description: 'Weer naar het midden, maar nu iets meer naar de speler die de vorige NIET nam. Verwarring groeit.',
          ballFrom: { x: 120, y: 230 },
          ballTo: { x: 90, y: 125 },
          arc: 'flat',
          shotType: 'Volley midden',
          hitter: 'you',
        },
        {
          step: 3,
          title: 'Afmaken via de hoek!',
          description: 'Nu de tegenstanders allebei naar het midden kijken: speel de bal naar de open hoek.',
          ballFrom: { x: 90, y: 225 },
          ballTo: { x: 15, y: 60 },
          arc: 'flat',
          shotType: 'Winnaar naar hoek',
          hitter: 'you',
        },
      ],
      variations: [
        'Varieer het midden: iets meer naar de forehand-speler voor extra druk',
        'Na 2x midden een lob over het hoofd als ze naar voren komen',
        'Je partner kan de 3e bal poachen als de tegenstander voorspelbaar reageert',
      ],
    },
    zones: [
      { x: 70, y: 100, width: 60, height: 50, color: '#FFD700', label: 'Twijfelzone', opacity: 0.12 },
      { x: 0, y: 40, width: 30, height: 50, color: '#32CD32', label: 'Open hoek', opacity: 0.15 },
      { x: 170, y: 40, width: 30, height: 50, color: '#32CD32', label: 'Open hoek', opacity: 0.15 },
    ],
  },
  {
    id: 'pat-lob-switch',
    name: 'Lob + Positiewissel',
    category: 'pattern',
    description: 'Speel een diepe lob diagonaal en neem met je partner het net in terwijl de tegenstanders naar achteren moeten. Een van de meest effectieve manieren om van verdediging naar aanval te gaan.',
    tips: [
      'De lob moet DIEP zijn — voorbij de tegenstander, liefst tot de achterwand',
      'De lob moet CROSS gaan (diagonaal) — dit geeft de langste baan en meeste tijd',
      'Zodra je ziet dat de lob diep genoeg is: BEIDE naar voren',
      'Als de lob niet diep genoeg is: NIET naar voren, blijf staan',
      'De tegenstander moet de bal van de achterwand spelen — lastig om aanvallend te retourneren',
      'Na het innemen van het net: verwacht een lob terug en wees klaar',
    ],
    players: [
      { x: 145, y: 340, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 340, label: 'Partner', team: 'partner' },
      { x: 145, y: 80, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 80, label: 'Tegenstander L', team: 'opponent' },
    ],
    pattern: {
      name: 'Lob + Switch',
      difficulty: 'beginner',
      goal: 'Via een diepe lob het net veroveren en van verdediging naar aanval gaan',
      when: 'Wanneer je achter staat en de kans krijgt om een lob te spelen',
      steps: [
        {
          step: 0,
          title: 'Diepe cross-lob',
          description: 'Speel een hoge, diepe lob diagonaal over de tegenstander aan het net. De bal moet de achterwand raken.',
          ballFrom: { x: 145, y: 340 },
          ballTo: { x: 40, y: 15 },
          arc: 'lob',
          shotType: 'Lob cross',
          hitter: 'you',
        },
        {
          step: 1,
          title: 'Samen naar voren!',
          description: 'Zodra je ziet dat de lob diep genoeg is, lopen jullie BEIDEN naar het net. Beweeg als één blok.',
          ballFrom: { x: 40, y: 15 },
          ballTo: { x: 40, y: 15 },
          arc: 'flat',
          shotType: 'Loopactie',
          hitter: 'you',
          playerMoves: [
            { who: 'you', toX: 145, toY: 230 },
            { who: 'partner', toX: 55, toY: 230 },
          ],
        },
        {
          step: 2,
          title: 'Tegenstander in de problemen',
          description: 'De tegenstander moet de bal van de achterwand spelen. Hij kan alleen maar verdedigend retourneren.',
          ballFrom: { x: 40, y: 15 },
          ballTo: { x: 120, y: 235 },
          arc: 'high',
          shotType: 'Verdedigende return',
          hitter: 'opponent',
        },
        {
          step: 3,
          title: 'Volley afmaken',
          description: 'Jullie staan nu aan het net en de tegenstander speelt hoog. Volley of bandeja naar de open ruimte.',
          ballFrom: { x: 120, y: 235 },
          ballTo: { x: 160, y: 100 },
          arc: 'flat',
          shotType: 'Volley/bandeja',
          hitter: 'you',
        },
      ],
      variations: [
        'Lob langs de lijn als de tegenstander al naar de cross-kant beweegt',
        'Dubbele lob: als de eerste terugkomt, lob opnieuw en neem dan het net',
        'Topspin-lob voor extra diepte en sprong van de achterwand',
      ],
    },
    zones: [
      { x: 10, y: 0, width: 60, height: 30, color: '#32CD32', label: 'Lob landing', opacity: 0.15 },
    ],
  },
  {
    id: 'pat-contrapie',
    name: 'Contrapiés (achter de loper)',
    category: 'pattern',
    description: 'Speel de bal bewust naar de plek waar de tegenstander NET vandaan komt. Terwijl hij herstelt van zijn vorige slag, speel je achter hem aan — hij kan niet meer terug.',
    tips: [
      'Kijk naar de bewegingsrichting van de tegenstander, niet naar de bal',
      'Als de tegenstander naar links beweegt: speel rechts (waar hij vandaan kwam)',
      'Timing is cruciaal: speel de bal net als de tegenstander in beweging is',
      'Dit werkt het best na een breed gespeelde bal — de tegenstander rekt zich uit',
      'Je hoeft niet hard te slaan — plaatsing wint van power',
      'Combineer met het "3x midden" patroon: na 2x midden, contrapiés!',
    ],
    players: [
      { x: 145, y: 220, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 220, label: 'Partner', team: 'partner' },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    pattern: {
      name: 'Contrapiés',
      difficulty: 'gevorderd',
      goal: 'De tegenstander op het verkeerde been zetten door achter hem te spelen',
      when: 'Wanneer je ziet dat de tegenstander in beweging is naar één kant',
      steps: [
        {
          step: 0,
          title: 'Breed spelen (setup)',
          description: 'Speel de bal breed naar de rechterkant om de tegenstander uit positie te trekken.',
          ballFrom: { x: 145, y: 220 },
          ballTo: { x: 175, y: 130 },
          arc: 'flat',
          shotType: 'Volley breed',
          hitter: 'you',
        },
        {
          step: 1,
          title: 'Tegenstander beweegt',
          description: 'De tegenstander rekt zich uit naar rechts om de bal te bereiken. Let op: hij beweegt NAAR RECHTS.',
          ballFrom: { x: 175, y: 130 },
          ballTo: { x: 130, y: 225 },
          arc: 'medium',
          shotType: 'Stretch return',
          hitter: 'opponent',
        },
        {
          step: 2,
          title: 'Contrapiés! Achter de loper!',
          description: 'Terwijl de tegenstander nog naar rechts leunt, speel je de bal LINKS — waar hij net vandaan kwam. Hij kan niet meer terug.',
          ballFrom: { x: 130, y: 225 },
          ballTo: { x: 50, y: 120 },
          arc: 'flat',
          shotType: 'Contrapiés!',
          hitter: 'you',
        },
      ],
      variations: [
        'Werkt ook vanuit verdediging: lob rechts, volgende bal links',
        'Fake de blik naar rechts, speel links — de "no look" variant',
        'Extra effectief na een poach die de tegenstander zag aankomen',
      ],
    },
    zones: [
      { x: 160, y: 110, width: 35, height: 40, color: '#FFD700', label: 'Setup hoek', opacity: 0.12 },
      { x: 20, y: 100, width: 50, height: 45, color: '#32CD32', label: 'Open ruimte!', opacity: 0.2 },
    ],
  },
  {
    id: 'pat-bajada-attack',
    name: 'Bajada + Aanval (van de achterwand)',
    category: 'pattern',
    description: 'De tegenstander lobbede over je heen. In plaats van alleen maar terug te lobben, speel je de bal agressief van de achterwand (bajada) en neem je direct het net weer in.',
    tips: [
      'De bajada is een aanvallende slag vanuit de verdediging — je speelt de bal NA de stuit van de achterwand',
      'Wacht tot de bal van de achterwand komt — haast je niet',
      'Speel de bajada LAAG en richting de voeten van de tegenstander',
      'Na de bajada: loop direct terug naar het net',
      'Dit verrast tegenstanders die verwachten dat je een hoge lob teruggeeft',
      'Oefen het lezen van ballen van de achterwand — dit is de sleutel',
    ],
    players: [
      { x: 145, y: 350, label: 'Jij', team: 'you', isYou: true, ghostX: 145, ghostY: 225 },
      { x: 55, y: 280, label: 'Partner', team: 'partner', ghostX: 55, ghostY: 225 },
      { x: 145, y: 90, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 90, label: 'Tegenstander L', team: 'opponent' },
    ],
    pattern: {
      name: 'Bajada + Net',
      difficulty: 'gevorderd',
      goal: 'Een lob aanvallend beantwoorden in plaats van verdedigend, en het net behouden',
      when: 'Wanneer de tegenstander een niet-perfecte lob speelt die van de achterwand komt',
      steps: [
        {
          step: 0,
          title: 'Lob komt over je heen',
          description: 'De tegenstander lobde. De bal gaat over je hoofd richting de achterwand. Draai en loop naar achteren.',
          ballFrom: { x: 55, y: 90 },
          ballTo: { x: 150, y: 385 },
          arc: 'lob',
          shotType: 'Lob tegenstander',
          hitter: 'opponent',
        },
        {
          step: 1,
          title: 'Wacht op de achterwand',
          description: 'Laat de bal stuiteren en van de achterwand komen. Positioneer je op 1,5m van de wand en wacht.',
          ballFrom: { x: 150, y: 385 },
          ballTo: { x: 145, y: 350 },
          arc: 'medium',
          shotType: 'Bal van de wand',
          hitter: 'you',
        },
        {
          step: 2,
          title: 'Bajada! Aanvallend terugspelen',
          description: 'Speel de bal laag en hard richting de voeten van de tegenstander. Slice of flat — niet lobben!',
          ballFrom: { x: 145, y: 350 },
          ballTo: { x: 60, y: 100 },
          arc: 'flat',
          shotType: 'Bajada (aanval)',
          hitter: 'you',
        },
        {
          step: 3,
          title: 'Terug naar het net',
          description: 'Direct na de bajada loop je terug naar het net. Je partner is al opgeschoven. Neem samen het net in.',
          ballFrom: { x: 60, y: 100 },
          ballTo: { x: 60, y: 100 },
          arc: 'flat',
          shotType: 'Loopactie',
          hitter: 'you',
          playerMoves: [
            { who: 'you', toX: 145, toY: 230 },
            { who: 'partner', toX: 55, toY: 230 },
          ],
        },
      ],
      variations: [
        'Bajada cross als de tegenstander aan de rechterkant staat',
        'Bajada + lob als de tegenstander te snel naar het net komt',
        'Als de lob te diep is en in de hoek komt: speel liever een lob terug',
      ],
    },
    zones: [
      { x: 120, y: 360, width: 60, height: 35, color: '#00BFFF', label: 'Wachtpositie', opacity: 0.12 },
      { x: 30, y: 80, width: 60, height: 40, color: '#32CD32', label: 'Bajada doel', opacity: 0.15 },
    ],
  },
  {
    id: 'pat-serve-volley-close',
    name: 'Serve + Volley + Afsluiten',
    category: 'pattern',
    description: 'Het complete service-patroon: serveer, neem het net in, en maak het punt af in 3 slagen. Dit is hoe je elk servicegame dominant speelt.',
    tips: [
      'Serveer richting het lichaam of de T — maak de return moeilijk',
      'Loop naar voren TIJDENS de service-beweging, niet erna',
      'Eerste volley: NIET afmaken, maar plaatsen richting de lastigste positie',
      'De eerste volley is een "setup volley" — de tweede is de "kill"',
      'Communiceer met je partner: wie neemt welke kant?',
      'Wees klaar voor een lob na je eerste volley — dit is de meest voorkomende reactie',
    ],
    players: [
      { x: 155, y: 310, label: 'Jij (server)', team: 'you', isYou: true },
      { x: 55, y: 230, label: 'Partner (net)', team: 'partner' },
      { x: 55, y: 100, label: 'Returner', team: 'opponent' },
      { x: 145, y: 170, label: 'Tegenstander (net)', team: 'opponent' },
    ],
    pattern: {
      name: 'Serve + Volley + Kill',
      difficulty: 'gevorderd',
      goal: 'Het punt afsluiten binnen 3 slagen na je service',
      when: 'Bij elk servicepunt — dit is je standaard service-plan',
      steps: [
        {
          step: 0,
          title: 'Service naar het lichaam',
          description: 'Serveer richting het lichaam van de returner. Dit beperkt zijn hoeken en geeft je tijd om naar voren te lopen.',
          ballFrom: { x: 155, y: 310 },
          ballTo: { x: 55, y: 130 },
          arc: 'medium',
          shotType: 'Service',
          hitter: 'you',
        },
        {
          step: 1,
          title: 'Naar voren + split-step',
          description: 'Loop naar voren richting het net. Doe een split-step net voordat de returner slaat.',
          ballFrom: { x: 55, y: 130 },
          ballTo: { x: 55, y: 130 },
          arc: 'flat',
          shotType: 'Loopactie',
          hitter: 'you',
          playerMoves: [
            { who: 'you', toX: 145, toY: 240 },
          ],
        },
        {
          step: 2,
          title: 'Setup volley (eerste volley)',
          description: 'De returner speelt een return. Jij volleyt naar de voeten of het midden — nog niet afmaken, wel druk zetten.',
          ballFrom: { x: 55, y: 130 },
          ballTo: { x: 120, y: 240 },
          arc: 'medium',
          shotType: 'Return',
          hitter: 'opponent',
        },
        {
          step: 3,
          title: 'Kill volley!',
          description: 'De tegenstander speelt omhoog. Nu afmaken: volley naar de open ruimte, hard of met een angel.',
          ballFrom: { x: 145, y: 235 },
          ballTo: { x: 100, y: 110 },
          arc: 'flat',
          shotType: 'Setup volley → kill!',
          hitter: 'you',
        },
      ],
      variations: [
        'Bij een zwakke return: sla de eerste volley direct af (kill)',
        'Service breed + volley naar de T als de returner uit positie is',
        'Als de return een lob is: bandeja en houd positie',
      ],
    },
    zones: [
      { x: 30, y: 110, width: 50, height: 40, color: '#FFD700', label: 'Service doel', opacity: 0.12 },
      { x: 0, y: 225, width: 200, height: 25, color: '#00BFFF', label: 'Split-step zone', opacity: 0.08 },
    ],
  },
  {
    id: 'pat-serve-backhand',
    name: 'Service op de backhand + afmaken',
    category: 'pattern',
    description: 'Serveer bewust op de backhand van de returner. De backhand-return is meestal zwakker, wat je een makkelijke eerste volley geeft om het punt af te sluiten.',
    tips: [
      'De meeste spelers hebben een zwakkere backhand-return',
      'Service richting het lichaam/backhand beperkt de hoeken van de return',
      'Na de service: loop naar het net en verwacht een hoge/zwakke return',
      'Eerste volley richting de open kant — de returner is nog uit positie',
      'Wissel af met service op de forehand zodat je onvoorspelbaar blijft',
    ],
    players: [
      { x: 155, y: 310, label: 'Jij (server)', team: 'you', isYou: true },
      { x: 55, y: 230, label: 'Partner (net)', team: 'partner' },
      { x: 55, y: 100, label: 'Returner', team: 'opponent' },
      { x: 145, y: 170, label: 'Tegenstander', team: 'opponent' },
    ],
    pattern: {
      name: 'Serve op backhand',
      difficulty: 'beginner',
      goal: 'Een zwakke return afdwingen via de backhand en het punt afmaken',
      when: 'Bij elke service — vooral als je merkt dat de returner een zwakke backhand heeft',
      steps: [
        {
          step: 0,
          title: 'Service op de backhand',
          description: 'Serveer richting de backhand van de returner (linkerkant van hun lichaam). Niet te hard — plaatsing is key.',
          ballFrom: { x: 155, y: 310 },
          ballTo: { x: 70, y: 120 },
          arc: 'medium',
          shotType: 'Service backhand',
          hitter: 'you',
        },
        {
          step: 1,
          title: 'Naar het net',
          description: 'Loop direct naar voren na de service. Split-step voordat de returner slaat.',
          ballFrom: { x: 70, y: 120 },
          ballTo: { x: 70, y: 120 },
          arc: 'flat',
          shotType: 'Loopactie',
          hitter: 'you',
          playerMoves: [{ who: 'you', toX: 145, toY: 240 }],
        },
        {
          step: 2,
          title: 'Zwakke backhand-return',
          description: 'De returner speelt een zwakke/hoge return vanuit de backhand. Jij staat klaar aan het net.',
          ballFrom: { x: 70, y: 120 },
          ballTo: { x: 120, y: 235 },
          arc: 'high',
          shotType: 'Zwakke return',
          hitter: 'opponent',
        },
        {
          step: 3,
          title: 'Volley afmaken',
          description: 'Volley richting de open ruimte aan de andere kant. De returner is nog uit positie na de backhand.',
          ballFrom: { x: 120, y: 235 },
          ballTo: { x: 170, y: 80 },
          arc: 'flat',
          shotType: 'Winnende volley',
          hitter: 'you',
        },
      ],
      variations: [
        'Service naar de T (midden) als de returner te ver naar de backhand-kant staat',
        'Laat je partner poachen als de return voorspelbaar cross gaat',
        'Bij een goede returner: mix backhand en lichaam om onvoorspelbaar te zijn',
      ],
    },
    zones: [
      { x: 50, y: 100, width: 40, height: 35, color: '#32CD32', label: 'Backhand zone', opacity: 0.15 },
    ],
  },
  {
    id: 'pat-pressure-one',
    name: 'Druk op één tegenstander',
    category: 'pattern',
    description: 'Speel bewust 80% van de ballen naar de zwakste tegenstander. Dit breekt hun ritme, creëert frustratie, en dwingt de sterkere speler om passief toe te kijken.',
    tips: [
      'Identificeer de zwakkere speler in de eerste paar games',
      'Speel NIET altijd naar dezelfde hoek — varieer wél binnen zijn zone',
      'Wissel af: voeten, lichaam, backhand, zijwand — maar altijd naar dezelfde persoon',
      'De sterkere speler wordt ongeduldig en gaat poachen → open ruimte!',
      'Als de zwakke speler naar achteren wordt gedwongen: volley naar zijn voeten',
      'Wees niet te voorspelbaar: speel af en toe naar de sterke speler om ze scherp te houden',
    ],
    players: [
      { x: 145, y: 225, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 225, label: 'Partner', team: 'partner' },
      { x: 145, y: 130, label: 'Zwakkere (target)', team: 'opponent' },
      { x: 55, y: 130, label: 'Sterkere', team: 'opponent' },
    ],
    pattern: {
      name: 'Target de zwakkere',
      difficulty: 'beginner',
      goal: 'De zwakste tegenstander onder druk zetten tot hij fouten maakt',
      when: 'Zodra je merkt dat één tegenstander duidelijk zwakker is of minder goed beweegt',
      steps: [
        {
          step: 0,
          title: 'Volley naar voeten (target)',
          description: 'Speel je volley richting de voeten van de zwakkere tegenstander. Hij moet omhoog spelen.',
          ballFrom: { x: 145, y: 225 },
          ballTo: { x: 150, y: 135 },
          arc: 'flat',
          shotType: 'Volley voeten',
          hitter: 'you',
        },
        {
          step: 1,
          title: 'Zwakke return komt terug',
          description: 'De target speelt een matige return. Zijn positie is niet optimaal.',
          ballFrom: { x: 150, y: 135 },
          ballTo: { x: 130, y: 230 },
          arc: 'medium',
          shotType: 'Matige return',
          hitter: 'opponent',
        },
        {
          step: 2,
          title: 'Weer naar dezelfde speler',
          description: 'Speel opnieuw naar de target, maar nu iets meer naar zijn backhand. De druk stapelt op.',
          ballFrom: { x: 130, y: 230 },
          ballTo: { x: 120, y: 130 },
          arc: 'flat',
          shotType: 'Druk backhand',
          hitter: 'you',
        },
        {
          step: 3,
          title: 'Fout of open ruimte',
          description: 'De target maakt een fout OF de sterkere speler gaat poachen → open ruimte aan de andere kant!',
          ballFrom: { x: 120, y: 130 },
          ballTo: { x: 80, y: 235 },
          arc: 'medium',
          shotType: 'Fout / poach-poging',
          hitter: 'opponent',
        },
      ],
      variations: [
        'Als de sterkere gaat poachen: wacht en speel naar de lege kant',
        'Wissel 1 op 5 ballen naar de sterkere om ze alert te houden',
        'Bij een wisseling van kant: heridentificeer wie de zwakkere is',
      ],
    },
    zones: [
      { x: 100, y: 110, width: 90, height: 50, color: '#FF6347', label: 'Target zone', opacity: 0.12 },
      { x: 10, y: 110, width: 80, height: 50, color: '#32CD32', label: 'Open bij poach', opacity: 0.08 },
    ],
  },
  {
    id: 'pat-rulo',
    name: 'De Rulo (por 4 / over het hek)',
    category: 'pattern',
    description: 'De rulo is een smash of overheadslag die zo hard en steil wordt geslagen dat de bal via de achterwand OVER het hek uit de baan springt. Een spectaculaire winnaar die het punt direct beëindigt.',
    tips: [
      'De rulo werkt alleen bij een lob die hoog genoeg is om boven je hoofd te slaan',
      'Sla de bal STEIL naar beneden richting de achterwand van de tegenstander',
      'De bal moet de grond raken dicht bij de achterwand, dan via de wand omhoog over het hek',
      'Topspin is essentieel — dit zorgt ervoor dat de bal omhoog springt na de wand',
      'Richt op ~1 meter voor de achterwand — niet TE dicht bij de muur',
      'Als het lukt, is het punt direct voorbij — de bal is uit het veld',
    ],
    players: [
      { x: 145, y: 225, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 225, label: 'Partner', team: 'partner' },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    pattern: {
      name: 'Rulo (Por 4)',
      difficulty: 'expert',
      goal: 'Het punt direct winnen met een smash die over het hek gaat',
      when: 'Bij een hoge, korte lob die je comfortabel boven je hoofd kunt slaan',
      steps: [
        {
          step: 0,
          title: 'Hoge lob komt',
          description: 'De tegenstander speelt een lob die niet diep genoeg is. Je hebt tijd om je op te stellen.',
          ballFrom: { x: 55, y: 130 },
          ballTo: { x: 145, y: 230 },
          arc: 'lob',
          shotType: 'Korte lob',
          hitter: 'opponent',
        },
        {
          step: 1,
          title: 'Opstellen voor de smash',
          description: 'Positioneer je onder de bal, draai zijwaarts. Vrije hand wijst naar de bal.',
          ballFrom: { x: 145, y: 230 },
          ballTo: { x: 145, y: 230 },
          arc: 'flat',
          shotType: 'Positie innemen',
          hitter: 'you',
        },
        {
          step: 2,
          title: 'RULO! Steil naar de achterwand',
          description: 'Smash met volle topspin steil naar beneden. De bal moet vlak voor de achterwand stuiteren en dan via de muur omhoog schieten.',
          ballFrom: { x: 145, y: 225 },
          ballTo: { x: 140, y: 20 },
          arc: 'flat',
          shotType: 'RULO!',
          hitter: 'you',
        },
        {
          step: 3,
          title: 'Bal over het hek = punt!',
          description: 'De bal stuitert, raakt de achterwand met topspin en springt OVER het hek. Punt gewonnen!',
          ballFrom: { x: 140, y: 20 },
          ballTo: { x: 140, y: -10 },
          arc: 'medium',
          shotType: 'Over het hek!',
          hitter: 'you',
        },
      ],
      variations: [
        'Rulo cross: moeilijker maar onverwacht — de bal gaat diagonaal over het hek',
        'Fake rulo → drop shot: doe alsof je de rulo slaat, maar speel een zachte drop',
        'Als de rulo niet lukt, wordt het een gewone smash — wees klaar voor de return',
      ],
    },
    zones: [
      { x: 110, y: 0, width: 60, height: 25, color: '#FF6347', label: 'Rulo zone!', opacity: 0.2 },
    ],
  },
  {
    id: 'pat-volley-feet-net',
    name: 'Volley op de voeten + naar net',
    category: 'pattern',
    description: 'Het simpelste maar meest effectieve patroon: speel elke volley naar de voeten van de tegenstander. Hij MOET omhoog spelen → jij maakt af. Herhaal tot het punt voorbij is.',
    tips: [
      'De voeten zijn het moeilijkste punt om te verdedigen — de tegenstander moet bukken',
      'Een bal op de voeten dwingt een return omhoog → jouw volgende volley is makkelijker',
      'Niet hard slaan — plaatsing op de voeten is belangrijker dan snelheid',
      'Na elke volley: racket HOOG houden, klaar voor de volgende',
      'Dit patroon werkt als een trechter: elke volley beperkt de opties van de tegenstander meer',
    ],
    players: [
      { x: 145, y: 220, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 220, label: 'Partner', team: 'partner' },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    pattern: {
      name: 'Voeten-trechter',
      difficulty: 'beginner',
      goal: 'De tegenstander steeds hoger laten spelen tot je kunt afmaken',
      when: 'Altijd wanneer je aan het net staat — dit is je standaard volley-strategie',
      steps: [
        {
          step: 0,
          title: '1e volley: naar de voeten',
          description: 'Eerste volley laag richting de voeten van de tegenstander. Niet hard, wel precies.',
          ballFrom: { x: 145, y: 220 },
          ballTo: { x: 140, y: 135 },
          arc: 'flat',
          shotType: 'Volley voeten',
          hitter: 'you',
        },
        {
          step: 1,
          title: 'Tegenstander speelt omhoog',
          description: 'De tegenstander moet bukken en de bal omhoog spelen. Zijn return is zwak en hoog.',
          ballFrom: { x: 140, y: 135 },
          ballTo: { x: 120, y: 225 },
          arc: 'high',
          shotType: 'Gedwongen omhoog',
          hitter: 'opponent',
        },
        {
          step: 2,
          title: '2e volley: weer voeten of midden',
          description: 'Weer naar de voeten, of nu naar het midden om verwarring te zaaien. De druk groeit.',
          ballFrom: { x: 120, y: 225 },
          ballTo: { x: 100, y: 130 },
          arc: 'flat',
          shotType: 'Volley midden/voeten',
          hitter: 'you',
        },
        {
          step: 3,
          title: 'Afmaken naar de open hoek',
          description: 'De tegenstander is nu uit positie of speelt nog hoger. Volley naar de open hoek → punt!',
          ballFrom: { x: 100, y: 225 },
          ballTo: { x: 30, y: 60 },
          arc: 'flat',
          shotType: 'Winnende volley!',
          hitter: 'you',
        },
      ],
      variations: [
        'Afwisselen tussen voeten links en voeten rechts tegenstander',
        'Na 2x voeten: drop shot als de tegenstander te ver achter staat',
        'Partner kan poachen na de 2e zwakke return',
      ],
    },
    zones: [
      { x: 115, y: 125, width: 55, height: 15, color: '#32CD32', label: 'Voeten!', opacity: 0.2 },
    ],
  },
  {
    id: 'pat-golden-point',
    name: 'Gouden punt (40-40 strategie)',
    category: 'pattern',
    description: 'Bij 40-40 (deuce) in padel wordt er één punt gespeeld. Dit is HET moment om je beste patroon te kiezen. Veiligheid boven risico — de speler die de minste fouten maakt wint.',
    tips: [
      'Kies je STERKSTE patroon — dit is niet het moment voor experimenten',
      'Als je serveert: serveer naar het lichaam, neem het net, speel veilig',
      'Als je returnt: chiquita naar de voeten, neem het net als het kan',
      'Communiceer met je partner VAN TEVOREN wat het plan is',
      'Vermijd onnodige risico\'s — geen rulo\'s of scherpe hoeken',
      'De team dat het net heeft wint 80% van de punten bij 40-40',
    ],
    players: [
      { x: 145, y: 310, label: 'Jij (server)', team: 'you', isYou: true },
      { x: 55, y: 230, label: 'Partner (net)', team: 'partner' },
      { x: 55, y: 100, label: 'Returner', team: 'opponent' },
      { x: 145, y: 170, label: 'Tegenstander', team: 'opponent' },
    ],
    pattern: {
      name: '40-40 Plan',
      difficulty: 'gevorderd',
      goal: 'Het beslissende punt winnen met een veilig maar effectief patroon',
      when: 'Bij 40-40 (punto de oro) — het allerbelangrijkste punt van de game',
      steps: [
        {
          step: 0,
          title: 'Veilige service naar het lichaam',
          description: 'GEEN risico. Service naar het lichaam/backhand van de returner. Beperkt zijn hoeken.',
          ballFrom: { x: 155, y: 310 },
          ballTo: { x: 60, y: 115 },
          arc: 'medium',
          shotType: 'Veilige service',
          hitter: 'you',
        },
        {
          step: 1,
          title: 'Direct naar het net',
          description: 'Sluit aan bij je partner aan het net. Twee aan het net = maximale druk.',
          ballFrom: { x: 60, y: 115 },
          ballTo: { x: 60, y: 115 },
          arc: 'flat',
          shotType: 'Loopactie',
          hitter: 'you',
          playerMoves: [{ who: 'you', toX: 145, toY: 235 }],
        },
        {
          step: 2,
          title: 'Eerste volley: veilig naar voeten',
          description: 'De return komt. Speel VEILIG naar de voeten — geen risico\'s nemen.',
          ballFrom: { x: 60, y: 115 },
          ballTo: { x: 130, y: 240 },
          arc: 'medium',
          shotType: 'Return',
          hitter: 'opponent',
        },
        {
          step: 3,
          title: 'Controle houden',
          description: 'Blijf naar de voeten spelen tot je een bal krijgt die je ZEKER kunt afmaken. Geduld wint.',
          ballFrom: { x: 130, y: 235 },
          ballTo: { x: 140, y: 120 },
          arc: 'flat',
          shotType: 'Controle volley',
          hitter: 'you',
        },
      ],
      variations: [
        'Als returner: chiquita + naar het net is je veiligste optie',
        'Bij twijfel: lob diep en neem het net als de lob goed genoeg is',
        'Spreek met je partner af wie de bal in het midden neemt',
      ],
    },
    zones: [
      { x: 35, y: 95, width: 45, height: 35, color: '#32CD32', label: 'Service doel', opacity: 0.12 },
    ],
  },
  {
    id: 'pat-bandeja-cycle',
    name: 'Bandeja-cyclus (controle houden)',
    category: 'pattern',
    description: 'De tegenstander lobbede. In plaats van te smashen speel je een gecontroleerde bandeja, houd je positie aan het net, en herhaalt het patroon tot je kunt afmaken. Dit is hoe pro\'s spelen.',
    tips: [
      'De bandeja is GEEN afmaker — het is een controle-slag om aan het net te blijven',
      'Na de bandeja: direct weer klaar aan het net, racket hoog',
      'De tegenstander MOET opnieuw lobben of laag spelen → beide opties zijn in jouw voordeel',
      'Herhaal de bandeja 2-3x als het moet — geduld wint',
      'Pas als je een korte/lage bal krijgt: DAN maak je af met een volley of smash',
    ],
    players: [
      { x: 145, y: 225, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 225, label: 'Partner', team: 'partner' },
      { x: 145, y: 130, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 130, label: 'Tegenstander L', team: 'opponent' },
    ],
    pattern: {
      name: 'Bandeja-cyclus',
      difficulty: 'gevorderd',
      goal: 'Het net behouden via herhaalde bandejas tot je kunt afmaken',
      when: 'Altijd wanneer de tegenstander lobt en je aan het net staat — dit is je standaard reactie',
      steps: [
        {
          step: 0,
          title: 'Lob van de tegenstander',
          description: 'De tegenstander probeert je van het net te krijgen met een lob.',
          ballFrom: { x: 145, y: 130 },
          ballTo: { x: 148, y: 228 },
          arc: 'lob',
          shotType: 'Lob',
          hitter: 'opponent',
        },
        {
          step: 1,
          title: 'Bandeja (niet smashen!)',
          description: 'Speel een gecontroleerde bandeja cross. Backspin houdt de bal laag. Blijf aan het net.',
          ballFrom: { x: 148, y: 228 },
          ballTo: { x: 55, y: 110 },
          arc: 'medium',
          shotType: 'Bandeja cross',
          hitter: 'you',
        },
        {
          step: 2,
          title: 'Tegenstander lobt opnieuw',
          description: 'De tegenstander heeft geen betere optie dan opnieuw lobben. De cyclus herhaalt.',
          ballFrom: { x: 55, y: 110 },
          ballTo: { x: 140, y: 235 },
          arc: 'lob',
          shotType: 'Opnieuw lob',
          hitter: 'opponent',
        },
        {
          step: 3,
          title: 'Korte lob → afmaken!',
          description: 'Na 2-3 bandejas wordt de lob korter. NU mag je smashen of naar de voeten volleyen.',
          ballFrom: { x: 140, y: 230 },
          ballTo: { x: 130, y: 100 },
          arc: 'flat',
          shotType: 'Afmaken!',
          hitter: 'you',
        },
      ],
      variations: [
        'Wissel bandeja met víbora om de tegenstander te verrassen',
        'Na 2x bandeja cross: speel bandeja langs de lijn',
        'Als de lob echt kort is: smash of rulo in plaats van bandeja',
      ],
    },
    zones: [
      { x: 30, y: 90, width: 50, height: 40, color: '#32CD32', label: 'Bandeja doel', opacity: 0.12 },
    ],
  },
  {
    id: 'pat-aussie-formation',
    name: 'Australische formatie',
    category: 'pattern',
    description: 'Je partner staat aan DEZELFDE kant als jij bij de service, in plaats van de gebruikelijke posities. Dit verwart de returner en verandert alle hoeken. Een slim wapen om af en toe in te zetten.',
    tips: [
      'Je partner staat aan het net aan JOUW kant (rechts) in plaats van links',
      'De returner weet niet of hij cross of lijn moet spelen — verwarring!',
      'Na de service: jij gaat naar de LINKER kant, je partner blijft rechts',
      'Gebruik het als verrassingswapen — niet elk punt, maar 1 op de 4-5 punten',
      'Bespreek van tevoren met je partner wie welke kant dekt na de service',
    ],
    players: [
      { x: 155, y: 310, label: 'Jij (server)', team: 'you', isYou: true },
      { x: 130, y: 230, label: 'Partner (!)', team: 'partner' },
      { x: 55, y: 100, label: 'Returner', team: 'opponent' },
      { x: 145, y: 170, label: 'Tegenstander', team: 'opponent' },
    ],
    pattern: {
      name: 'Aussie Formation',
      difficulty: 'gevorderd',
      goal: 'De returner verwarren met een onverwachte formatie',
      when: 'Als verrassingswapen bij belangrijke servicepunten, of als de returner steeds dezelfde return speelt',
      steps: [
        {
          step: 0,
          title: 'Partner aan jouw kant',
          description: 'Je partner knielt/staat aan het net aan JOUW kant. De returner ziet dit en twijfelt.',
          ballFrom: { x: 155, y: 310 },
          ballTo: { x: 155, y: 310 },
          arc: 'flat',
          shotType: 'Opstelling',
          hitter: 'you',
        },
        {
          step: 1,
          title: 'Service + switch',
          description: 'Serveer cross naar de returner. Direct daarna ga JIJ naar links, je partner blijft rechts.',
          ballFrom: { x: 155, y: 310 },
          ballTo: { x: 65, y: 125 },
          arc: 'medium',
          shotType: 'Service cross',
          hitter: 'you',
          playerMoves: [
            { who: 'you', toX: 55, toY: 240 },
          ],
        },
        {
          step: 2,
          title: 'Verwarde return',
          description: 'De returner twijfelt: cross is geblokkeerd door je partner, lijn is ongebruikelijk. Vaak komt er een zwakke return.',
          ballFrom: { x: 65, y: 125 },
          ballTo: { x: 80, y: 235 },
          arc: 'medium',
          shotType: 'Verwarde return',
          hitter: 'opponent',
        },
        {
          step: 3,
          title: 'Afmaken vanuit nieuwe positie',
          description: 'Jij of je partner maakt de zwakke return af vanuit jullie nieuwe posities.',
          ballFrom: { x: 80, y: 235 },
          ballTo: { x: 160, y: 80 },
          arc: 'flat',
          shotType: 'Afmaken!',
          hitter: 'you',
        },
      ],
      variations: [
        'Partner geeft achter zijn rug een signaal: links of rechts gaan na de service',
        'Soms NIET wisselen — partner springt naar dezelfde kant als de return → poach',
        'Bij dubbele fout-druk: NIET gebruiken, het geeft extra nervositeit',
      ],
    },
    zones: [
      { x: 100, y: 215, width: 60, height: 35, color: '#FFD700', label: 'Partner (onverwacht!)', opacity: 0.12 },
      { x: 0, y: 220, width: 90, height: 40, color: '#00BFFF', label: 'Jij na switch', opacity: 0.08 },
    ],
  },
  {
    id: 'pat-wall-lob-counter',
    name: 'Achterwand → lob → aanval',
    category: 'pattern',
    description: 'De tegenstander slaat een harde bal die via de achterwand terugkomt. In plaats van paniekerig terug te slaan, wacht je rustig, speelt een diepe lob, en neemt samen met je partner het net in.',
    tips: [
      'GEEN PANIEK bij een harde bal — de achterwand is je vriend',
      'Stap weg van de muur (1.5m) en wacht tot de bal van de wand komt',
      'Speel een HOGE, DIEPE lob — dit geeft je tijd om naar voren te lopen',
      'De lob moet cross gaan (diagonaal) voor maximale afstand en tijd',
      'Zodra de lob weg is: BEIDE naar voren, net claimen',
    ],
    players: [
      { x: 150, y: 360, label: 'Jij', team: 'you', isYou: true },
      { x: 55, y: 340, label: 'Partner', team: 'partner' },
      { x: 145, y: 90, label: 'Tegenstander R', team: 'opponent' },
      { x: 55, y: 90, label: 'Tegenstander L', team: 'opponent' },
    ],
    pattern: {
      name: 'Muur → Lob → Net',
      difficulty: 'beginner',
      goal: 'Een harde bal verdedigen via de wand en dan het net claimen',
      when: 'Wanneer de tegenstander hard slaat en de bal via de achterwand terugkomt',
      steps: [
        {
          step: 0,
          title: 'Harde bal naar de achterwand',
          description: 'De tegenstander slaat hard. De bal stuitert en raakt de achterwand. Stap weg van de muur.',
          ballFrom: { x: 145, y: 90 },
          ballTo: { x: 150, y: 390 },
          arc: 'flat',
          shotType: 'Harde slag',
          hitter: 'opponent',
        },
        {
          step: 1,
          title: 'Wacht op de achterwand',
          description: 'De bal komt van de achterwand terug. Jij staat op 1.5m van de muur en wacht geduldig.',
          ballFrom: { x: 150, y: 390 },
          ballTo: { x: 150, y: 360 },
          arc: 'flat',
          shotType: 'Van de wand',
          hitter: 'you',
        },
        {
          step: 2,
          title: 'Diepe cross-lob',
          description: 'Speel een hoge, diepe lob diagonaal. Dit geeft je maximale tijd om naar voren te lopen.',
          ballFrom: { x: 150, y: 360 },
          ballTo: { x: 40, y: 15 },
          arc: 'lob',
          shotType: 'Diepe lob cross',
          hitter: 'you',
        },
        {
          step: 3,
          title: 'Samen naar het net!',
          description: 'De lob is diep genoeg. Loop SAMEN naar het net. Van verdediging naar aanval!',
          ballFrom: { x: 40, y: 15 },
          ballTo: { x: 40, y: 15 },
          arc: 'flat',
          shotType: 'Net claimen!',
          hitter: 'you',
          playerMoves: [
            { who: 'you', toX: 145, toY: 230 },
            { who: 'partner', toX: 55, toY: 230 },
          ],
        },
      ],
      variations: [
        'Als de bal van de zijwand + achterwand komt: idem, wacht geduldig',
        'Bij een niet-diepe-genoege lob: NIET naar voren, blijf achter',
        'Bajada als alternatief als de bal goed van de wand komt',
      ],
    },
    zones: [
      { x: 120, y: 345, width: 60, height: 30, color: '#00BFFF', label: 'Wachtpositie', opacity: 0.12 },
      { x: 10, y: 0, width: 60, height: 25, color: '#32CD32', label: 'Lob landing', opacity: 0.15 },
    ],
  },
]

export const categoryLabels: Record<string, string> = {
  defensive: 'Verdedigend',
  offensive: 'Aanvallend',
  transition: 'Transitie',
  serve: 'Service & Return',
  technique: 'Slagen & Techniek',
  pattern: 'Patronen & Slimmigheidjes',
}

export const categoryDescriptions: Record<string, string> = {
  defensive: 'Positionering wanneer de tegenstanders aan het net staan en jullie achter staan',
  offensive: 'Positionering wanneer jullie aan het net staan en de druk opvoeren',
  transition: 'Het wisselen tussen aanval en verdediging — de sleutel tot beter padel',
  serve: 'Service en return situaties — het begin van elk punt',
  technique: 'Hoe je de belangrijkste slagen uitvoert — grip, contactpunt, spin en doelzones',
  pattern: 'Slimme speelpatronen en combinaties om punten te winnen',
}
