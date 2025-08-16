import { Request, Response } from 'express';
import { createScoreService } from '../services/scoreService';
import { ScoreRepository } from '../repositories/interfaces/scoreRepository';
import { getInvalidFields } from '../utils';

export const createScoreController = (scoreRepository: ScoreRepository) => {
    const scoreService = createScoreService(scoreRepository);

    return {
        findScoresByDayIndex: async (req: Request, res: Response) => {
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

                const scores = await scoreService.findScoresByDayIndex(dayIndex);

                return res.json({
                    success: true,
                    data: scores
                });

            } catch (error) {
                console.error('Error in findScoresByDayIndex:', error);

                if (error instanceof Error && error.message.includes('No scores found')) {
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
        },
        createScore: async (req: Request, res: Response) => {
            try {
                const { day_index, player_name, attempts, time_ms, points } = req.body;
                const dayIndexRegex = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
                const isValidDayIndex = dayIndexRegex.test(day_index);
                const invalidFields = getInvalidFields([
                    {
                        name: "player_name",
                        type: "string",
                        value: player_name,
                        required: true
                    },
                    {
                        name: "attempts",
                        type: "number",
                        value: attempts,
                        required: true
                    }, {
                        name: "time_ms",
                        type: "number",
                        value: time_ms,
                        required: true
                    }, {
                        name: "points",
                        type: "number",
                        value: points,
                        required: true
                    }], req.body);

                if (!isValidDayIndex) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid day_index format. Must be a number in the format YYYYMMDD.'
                    });
                }


                if (invalidFields.length > 0) {
                    return res.status(400).json({
                        success: false,
                        error: `Invalid fields: ${invalidFields.join(', ')}`
                    });
                }


                const score = await scoreService.createScore({
                    day_index,
                    player_name,
                    attempts,
                    time_ms,
                    points
                });

                return res.json({
                    success: true,
                    data: score
                });

            } catch (error) {
                console.error('Error in createScore:', error);

                return res.status(500).json({
                    success: false,
                    error: 'Internal server error'
                });
            }
        }
    }
}