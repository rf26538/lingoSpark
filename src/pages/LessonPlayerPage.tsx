import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import type { Course, Lesson, Unit, Question } from "../store/types";
import QuestionView from "../components/QuestionView";
import { completeLesson } from "../store/progressSlice";

interface LessonContext {
  course: Course;
  unit: Unit;
  lesson: Lesson;
}

const LessonPlayerPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const courses = useAppSelector((state) => state.courses.courses);

  const lessonCtx: LessonContext | undefined = useMemo(() => {
    if (!courseId || !lessonId) return undefined;
    const course = courses.find((c: Course) => c.id === courseId);
    if (!course) return undefined;

    for (const unit of course.units) {
      const lesson = unit.lessons.find((l) => l.id === lessonId);
      if (lesson) {
        return { course, unit, lesson };
      }
    }
    return undefined;
  }, [courseId, lessonId, courses]);

  const [index, setIndex] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);

  if (!user) {
    return <div className="p-4 text-sm">You must be logged in.</div>;
  }

  if (!lessonCtx) {
    return <div className="p-4 text-sm">Lesson not found</div>;
  }

  const { course, unit, lesson } = lessonCtx;
  const questions: Question[] = lesson.questions || [];

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    const nextIdx = index + 1;
    if (nextIdx >= questions.length) {
      // Dispatch typed action/thunk to update progress + XP
      dispatch(
        completeLesson({
          userId: user.id,
          courseId: course.id,
          lessonId: lesson.id,
          xpEarned: lesson.xpReward,
        })
      );
      setFinished(true);
    } else {
      setIndex(nextIdx);
    }
  };

  if (finished) {
    return (
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-semibold">Lesson complete 🎉</h2>

        <p className="text-sm">
          You answered{" "}
          <span className="font-semibold">
            {correctCount}/{questions.length}
          </span>{" "}
          correctly.
        </p>

        <p className="font-medium">
          XP earned: {lesson.xpReward}
        </p>

        <div className="flex gap-3 mt-3">
          <button
            onClick={() => navigate(`/courses/${course.id}`)}
            className="rounded-full border border-slate-300 px-4 py-1.5 text-sm hover:bg-slate-100"
          >
            Back to course
          </button>

          <Link
            to="/leaderboard"
            className="rounded-full border border-slate-300 px-4 py-1.5 text-sm hover:bg-slate-100"
          >
            View leaderboard
          </Link>
        </div>
      </div>
    );
  }

  const question = questions[index];

  return (
    <div className="p-4 space-y-3">
      <p className="text-xs text-slate-500">
        {course.name} → {unit.title} → {lesson.title}
      </p>

      <h2 className="text-lg font-semibold">{lesson.title}</h2>

      <p className="text-xs text-slate-500">
        Question {index + 1}/{questions.length}
      </p>

      <QuestionView question={question} onAnswer={handleAnswer} />
    </div>
  );
};

export default LessonPlayerPage;
