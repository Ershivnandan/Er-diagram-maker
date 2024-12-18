import { Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PrivateRoute from "../utils/PrivateRoute";
import Dashboard from "../Pages/Dashboard";
import Landing from "../Pages/Landing";
import Login from "../Pages/Auth/Login";
import Signup from "../Pages/Auth/Signup";

const AllRoutes = () => {

    const { user } = useAuth();
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

       {/* Private Routes */}
       <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Example dynamic behavior */}
        <Route
          path="/profile"
          element={user ? <p>User Profile</p> : <p>Login to view profile</p>}
        />
    </Routes>
  );
};

export default AllRoutes;
