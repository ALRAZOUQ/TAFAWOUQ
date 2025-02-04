import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Authentication_context } from "./authentication/Authentication_context";
import { CourseProvider } from './context/CourseContext';

createRoot(document.getElementById("root")).render(
  <Authentication_context>
    <CourseProvider>
    <StrictMode>
      <App />
    </StrictMode>
    </CourseProvider>
  </Authentication_context>
);
