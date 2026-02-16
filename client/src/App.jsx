import { SignIn } from "./pages/Auth/Signin";
import { SignUp } from "./pages/Auth/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import { Home } from "./pages/Home";
import { Profile } from "./pages/profile/index";
import {ProfileUpdate} from "./pages/profile/update-profile/ProfileUpdate";
import { AuthProvider } from "./context/AuthContext";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path:'/profile/:id',
    element: <Profile />
  },
  {
    path:'/signup',
    element: <SignUp />
  },
  {
    path:'/signin',
    element: <SignIn />
  }, 
  {
    path: '/profile/:id/update',
    element: <ProfileUpdate />
  }
]);

function App() {

  return (
    <>
        <AuthProvider>
    
      <RouterProvider router={appRouter}/>
    </AuthProvider>


    </>
  )
}

export default App
