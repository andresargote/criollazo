
import { playSound, initializeAudio, type SoundType } from "./audio";
import { getRandomWord, getRandomWordWithHint, isValidLetter, isValidWord } from "./word";
import { evaluateAttempt, hasWon, calculateLetterCount } from "./game";

export {
    playSound,
    initializeAudio,
    getRandomWord,
    getRandomWordWithHint,
    isValidLetter,
    isValidWord,
    evaluateAttempt,
    hasWon,
    calculateLetterCount
};

export type { SoundType };