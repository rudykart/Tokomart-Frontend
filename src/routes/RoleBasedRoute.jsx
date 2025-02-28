import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, role, isLoading } = useContext(AuthContext);
  const location = useLocation();
  
  console.log("is Login : "+isLoggedIn);
  console.log("is Role  : "+role);

  if (isLoading) return <div>Loading...</div>; // Tunggu sebelum render

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleBasedRoute;


// import { Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../auth/AuthContext";

// const RoleBasedRoute = ({ children, allowedRoles }) => {
//   const { isLoggedIn, role } = useContext(AuthContext);

//   console.log("is Login : "+isLoggedIn);
//   console.log("is Role  : "+role);
//   if (!isLoggedIn) {
//     return <Navigate to="/login" replace />; // Redirect ke login jika belum login
//   }

//   if (!allowedRoles.includes(role)) {
//     return <Navigate to="/" replace />; // Redirect ke home jika role tidak sesuai
//   }

//   return children;
// };

// export default RoleBasedRoute;
