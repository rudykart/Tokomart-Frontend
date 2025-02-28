import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../auth/AuthContext"; // Import AuthContext

function Sidebar() {
  const location = useLocation();
  const { logout, role } = useContext(AuthContext); // Ambil role & logout

  console.log(location.pathname);
  return (
    <>
      {/* <h2 className="text-lg font-bold mb-4 mt-20">Menu</h2> */}
      <ul className="space-y-2 mt-16">
        <li>
          <Link
            to="/"
            className={`flex items-center p-2 hover:bg-gray-700 rounded-md transition-colors ${
              location.pathname == "/" ? "bg-gray-700" : ""
            }`}
          >
            <FontAwesomeIcon icon="fa-solid fa-gauge" className="mr-2" />
            Home
          </Link>
        </li>
         {/* Hanya Admin yang bisa melihat Classifications */}
         {role === "admin" && (
          <li>
            <Link
              to="/classifications"
              className={`flex items-center p-2 hover:bg-gray-700 rounded-md transition-colors ${
                location.pathname === "/classifications" ? "bg-gray-700" : ""
              }`}
            >
              <FontAwesomeIcon icon="fa-solid fa-th-list" className="mr-2" />
              Classifications
            </Link>
          </li>
        )}
        <li>
          <Link
            to="/customers"
            className={`flex items-center p-2 hover:bg-gray-700 rounded-md transition-colors ${
              location.pathname == "/customers" ? "bg-gray-700" : ""
            }`}
          >
            <FontAwesomeIcon icon="fa-solid fa-users" className="mr-2" />
            Customer
          </Link>
        </li>
        <li>
          <Link
            to="/products"
            className={`flex items-center p-2 hover:bg-gray-700 rounded-md transition-colors ${
              location.pathname.startsWith('/products') ? "bg-gray-700" : ""
            }`}
          >
            <FontAwesomeIcon
              icon="fa-solid fa-boxes-packing"
              className="mr-2"
            />
            Product
          </Link>
        </li>
        

        {role === "admin" && (
          <li>
          <Link
            to="/discounts"
            className={`flex items-center p-2 hover:bg-gray-700 rounded-md transition-colors ${
              location.pathname == "/discounts" ? "bg-gray-700" : ""
            }`}
          >
            <FontAwesomeIcon icon="fa-solid fa-percent" className="mr-2" />
            Discount
          </Link>
        </li>
        )}

        {role === "admin" && (
          <li>
          <Link
            to="/users"
            className={`flex items-center p-2 hover:bg-gray-700 rounded-md transition-colors ${
              location.pathname == "/users" ? "bg-gray-700" : ""
            }`}
          >
            <FontAwesomeIcon icon="fa-solid fa-users-gear" className="mr-2" />
            Users
          </Link>
        </li>
        )}

        <li>
          <Link
            to="/transactions"
            className={`flex items-center p-2 hover:bg-gray-700 rounded-md transition-colors ${
              location.pathname.startsWith('/transactions') ? "bg-gray-700" : ""
            }`}
          >
            <FontAwesomeIcon
              icon="fa-solid fa-basket-shopping"
              className="mr-2"
            />
            Transaction
          </Link>
        </li>
        {/* Tombol Logout */}
        <li>
          <button
            onClick={logout}
            className="flex items-center p-2 w-full text-left  hover:bg-gray-700  text-white rounded-md transition-colors"
          >
            <FontAwesomeIcon
              icon="fa-solid fa-right-from-bracket"
              className="mr-2"
            />
            Logout
          </button>
        </li>
      </ul>
      
    </>
  );
}

export default Sidebar;
