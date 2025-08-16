import { Request, Response } from 'express';
import { createWordService } from '../services/wordService';
import { WordRepository } from '../repositories/interfaces/wordRepository';

export const createWordController = (wordRepository: WordRepository) => {
  const wordService = createWordService(wordRepository);

  return {
    getWordOfDay: async (req: Request, res: Response) => {
      try {
        const { day_index } = req.params;
        const dayIndex = parseInt(day_index);
        const dayIndexRegex = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
        const isValidDayIndex = dayIndexRegex.test(day_index);

        if (!isValidDayIndex) {
          return res.status(400).json({
            success: false,
            error: 'Invalid day_index format. Must be a number in the format YYYYMMDD.'
          });
        }

        const word = await wordService.getWordOfDay(dayIndex);

        return res.json({
          success: true,
          data: word
        });

      } catch (error) {
        console.error('Error in getWordOfDay:', error);

        if (error instanceof Error && error.message.includes('No word found')) {
          return res.status(404).json({
            success: false,
            error: error.message
          });
        }

        return res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  };
};
