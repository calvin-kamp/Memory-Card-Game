import './styles/main.scss'

import { initThemeStore } from '@stores/theme-store'
import { initGamePage } from '@pages/game.page'
import { initSettingsPage } from '@pages/settings.page'

initThemeStore()
initSettingsPage()
initGamePage()
