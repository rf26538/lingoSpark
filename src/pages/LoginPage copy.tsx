import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/authSlice";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const [email, setEmail] = useState<string>("demo@demo.com");
  const [password, setPassword] = useState<string>("demo");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Assumes login is a createAsyncThunk returning a promise
      await dispatch(login({ email, password })).unwrap();
      nav("/");
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "Login failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-1">Login</h2>
      <p className="text-xs text-slate-500 mb-4">
        Demo: demo@demo.com / demo
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-full border border-slate-300 px-4 py-2 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={submitting}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-full border border-slate-300 px-4 py-2 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={submitting}
        />

        {error && (
          <div className="text-xs text-red-600">{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-blue-600 text-white py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-600">
        No account?{" "}
        <Link className="text-blue-600 hover:text-blue-700" to="/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
