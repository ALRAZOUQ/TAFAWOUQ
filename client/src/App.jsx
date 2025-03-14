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
import "react-toastify/dist/ReactToastify.css"; // Import CSS

// HASSAN: lazy to optimize the performance for the app and load the page in the background
const CoursesPage = lazy(() => import("./Routes/CoursesPage"));
const CoursePage = lazy(() => import("./Routes/CoursePage"));
const Error404Page = lazy(() => import("./Routes/Error"));
const Home_page = lazy(() => import("./Routes/Home_page"));
const AdminHomePage = lazy(() => import("./Routes/AdminHomePage"));
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
      { path: "admin/admin-home", element: <AdminHomePage /> },
      { path: "courses/:courseId", element: <CoursePage /> },
      { path: "mypreviousschedules", element: <CoursePage /> },
      { path: "myquizzes", element: <CoursePage /> },
    ],
  },
  { path: "signup", element: <Signup /> },
  { path: "login", element: <Login /> },
]);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // Simulate short loading delay
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
