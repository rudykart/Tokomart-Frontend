import { Routes, Route } from "react-router-dom";
import Home from "../views/home.jsx";
import ClassificationIndex from "../views/classification/ClassificationIndex.jsx";
import CustomerIndex from "../views/customer/CustomerIndex.jsx";

import ProductIndex from "../views/product/ProductIndex.jsx";
import ProductCreate from "../views/product/ProductCreate.jsx";
import ProductEdit  from "../views/product/ProductEdit.jsx";
import ProductDetail  from "../views/product/ProductDetail.jsx";

import TransactionIndex from "../views/transaction/TransactionIndex.jsx";
import TransactionCreate from "../views/transaction/TransactionCreate.jsx";
import TransactionDetail from "../views/transaction/TransactionDetail.jsx";

import NotificationIndex from "../views/notification/NotificationIndex.jsx";

import UserIndex from "../views/user/UserIndex.jsx";

import DiscountIndex from "../views/discount/DiscountIndex";
import Login from "../views/auth/Login.jsx";
import Register from "../views/auth/Register.jsx";

// Import tiga jenis proteksi route
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";

function RoutesIndex() {
  return (
    <Routes>
      {/* Halaman Utama (Terbuka untuk semua pengguna) */}
      <Route path="/" element={<Home />} />

      {/* Halaman yang memerlukan login */}
      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <CustomerIndex />
          </PrivateRoute>
        }
      />

      <Route
        path="/products"
        element={
          <PrivateRoute>
            <ProductIndex />
          </PrivateRoute>
        }
      />
      <Route
        path="/products/create"
        element={
          <PrivateRoute>
            <ProductCreate />
          </PrivateRoute>
        }
      />
      <Route
        path="/products/edit/:id"
        element={
          <PrivateRoute>
            <ProductEdit />
          </PrivateRoute>
        }
      />
      <Route
        path="/products/:id"
        element={
          <PrivateRoute>
            <ProductDetail />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/transactions"
        element={
          <RoleBasedRoute allowedRoles={["admin","user"]}>
            <TransactionIndex />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/transactions/create"
        element={
          <RoleBasedRoute allowedRoles={["admin","user"]}>
            <TransactionCreate />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/transactions/detail/:id"
        element={
          <RoleBasedRoute allowedRoles={["admin","user"]}>
            <TransactionDetail />
          </RoleBasedRoute>
        }
      />

      {/* Halaman yang membutuhkan role admin */}
      <Route
        path="/classifications"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <ClassificationIndex />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/discounts"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <DiscountIndex />
          </RoleBasedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <UserIndex />
          </RoleBasedRoute>
        }
      />

      
<Route
        path="/notifications"
        element={
          <RoleBasedRoute allowedRoles={["admin"]}>
            <NotificationIndex />
          </RoleBasedRoute>
        }
      />

      {/* Halaman Login & Register (Hanya bisa diakses jika belum login) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
    </Routes>
  );
}

export default RoutesIndex;


// import { Routes, Route } from "react-router-dom";
// import Home from "../views/home.jsx";
// import ClassificationIndex from "../views/classification/ClassificationIndex.jsx";
// import CustomerIndex from "../views/customer/CustomerIndex.jsx";
// import ProductIndex from "../views/product/ProductIndex.jsx";
// import DiscountIndex from "../views/dsicount/DiscountIndex";
// import Login from "../views/auth/Login.jsx";
// import Register from "../views/auth/Register.jsx";
// import ProtectedRoute from "./ProtectedRoute.jsx"; // Import proteksi rute

// function RoutesIndex() {
//   return (
//     <Routes>
//       {/* Halaman Utama (Terbuka untuk semua pengguna) */}
//       <Route path="/" element={<Home />} />

//       {/* Halaman yang memerlukan autentikasi */}
//       <Route
//         path="/classifications"
//         element={
//           <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
//             <ClassificationIndex />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/customers"
//         element={
//           <ProtectedRoute requireAuth={true}>
//             <CustomerIndex />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/products"
//         element={
//           <ProtectedRoute requireAuth={true}>
//             <ProductIndex />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/discounts"
//         element={
//           <ProtectedRoute requireAuth={true} allowedRoles={["admin"]}>
//             <DiscountIndex />
//           </ProtectedRoute>
//         }
//       />

//       {/* Halaman Login & Register (Hanya bisa diakses jika belum login) */}
//       <Route
//         path="/login"
//         element={
//           <ProtectedRoute requireAuth={false}>
//             <Login />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/register"
//         element={
//           <ProtectedRoute requireAuth={false}>
//             <Register />
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// }

// export default RoutesIndex;



// import { Routes, Route } from "react-router-dom";
// import Home from "../views/home";
// import ClassificationIndex from "../views/classification/ClassificationIndex";
// import CustomerIndex from "../views/customer/CustomerIndex";
// import ProductIndex from "../views/product/ProductIndex";
// import Login from "../views/auth/Login";
// import Register from "../views/auth/Register";
// import DiscountIndex from "../views/dsicount/DiscountIndex";
// import ProtectedRoute from "./ProtectedRoute"; // Import proteksi rute

// function RoutesIndex() {
//   return (
//     <Routes>
//       {/* Halaman Utama (Bisa diakses semua orang) */}
//       <Route path="/" element={<Home />} />

//       {/* Halaman yang memerlukan login */}
//       <Route
//         path="/classifications"
//         element={
//           <ProtectedRoute requireAuth allowedRoles={["admin"]}>
//             <ClassificationIndex />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/customers"
//         element={
//           <ProtectedRoute requireAuth>
//             <CustomerIndex />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/products"
//         element={
//           <ProtectedRoute requireAuth>
//             <ProductIndex />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/discounts"
//         element={
//           <ProtectedRoute requireAuth allowedRoles={["admin"]}>
//             <DiscountIndex />
//           </ProtectedRoute>
//         }
//       />

//       {/* Halaman Login & Register yang hanya bisa diakses jika belum login */}
//       <Route
//         path="/login"
//         element={
//           <ProtectedRoute requireAuth={false}>
//             <Login />
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/register"
//         element={
//           <ProtectedRoute requireAuth={false}>
//             <Register />
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// }

// export default RoutesIndex;




















// //import react router dom
// import { Routes, Route } from "react-router-dom";

// //import view homepage
// import Home from '../views/home.jsx';

// //import view
// import ClassificationIndex from '../views/classification/ClassificationIndex.jsx';
// import CustomerIndex from '../views/customer/CustomerIndex.jsx';
// import ProductIndex from '../views/product/ProductIndex.jsx';
// import Login from '../views/auth/Login.jsx';
// import Register from '../views/auth/Register.jsx';


// function RoutesIndex() {
//     return (
//         <Routes>

//             {/* route "/" */}
//             <Route path="/" element={<Home />} />

//             {/* route "/posts" */}
//             <Route path="/classifications" element={<ClassificationIndex />} />
//             <Route path="/customers" element={<CustomerIndex />} />
//             <Route path="/products" element={<ProductIndex />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//         </Routes>
//     )
// }

// export default RoutesIndex