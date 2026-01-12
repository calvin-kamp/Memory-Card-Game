import { Game } from '@models/game.model'
import { getGameSettings } from '@stores/game-settings-store'

export function initGamePage() {
    const root = document.querySelector<HTMLElement>('[data-component="game"]')
    if (!root) {
        return
    }

    const settings = getGameSettings()
    new Game(root, settings)
}
