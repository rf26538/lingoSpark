import React from "react";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import type { Course, Lesson, Unit } from "../store/types";

const CoursePath: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const user = useAppSelector((state) => state.auth.user);
  const courses = useAppSelector((state) => state.courses.courses);
  const progressState = useAppSelector(
    (state) => state.progress.byUserId[user?.id ?? ""] ?? { completedLessons: {} }
  );

  const course: Course | undefined = courses.find(
    (c: Course) => c.id === courseId
  );

  if (!user) {
    return <div className="p-4 text-sm">You must be logged in.</div>;
  }

  if (!course) {
    return <div className="p-4 text-sm">Course not found</div>;
  }

  const isLessonCompleted = (lessonId: string): boolean =>
    Boolean(progressState.completedLessons[lessonId]);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{course.name}</h2>
        <p className="text-sm text-slate-500 mt-1">{course.description}</p>
      </div>

      {course.units.map((unit: Unit) => (
        <div key={unit.id} className="space-y-2">
          <h3 className="text-lg font-semibold">
            Unit {unit.order}: {unit.title}
          </h3>

          <div className="flex flex-wrap gap-3">
            {unit.lessons
              .slice()
              .sort((a: Lesson, b: Lesson) => a.order - b.order)
              .map((lesson: Lesson, idx: number) => {
                const completed = isLessonCompleted(lesson.id);
                const prevLesson = unit.lessons[idx - 1];
                const unlocked =
                  idx === 0 || (prevLesson && isLessonCompleted(prevLesson.id));

                const base =
                  "rounded-2xl p-3 min-w-[150px] text-sm shadow-sm transition";
                const style = completed
                  ? "bg-green-50 border border-green-400"
                  : unlocked
                  ? "bg-blue-50 border border-blue-400 hover:bg-blue-100"
                  : "bg-slate-200 border border-slate-300 opacity-60 cursor-not-allowed";

                return (
                  <Link
                    key={lesson.id}
                    to={
                      unlocked
                        ? `/courses/${course.id}/lessons/${lesson.id}`
                        : "#"
                    }
                    className={`${base} ${style}`}
                    style={{ pointerEvents: unlocked ? "auto" : "none" }}
                  >
                    <div className="font-semibold">
                      Lesson {lesson.order}
                    </div>
                    <div className="text-xs text-slate-700">
                      {lesson.title}
                    </div>

                    {completed && (
                      <div className="text-xs text-green-600 mt-1">
                        Completed ✓
                      </div>
                    )}

                    {!completed && unlocked && (
                      <div className="text-xs text-blue-600 mt-1">
                        XP: {lesson.xpReward}
                      </div>
                    )}

                    {!unlocked && (
                      <div className="text-xs text-slate-600 mt-1">
                        Locked
                      </div>
                    )}
                  </Link>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursePath;
