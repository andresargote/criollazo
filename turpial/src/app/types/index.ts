export enum CellState {
    EMPTY = 'empty',
    FILLED = 'filled',
    CORRECT = 'correct',
    INCORRECT = 'incorrect',
    WRONG_POSITION = 'wrong-position'
}

export type Cell = {
    value: string;
    state: CellState;
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
    MISS = "miss"
}