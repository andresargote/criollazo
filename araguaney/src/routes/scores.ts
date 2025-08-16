import { Router } from 'express';
import { createScoreController } from '../controllers/scoreController';
import { ScoreRepository } from '../repositories/interfaces/scoreRepository';

export const createScoreRoutes = (scoreRepository: ScoreRepository): Router => {
    const router = Router();
    const scoreController = createScoreController(scoreRepository);

    router.get('/:day_index', scoreController.findScoresByDayIndex);
    router.post('/', scoreController.createScore);

    return router;
};
