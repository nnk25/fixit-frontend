import "./App.css";
import LoginPage from "./components/login-page";
import TaskManagement from "./components/task-management";
import { TodoListProvider } from "./providers/task-provider";
import { useEffect, useMemo, useState } from "react";
import {
  ApiHttpError,
  getAuthenticatedUser,
  logout,
  signInWithGoogle,
} from "./lib/api";
import { AuthUserResponseDto } from "./lib/api.types";

type AuthState = "loading" | "authenticated" | "unauthenticated" | "error";

function App() {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [user, setUser] = useState<AuthUserResponseDto | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const loginError = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("error") === "oauth2"
      ? "Google sign-in failed. Please try again."
      : undefined;
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getAuthenticatedUser();
        setUser(currentUser);
        setErrorMessage(undefined);
        setAuthState("authenticated");
      } catch (err) {
        if (err instanceof ApiHttpError && err.status === 401) {
          setAuthState("unauthenticated");
          setUser(undefined);
          return;
        }
        setAuthState("error");
        setErrorMessage(err instanceof Error ? err.message : "Authentication failed");
      }
    };

    void checkAuth();
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(undefined);
    setAuthState("unauthenticated");
  };

  if (authState === "loading") {
    return <p className="text-muted-foreground">Checking session...</p>;
  }

  if (authState === "unauthenticated" || authState === "error" || !user) {
    return <LoginPage onSignIn={signInWithGoogle} errorMessage={errorMessage ?? loginError} />;
  }

  return (
    <TodoListProvider>
      <TaskManagement currentUser={user} onLogout={handleLogout} />
    </TodoListProvider>
  );
}

export default App;
