import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Routes/Signup";
import Login from "./Routes/Login";
import Error404Page from "./Routes/Error";
import Landing from "./Routes/Landing";


const router = createBrowserRouter([
  { path: "/signup", element: <Signup /> },
  { path: "/", element: <Landing />, errorElement: <Error404Page /> },
  { path: "/login", element: <Login /> },
]);
function App() {
  return (
    
      <RouterProvider router={router} />
    
  );
}

export default App;
