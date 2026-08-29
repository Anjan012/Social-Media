import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import VynkLoader from "../components/VynkLoader";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoutes = () => {
  const { authUser, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* <p>Loading...</p>    */}
        <VynkLoader />
      </div>
    );
  }

  // 2. After loading, decide
  return authUser ? <Outlet /> : <Navigate to="/signin" replace />;
};