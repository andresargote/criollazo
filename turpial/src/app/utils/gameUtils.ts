import { Cell, LetterState, LetterCount } from '../types';

export const evaluateAttempt = (
    currentRow: Cell[],
    secretWord: string,
    letterCount: LetterCount
): Cell[] => {
    const availableLetters = { ...letterCount };
    const attemptEvaluation: Cell[] = new Array(currentRow.length);

    currentRow.forEach(({ value }, index) => {
        const secretLetter = secretWord[index];
        if (value === secretLetter) {
            availableLetters[secretLetter] -= 1;
            attemptEvaluation[index] = {
                value,
                state: LetterState.HIT
            };
        }
    });

    currentRow.forEach(({ value }, index) => {
        if (!attemptEvaluation[index]) {
            if (availableLetters[value] && availableLetters[value] > 0) {
                availableLetters[value] -= 1;
                attemptEvaluation[index] = {
                    value,
                    state: LetterState.CLOSE
                };
            } else {
                attemptEvaluation[index] = {
                    value,
                    state: LetterState.MISS
                };
            }
        }
    });

    return attemptEvaluation;
};

export const hasWon = (attemptEvaluation: Cell[]): boolean => {
    return attemptEvaluation.every(cell => cell.state === LetterState.HIT);
};

export const calculateLetterCount = (word: string): LetterCount => {
    const count: LetterCount = {};
    for (const letter of word) {
        count[letter] = (count[letter] || 0) + 1;
    }
    return count;
};
