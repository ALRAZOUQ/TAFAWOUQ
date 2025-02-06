import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Routes/Signup";
import Login from "./Routes/Login";
import Error404Page from "./Routes/Error";
import Landing from "./Routes/Landing";
import Home_page from "./Routes/Home_page";
import After_login from "./Routes/After_login";


const router = createBrowserRouter([
  { path: "/signup", element: <Signup /> },
  { path: "/", element: <Landing />, errorElement: <Error404Page /> },
  { path: "/login", element: <Login /> },
  { path: "/home", element: <Home_page/> },
  { path: "/After_login", element: <After_login /> },
]);
function App() {
  return (
    
      <RouterProvider router={router} />
    
  );
}

export default App;
