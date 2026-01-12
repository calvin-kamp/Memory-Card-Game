import { getPreferredScheme } from '@root/utils/helper'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'memory:theme'

function isTheme(value: unknown): value is Theme {
    return value === 'light' || value === 'dark'
}

export function getTheme(): Theme {
    if (typeof window === 'undefined') {
        return 'light'
    }

    const stored = window.localStorage.getItem(THEME_KEY)
    if (isTheme(stored)) {
        return stored
    }

    return getPreferredScheme() as Theme
}

export function applyTheme(theme: Theme) {
    if (typeof document === 'undefined') {
        return
    }

    document.documentElement.setAttribute('data-theme', theme)
}

export function setTheme(theme: Theme) {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(THEME_KEY, theme)
    }

    applyTheme(theme)
}

export function initThemeStore() {
    applyTheme(getTheme())

    if (typeof window === 'undefined' || !window.matchMedia) {
        return
    }

    const stored = window.localStorage.getItem(THEME_KEY)
    if (isTheme(stored)) {
        return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme(getTheme())

    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', onChange)
    }
}
