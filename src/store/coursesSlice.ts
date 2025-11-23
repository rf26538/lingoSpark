import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Course } from "./types";
import { loadDb, saveDb } from "./localDb";

interface CoursesState {
  courses: Course[];
}

const db = loadDb();

const initialState: CoursesState = {
  courses: db.courses,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    saveCourse(state, action: PayloadAction<Course>) {
      const updated = action.payload;
      const index = state.courses.findIndex((c) => c.id === updated.id);
      if (index === -1) state.courses.push(updated);
      else state.courses[index] = updated;

      const db = loadDb();
      db.courses = state.courses;
      saveDb(db);
    },
  },
});

export const { saveCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
