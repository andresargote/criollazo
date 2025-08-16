import { ScoreRepository } from "repositories/interfaces/scoreRepository";
import { Score, ScoreResponse } from "types";


export const createScoreService = (scoreRepository: ScoreRepository) => ({
    findScoresByDayIndex: async (dayIndex: number): Promise<ScoreResponse[]> => {
    const scores = await scoreRepository.findScoresByDayIndex(dayIndex);
    
    if (scores.length === 0) {
      throw new Error(`No scores found for day: ${dayIndex}`);
    }
    
    return scores.map((score) => ({
      player_name: score.player_name,
      attempts: score.attempts,
      time_ms: score.time_ms,
      points: score.points
    }));
  },
  createScore: async (score: Score): Promise<ScoreResponse> => {
    const newScore = await scoreRepository.createScore(score);
    
    return {
      player_name: newScore.player_name,
      attempts: newScore.attempts,
      time_ms: newScore.time_ms,
      points: newScore.points
    };
  }
});
