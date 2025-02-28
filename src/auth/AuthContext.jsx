import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Tambahkan state isLoading
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("name");
    const storedUserId = localStorage.getItem("user_id");
    const storedUsername = localStorage.getItem("username");

    if (token) {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
    
    setIsLoading(false); // Selesai membaca localStorage
  }, []);

  const login = (token, userRole,name, userName, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    localStorage.setItem("name", name);
    localStorage.setItem("user_id", userId);
    localStorage.setItem("username", userName);
    setIsLoggedIn(true);
    setRole(userRole);
    setName(name);
    setUsername(userName);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setRole(null);
    setName(null);
    setUsername(null);
    setUserId(null);
    navigate("/login"); // Redirect ke halaman login setelah logout
  };

  if (isLoading) return <div>Loading...</div>; // Tunggu sebelum render

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}


// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [role, setRole] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedRole = localStorage.getItem("role");

//     if (token) {
//       setIsLoggedIn(true);
//       setRole(storedRole);
//     }
//   }, []);

//   const login = (token, userRole) => {
//     localStorage.setItem("token", token);
//     localStorage.setItem("role", userRole);
//     setIsLoggedIn(true);
//     setRole(userRole);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     setIsLoggedIn(false);
//     setRole(null);
//     navigate("/login"); // Redirect ke halaman login setelah logout
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
