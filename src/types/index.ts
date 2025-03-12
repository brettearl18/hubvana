export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'coach' | 'client';
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckIn {
  id: string;
  clientId: string;
  coachId: string;
  date: Date;
  status: 'completed' | 'missed' | 'upcoming';
  overallProgress: number;
  responses: QuestionResponse[];
}

export interface Question {
  id: string;
  type: 'text' | 'number' | 'slider' | 'radio' | 'checkbox' | 'file';
  label: string;
  required: boolean;
  options?: string[];
  min?: number;
  max?: number;
}

export interface QuestionResponse {
  questionId: string;
  value: string | number | boolean | string[];
}

export interface CheckInTemplate {
  id: string;
  name: string;
  questions: Question[];
  createdBy: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientProgress {
  clientId: string;
  metrics: {
    [key: string]: number[];
  };
  goals: {
    [key: string]: {
      target: number;
      current: number;
    };
  };
  lastUpdated: Date;
} 