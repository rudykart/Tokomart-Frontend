import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

const ProtectedRoute = ({ children, requireAuth = false, allowedRoles = [] }) => {
  const { isLoggedIn, role } = useContext(AuthContext);

  const location = useLocation();

  console.log("is Login : "+isLoggedIn);
  console.log("URL Saat Ini : "+location.pathname);
  
  // Jika halaman membutuhkan autentikasi tetapi pengguna belum login
  if (requireAuth && !isLoggedIn) {
    // return <Navigate to="/login" replace />;
  }

  // Jika halaman hanya untuk pengguna yang belum login, tetapi pengguna sudah login
  if (!requireAuth && isLoggedIn) {
    // return <Navigate to="/" replace />;
  }

  // Jika halaman membutuhkan role tertentu dan pengguna tidak memiliki role yang diizinkan
  if (requireAuth && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

// import { Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "../auth/AuthContext";

// const ProtectedRoute = ({ children, requireAuth, allowedRoles }) => {
//   const { isLoggedIn, role } = useContext(AuthContext);

//   if (requireAuth && !isLoggedIn) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!requireAuth && isLoggedIn) {
//     return <Navigate to="/" replace />;
//   }

//   // Cek jika halaman membutuhkan role tertentu
//   if (allowedRoles && !allowedRoles.includes(role)) {
//     return <Navigate to="/" replace />; // Redirect ke home jika tidak punya akses
//   }

//   return children;
// };

// export default ProtectedRoute;
