import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Dark Mode */}
    <div className="dark text-foreground bg-background min-h-screen min-w-screen flex justify-center items-center">
      <App />
    </div>
    <Toaster />
  </StrictMode>,
);
