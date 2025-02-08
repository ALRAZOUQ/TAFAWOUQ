import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Routes/Signup";
import Login from "./Routes/Login";
import Error404Page from "./Routes/Error";
import Landing from "./Routes/Landing";
import Home_page from "./Routes/Home_page";
import RootLayout from "./Routes/RootLayout";
import CoursesPage from "./Routes/CoursesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error404Page />,
    children: [
      { path: "home", element: <Home_page /> },
      { index: true, path: "", element: <Landing /> },
      { path: "courses", element: <CoursesPage /> },
    ],
  },
  //relative paths so we can navigate to it easily without clashes
  { path: "signup", element: <Signup /> },
  { path: "login", element: <Login /> },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
