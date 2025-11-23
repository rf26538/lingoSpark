import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { loadDb } from "../store/localDb";
import type { Course } from "../store/types";

const HomePage: React.FC = () => {
  const authUser = useAppSelector((state) => state.auth.user);
  const progressByUser = useAppSelector((state) => state.progress.byUserId);
  const courses = useAppSelector((state) => state.courses.courses);

  if (!authUser) {
    return <div className="p-4 text-sm">You must be logged in.</div>;
  }

  const db = loadDb();
  const dbUser = db.users.find((u) => u.id === authUser.id) ?? authUser;
  const progress = progressByUser[authUser.id] ?? {
    completedLessons: {},
    dailyXp: {},
  };

  const today = new Date().toISOString().slice(0, 10);
  const xpToday = progress.dailyXp[today] || 0;
  const goal = authUser.dailyGoalXp || 0;
  const goalPct = goal ? Math.min(100, Math.round((xpToday / goal) * 100)) : 0;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">
        Welcome back, {authUser.name}
      </h2>

      <div className="flex flex-wrap gap-3">
        <InfoCard title="Total XP" value={dbUser.totalXp} />
        <InfoCard title="Current streak" value={`${dbUser.currentStreak} 🔥`} />
        <InfoCard title="Longest streak" value={dbUser.longestStreak} />
      </div>

      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium">Daily XP goal</span>
          <span className="text-xs text-slate-500">
            {xpToday}/{goal || "—"} XP
          </span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-2 rounded-full ${
              goalPct >= 100 ? "bg-green-500" : "bg-blue-500"
            } transition-all`}
            style={{ width: `${goalPct}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {goal
            ? goalPct >= 100
              ? "Goal complete! 🎉"
              : `You're ${goal - xpToday} XP away from your goal.`
            : "Set a daily goal from your Profile page."}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mt-2 mb-2">Your courses</h3>
        <div className="flex flex-wrap gap-3">
          {courses.map((course: Course) => {
            const lessons = course.units.flatMap((u) => u.lessons);
            const completedCount = lessons.filter(
              (l) => progress.completedLessons[l.id]
            ).length;

            return (
              <Link
                to={`/courses/${course.id}`}
                key={course.id}
                className="flex-1 min-w-[230px] max-w-sm rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:border-blue-400 transition"
              >
                <h4 className="font-semibold text-sm">{course.name}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {course.description}
                </p>
                <p className="text-xs mt-1 font-medium">
                  Progress: {completedCount}/{lessons.length} lessons
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface InfoCardProps {
  title: string;
  value: string | number;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm min-w-[130px]">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
};

export default HomePage;
