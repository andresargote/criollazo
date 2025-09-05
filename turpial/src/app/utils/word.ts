import wordsData from '../data/words.json';
import { WordWithHint } from '../types';

export const getRandomWordWithHint = (): WordWithHint => {
    const words = wordsData.venezuelanWords as WordWithHint[];
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
};

export const getRandomWord = (): string => {
    return getRandomWordWithHint().word;
};

export const isValidLetter = (character: string): boolean => {
    return /^[A-ZÑ]$/u.test(character);
};

export const isValidWord = (word: string): boolean => {
    const invalidPatterns = [
        /[bcdfghjklmnpqrstvwxyzñ]{4,}/i,
        /(.)\1{2,}/i,
        /^[aeiou]+$/i,
        /^[bcdfghjklmnpqrstvwxyzñ]+$/i,
        /[aeiou]{4,}/i,
        /q(?!u)/i,
        /[wxz]/i
    ];

    return !invalidPatterns.some(pattern => pattern.test(word));
};
