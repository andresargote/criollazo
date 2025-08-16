import mongoose, { Schema, Document } from 'mongoose';
import { Score } from '../types';

export interface ScoreDocument extends Omit<Score, '_id'>, Document {}

const ScoreSchema = new Schema<ScoreDocument>({
  day_index: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  player_name: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    required: true
  },
  time_ms: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    required: true
  }
}, {
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: false 
  },
  collection: 'scores'
});

export const ScoreModel = mongoose.model<ScoreDocument>('Score', ScoreSchema);