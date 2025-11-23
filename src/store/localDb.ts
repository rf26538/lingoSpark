import type {
    User,
    Course,
    UserProgress,
    LessonCompletion,
  } from "./types";
  
  const STORAGE_KEY = "lingospark-redux-db";
  
  // ---------- Helpers ----------
  const todayStr = () => new Date().toISOString().slice(0, 10);
  
  // ---------- Load ----------
  export interface Database {
    users: User[];
    courses: Course[];
    progress: Record<string, UserProgress>;
  }
  
  function getInitialDb(): Database {
    const today = todayStr();
  
    return {
      users: [
        {
          id: "u1",
          name: "Demo Admin",
          email: "demo@demo.com",
          password: "demo",
          avatarColor: "#f97316",
          totalXp: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastPracticeDate: null,
          role: "admin",
          dailyGoalXp: 20,
        },
        {
          id: "b1",
          name: "LingoBot 1",
          email: "bot1@local",
          password: "bot",
          avatarColor: "#22c55e",
          totalXp: 200,
          currentStreak: 3,
          longestStreak: 7,
          lastPracticeDate: today,
          role: "user",
          dailyGoalXp: 20,
        },
      ],
      courses: [
        {
          id: "course_english",
          name: "English Basics",
          code: "ENG001",
          description: "Learn English fundamentals with simple lessons.",
          units: [
            {
              id: "u_eng_1",
              title: "Basics",
              order: 1,
              lessons: [
                {
                  id: "l_eng_hello",
                  title: "Greetings",
                  order: 1,
                  xpReward: 10,
                  questions: [
                    {
                      id: "q1",
                      type: "mcq",
                      prompt: "How do you say 'Hello'?",
                      options: ["Hello", "Bye", "Thanks"],
                      correctOptionIndex: 0,
                    },
                    {
                      id: "q2",
                      type: "text",
                      prompt: "Write the word for greeting someone:",
                      correctAnswer: "hello"
                    }
                  ]
                },
                {
                  id: "l_eng_colors",
                  title: "Colors",
                  order: 2,
                  xpReward: 15,
                  questions: [
                    {
                      id: "q3",
                      type: "word_bank",
                      prompt: "Arrange the letters to form a color:",
                      options: ["r", "e", "d"],
                      correctSequence: ["r", "e", "d"]
                    },
                    {
                      id: "q4",
                      type: "reorder",
                      prompt: "Arrange the colors from light to dark:",
                      options: ["yellow", "blue", "black"],
                      correctSequence: ["yellow", "blue", "black"]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],      
      progress: {
        u1: { completedLessons: {}, dailyXp: {} },
        b1: { completedLessons: {}, dailyXp: { [today]: 20 } },
      },
    };
  }
  
  export function loadDb(): Database {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const init = getInitialDb();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw);
  }
  
  export function saveDb(db: Database) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
  