import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { loadDb, saveDb } from "./localDb";
import type { User } from "./types";

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export const login = createAsyncThunk<User, LoginPayload>(
  "auth/login",
  async ({ email, password }) => {
    const db = loadDb();
    const user = db.users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error("Invalid credentials");
    return user;
  }
);

export const signup = createAsyncThunk<User, SignupPayload>(
  "auth/signup",
  async ({ name, email, password }) => {
    const db = loadDb();
    if (db.users.find((u) => u.email === email)) {
      throw new Error("Email already registered");
    }
    const newUser: User = {
      id: "u" + (db.users.length + 1),
      name,
      email,
      password,
      avatarColor: "#" + Math.floor(Math.random() * 0xffffff).toString(16),
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastPracticeDate: null,
      role: "user",
      dailyGoalXp: 20,
    };
    db.users.push(newUser);
    db.progress[newUser.id] = {
      completedLessons: {},
      dailyXp: {},
    };
    saveDb(db);
    return newUser;
  }
);

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "error";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "idle";
      state.user = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "error";
      state.error = action.error.message || "Login failed";
    });

    builder.addCase(signup.fulfilled, (state, action) => {
      state.status = "idle";
      state.user = action.payload;
    });
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
