import { SignIn } from "./pages/Auth/Signin";
import { SignUp } from "./pages/Auth/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import { Home } from "./pages/Home";
import { Profile } from "./pages/profile/index";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path:'/profile',
    element: <Profile />
  },
  {
    path:'/signup',
    element: <SignUp />
  },
  {
    path:'/signin',
    element: <SignIn />
  }
]);

function App() {

  return (
    <>
      <RouterProvider router={appRouter}/>

    </>
  )
}

export default App
