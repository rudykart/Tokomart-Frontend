import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const formData ={
      name,
      username,
      password,
      confirm_password: confirmPassword
    }

    console.log("Tes");

      try {
         await api.post("/auth/register", formData);
        navigate("/login");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          setErrors(error.response.data.errors); // Menyimpan error di state

          console.log("Error submit " + error.status);
        } else {
          alert("Error updating classification.");
        }
      }
  };

  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <div
          
          className="bg-white p-8 rounded shadow-lg w-full sm:w-full md:w-2/4 lg:w-2/6"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={`w-full px-3 py-2 border rounded ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <div className="text-red-500 text-sm mt-1">
              {errors.name.map((msg, idx) => (
                <p key={idx}>{msg}</p>
              ))}
            </div>
          )}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className={`w-full mt-4 px-3 py-2 border rounded ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.username && (
            <div className="text-red-500 text-sm mt-1">
              {errors.username.map((msg, idx) => (
                <p key={idx}>{msg}</p>
              ))}
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
              {errors.password.map((msg, idx) => (
                <p key={idx}>{msg}</p>
              ))}
            </div>
          )}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className={`w-full mt-4 px-3 py-2 border rounded ${
              errors.confirm_password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirm_password && (
            <div className="text-red-500 text-sm mt-1">
              {errors.confirm_password.map((msg, idx) => (
                <p key={idx}>{msg}</p>
              ))}
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded"
          >
            Register
          </button>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">
              Login here
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
