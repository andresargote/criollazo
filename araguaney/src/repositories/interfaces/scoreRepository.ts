import { Score } from '../../types';

export type FindScoresByDayIndex = (dayIndex: number) => Promise<Score[]>;
export type CreateScore = (score: Score) => Promise<Score>;

export type ScoreRepository = {
  findScoresByDayIndex: FindScoresByDayIndex;
  createScore: CreateScore;
};