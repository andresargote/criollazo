import { WordRepository } from '../repositories/interfaces/wordRepository';
import {  WordResponse } from '../types';

export const createWordService = (wordRepository: WordRepository) => ({
  getWordOfDay: async (dayIndex: number): Promise<WordResponse> => {
    const word = await wordRepository.findByDayIndex(dayIndex);
    
    if (!word) {
      throw new Error(`No word found for day: ${dayIndex}`);
    }
    
    return {
      display: word.display,
      normalized: word.normalized,
      length: word.length,
      day_index: word.day_index,
      difficulty: word.difficulty
    };
  }
});
