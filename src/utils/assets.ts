import { randomNumber } from '@root/utils/helper'

const ICON_NAMES = [
    'angular.svg',
    'bootstrap.svg',
    'browser-stack.svg',
    'css.svg',
    'docker.svg',
    'git.svg',
    'html.svg',
    'javascript.svg',
    'nuxt.svg',
    'python.svg',
    'react.svg',
    'shopware.svg',
    'stack-overflow.svg',
    'svelte.svg',
    'typescript.svg',
    'visual-studio-code.svg',
    'vite.svg',
    'vue.svg',
]

export function getIconUrls(): string[] {
    const baseUrl = new URL('/icons/', window.location.href).toString().replace(/\/$/, '')
    return ICON_NAMES.map(name => `${baseUrl}/${name}`)
}

export function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr]

    for (let i = copy.length - 1; i > 0; i--) {
        const j = randomNumber(0, i)
        const tmp = copy[i]
        copy[i] = copy[j]
        copy[j] = tmp
    }

    return copy
}

export function pickRandomUnique<T>(items: T[], count: number): T[] {
    if (count <= 0 || items.length === 0) {
        return []
    }

    if (items.length <= count) {
        return shuffle(items).slice(0, count)
    }

    const remaining = [...items]
    const picked: T[] = []

    while (picked.length < count && remaining.length > 0) {
        const idx = randomNumber(0, remaining.length - 1)
        
        picked.push(remaining[idx])
        remaining.splice(idx, 1)
    }

    return picked
}
