export interface TrainingPlan {
    id: string;
    name: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    weeklySchedule: WeeklyRun[];
  }
  
  export interface WeeklyRun {
    id: string;
    dayNumber: number;
    type: RunType;
    distance?: number;  
    duration?: number;  
    description: string;
    targetPace?: string;
  }
  
  export enum RunType {
    EASY = 'easy',
    TEMPO = 'tempo',
    INTERVALS = 'intervals',
    LONG = 'long',
    RECOVERY = 'recovery'
  }
  
  export interface StravaActivity {
    id: string;
    type: string;
    start_date: string;
    name: string;
    distance: number;
    moving_time: number;
  }

  export interface StravaAthlete {
    firstname: string,
    lastname: string,
    sex: string
  }