
export type GradeLevel = '6ème' | '5ème' | '4ème' | '3ème';

export type ExerciseType = 'FILL_IN_THE_BLANKS' | 'FREE_REDACTION' | 'STEP_BY_STEP';

export interface Property {
  id: string;
  name: string;
  statement: string; // "Si... alors..."
}

export interface Exercise {
  id: string;
  title: string;
  grade: GradeLevel;
  theme: string;
  statement: string;
  figureUrl?: string; // GeoGebra material ID or local placeholder
  geogebraId?: string;
  difficulty: 1 | 2 | 3;
  type: ExerciseType;
  solution: {
    hypotheses: string[];
    propertyId: string;
    conclusion: string;
  };
}

export interface StudentProgress {
  userId: string;
  completedExercises: string[];
  points: number;
  lastGrade: GradeLevel;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
