import { Router } from 'express';
import { createWordController } from '../controllers/wordController';
import { WordRepository } from '../repositories/interfaces/wordRepository';

export const createWordRoutes = (wordRepository: WordRepository): Router => {
  const router = Router();
  const wordController = createWordController(wordRepository);

  router.get('/:day_index', wordController.getWordOfDay);

  return router;
};
