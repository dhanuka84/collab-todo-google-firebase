import React, { useState } from "react";
import { useAuth } from "./lib/authContext";
import { TodoBoardPage } from "./pages/TodoBoardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

export const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  if (loading) {
    return <div className="p-6 text-sm">Checking authentication...</div>;
  }

  if (!user) {
    return mode === "login" ? (
      <LoginPage onLoggedIn={() => {}} goToRegister={() => setMode("register")} />
    ) : (
      <RegisterPage
        onRegistered={() => setMode("login")}
        goToLogin={() => setMode("login")}
      />
    );
  }

  return <TodoBoardPage />;
};
