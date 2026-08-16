import { SignIn } from "./pages/Auth/Signin";
import { SignUp } from "./pages/Auth/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import { Home } from "./pages/Home";
import { Profile } from "./pages/profile/index";
import { ProfileUpdate } from "./pages/profile/update-profile/ProfileUpdate";
import { CommentPage } from "./pages/comment/index";
import SearchPage from "./pages/search/SearchPage";
import { ProtectedRoutes } from "./utils/ProtectedRoutes";
import ForgotPassword from "./pages/forget-password/ForgotPassword";

const appRouter = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  // ← All protected routes go inside this layout
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/profile/:id/update",
        element: <ProfileUpdate />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/post/:id/comment",
        element: <CommentPage />,
      }
      // Add more protected routes here
    ],
  },
]);

function App() {

  return (
    <RouterProvider router={appRouter} />
  )
}

export default App
