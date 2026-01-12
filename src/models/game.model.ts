import { getIconUrls, pickRandomUnique, shuffle } from '@root/utils/assets'
import { boardTemplate, MemoryCard } from '@templates/board.template'
import { GameSettings, PlayerColor } from '@stores/game-settings-store'

type GameState = 'idle' | 'playing' | 'won'

function getOpponent(player: PlayerColor): PlayerColor {
    return player === 'blue' ? 'red' : 'blue'
}

function formatPlayer(player: PlayerColor): string {
    return player === 'blue' ? 'Blue' : 'Red'
}

export class Game {
    private root: HTMLElement
    private boardEl: HTMLElement
    private statsEl: HTMLElement | null
    private messageEl: HTMLElement | null

    private settings: GameSettings
    private cards: MemoryCard[] = []
    private opened: string[] = []
    private lock: boolean = false

    private moves: number = 0
    private matches: number = 0
    private state: GameState = 'idle'

    private currentPlayer: PlayerColor = 'blue'
    private score: Record<PlayerColor, number> = { blue: 0, red: 0 }

    constructor(root: HTMLElement, settings: GameSettings) {
        this.root = root
        this.settings = settings

        const board = this.root.querySelector<HTMLElement>('[data-board]')
        if (!board) {
            throw new Error('Game: [data-board] not found')
        }

        this.boardEl = board
        this.statsEl = this.root.querySelector<HTMLElement>('[data-game-stats]')
        this.messageEl = this.root.querySelector<HTMLElement>('[data-game-message]')

        this.bindEvents()
        this.newGame()
    }

    newGame() {
        this.state = 'playing'
        this.moves = 0
        this.matches = 0
        this.opened = []
        this.lock = false

        this.currentPlayer = this.settings.startingPlayer
        this.score = { blue: 0, red: 0 }

        this.cards = this.createDeck(this.settings.boardSize)
        this.render()
        this.updateStats()
        this.setMessage(`${formatPlayer(this.currentPlayer)} starts`)
        this.syncRootDatasets()
    }

    private syncRootDatasets() {
        this.root.dataset.currentPlayer = this.currentPlayer
    }

    private bindEvents() {
        this.boardEl.addEventListener('click', (e) => {
            const target = e.target as HTMLElement
            const btn = target.closest<HTMLButtonElement>('[data-card-id]')
            if (!btn) {
                return
            }

            const cardId = btn.getAttribute('data-card-id')
            if (!cardId) {
                return
            }

            this.flip(cardId)
        })

        const newGameBtn = this.root.querySelector<HTMLButtonElement>('[data-action="new-game"]')
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.newGame())
        }
    }

    private createDeck(boardSize: number): MemoryCard[] {
        const neededUnique = Math.floor(boardSize / 2)
        const icons = getIconUrls()

        const chosen = pickRandomUnique(icons, neededUnique)
        const pairs: MemoryCard[] = []

        for (let i = 0; i < neededUnique; i++) {
            const iconUrl = chosen[i] ?? icons[i % icons.length]
            const pairKey = `pair-${i}`
            pairs.push({ id: `${pairKey}-a`, pairKey, iconUrl, state: 'hidden', matchedBy: null })
            pairs.push({ id: `${pairKey}-b`, pairKey, iconUrl, state: 'hidden', matchedBy: null })
        }

        return shuffle(pairs)
    }

    private flip(cardId: string) {
        if (this.state !== 'playing') {
            return
        }

        if (this.lock) {
            return
        }

        const card = this.cards.find((c) => c.id === cardId)
        if (!card) {
            return
        }

        if (card.state === 'matched' || card.state === 'visible') {
            return
        }

        card.state = 'visible'
        this.opened.push(card.id)
        this.render()

        if (this.opened.length < 2) {
            return
        }

        this.moves += 1
        this.updateStats()

        const [aId, bId] = this.opened
        const a = this.cards.find((c) => c.id === aId)
        const b = this.cards.find((c) => c.id === bId)

        if (!a || !b) {
            this.opened = []
            return
        }

        this.lock = true

        if (a.pairKey === b.pairKey) {
            a.state = 'matched'
            b.state = 'matched'

            this.matches += 1
            this.score[this.currentPlayer] += 1

            this.opened = []
            this.lock = false

            this.render()
            this.updateStats()
            this.setMessage(`Match! ${formatPlayer(this.currentPlayer)} scores and continues`)
            this.checkWin()
            return
        }

        const nextPlayer = getOpponent(this.currentPlayer)

        window.setTimeout(() => {
            a.state = 'hidden'
            b.state = 'hidden'

            this.opened = []
            this.lock = false

            this.currentPlayer = nextPlayer
            this.syncRootDatasets()

            this.render()
            this.updateStats()
            this.setMessage(`No match — ${formatPlayer(this.currentPlayer)}'s turn`)
        }, 700)
    }

    private checkWin() {
        const totalPairs = Math.floor(this.settings.boardSize / 2)
        if (this.matches !== totalPairs) {
            return
        }

        this.state = 'won'

        if (this.score.blue > this.score.red) {
            this.setMessage(`Game over — Blue wins (${this.score.blue}:${this.score.red})`)
            return
        }

        if (this.score.red > this.score.blue) {
            this.setMessage(`Game over — Red wins (${this.score.red}:${this.score.blue})`)
            return
        }

        this.setMessage(`Game over — Draw (${this.score.blue}:${this.score.red})`)
    }

    private updateStats() {
        if (!this.statsEl) {
            return
        }

        const totalPairs = Math.floor(this.settings.boardSize / 2)
        const turn = formatPlayer(this.currentPlayer)

        this.statsEl.innerHTML = `
            <div class="game-stats" data-turn="${this.currentPlayer}">
                <span class="game-stats__turn">Turn: ${turn}</span>
                <span class="game-stats__scores">
                    <span class="score score--blue${this.currentPlayer === 'blue' ? ' is-active' : ''}">Blue: ${this.score.blue}</span>
                    <span class="score score--red${this.currentPlayer === 'red' ? ' is-active' : ''}">Red: ${this.score.red}</span>
                </span>
                <span class="game-stats__meta">Moves: ${this.moves} · Pairs: ${this.matches}/${totalPairs}</span>
            </div>
        `.trim()
    }

    private setMessage(text: string) {
        if (!this.messageEl) {
            return
        }

        this.messageEl.textContent = text
    }

    private render() {
        this.boardEl.innerHTML = boardTemplate(this.cards, this.settings.boardSize)
    }
}
