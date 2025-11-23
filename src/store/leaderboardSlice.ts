import { createSlice } from "@reduxjs/toolkit";
import { loadDb, saveDb } from "./localDb";

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {},
  reducers: {
    tickBots() {
      const db = loadDb();
      const bots = db.users.filter((u) => u.id.startsWith("b"));

      if (bots.length === 0) return;

      const bot = bots[Math.floor(Math.random() * bots.length)];

      const gain = Math.random() < 0.6 ? 5 : 10;
      bot.totalXp += gain;

      const today = new Date().toISOString().slice(0, 10);
      const prog = db.progress[bot.id] ?? {
        completedLessons: {},
        dailyXp: {},
      };

      prog.dailyXp[today] = (prog.dailyXp[today] || 0) + gain;
      db.progress[bot.id] = prog;

      saveDb(db);
    },
  },
});

export const { tickBots } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
