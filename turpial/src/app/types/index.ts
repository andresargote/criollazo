export type Letter = {
    value: string;
    state: LetterState;
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
    // EMPTY = "empty",
    // FILLED = "filled"
}

export type WordWithHint = {
    word: string;
    hint: string;
    wordLength: number;
}

export enum GameState {
    PLAYING = "playing",
    WON = "won",
    LOST = "lost"
}