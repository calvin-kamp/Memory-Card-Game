import { randomNumber } from '@root/utils/helper'

export function getIconUrls(): string[] {
    const modules = import.meta.glob('../assets/*.svg', {
        eager: true,
        query: '?url',
        import: 'default',
    }) as Record<string, string>

    return Object.values(modules)
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
