import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { signup } from "../store/authSlice";

const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await dispatch(signup({ name, email, password })).unwrap();
      nav("/");
    } catch (err) {
      const message =
        (err as { message?: string })?.message ?? "Signup failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create account</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          className="w-full rounded-full border border-slate-300 px-4 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={submitting}
        />

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
          {submitting ? "Creating..." : "Sign up"}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-600">
        Already have an account?{" "}
        <Link className="text-blue-600 hover:text-blue-700" to="/login">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
