import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadDb, saveDb } from "./localDb";
import type { UserProgress } from "./types";

const todayStr = () => new Date().toISOString().slice(0, 10);

interface CompleteLessonPayload {
  userId: string;
  courseId: string;
  lessonId: string;
  xpEarned: number;
}

interface ProgressState {
  byUserId: Record<string, UserProgress>;
}

const db = loadDb();

const initialState: ProgressState = {
  byUserId: db.progress,
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    completeLesson(state, action: PayloadAction<CompleteLessonPayload>) {
      const { userId, courseId, lessonId, xpEarned } = action.payload;
      const today = todayStr();

      let userProg = state.byUserId[userId];
      if (!userProg) {
        userProg = { completedLessons: {}, dailyXp: {} };
        state.byUserId[userId] = userProg;
      }

      userProg.completedLessons[lessonId] = {
        completedAt: today,
        xpEarned,
        courseId,
      };

      userProg.dailyXp[today] = (userProg.dailyXp[today] || 0) + xpEarned;

      // Update users table as well
      const db = loadDb();
      const user = db.users.find((u) => u.id === userId);
      if (user) {
        user.totalXp += xpEarned;

        const last = user.lastPracticeDate;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().slice(0, 10);

        if (!last) user.currentStreak = 1;
        else if (last === today) user.currentStreak = user.currentStreak;
        else if (last === yStr) user.currentStreak += 1;
        else user.currentStreak = 1;

        user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
        user.lastPracticeDate = today;
      }

      db.progress = state.byUserId;
      saveDb(db);
    },
  },
});

export const { completeLesson } = progressSlice.actions;
export default progressSlice.reducer;
