import { useState, useContext  } from "react";
import Routes from "./routes"; // Komponen Routes tetap dipertahankan
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons"; // Mengimpor semua ikon solid
import Sidebar from "./views/layout/Sidebar"; // Komponen Sidebar
import Navbar from "./views/layout/Navbar"; // Mengimpor Navbar
import { useNavigate } from "react-router-dom"; // Menggunakan useNavigate untuk navigasi
import { AuthContext } from "./auth/AuthContext";

// Menambahkan seluruh ikon solid ke dalam library
library.add(fas);

function App() {
  // State untuk mengontrol visibilitas sidebar
  const [isVisible, setIsVisible] = useState(true);
  const { isLoggedIn } = useContext(AuthContext); // Gunakan Context

  const navigate = useNavigate();

  // Fungsi untuk toggle visibilitas sidebar
  const toggleSidebar = () => {
    setIsVisible((prev) => !prev);
  };

  // useEffect(() => {
  //   // Mengecek token di localStorage
  //   const token = localStorage.getItem("token");

  //   if (token) {
  //     setIsLoggedIn(true);
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, []);

  return (
    <>
    
      {isLoggedIn && <Navbar toggleSidebar={toggleSidebar} />}
      {/* <Navbar toggleSidebar={toggleSidebar} /> */}

      {isLoggedIn && (
        <div
          className={`fixed inset-0 top-0 left-0 bg-gray-800 text-white w-64 min-h-screen p-4 transition-transform duration-300 ${
            isVisible ? "translate-x-0" : "-translate-x-full"
          } shadow-lg`}
        >
          <Sidebar />
        </div>
      )}

      {/* <h1>{isLoggedIn ? "Sudah": "Belum"} Login</h1> */}

      {isLoggedIn ? (
        <div
          className={`transition-all duration-300 ${
            isVisible ? "pl-64" : "pl-0"
          }`}
        >
          <div className="p-6 mt-12 ">
            <Routes />
          </div>
        </div>
      ) : (
        <Routes />
      )}
    </>
  );
}

export default App;
