import { getGameSettings, setGameSettings } from '../stores/game-settings-store'
import { getTheme, setTheme, Theme } from '../stores/theme-store'

export function initSettingsPage() {
    const root = document.querySelector<HTMLElement>('[data-component="settings"]')
    if (!root) {
        return
    }

    const themeValue = getTheme()
    const themeInput = root.querySelector<HTMLInputElement>(`input[name="color-theme"][value="${themeValue}"]`)
    if (themeInput) {
        themeInput.checked = true
    }

    const settings = getGameSettings()

    const boardInput = root.querySelector<HTMLInputElement>(`input[name="board-size"][value="${settings.boardSize}"]`)
    if (boardInput) {
        boardInput.checked = true
    }

    const startingInput = root.querySelector<HTMLInputElement>(`input[name="player"][value="${settings.startingPlayer}"]`)
    if (startingInput) {
        startingInput.checked = true
    }

    root.addEventListener('change', (e) => {
        const target = e.target as HTMLElement
        if (!(target instanceof HTMLInputElement)) {
            return
        }

        if (target.name === 'color-theme') {
            const next = target.value as Theme
            if (next === 'light' || next === 'dark') {
                setTheme(next)
            }
            return
        }

        if (target.name === 'board-size') {
            const size = Number(target.value)
            if (size === 16 || size === 24 || size === 32) {
                setGameSettings({ boardSize: size })
            }
            return
        }

        // name="player" => startingPlayer
        if (target.name === 'player') {
            const color = target.value
            if (color === 'blue' || color === 'red') {
                setGameSettings({ startingPlayer: color })
            }
        }
    })

    const startBtn = root.querySelector<HTMLButtonElement>('[data-action="start-game"]')
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            window.location.href = './game.html'
        })
    }
}
