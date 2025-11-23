// auth slice
export interface User {
  role: string;
  id: string;
  name: string;
  avatarColor: string;
  dailyGoalXp: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
}

interface AuthState {
  user: User | null;
}

// courses slice
export interface Question {
  id: string;
  type: "mcq" | "text" | "word_bank" | "reorder";
  prompt: string;
  options?: string[];
  correctOptionIndex?: number;
  correctAnswer?: string;
  correctSequence?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  order: number;
  xpReward: number;
  questions: Question[];
}

export interface Unit {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  units: Unit[];
}

interface CoursesState {
  courses: Course[];
}

// progress slice
interface UserLessonsProgress {
  completedLessons: Record<
    string,
    { completedAt: string; xpEarned: number; courseId: string }
  >;
}

interface ProgressState {
  byUserId: Record<string, UserLessonsProgress>;
}
