import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";
import { AuthContext } from "../../auth/AuthContext"; // Import Context

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext); // Gunakan Context

  const handleSubmit = async () => {
    const formData = { username, password };

    try {
      const response = await api.post("/auth/login", formData);
      const token = response.data.payload.access_token;
      const role = response.data.payload.role;
      const name = response.data.payload.name;
      const username = response.data.payload.username;
      const userId = response.data.payload.user_id;

      login(token, role, name, username,userId); // Simpan token dan role di AuthContext

      // Redirect ke halaman sebelum login
      const redirectTo = location.state?.from || "/classifications";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("Error saat login.");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-lg w-full sm:w-full md:w-2/4 lg:w-2/6">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className={`w-full px-3 py-2 border rounded ${
            errors.username ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.username && (
          <div className="text-red-500 text-sm mt-1">
            {errors.username.map((msg, idx) => <p key={idx}>{msg}</p>)}
          </div>
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={`w-full mt-4 px-3 py-2 border rounded ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && (
          <div className="text-red-500 text-sm mt-1">
            {errors.password.map((msg, idx) => <p key={idx}>{msg}</p>)}
          </div>
        )}
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;

// import { useState,useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api";
// import { AuthContext } from "../../auth/AuthContext"; // Import Context


// function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext); // Gunakan Context

//   const handleSubmit = async () => {
//     const formData ={
//       username,
//       password
//     }

//     try {
//       const response = await api.post("/auth/login", formData);
//       console.log("isi token = "+response.data.payload.access_token);
//       const token = response.data.payload.access_token;
//       const role = response.data.payload.role; // Pastikan API mengembalikan role
      
//       login(token, role); // Simpan token dan role di AuthContext

//      navigate("/classifications");
//    } catch (error) {
//      if (
//        error.response &&
//        error.response.data &&
//        error.response.data.errors
//      ) {
//        setErrors(error.response.data.errors); // Menyimpan error di state

//        console.log("Error submit " + error.status);
//      } else {
//        alert("Error updating classification.");
//      }
//    }
//   };

//   return (
//     <>

// <div className="h-screen flex items-center justify-center">
//     <div className="bg-white p-8 rounded shadow-lg w-full sm:w-full md:w-1/2 lg:w-1/2">
//       <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
//       <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             placeholder="Username"
//             className={`w-full px-3 py-2 border rounded ${
//               errors.username ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.username && (
//             <div className="text-red-500 text-sm mt-1">
//               {errors.username.map((msg, idx) => (
//                 <p key={idx}>{msg}</p>
//               ))}
//             </div>
//           )}
//       <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Password"
//             className={`w-full mt-4 px-3 py-2 border rounded ${
//               errors.password ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.password && (
//             <div className="text-red-500 text-sm mt-1">
//               {errors.password.map((msg, idx) => (
//                 <p key={idx}>{msg}</p>
//               ))}
//             </div>
//           )}
//       <button
//          onClick={handleSubmit}
//         className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
//       >
//         Login
//       </button>
//         <p className="mt-4 text-center">
//           Don't have an account?{" "}
//           <a href="/register" className="text-blue-500">Register here</a>
//         </p>
//     </div>
//     </div>
//     </>
//   );
// };

// export default Login;
