import React, { useEffect, useMemo, useState } from "react";
import type { Question } from "../store/types";

interface QuestionViewProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

function playBeep(frequency = 880, duration = 0.12) {
  try {
    const Ctx =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    osc.start();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + duration
    );
    osc.stop(ctx.currentTime + duration);
  } catch {
    // ignore
  }
}

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  onAnswer,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [wordSequence, setWordSequence] = useState<string[]>([]);
  const [reorderList, setReorderList] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">(
    "idle"
  );

  useEffect(() => {
    setSelectedIndex(null);
    setTextAnswer("");
    setFeedback(null);
    setWordSequence([]);
    setReorderList(question.options ?? []);
    setStatus("idle");
  }, [question]);

  const canSubmit = useMemo(() => {
    switch (question.type) {
      case "mcq":
        return selectedIndex !== null;
      case "text":
        return textAnswer.trim().length > 0;
      case "word_bank":
        return wordSequence.length > 0;
      case "reorder":
        return (reorderList ?? []).length > 0;
      default:
        return false;
    }
  }, [question.type, selectedIndex, textAnswer, wordSequence, reorderList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    let isCorrect = false;

    if (question.type === "mcq") {
      isCorrect = selectedIndex === question.correctOptionIndex;
    } else if (question.type === "text") {
      isCorrect =
        textAnswer.trim().toLowerCase() ===
        (question.correctAnswer ?? "").trim().toLowerCase();
    } else if (question.type === "word_bank") {
      const correctSeq = (question.correctSequence ?? []).map((w) =>
        w.toLowerCase()
      );
      const givenSeq = wordSequence.map((w) => w.toLowerCase());
      isCorrect =
        correctSeq.length === givenSeq.length &&
        correctSeq.every((w, i) => w === givenSeq[i]);
    } else if (question.type === "reorder") {
      const correctSeq = (question.correctSequence ?? []).map((w) =>
        w.toLowerCase()
      );
      const givenSeq = reorderList.map((w) => w.toLowerCase());
      isCorrect =
        correctSeq.length === givenSeq.length &&
        correctSeq.every((w, i) => w === givenSeq[i]);
    }

    setStatus(isCorrect ? "correct" : "incorrect");
    setFeedback(
      isCorrect ? "Correct! 🎉" : "Incorrect. Moving on to the next one."
    );
    playBeep(isCorrect ? 1046 : 196);

    setTimeout(() => {
      setFeedback(null);
      setStatus("idle");
      onAnswer(isCorrect);
      setSelectedIndex(null);
      setTextAnswer("");
      setWordSequence([]);
      setReorderList(question.options ?? []);
    }, 700);
  };

  const handleWordClick = (word: string) => {
    setWordSequence((seq) => [...seq, word]);
  };

  const handleWordRemove = (idx: number) => {
    setWordSequence((seq) => seq.filter((_, i) => i !== idx));
  };

  const moveReorderItem = (index: number, delta: number) => {
    setReorderList((list) => {
      const newList = [...list];
      const swapIndex = index + delta;
      if (swapIndex < 0 || swapIndex >= newList.length) return newList;
      const temp = newList[index];
      newList[index] = newList[swapIndex];
      newList[swapIndex] = temp;
      return newList;
    });
  };

  const cardStatusClass =
    status === "correct"
      ? "border-green-400 bg-green-50"
      : status === "incorrect"
      ? "border-red-400 bg-red-50"
      : "border-slate-200 bg-white";

  return (
    <div
      className={`max-w-xl mt-4 rounded-2xl border p-4 shadow-sm transition-all ${cardStatusClass}`}
    >
      <h3 className="font-semibold mb-2">{question.prompt}</h3>

      <form onSubmit={handleSubmit} className="space-y-3">
        {question.type === "mcq" && (
          <div className="flex flex-col gap-2">
            {(question.options ?? []).map((opt, idx) => (
              <label
                key={idx}
                className={`flex items-center gap-2 rounded-full border px-3 py-1 cursor-pointer text-sm ${
                  selectedIndex === idx
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  checked={selectedIndex === idx}
                  onChange={() => setSelectedIndex(idx)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === "text" && (
          <input
            type="text"
            placeholder="Type your answer..."
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            className="w-full rounded-full border border-slate-300 px-3 py-2 text-sm"
          />
        )}

        {question.type === "word_bank" && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {(question.options ?? []).map((w, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleWordClick(w)}
                  className="px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-xs hover:bg-slate-100"
                >
                  {w}
                </button>
              ))}
            </div>
            <div className="min-h-[2.5rem] flex flex-wrap gap-2 rounded-xl border border-dashed border-slate-300 px-2 py-1 text-sm">
              {wordSequence.length === 0 && (
                <span className="text-xs text-slate-400">
                  Tap words to build your answer
                </span>
              )}
              {wordSequence.map((w, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleWordRemove(idx)}
                  className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs"
                >
                  {w} ✕
                </button>
              ))}
            </div>
          </div>
        )}

        {question.type === "reorder" && (
          <div className="space-y-2">
            {(reorderList ?? []).map((w, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-sm"
              >
                <span className="w-5 text-xs text-slate-400">{idx + 1}</span>
                <span className="flex-1">{w}</span>
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveReorderItem(idx, -1)}
                    className="text-xs border border-slate-300 rounded px-1 leading-none"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveReorderItem(idx, 1)}
                    className="text-xs border border-slate-300 rounded px-1 leading-none"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className={`mt-1 inline-flex items-center rounded-full px-4 py-1 text-sm font-medium text-white transition ${
            canSubmit
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-slate-300 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </form>

      {feedback && (
        <div className="mt-2 text-sm font-medium">{feedback}</div>
      )}
    </div>
  );
};

export default QuestionView;
