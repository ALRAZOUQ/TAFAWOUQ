import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect } from "react";
import Signup from "./Routes/Signup";
import Login from "./Routes/Login";
import Error404Page from "./Routes/Error";
import Landing from "./Routes/Landing";
import Home_page from "./Routes/Home_page";
import RootLayout from "./Routes/RootLayout";
import CoursesPage from "./Routes/CoursesPage";
import CoursePage from "./Routes/CoursePage";
import AdminHomePage from "./Routes/AdminHomePage";
import { ToastContainer } from "react-toastify";
import LoadingScreen from "./components/LoadingScreen";
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import DummyRoute from "./Routes/dummyRoute";

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
      { path: "dummy", element: <DummyRoute /> },
    ],
  },
  { path: "signup", element: <Signup /> },
  { path: "login", element: <Login /> },
]);

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate a small delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <div
            id="loadingSpinnerContainer"
            className=" hidden w-screen h-screen fixed z-50">
            <span className="loadingSpinner"></span>
          </div>
          <RouterProvider router={router} />
          <ToastContainer
            position="top-center"
            autoClose={3000}
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
