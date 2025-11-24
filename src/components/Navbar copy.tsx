import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/authSlice";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const isAuthenticated = !!user;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="flex items-center gap-4 px-4 py-2 border-b border-slate-200 bg-white sticky top-0 z-10">
      <Link
        to="/"
        className="font-bold text-lg text-blue-600 hover:text-blue-700"
      >
        LingoSpark
      </Link>

      {isAuthenticated && user && (
        <>
          <nav className="flex gap-3 text-sm">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link to="/stats" className="hover:text-blue-600">
              Stats
            </Link>
            <Link to="/leaderboard" className="hover:text-blue-600">
              Leaderboard
            </Link>
            <Link to="/profile" className="hover:text-blue-600">
              Profile
            </Link>
            {user.role === "admin" && (
              <Link to="/admin" className="hover:text-blue-600">
                Admin
              </Link>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ background: user.avatarColor || "#94a3b8" }}
            >
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-sm">{user.name}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-full border border-slate-300 text-xs hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </>
      )}

      {!isAuthenticated && (
        <nav className="ml-auto flex gap-3 text-sm">
          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>
          <Link to="/signup" className="hover:text-blue-600">
            Signup
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
