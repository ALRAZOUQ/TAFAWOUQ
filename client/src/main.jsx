import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CourseProvider } from "./context/CourseContext";
import { AuthProvider } from "./context/authContext";
import { ScheduleProvider } from "./context/ScheduleContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ScheduleProvider>
      <CourseProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </CourseProvider>
    </ScheduleProvider>
  </AuthProvider>
);