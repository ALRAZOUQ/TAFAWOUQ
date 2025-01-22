import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Routes/Signup";
import Login from "./Routes/Login";


const router=createBrowserRouter([
  {path:'/signup', element:<Signup/>},
  {path:'/login', element:<Login/>}
]);
function App() {
return <RouterProvider router={router}/>
}

export default App;
