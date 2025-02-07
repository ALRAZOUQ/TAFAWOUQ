import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Routes/Signup";
import Login from "./Routes/Login";
import Error404Page from "./Routes/Error";
import Landing from "./Routes/Landing";
import Home_page from "./Routes/Home_page";
import After_login from "./Routes/After_login";
import RootLayout from "./Routes/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error404Page />,
    children: [
      { path: "home", element: <Home_page /> },
      { index: true, path: "", element: <Landing /> },
    ],
  },
  //relative paths so we can navigate to it easily without clashes
  { path: "signup", element: <Signup /> },
  { path: "login", element: <Login /> },
  { path: "/After_login", element: <After_login /> },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
