import mongoose, { Schema, Document } from 'mongoose';
import { Word } from '../types';

export interface WordDocument extends Omit<Word, '_id'>, Document {}

const WordSchema = new Schema<WordDocument>({
  display: {
    type: String,
    required: true,
    trim: true
  },
  normalized: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  length: {
    type: Number,
    required: true
  },
  day_index: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  region: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
    default: 1
  }
}, {
  timestamps: { 
    createdAt: 'created_at',
    updatedAt: false 
  },
  collection: 'words'
});


export const WordModel = mongoose.model<WordDocument>('Word', WordSchema);
