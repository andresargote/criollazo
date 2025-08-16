import { ScoreRepository } from '../../interfaces/scoreRepository';
import { ScoreModel } from '../../../models/Score';
import { Score } from '../../../types';

export const createMongoScoreRepository = (): ScoreRepository => ({
  findScoresByDayIndex: async (dayIndex: number): Promise<Score[]> => {
    try {
      const scores = await ScoreModel.find({ day_index: dayIndex }).lean();
      return scores as unknown as Score[];
    } catch (error) {
      console.error('Error finding scores by day index:', error);
      throw error;
    }
  },
  createScore: async (score: Score): Promise<Score> => {
    try {
      const newScore = await ScoreModel.create(score);
      return newScore as unknown as Score;
    } catch (error) {
      console.error('Error creating score:', error);
      throw error;
    }
  }
});