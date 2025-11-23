import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateUser } from "../store/authSlice";

const ProfilePage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [name, setName] = useState<string>(user?.name ?? "");
  const [avatarColor, setAvatarColor] = useState<string>(
    user?.avatarColor ?? "#94a3b8"
  );
  const [dailyGoalXp, setDailyGoalXp] = useState<number>(
    user?.dailyGoalXp ?? 20
  );
  const [saved, setSaved] = useState<boolean>(false);

  if (!user) {
    return <div className="p-4 text-sm">You must be logged in.</div>;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateUser({
        name: name.trim() || user.name,
        avatarColor,
        dailyGoalXp: Number(dailyGoalXp) || 0,
      })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div className="p-4 max-w-md">
      <h2 className="text-xl font-semibold mb-3">Profile</h2>

      <form onSubmit={handleSave} className="space-y-3 text-sm">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow"
            style={{ background: avatarColor }}
          >
            {(name || user.name)[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-0.5">
              Avatar color
            </label>
            <input
              type="color"
              value={avatarColor}
              onChange={(e) => setAvatarColor(e.target.value)}
              className="h-8 w-16 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-0.5">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-0.5">
            Daily XP goal
          </label>
          <input
            type="number"
            value={dailyGoalXp}
            onChange={(e) => setDailyGoalXp(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-300 px-3 py-1.5"
          />
          <p className="text-[11px] text-slate-500 mt-0.5">
            Used for progress ring and achievements.
          </p>
        </div>

        <button
          type="submit"
          className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
        >
          Save changes
        </button>
        {saved && (
          <span className="ml-2 text-xs text-green-600">Saved ✓</span>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
