export type PlayerColor = 'blue' | 'red'
export type BoardSize = 16 | 24 | 32

export interface GameSettings {
    boardSize: BoardSize
    startingPlayer: PlayerColor
}

const SETTINGS_KEY = 'memory:settings'

function isBoardSize(value: unknown): value is BoardSize {
    return value === 16 || value === 24 || value === 32
}

function isPlayerColor(value: unknown): value is PlayerColor {
    return value === 'blue' || value === 'red'
}

export function getGameSettings(): GameSettings {
    if (typeof window === 'undefined') {
        return { boardSize: 16, startingPlayer: 'blue' }
    }

    try {
        const raw = window.localStorage.getItem(SETTINGS_KEY)
        if (!raw) {
            return { boardSize: 16, startingPlayer: 'blue' }
        }

        const parsed = JSON.parse(raw) as any

        const boardSize = isBoardSize(parsed.boardSize) ? parsed.boardSize : 16

        // Backward compat: falls vorher "playerColor" gespeichert war
        const startingPlayerRaw = parsed.startingPlayer ?? parsed.playerColor
        const startingPlayer = isPlayerColor(startingPlayerRaw) ? startingPlayerRaw : 'blue'

        return { boardSize, startingPlayer }
    } catch {
        return { boardSize: 16, startingPlayer: 'blue' }
    }
}

export function setGameSettings(next: Partial<GameSettings>) {
    if (typeof window === 'undefined') {
        return
    }

    const current = getGameSettings()

    const merged: GameSettings = {
        boardSize: isBoardSize(next.boardSize) ? next.boardSize : current.boardSize,
        startingPlayer: isPlayerColor(next.startingPlayer) ? next.startingPlayer : current.startingPlayer,
    }

    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged))
}
