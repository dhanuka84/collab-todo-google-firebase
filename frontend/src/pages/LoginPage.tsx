import React, { useState } from "react";
import { useAuth } from "../lib/authContext";

interface Props {
  onLoggedIn(): void;
  goToRegister(): void;
}

export const LoginPage: React.FC<Props> = ({ onLoggedIn, goToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      onLoggedIn();
    } catch (e: any) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="border rounded-lg p-6 bg-white shadow-sm w-full max-w-sm">
        <h1 className="text-lg font-bold mb-4">Login</h1>
        {error && (
          <div className="mb-3 text-sm text-red-600 border border-red-200 bg-red-50 rounded px-3 py-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="border rounded px-2 py-1 text-sm"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border rounded px-2 py-1 text-sm"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-1 text-sm px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-600">
          No account?{" "}
          <button onClick={goToRegister} className="underline">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};
