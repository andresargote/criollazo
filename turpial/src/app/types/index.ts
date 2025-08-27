export type Cell = {
    value: string;
    state: LetterState;
}

export type GridPosition = {
    row: number;
    cell: number;
}

export type Key = {
    key: string;
    value: string
}

export type LetterCount = {
    [key: string]: number;
}

export enum LetterState {
    HIT = "hit",
    CLOSE = "close",
    MISS = "miss",
    EMPTY = "empty",
    FILLED = "filled"
}

export enum GameState {
    PLAYING = "playing",
    WON = "won",
    LOST = "lost"
}