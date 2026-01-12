export type CardState = 'hidden' | 'visible' | 'matched'
export type PlayerColor = 'blue' | 'red'

export interface MemoryCard {
    id: string
    pairKey: string
    iconUrl: string
    state: CardState
    matchedBy: PlayerColor | null
}

export function getBoardCols(boardSize: number): number {
    if (boardSize === 16) {
        return 4
    }
    if (boardSize === 24) {
        return 6
    }
    return 8
}

export function boardTemplate(cards: MemoryCard[], boardSize: number): string {
    const cols = getBoardCols(boardSize)

    const items = cards
        .map((card) => {
            const isFlipped = card.state === 'visible' || card.state === 'matched'
            const isMatched = card.state === 'matched'
            const matchedBy = isMatched && card.matchedBy ? card.matchedBy : ''

            return `
                <button
                    class="memory-card${isFlipped ? ' is-flipped' : ''}${isMatched ? ' is-matched' : ''}"
                    type="button"
                    data-card-id="${card.id}"
                    data-pair-key="${card.pairKey}"
                    data-matched-by="${matchedBy}"
                    aria-pressed="${isFlipped ? 'true' : 'false'}"
                    aria-disabled="${isMatched ? 'true' : 'false'}"
                >
                    <span class="memory-card__inner" aria-hidden="true">
                        <span class="memory-card__front"></span>
                        <span class="memory-card__back">
                            <img src="${card.iconUrl}" alt="" loading="lazy" />
                        </span>
                    </span>
                </button>
            `.trim()
        })
        .join('')

    return `
        <div class="board" data-board-grid style="grid-template-columns: repeat(${cols}, minmax(0, 1fr));">
            ${items}
        </div>
    `.trim()
}
