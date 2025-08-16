import { WordRepository } from '../../interfaces/wordRepository';
import { WordModel } from '../../../models/Word';
import { Word } from '../../../types';

export const createMongoWordRepository = (): WordRepository => ({
  findByDayIndex: async (dayIndex: number): Promise<Word | null> => {
    try {
      const word = await WordModel.findOne({ day_index: dayIndex }).lean();
      return word as Word | null;
    } catch (error) {
      console.error('Error finding word by day index:', error);
      throw error;
    }
  }
});
