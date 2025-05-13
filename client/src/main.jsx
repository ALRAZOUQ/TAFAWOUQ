import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CourseProvider } from "./context/CourseContext";
import { AuthProvider } from "./context/authContext";
import { ScheduleProvider } from "./context/ScheduleContext";

// firbase config to send the 'push notifications'
try {

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("🔔 🛜 Service Worker registered:", registration);
        console.log(`=====================================`);
      })
      .catch((err) => {
        console.error("🔔 🛜 Service Worker registration failed:", err);
        console.log(`=====================================`);
      });
  }
} catch (error) {
  console.error(`Error while making the serviceWorker 😭: ${error}`);
}

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
