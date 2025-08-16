import { Word } from '../../types';

export type FindWordByDayIndex = (dayIndex: number) => Promise<Word | null>;

export type WordRepository = {
  findByDayIndex: FindWordByDayIndex;
};
