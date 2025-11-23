# 🧠 Overview

LingoSpark is a web-based language learning platform that mirrors key features typically found in mobile apps like Duolingo:

✔ Learn language via interactive lessons
✔ XP, streaks, daily progress tracking
✔ Real-time-like leaderboard
✔ Admin panel to add courses, units, lessons & questions
✔ Full authentication system


# 📱 Why this app?
The assignment required a non-tutorial, real-world application that mirrors the complexity of well-known mobile apps.

A Duolingo-style app fits perfectly because it includes:
1. Auth
2. Content creation
3. Dynamic locking/unlocking
4. Interactive learning system
5. Reward mechanics (XP, streak)
6. Real-time-like leaderboard
7. Admin management

# ✨ Features

🔐 Authentication
1. Signup with name, email, password
2. Login
3. Logout
4. Persisted session via localStorage

# 📚 Learning System
Courses → Units → Lessons → Questions
1. Sequential unlock
2. Tracks completed lessons
3. Instant feedback on answers
4. XP reward based on lesson
5. Tracks correct/incorrect answers

# 🔥 Gamification
XP -> Earn XP for each completed lesson.
Streak -> Streak increments daily when at least one lesson is completed.
Longest streak -> Automatically tracked based on daily activity.

# 📊 Stats Dashboard
Shows:
1. Total XP
2. Current streak
3. Longest streak
4. XP/day table

# 🏆 Leaderboard
Shows global ranking of users sorted by XP.
Highlights the current user.

# 🛠 Admin Panel
A complete interface for:
1. Editing course name & description
2. Managing units
3. Managing lessons
4. Adding questions
5. Editing question types & content

Displays:
1. Units list
2. Lessons inside each unit
3. Questions inside each lesson

All saved to localStorage.

# 🗂 Tech Stack

UI Framework -> React
Routing 	 -> React Router
Build System -> Parcel (as per requirement)
Data Persistence -> localStorage
State Management -> React Context
Styling	Inline styles (no external CSS needed)

You can upgrade it to Tailwind on request.

# 📦 Project Structure
src/
  api/
    storage.ts          # localStorage "backend"
  context/
    AuthContext.tsx
  components/
    Navbar.tsx
    ProtectedRoute.tsx
    CoursePath.tsx
    QuestionView.tsx
  pages/
    LoginPage.tsx
    SignupPage.tsx
    HomePage.tsx
    CoursePage.tsx
    LessonPlayerPage.tsx
    StatsPage.tsx
    LeaderboardPage.tsx
    AdminDashboardPage.tsx
  App.tsx
  index.tsx
index.html
package.tson

# ▶ Running Locally
Install dependencies
npm install

Run dev server
npm run dev

Open:
http://localhost:1234

Build
npm run build

# 🧪 Test Credentials
Email: demo@demo.com
Password: demo
Role: admin

# 🧵 Admin Access
When logged in as admin:
/admin