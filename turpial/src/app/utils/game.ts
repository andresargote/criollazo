import { Letter, LetterState, LetterCount } from '../types';

type EvaluteAttempt = {
    letterCount: LetterCount,
    secretWord: string,
    attempt: string[]
}

export const evaluateAttempt = ({
    letterCount,
    secretWord,
    attempt
}: EvaluteAttempt): Letter[] => {
    const availableLetters = { ...letterCount };
    const attemptResult: Letter[] = []

    attempt.forEach((letter, index) => {
        const secretLetter = secretWord[index]
        if (letter === secretLetter) {
            availableLetters[secretLetter] -= 1;
            attemptResult[index] = {
                value: letter,
                state: LetterState.HIT
            };
        }
    })

    attempt.forEach((letter, index) => {
        if (!attemptResult[index]) {
            if (availableLetters[letter] && availableLetters[letter] > 0) {
                availableLetters[letter] -= 1;
                attemptResult[index] = {
                    value: letter,
                    state: LetterState.CLOSE
                };
            } else {
                attemptResult[index] = {
                    value: letter,
                    state: LetterState.MISS
                };
            }
        }
    });

    return attemptResult
};

export const hasWon = (attemptEvaluation: Letter[]): boolean => {
    return attemptEvaluation.every(letter => letter.state === LetterState.HIT);
};

export const calculateLetterCount = (word: string): LetterCount => {
    const count: LetterCount = {};
    for (const letter of word) {
        count[letter] = (count[letter] || 0) + 1;
    }
    return count;
};
