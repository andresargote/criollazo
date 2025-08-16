import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase } from './database';
import { createWordRoutes } from '../routes/word';
import { createMongoWordRepository } from '../repositories/implementations/mongodb/wordRepository';
import { createScoreRoutes } from '../routes/scores';
import { createMongoScoreRepository } from '../repositories/implementations/mongodb/scoreRepository';

dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3001;

connectDatabase();

const wordRepository = createMongoWordRepository();
const scoreRepository = createMongoScoreRepository();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/word', createWordRoutes(wordRepository));
app.use('/scores', createScoreRoutes(scoreRepository));

app.get('/', (_, res) => {
  res.json({
    message: 'Araguaney API is running!',
    version: process.env.API_VERSION || 'v1',
    timestamp: new Date().toISOString()
  });
});


app.get('/health', (_, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Araguaney server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Word endpoint: http://localhost:${PORT}/word/:day_index`);
  console.log(`Scores endpoint: http://localhost:${PORT}/scores/:day_index`);
});

export default app;
