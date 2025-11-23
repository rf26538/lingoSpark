const STORAGE_KEY = "lingospark-data-v2";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getInitialData() {
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
        dailyGoalXp: 20
      },
      // bot users for realtime-like leaderboard
      {
        id: "b1",
        name: "LingoBot 1",
        email: "bot1@lingospark.local",
        password: "bot",
        avatarColor: "#22c55e",
        totalXp: 150,
        currentStreak: 5,
        longestStreak: 7,
        lastPracticeDate: today,
        role: "user",
        dailyGoalXp: 10
      },
      {
        id: "b2",
        name: "LingoBot 2",
        email: "bot2@lingospark.local",
        password: "bot",
        avatarColor: "#3b82f6",
        totalXp: 230,
        currentStreak: 2,
        longestStreak: 10,
        lastPracticeDate: today,
        role: "user",
        dailyGoalXp: 15
      }
    ],
    currentUserId: null,
    courses: [
      {
        id: "c1",
        name: "English → Spanish",
        code: "en-es",
        description: "Beginner Spanish course",
        units: [
          {
            id: "u1",
            title: "Basics 1",
            order: 1,
            lessons: [
              {
                id: "l1",
                title: "Greetings",
                order: 1,
                xpReward: 10,
                questions: [
                  {
                    id: "q1",
                    type: "mcq",
                    prompt: "How do you say 'Hello' in Spanish?",
                    options: ["Hola", "Adiós", "Gracias", "Por favor"],
                    correctOptionIndex: 0
                  },
                  {
                    id: "q2",
                    type: "text",
                    prompt: "Type the Spanish word for 'Thanks'",
                    correctAnswer: "gracias"
                  },
                  {
                    id: "q3",
                    type: "word_bank",
                    prompt: "Build the sentence: 'Good morning'",
                    options: ["buenos", "hola", "días"],
                    correctSequence: ["buenos", "días"]
                  }
                ]
              },
              {
                id: "l2",
                title: "Farewell",
                order: 2,
                xpReward: 10,
                questions: [
                  {
                    id: "q4",
                    type: "mcq",
                    prompt: "How do you say 'Goodbye' in Spanish?",
                    options: ["Hola", "Adiós", "Gracias", "Buenos días"],
                    correctOptionIndex: 1
                  },
                  {
                    id: "q5",
                    type: "reorder",
                    prompt: "Put the Spanish sentence in correct order: 'See you later'",
                    options: ["vemos", "luego", "nos"],
                    correctSequence: ["nos", "vemos", "luego"]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "c2",
        name: "English → German",
        code: "en-de",
        description: "Simple German phrases for travellers",
        units: [
          {
            id: "u2",
            title: "Basics 1",
            order: 1,
            lessons: [
              {
                id: "l3",
                title: "Greetings",
                order: 1,
                xpReward: 15,
                questions: [
                  {
                    id: "q6",
                    type: "mcq",
                    prompt: "How do you say 'Hello' in German?",
                    options: ["Hallo", "Ciao", "Hola", "Salut"],
                    correctOptionIndex: 0
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    userProgress: {
      u1: {
        completedLessons: {},
        dailyXp: { [today]: 0 }
      },
      b1: {
        completedLessons: {},
        dailyXp: { [today]: 15 }
      },
      b2: {
        completedLessons: {},
        dailyXp: { [today]: 25 }
      }
    }
  };
}

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = getInitialData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch {
    const initial = getInitialData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getData() {
  return loadData();
}

export function setData(updater) {
  const current = loadData();
  const updated = typeof updater === "function" ? updater(current) : updater;
  saveData(updated);
  return updated;
}

export function getCurrentUser() {
  const data = getData();
  return data.users.find((u) => u.id === data.currentUserId) || null;
}

export function login(email, password) {
  const data = getData();
  const user = data.users.find((u) => u.email === email && u.password === password);
  if (!user) return null;
  data.currentUserId = user.id;
  saveData(data);
  return user;
}

export function logout() {
  setData((d) => ({ ...d, currentUserId: null }));
}

export function signup({ name, email, password }) {
  return setData((d) => {
    if (d.users.some((u) => u.email === email)) {
      throw new Error("Email already registered");
    }
    const id = "u" + (d.users.length + 1);
    const newUser = {
      id,
      name,
      email,
      password,
      avatarColor: "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0"),
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastPracticeDate: null,
      role: "user",
      dailyGoalXp: 20
    };
    d.users.push(newUser);
    d.userProgress[id] = {
      completedLessons: {},
      dailyXp: {}
    };
    d.currentUserId = id;
    return d;
  }).users.slice(-1)[0];
}

export function updateUser(userId, patch) {
  return setData((d) => {
    const idx = d.users.findIndex((u) => u.id === userId);
    if (idx >= 0) {
      d.users[idx] = { ...d.users[idx], ...patch };
    }
    return d;
  }).users.find((u) => u.id === userId) || null;
}

export function getCourses() {
  return getData().courses;
}

export function getCourseById(courseId) {
  return getCourses().find((c) => c.id === courseId) || null;
}

export function getLessonById(courseId, lessonId) {
  const course = getCourseById(courseId);
  if (!course) return null;
  for (const unit of course.units) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return { course, unit, lesson };
  }
  return null;
}

export function completeLesson(userId, courseId, lessonId, xpEarned) {
  const today = todayStr();
  return setData((d) => {
    const user = d.users.find((u) => u.id === userId);
    if (!user) return d;

    if (!d.userProgress[userId]) {
      d.userProgress[userId] = { completedLessons: {}, dailyXp: {} };
    }
    const progress = d.userProgress[userId];
    progress.completedLessons[lessonId] = {
      completedAt: today,
      xpEarned,
      courseId
    };

    if (!progress.dailyXp[today]) {
      progress.dailyXp[today] = 0;
    }
    progress.dailyXp[today] += xpEarned;

    user.totalXp += xpEarned;

    if (!user.lastPracticeDate) {
      user.currentStreak = 1;
    } else {
      const last = user.lastPracticeDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);
      if (last === today) {
        // same day: streak unchanged
      } else if (last === yStr) {
        user.currentStreak += 1;
      } else {
        user.currentStreak = 1;
      }
    }
    user.lastPracticeDate = today;
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }

    return d;
  });
}

export function getUserProgress(userId) {
  const d = getData();
  return d.userProgress[userId] || { completedLessons: {}, dailyXp: {} };
}

export function getLeaderboard() {
  const d = getData();
  return [...d.users]
    .sort((a, b) => b.totalXp - a.totalXp)
    .slice(0, 20);
}

// Simple computed achievements
export function getUserAchievements(userId) {
  const d = getData();
  const user = d.users.find((u) => u.id === userId);
  if (!user) return [];
  const progress = d.userProgress[userId] || { completedLessons: {}, dailyXp: {} };

  const achievements = [];

  const lessonCount = Object.keys(progress.completedLessons).length;
  if (lessonCount >= 1) {
    achievements.push({
      id: "a1",
      title: "First Steps",
      description: "Completed your first lesson"
    });
  }
  if (user.currentStreak >= 3) {
    achievements.push({
      id: "a2",
      title: "3-Day Streak",
      description: "Practised 3 days in a row"
    });
  }
  if (user.longestStreak >= 10) {
    achievements.push({
      id: "a3",
      title: "10-Day Streak",
      description: "Longest streak of 10+ days"
    });
  }
  if (user.totalXp >= 100) {
    achievements.push({
      id: "a4",
      title: "Century Club",
      description: "Earned 100+ XP in total"
    });
  }

  const today = todayStr();
  const xpToday = progress.dailyXp[today] || 0;
  if (xpToday >= (user.dailyGoalXp || 0) && user.dailyGoalXp) {
    achievements.push({
      id: "a5",
      title: "Goal Crushed",
      description: "Hit your daily XP goal today"
    });
  }

  return achievements;
}

// For Stats/Home
export function getTodayXp(userId) {
  const progress = getUserProgress(userId);
  return progress.dailyXp[todayStr()] || 0;
}

// Real-time-like bot activity tick
export function simulateBotActivityTick() {
  setData((d) => {
    const botIds = d.users.filter((u) => u.id.startsWith("b")).map((u) => u.id);
    if (botIds.length === 0) return d;
    const today = todayStr();

    const randomBotId = botIds[Math.floor(Math.random() * botIds.length)];
    const bot = d.users.find((u) => u.id === randomBotId);
    if (!bot) return d;

    const deltaXp = Math.random() < 0.6 ? 5 : 10; // 5/10 XP
    bot.totalXp += deltaXp;

    if (!d.userProgress[randomBotId]) {
      d.userProgress[randomBotId] = { completedLessons: {}, dailyXp: {} };
    }
    const p = d.userProgress[randomBotId];
    if (!p.dailyXp[today]) p.dailyXp[today] = 0;
    p.dailyXp[today] += deltaXp;

    // bots streak update (simplified)
    bot.currentStreak = Math.max(bot.currentStreak || 1, 1);
    if (bot.currentStreak > (bot.longestStreak || 0)) {
      bot.longestStreak = bot.currentStreak;
    }

    return d;
  });
}

// Admin
export function saveCourse(course) {
  return setData((d) => {
    const idx = d.courses.findIndex((c) => c.id === course.id);
    if (idx === -1) {
      d.courses.push(course);
    } else {
      d.courses[idx] = course;
    }
    return d;
  });
}
