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