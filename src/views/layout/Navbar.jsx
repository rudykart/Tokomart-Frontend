import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import api from "../../api";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale"; // Gunakan lokal Indonesia jika perlu
import { useNavigate } from "react-router-dom";

function Navbar({ toggleSidebar }) {
  
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [countNotification, setCountNotification] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Data dummy untuk notifikasi
  // const notifications = [
  //   { id: 1, message: "Pesanan baru telah masuk", time: "2 menit yang lalu" },
  //   { id: 2, message: "Barang stok rendah", time: "10 menit yang lalu" },
  //   { id: 3, message: "Promo baru tersedia", time: "1 jam yang lalu" },
  // ];

  const fetchNotification = async () => {
    console.log("tess notiff");
    try {
      // const response = await api.get(`/notifications/${id}`);
      const response = await api.get(`/notifications/unread?size=5`);
      const notificationList = response.data.payload;

      setNotifications(notificationList);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchCountNotification = async () => {
    console.log("tess notiff count");
    try {
      // const response = await api.get(`/notifications/${id}`);
      const response = await api.get(`/notifications/count-all-unread`);

      console.log("isi count = ",response.data.payload);
      setCountNotification(response.data.payload.count_data);
    } catch (error) {
      console.error("Error fetching count:", error);
    }
  };

  const loadMore = () => {
    setShowNotifications(false);
    navigate(`/notifications`)
  };

  const toDetail = (notification) => {
    console.log("detail  = ",notification);

    if(notification.table_name === "transactions"){
      
      navigate(`/transactions/detail/${notification.path_id}`)
    }
    setShowNotifications(false);
    readNotifById(notification.id);
    fetchNotification();
    fetchCountNotification();
  };

  
  const readNotifById = async (notificationId) => {
    try {
      let url = `/notifications/${notificationId}`;
      await api.get(url);
    } catch (error) {
      console.error("Error read notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotification();
    fetchCountNotification();
  }, []);

  // Event listener untuk menutup dropdown saat klik di luar elemen notifikasi
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    // Tambahkan event listener saat dropdown aktif
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // Hapus event listener saat komponen di-unmount atau dropdown tertutup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <div className="bg-white text-gray-800 fixed top-0 left-0 w-full p-3 flex items-center justify-between shadow-md z-50">
      {/* Sidebar Toggle */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="bg-gray-300 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-md transition-all"
        >
          <FontAwesomeIcon icon={faBars} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-semibold">Tokomart</h1>
      </div>

      {/* Notifikasi & User */}
      <div className="flex items-center space-x-4 px-2 relative">
        {/* Notifikasi */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="bg-gray-300 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full transition-all relative"
          >
            <FontAwesomeIcon icon={faBell} className="text-gray-800" />
            {countNotification > 0 && (
              <span
                className={`absolute bottom-4 right-5 bg-red-600 text-white text-xs font-bold flex items-center justify-center rounded-full
                ${
                  countNotification < 10
                    ? "w-4 h-4" // Untuk angka 1-9, ukuran tetap kecil
                    : countNotification < 100
                    ? "w-5 h-5" // Untuk angka 10-99, ukuran diperbesar
                    : "w-6 h-6" // Untuk angka 100 ke atas, ukuran lebih besar
                }
              `}
              >
                {countNotification}
              </span>
            )}
          </button>

          {/* Dropdown Notifikasi */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-2 border border-gray-300 ">
              <h3 className="text-base font-medium border-b pb-2">
                Notifikasi
              </h3>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  // <div key={notif.id} className="p-2 border-b last:border-none">
                  <div
                    key={notif.id}
                    // onClick={() => console.log("notif klik")}
                    onClick={() => toDetail(notif)}
                    className="p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer transition-all"
                  >
                    <div className="flex justify-between ">
                      <p className="text-sm font-semibold">{notif.title}</p>
                      {!notif.has_read && (
                        <p className="text-sm text-right text-white rounded px-1 bg-blue-600">
                          New
                        </p>
                      )}
                    </div>
                    <p className="text-sm">{notif.description}</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notif.created_at), {
                        addSuffix: true,
                        locale: id,
                      })}
                    </p>
                    {/* <p className="text-xs text-gray-500">{notif.created_at}</p> */}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 p-2">
                  Tidak ada notifikasi
                </p>
              )}

              {notifications.length > 0 && (
              //   <button
              //   className="w-20 bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-500 transition duration-200"
              //   onClick={() => navigate(`/transactions/create`)}
              // >
              //   Create
              // </button>
                <div 
                // onClick={() => console.log("notif klik")}
                onClick={loadMore}
                 className="p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer transition-all">
                  <p className="text-sm font-semibold text-center">Load more</p>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="bg-gray-300 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full transition-all"
        >
          <FontAwesomeIcon icon="fa-solid fa-user" className="text-gray-800" />
        </button>
      </div>
    </div>
  );
}

export default Navbar;

// src/views/layout/Navbar.jsx
// import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";

// function Navbar({ toggleSidebar }) {
//   const [showNotifications, setShowNotifications] = useState(false);

//   // Data dummy untuk notifikasi
//   const notifications = [
//     { id: 1, message: "Pesanan baru telah masuk", time: "2 menit yang lalu" },
//     { id: 2, message: "Barang stok rendah", time: "10 menit yang lalu" },
//     { id: 3, message: "Promo baru tersedia", time: "1 jam yang lalu" },
//   ];

//   return (
//     <div className="bg-white text-gray-800 fixed top-0 left-0 w-full p-3 flex items-center justify-between shadow-md z-50">
//       {/* Sidebar Toggle */}
//       <div className="flex items-center space-x-4">
//         <button
//           onClick={toggleSidebar}
//           className="bg-gray-300 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-md transition-all"
//         >
//           <FontAwesomeIcon icon={faBars} className="text-gray-800" />
//         </button>
//         <h1 className="text-xl font-semibold">Tokomart</h1>
//       </div>

//       {/* Notifikasi & User */}
//       <div className="flex items-center space-x-4 px-2 relative">
//         {/* Notifikasi */}
//         <div className="relative">
//           <button
//             onClick={() => setShowNotifications(!showNotifications)}
//             className="bg-gray-300 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full transition-all relative"
//           >
//             <FontAwesomeIcon icon={faBell} className="text-gray-800" />
//             {notifications.length > 0 && (
//               <span className="absolute bottom-4 right-5 bg-red-600 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
//                 {notifications.length}
//               </span>
//             )}
//           </button>

//           {/* Dropdown Notifikasi */}
//           {showNotifications && (
//             <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 border border-gray-300 ">
//               <h3 className="text-sm font-semibold border-b pb-2">
//                 Notification
//               </h3>
//               {notifications.length > 0 ? (
//                 notifications.map((notif) => (
//                   <div key={notif.id} className="p-2 border-b last:border-none">
//                     <p className="text-sm">{notif.message}</p>
//                     <p className="text-xs text-gray-500">{notif.time}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-gray-500 p-2">
//                   Notification is Null
//                 </p>
//               )}
//             </div>
//           )}
//         </div>

//         <button
//           onClick={toggleSidebar}
//           className="bg-gray-300 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full transition-all"
//         >
//           <FontAwesomeIcon icon="fa-solid fa-user" className="text-gray-800" />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Navbar;

// // src/views/layout/Navbar.jsx
// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// function Navbar({ toggleSidebar }) {
//   return (
//     <div className="bg-white text-gray-800 fixed top-0 left-0 w-full p-2 flex items-center justify-between shadow-md z-50">
//       <div className="flex items-center space-x-4">
//         <button
//           onClick={toggleSidebar}
//           className="bg-gray-300 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-md transition-all"
//         >
//           <FontAwesomeIcon
//             icon="fa-solid fa-bars"
//             className="text-gray-800"
//           />
//         </button>
//         <h1 className="text-xl font-semibold">Tokomart</h1>
//       </div>

//       <div className="flex items-center space-x-4 px-2">

//         <div className="flex items-center space-x-4">
//           <button
//           // ini button notifikasi
//             onClick={toggleSidebar}
//             className="bg-gray-300 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full transition-all"
//           >
//             <FontAwesomeIcon icon="fa-solid fa-user" className="text-gray-800" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Navbar;
