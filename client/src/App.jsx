import { Button } from "@/components/ui/button";
import { Navbar } from "./components/ui/shared/Navbar";
import { ProfileHeader } from "./pages/Profile";
import { SignIn } from "./pages/Auth/Signin";
import { SignUp } from "./pages/Auth/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import { Home } from "./pages/Home";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />
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
