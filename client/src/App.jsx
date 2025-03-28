import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import Signup from "./Routes/Signup";
import Login from "./Routes/Login";
// import Error404Page from "./Routes/Error";
import Landing from "./Routes/Landing";
// import Home_page from "./Routes/Home_page";
import RootLayout from "./Routes/RootLayout";
// import CoursePage from "./Routes/CoursePage";
// import AdminHomePage from "./Routes/AdminHomePage";
import { ToastContainer } from "react-toastify";
import LoadingScreen from "./components/LoadingScreen";
import CreateTermModal from "./components/CreateTermModal";
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import Screen from "./components/Screen";

// HASSAN: lazy to optimize the performance for the app and load the page in the background
const CoursesPage = lazy(() => import("./Routes/CoursesPage"));
const CoursePage = lazy(() => import("./Routes/CoursePage"));
const Error404Page = lazy(() => import("./Routes/Error"));
const Home_page = lazy(() => import("./Routes/Home_page"));
const AdminHomePage = lazy(() => import("./Routes/AdminHomePage"));
const BannedAccounts = lazy(() => import("./Routes/BannedAccounts"));
const Hiddencomments = lazy(() => import("./Routes/HiddenComments"));
const PreviousSchedules = lazy(() => import("./Routes/PreviousSchedules"));
const Quizzes = lazy(() => import("./Routes/Quizzes"));

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
      { path: "myquizzes", element: <Quizzes /> },
      {
        path: "admin",
        children: [
          { index: true, path: "admin-home", element: <AdminHomePage /> },
          { path: "hiddencomments", element: <Hiddencomments /> },
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
