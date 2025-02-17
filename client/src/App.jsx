import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Routes/Signup";
import Login from "./Routes/Login";
import Error404Page from "./Routes/Error";
import Landing from "./Routes/Landing";
import Home_page from "./Routes/Home_page";
import RootLayout from "./Routes/RootLayout";
import CoursesPage from "./Routes/CoursesPage";
import CoursePage from "./Routes/CoursePage";
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import { ToastContainer } from 'react-toastify';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error404Page />,
    children: [
      { path: "home", element: <Home_page /> },
      { index: true, path: "", element: <Landing /> },
      { path: "courses", element: <CoursesPage /> },
      { path: "course/:courseId", element: <CoursePage /> },
    ],
  },
  //relative paths so we can navigate to it easily without clashes
  { path: "signup", element: <Signup /> },
  { path: "login", element: <Login /> },
]);
function App() {
  return ( <>
    <RouterProvider router={router} />
    <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
  </>);
}

export default App;
