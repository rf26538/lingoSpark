import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { saveCourse } from "../store/coursesSlice";
import type { Course, Unit, Lesson, Question } from "../store/types";

const AdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.courses.courses);

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses[0]?.id ?? ""
  );
  const [course, setCourse] = useState<Course | null>(
    courses[0] ?? null
  );
  const [message, setMessage] = useState<string>("");

  const handleSelectCourse = (id: string) => {
    const found = courses.find((c) => c.id === id) ?? null;
    setSelectedCourseId(id);
    setCourse(found);
  };

  const updateCourseField = (field: keyof Course, value: string) => {
    setCourse((prev) =>
      prev ? { ...prev, [field]: value } : prev
    );
  };

  const updateUnitTitle = (unitIndex: number, value: string) => {
    setCourse((prev) => {
      if (!prev) return prev;
      const units = [...prev.units];
      units[unitIndex] = { ...units[unitIndex], title: value };
      return { ...prev, units };
    });
  };

  const addUnit = () => {
    setCourse((prev) => {
      if (!prev) return prev;
      const newUnit: Unit = {
        id: "u" + Date.now(),
        title: "New unit",
        order: prev.units.length + 1,
        lessons: [],
      };
      return { ...prev, units: [...prev.units, newUnit] };
    });
  };

  const addLesson = (unitIndex: number) => {
    setCourse((prev) => {
      if (!prev) return prev;
      const units = [...prev.units];
      const unit = { ...units[unitIndex] };
      const nextOrder =
        (unit.lessons[unit.lessons.length - 1]?.order || 0) + 1;
      const newLesson: Lesson = {
        id: "l" + Date.now(),
        title: "New lesson",
        order: nextOrder,
        xpReward: 10,
        questions: [],
      };
      unit.lessons = [...unit.lessons, newLesson];
      units[unitIndex] = unit;
      return { ...prev, units };
    });
  };

  const updateLessonField = (
    unitIndex: number,
    lessonIndex: number,
    field: keyof Lesson,
    value: string | number
  ) => {
    setCourse((prev) => {
      if (!prev) return prev;
      const units = [...prev.units];
      const unit = { ...units[unitIndex] };
      const lessons = [...unit.lessons];
      lessons[lessonIndex] = {
        ...lessons[lessonIndex],
        [field]: value,
      };
      unit.lessons = lessons;
      units[unitIndex] = unit;
      return { ...prev, units };
    });
  };

  const addQuestion = (unitIndex: number, lessonIndex: number) => {
    setCourse((prev) => {
      if (!prev) return prev;
      const units = [...prev.units];
      const unit = { ...units[unitIndex] };
      const lessons = [...unit.lessons];
      const lesson = { ...lessons[lessonIndex] };
      const newQuestion: Question = {
        id: "q" + Date.now(),
        type: "mcq",
        prompt: "New question",
        options: ["Option 1", "Option 2"],
        correctOptionIndex: 0,
        correctAnswer: "",
        correctSequence: [],
      };
      lesson.questions = [...lesson.questions, newQuestion];
      lessons[lessonIndex] = lesson;
      unit.lessons = lessons;
      units[unitIndex] = unit;
      return { ...prev, units };
    });
  };

  const updateQuestionField = (
    unitIndex: number,
    lessonIndex: number,
    questionIndex: number,
    field: keyof Question,
    value: string | number | string[]
  ) => {
    setCourse((prev) => {
      if (!prev) return prev;
      const units = [...prev.units];
      const unit = { ...units[unitIndex] };
      const lessons = [...unit.lessons];
      const lesson = { ...lessons[lessonIndex] };
      const questions = [...lesson.questions];
      questions[questionIndex] = {
        ...questions[questionIndex],
        [field]: value,
      };
      lesson.questions = questions;
      lessons[lessonIndex] = lesson;
      unit.lessons = lessons;
      units[unitIndex] = unit;
      return { ...prev, units };
    });
  };

  const updateOptions = (
    ui: number,
    li: number,
    qi: number,
    optionsStr: string
  ) => {
    const options = optionsStr
      .split("|")
      .map((o) => o.trim())
      .filter(Boolean);
    updateQuestionField(ui, li, qi, "options", options);
  };

  const updateCorrectSequence = (
    ui: number,
    li: number,
    qi: number,
    seqStr: string
  ) => {
    const seq = seqStr
      .split("|")
      .map((o) => o.trim())
      .filter(Boolean);
    updateQuestionField(ui, li, qi, "correctSequence", seq);
  };

  const handleSave = () => {
    if (!course) return;
    dispatch(saveCourse(course));
    setMessage("Saved!");
    setTimeout(() => setMessage(""), 1000);
  };

  if (!course) {
    return <div className="p-4 text-sm">No course found</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Admin – Course editor</h2>
      <p className="text-xs text-slate-500">
        Edit courses, units, lessons and questions. Supported types: mcq, text,
        word_bank, reorder.
      </p>

      <div className="flex flex-wrap gap-2 items-center text-xs">
        <span className="text-slate-500">Select course:</span>
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSelectCourse(c.id)}
            className={`rounded-full border px-3 py-1 ${
              c.id === selectedCourseId
                ? "border-blue-500 bg-blue-50"
                : "border-slate-300 bg-white"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="max-w-xl space-y-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">
            Course name
          </label>
          <input
            type="text"
            value={course.name}
            onChange={(e) => updateCourseField("name", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">
            Description
          </label>
          <textarea
            value={course.description}
            onChange={(e) =>
              updateCourseField("description", e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
          />
        </div>

        <button
          onClick={addUnit}
          className="rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100"
        >
          + Add unit
        </button>

        {course.units.map((unit, ui) => (
          <div
            key={unit.id}
            className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-500">
                Unit {unit.order}
              </span>
            </div>
            <input
              type="text"
              value={unit.title}
              onChange={(e) => updateUnitTitle(ui, e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            />

            <button
              onClick={() => addLesson(ui)}
              className="mt-2 rounded-full border border-slate-300 px-3 py-1 text-[11px] hover:bg-slate-100"
            >
              + Add lesson
            </button>

            {unit.lessons.map((lesson, li) => (
              <div
                key={lesson.id}
                className="mt-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-2"
              >
                <div className="grid grid-cols-2 gap-2 text-[11px] mb-1">
                  <div>
                    <span className="text-slate-500 block">
                      Lesson title
                    </span>
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) =>
                        updateLessonField(ui, li, "title", e.target.value)
                      }
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 block">
                      XP reward
                    </span>
                    <input
                      type="number"
                      value={lesson.xpReward}
                      onChange={(e) =>
                        updateLessonField(
                          ui,
                          li,
                          "xpReward",
                          Number(e.target.value)
                        )
                      }
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  </div>
                </div>

                <button
                  onClick={() => addQuestion(ui, li)}
                  className="mt-1 rounded-full border border-slate-300 px-3 py-1 text-[11px] hover:bg-slate-100"
                >
                  + Add question
                </button>

                {lesson.questions.map((q, qi) => (
                  <div
                    key={q.id}
                    className="mt-2 rounded-lg border border-slate-200 bg-white p-2 text-[11px]"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500 block">
                          Type (mcq, text, word_bank, reorder)
                        </span>
                        <input
                          type="text"
                          value={q.type}
                          onChange={(e) =>
                            updateQuestionField(
                              ui,
                              li,
                              qi,
                              "type",
                              e.target.value.trim()
                            )
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1"
                        />
                      </div>
                      <div>
                        <span className="text-slate-500 block">
                          Prompt
                        </span>
                        <input
                          type="text"
                          value={q.prompt}
                          onChange={(e) =>
                            updateQuestionField(
                              ui,
                              li,
                              qi,
                              "prompt",
                              e.target.value
                            )
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1"
                        />
                      </div>
                    </div>

                    {(q.type === "mcq" ||
                      q.type === "word_bank" ||
                      q.type === "reorder") && (
                      <>
                        <span className="text-slate-500 block mt-1">
                          Options (separate with | )
                        </span>
                        <input
                          type="text"
                          value={(q.options ?? []).join(" | ")}
                          onChange={(e) =>
                            updateOptions(ui, li, qi, e.target.value)
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1"
                        />
                      </>
                    )}

                    {q.type === "mcq" && (
                      <>
                        <span className="text-slate-500 block mt-1">
                          Correct index (0-based)
                        </span>
                        <input
                          type="number"
                          value={q.correctOptionIndex ?? 0}
                          onChange={(e) =>
                            updateQuestionField(
                              ui,
                              li,
                              qi,
                              "correctOptionIndex",
                              Number(e.target.value)
                            )
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1"
                        />
                      </>
                    )}

                    {q.type === "text" && (
                      <>
                        <span className="text-slate-500 block mt-1">
                          Correct answer
                        </span>
                        <input
                          type="text"
                          value={q.correctAnswer ?? ""}
                          onChange={(e) =>
                            updateQuestionField(
                              ui,
                              li,
                              qi,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1"
                        />
                      </>
                    )}

                    {(q.type === "word_bank" || q.type === "reorder") && (
                      <>
                        <span className="text-slate-500 block mt-1">
                          Correct sequence (words separated with | )
                        </span>
                        <input
                          type="text"
                          value={(q.correctSequence ?? []).join(" | ")}
                          onChange={(e) =>
                            updateCorrectSequence(
                              ui,
                              li,
                              qi,
                              e.target.value
                            )
                          }
                          className="w-full rounded border border-slate-300 px-2 py-1"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
      >
        Save course
      </button>
      {message && (
        <span className="ml-2 text-xs text-green-600">{message}</span>
      )}
    </div>
  );
};

export default AdminDashboardPage;
