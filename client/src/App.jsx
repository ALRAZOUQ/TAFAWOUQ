import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Routes/Signup";
import Login from "./Routes/Login";


const router=createBrowserRouter([
  {path:'/signup', element:<Signup/>},
  {path:'/', element:<Signup/>}, // i did this temporarily, so u can know the server run correctly when u write the run command
  {path:'/login', element:<Login/>}
]);
function App() {
return <RouterProvider router={router}/>
}

export default App;
