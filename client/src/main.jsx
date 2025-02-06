import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
//import { Authentication_context } from "./authentication/Authentication_context";
import { CourseProvider } from './context/CourseContext';
import { AuthProvider } from './context/authContext';

createRoot(document.getElementById("root")).render(
   
    <CourseProvider>
       <AuthProvider>
    <StrictMode>
      <App />
    </StrictMode>
    </AuthProvider>
    </CourseProvider>
  
);
