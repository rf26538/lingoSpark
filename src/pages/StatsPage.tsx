import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { tickBots } from "../store/leaderboardSlice";
import { loadDb } from "../store/localDb";
import type { User } from "../store/types";

const LeaderboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const [board, setBoard] = useState<User[]>([]);

  useEffect(() => {
    const updateBoard = () => {
      const db = loadDb();
      const users = [...db.users].sort((a, b) => b.totalXp - a.totalXp);
      setBoard(users.slice(0, 20));
    };

    updateBoard();
    const interval = setInterval(() => {
      dispatch(tickBots());
      updateBoard();
    }, 3000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Leaderboard</h2>
      <p className="text-xs text-slate-500">
        Top learners by total XP (bots simulate real-time activity)
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left px-2 py-1">#</th>
              <th className="text-left px-2 py-1">User</th>
              <th className="text-right px-2 py-1">XP</th>
            </tr>
          </thead>
          <tbody>
            {board.map((u, idx) => (
              <tr
                key={u.id}
                className={`border-b border-slate-50 ${
                  u.id === authUser?.id ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-2 py-1">{idx + 1}</td>
                <td className="px-2 py-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                      style={{ background: u.avatarColor || "#94a3b8" }}
                    >
                      {u.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span>{u.name}</span>
                    {u.id === authUser?.id && (
                      <span className="text-[10px] text-blue-600">(you)</span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-1 text-right">{u.totalXp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
