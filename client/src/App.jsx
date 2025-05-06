import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import Signup from "./Routes/Signup";
import Login from "./Routes/Login";
import Landing from "./Routes/Landing";
import RootLayout from "./Routes/RootLayout";
import { ToastContainer } from "react-toastify";
import LoadingScreen from "./components/LoadingScreen";
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import CoursesPage from "./Routes/CoursesPage";

// HASSAN: lazy to optimize the performance for the app and load the page in the background
// const CoursesPage = lazy(() => import("./Routes/CoursesPage"));
const CoursePage = lazy(() => import("./Routes/CoursePage"));
const Error404Page = lazy(() => import("./Routes/Error"));
const Home_page = lazy(() => import("./Routes/Home_page"));
const ReportsPage = lazy(() => import("./Routes/ReportsPage"));
const BannedAccounts = lazy(() => import("./Routes/BannedAccounts"));
const HiddenItems = lazy(() => import("./Routes/HiddenItems"));
const PreviousSchedules = lazy(() => import("./Routes/PreviousSchedules"));
const MyQuizzes = lazy(() => import("./Routes/MyQuizzes"));
const AdminHomePage = lazy(() => import("./Routes/AdminHomePage"));
const QuizPage = lazy(() => import("./Routes/QuizPage"));

// ✅ Define Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error404Page />,
    children: [
      { path: "home", element: <Home_page /> },
      { index: true, element: <Landing /> },
      { path: "courses", element: <CoursesPage /> },

      { path: "courses/:courseId", element: <CoursePage /> },
      { path: "mypreviousschedules", element: <PreviousSchedules /> },
      { path: "myquizzes", element: <MyQuizzes /> },
      { path: "quiz/:quizId", element: <QuizPage /> },
      {
        path: "admin",
        children: [
          { index: true, element: <AdminHomePage /> },
          { path: "reports", element: <ReportsPage /> },
          { path: "hiddenItems", element: <HiddenItems /> },
          { path: "bannedaccounts", element: <BannedAccounts /> },
        ],
      },
    ],
  },
  { path: "signup", element: <Signup /> },
  { path: "login", element: <Login /> },
]);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // Simulate short loading delay note if it deleted it will cause the app to crash and will not working
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          {/* ✅ Suspense wraps the entire router for all lazy-loaded routes */}
          <Suspense fallback={<LoadingScreen />}>
            <RouterProvider router={router} />
          </Suspense>

          {/* ✅ Toast notifications */}
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={true}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </>
      )}
    </>
  );
}

export default App;
