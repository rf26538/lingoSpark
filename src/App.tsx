import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HeroPage from "./pages/HeroPage";
import SignupPage from "./pages/SignupPage";
// import HomePage from "./pages/HomePage";
// import StatsPage from "./pages/StatsPage";
// import LeaderboardPage from "./pages/LeaderboardPage";
// import ProfilePage from "./pages/ProfilePage";
// import CoursePage from "./pages/CoursePage";
// import LessonPlayerPage from "./pages/LessonPlayerPage";
// import AdminDashboardPage from "./pages/AdminDashboardPage";
// import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {

  return (
    <div className="w-screen h-screen bg-gray-900 overflow-hidden">
        <Navbar />
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/courses/:courseId" element={<CoursePage />} />
          <Route
            path="/courses/:courseId/lessons/:lessonId"
            element={<LessonPlayerPage />}
          />
        </Route>
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
        <Route
          path="*"
          element={
            <div className="p-4 text-sm">
              Page not found.{" "}
              <a className="text-blue-600" href="/">Go home</a>.
            </div>
          }
        /> */}
      </Routes>
    </div>
  );
};

export default App;