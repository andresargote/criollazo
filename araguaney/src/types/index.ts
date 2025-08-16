
export interface Word {
  _id?: string;
  display: string;
  normalized: string;
  length: number;
  day_index: number;
  region?: string[];
  tags?: string[];
  difficulty: number;
  created_at?: Date;
}


export interface WordResponse {
  display: string;
  normalized: string;
  length: number;
  day_index: number;
  difficulty: number;
}

export interface Score {
  _id?: string;
  day_index: number;
  player_name: string;
  attempts: number;
  time_ms: number;
  points: number;
  created_at?: Date;
}

export interface CreateScoreDto {
  player_name: string;
  attempts: number;
  time_ms: number;
  points: number;
}

export interface ScoreResponse {
  player_name: string;
  attempts: number;
  time_ms: number;
  points: number;
}


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
