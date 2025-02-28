import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import api from "../../api";
import Filter from "./Filter";

export default function NotificationIndex() {
  const [notifications, setNotifications] = useState([]);
  const [searchKey, setSearchKey] = useState(""); // Pencarian
  const [currentCursor, setCurrentCursor] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);

  const navigate = useNavigate();

  const fetchNotifications = async (isNewSearch = false) => {
    try {
      let url = "/notifications";
      const sizeData = 5;
      if (!searchKey) url += `/all?size=${sizeData}&sort=DESC`;
      else if (searchKey === "unread") url += `/unread?size=${sizeData}&sort=DESC`;
      else if (searchKey === "has_read") url += `/read?size=${sizeData}&sort=DESC`;
      if (!isNewSearch && nextCursor!=null) url += `&cursor=${nextCursor}`;
  
      const response = await api.get(url);
  
      setNotifications((prev) => {
        if (isNewSearch) return response.data.payload; // Reset jika pencarian baru
  
        const existingIds = new Set(prev.map((notif) => notif.id));
        const newNotifications = response.data.payload.filter((notif) => !existingIds.has(notif.id));
        return [...prev, ...newNotifications];
      });
  
      setNextCursor(response.data.meta.next_cursor);
      // setNextCursor(response.data.meta.next_cursor || null);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  
  useEffect(() => {
    fetchNotifications(true);
  }, [searchKey]); // Setiap `searchKey` berubah, panggil ulang data

  const handleNextCursor = () => {
    if (nextCursor) {
      setCurrentCursor(nextCursor);
      fetchNotifications();
    }
  };

  const handleFilterChange = (newSearchKey) => {
    setSearchKey(newSearchKey);
    console.log("search key  dari filter = ",newSearchKey);
    console.log("search key  dari notif  = ",searchKey);
    // fetchNotifications(true);
  };

  const toDetail = (notification) => {
    if (notification?.table_name === "transactions" && notification.path_id) {
      navigate(`/transactions/detail/${notification.path_id}`);
      readNotifById(notification.id);
    }
  };

  const readNotifById = async (notificationId) => {
    try {
      let url = `/notifications/${notificationId}`;
      await api.get(url);
    } catch (error) {
      console.error("Error read notifications:", error);
    }
  };

  return (
    <div className="mt-2 mb-2">
      <div className="bg-white rounded-lg shadow-md px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
          <button
            className="bg-red-600 text-white rounded px-4 py-2 text-sm hover:bg-red-500 transition"
            onClick={() => navigate(`/transactions/create`)}
          >
            Read All
          </button>
        </div>

        <Filter onFilterChange={handleFilterChange} />

        <div className="border border-gray-300 rounded-lg text-gray-800 px-4 py-4">
          {notifications.length > 0 ? (
            notifications.map((notif,index) => (
              <div
                key={notif.id}
                onClick={() => toDetail(notif)}
                className="p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer transition-all"
              >
                <div className="flex justify-between">
                  <p className="text-sm font-semibold">{index+1} {notif.title}</p>
                  {!notif.has_read && (
                    <p className="text-sm text-white rounded px-1 bg-blue-600">
                      Unread
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
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 p-2">Tidak ada notifikasi</p>
          )}
          {nextCursor && (
            <div
              onClick={handleNextCursor}
              className="p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer transition-all text-center"
            >
              <p className="text-sm font-semibold">Load more</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// import React, { useState, useEffect, useCallback } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import api from "../../api";
// import Filter from "./Filter";
// import { useNavigate } from "react-router-dom";
// import { formatDistanceToNow } from "date-fns";
// import { id } from "date-fns/locale";

// export default function NotificationIndex() {
//   // Hook untuk menyimpan state

//   const [currentCursor, setCurrentCursor] = useState(null);
//   const [nextCursor, setNextCursor] = useState(null);

//   const navigate = useNavigate();
//   const [notifications, setNotifications] = useState([]); // Menyimpan data klasifikasi
//   const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
//   //   const [nextPage, setNextPage] = useState(false); // Status untuk halaman berikutnya
//   //   const [previousPage, setPreviousPage] = useState(false); // Status untuk halaman sebelumnya
//   const [searchKey, setSearchKey] = useState(""); // Kata kunci pencarian

//   // Fungsi untuk mengambil data klasifikasi dari API dengan menggunakan useCallback agar tidak memanggil API berulang kali jika tidak ada perubahan
//   const fetchNotifications = useCallback(
//     async (isNewSearch = false) => {
//       try {
//         // Menyusun URL API dengan query parameters
//         // let url = `/notifications/all?size=2&sort=DESC`;
//         let url = `/notifications`;

//         console.log("cekk 1");
//         if (searchKey === "") {
//           url += `/all?size=2&sort=DESC`;
//           console.log("cekk 2");
//         } else if (searchKey === "unread") {
//           console.log("cekk 3");
//           url += `/unread?size=2&sort=DESC`;
//         } else if (searchKey === "has_read") {
//           console.log("cekk 4");
//           url += `/read?size=2&sort=DESC`;
//         }

//         console.log(
//           "next currentCursor darifetchNotifications = ",
//           currentCursor
//         );
        
//         console.log("cekk 5");
//         if (!isNewSearch && currentCursor) {
//           url += `&cursor=${currentCursor}`;
//           console.log("cekk 6");
//         }

//         const response = await api.get(url); // Melakukan request GET ke API

//         console.log("cekk 7");
//         if (isNewSearch) {
//           setNotifications(response.data.payload); // Reset jika pencarian baru
//           console.log("cekk 8");
//         } else {
//           console.log("cekk 9");
//           setNotifications((prevNotification) => [
//             ...prevNotification,
//             ...response.data.payload,
//           ]);
//         }

//         console.log("cekk 10");
//         setCurrentCursor(response.data.meta.next_cursor);
//         setNextCursor(response.data.meta.next_cursor);
//       } catch (error) {
//         console.error("Error fetching notifications:", error); // Menangani error jika ada masalah saat mengambil data
//       }
//     },
//     // [currentPage, searchKey]
//     []
//   );
//   //   }, [currentPage, searchKey]);

//   const handleNextCursor = () => {
//     console.log("next cursor = ", nextCursor);
//     console.log("next currentCursor = ", currentCursor);
//     if (nextCursor) {
//       setCurrentCursor(nextCursor);
//       fetchNotifications();
//     }
//   };

//   useEffect(() => {
//     fetchNotifications(); // Memanggil fetchNotifications setiap kali ada perubahan
//   }, [fetchNotifications]); // Dependencies: hanya dijalankan jika fetchNotifications berubah

//   const handleFilterChange = (newSearchKey) => {
//     console.log("search key  = ", newSearchKey);
//     fetchNotifications(true);
//     setSearchKey(newSearchKey);
//     // setCurrentPage(1);
//   };

//   const toDetail = (notification) => {
//     console.log("detail  = ", notification);

//     if (notification.table_name === "transactions") {
//       navigate(`/transactions/detail/${notification.path_id}`);
//     }
//     // setShowNotifications(false);
//   };
//   return (
//     <>
//       <div className="mt-2 mb-2">
//         <div className="bg-white rounded-lg shadow-md px-4 py-6">
//           {/* Header dengan tombol Create */}
//           <div className="flex justify-between items-center mb-4">
//             <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
//             <button
//               className="w-22 bg-red-600 text-white rounded px-4 py-2 text-sm hover:bg-red-500 transition duration-200"
//               // onClick={() => openModal("create")} // Membuka modal untuk aksi create
//               onClick={() => navigate(`/transactions/create`)}
//             >
//               Read All
//             </button>
//           </div>

//           {/* Filter untuk pencarian */}
//           <Filter onFilterChange={handleFilterChange} />

//           <div className="border border-gray-300 rounded-lg text-gray-800 px-4 py-4">
//             {notifications.length > 0 ? (
//               notifications.map((notif) => (
//                 // <div key={notif.id} className="p-2 border-b last:border-none">
//                 <div
//                   key={notif.id}
//                   // onClick={() => console.log("notif klik")}
//                   onClick={() => toDetail(notif)}
//                   className="p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer transition-all"
//                 >
//                   <div className="flex justify-between ">
//                     <p className="text-sm font-semibold">{notif.title}</p>
//                     {!notif.has_read && (
//                       <p className="text-sm text-right text-white rounded px-1 bg-blue-600">
//                         Unread
//                       </p>
//                     )}
//                   </div>
//                   <p className="text-sm">{notif.description}</p>
//                   <p className="text-xs text-gray-500">
//                     {formatDistanceToNow(new Date(notif.created_at), {
//                       addSuffix: true,
//                       locale: id,
//                     })}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-gray-500 p-2">Tidak ada notifikasi</p>
//             )}
//             {notifications.length > 0 && (
//               <div
//                 // onClick={loadMore}
//                 onClick={handleNextCursor}
//                 className="p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer transition-all"
//               >
//                 <p className="text-sm font-semibold text-center">Load more</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }











// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { formatDistanceToNow } from "date-fns";
// import { id } from "date-fns/locale";
// import api from "../../api";
// import Filter from "./Filter";

// export default function NotificationIndex() {
//   const navigate = useNavigate();

//   // State
//   const [notifications, setNotifications] = useState([]); // List notifikasi
//   const [currentCursor, setCurrentCursor] = useState(null);
//   const [nextCursor, setNextCursor] = useState(null);
//   const [isLoading, setIsLoading] = useState(false); // Status loading

//   // Fungsi Fetch Notifications
//   const fetchNotifications = useCallback(
//     async (isNewSearch = false) => {
//       if (isLoading) return; // Hindari multiple request

//       setIsLoading(true); // Set loading true

//       try {
//         let url = `/notifications/all?size=3&sort=DESC`;

//         // Jika bukan pencarian baru, tambahkan cursor
//         if (!isNewSearch && currentCursor) {
//           url += `&cursor=${currentCursor}`;
//         }

//         const response = await api.get(url);

//         if (isNewSearch) {
//           setNotifications(response.data.payload);
//         } else {
//           setNotifications((prevNotifications) => [
//             ...prevNotifications,
//             ...response.data.payload.filter(
//               (newNotification) =>
//                 !prevNotifications.some((p) => p.id === newNotification.id)
//             ), // Hindari duplikasi
//           ]);
//         }

//         // Perbarui nextCursor hanya jika ada perubahan
//         if (response.data.meta.next_cursor) {
//           setNextCursor(response.data.meta.next_cursor);
//         } else {
//           setNextCursor(null); // Jika tidak ada halaman berikutnya
//         }
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       } finally {
//         setIsLoading(false); // Set loading false
//       }
//     },
//     [currentCursor, isLoading] // Dependensi diperbaiki
//   );

//   // Load more data berdasarkan cursor
//   const handleNextCursor = () => {
//     if (nextCursor) {
//       setCurrentCursor(nextCursor); // Perbarui cursor sebelum fetch
//       fetchNotifications();
//     }
//   };

//   // Fetch data saat pertama kali load
//   useEffect(() => {
//     fetchNotifications(true);
//   }, []); // Panggil hanya sekali saat komponen dimount

//   // Redirect ke detail berdasarkan tipe notifikasi
//   const toDetail = (notification) => {
//     console.log("detail = ", notification);

//     if (notification.table_name === "transactions") {
//       navigate(`/transactions/detail/${notification.path_id}`);
//     }
//   };

//   return (
//     <div className="mt-2 mb-2">
//       <div className="bg-white rounded-lg shadow-md px-4 py-6">
//         <div className="flex justify-between items-center mb-4">
//           <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
//           <button
//             className="w-22 bg-red-600 text-white rounded px-4 py-2 text-sm hover:bg-red-500 transition duration-200"
//             onClick={() => navigate(`/transactions/create`)}
//           >
//             Read All
//           </button>
//         </div>

//         {/* Filter Pencarian */}
//         <Filter onFilterChange={() => fetchNotifications(true)} />

//         <div className="border border-gray-300 rounded-lg text-gray-800 px-4 py-4">
//           {notifications.length > 0 ? (
//             notifications.map((notif) => (
//               <div
//                 key={notif.id}
//                 onClick={() => toDetail(notif)}
//                 className="p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer transition-all"
//               >
//                 <div className="flex justify-between">
//                   <p className="text-sm font-semibold">{notif.title}</p>
//                   {!notif.has_read && (
//                     <p className="text-sm text-right text-white rounded px-1 bg-blue-600">
//                       Unread
//                     </p>
//                   )}
//                 </div>
//                 <p className="text-sm">{notif.description}</p>
//                 <p className="text-xs text-gray-500">
//                   {formatDistanceToNow(new Date(notif.created_at), {
//                     addSuffix: true,
//                     locale: id,
//                   })}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p className="text-sm text-gray-500 p-2">Tidak ada notifikasi</p>
//           )}

// {nextCursor && (
//             <div
//               onClick={handleNextCursor}
//               className="p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer transition-all text-center"
//             >
//               <p className="text-sm font-semibold">Load more</p>
//             </div>
//           )}

//           {/* Tombol Load More */}
//           {/* {nextCursor && !isLoading && (
//             <div
//               onClick={handleNextCursor}
//               className="p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer transition-all text-center"
//             >
//               <p className="text-sm font-semibold">Load more</p>
//             </div>
//           )} */}

//           {/* Indikator Loading */}
//           {/* {isLoading && (
//             <p className="text-sm text-gray-500 text-center p-2">Loading...</p>
//           )} */}
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect, useCallback } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import api from "../../api";
// import Filter from "./Filter";
// import { useNavigate } from "react-router-dom";
// import { formatDistanceToNow } from "date-fns";
// import { id } from "date-fns/locale";

// export default function NotificationIndex() {
//   // Hook untuk menyimpan state

//   const [currentCursor, setCurrentCursor] = useState(null);
//   const [nextCursor, setNextCursor] = useState(null);

//   const navigate = useNavigate();
//   const [notifications, setNotifications] = useState([]); // Menyimpan data klasifikasi
//   const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
// //   const [nextPage, setNextPage] = useState(false); // Status untuk halaman berikutnya
// //   const [previousPage, setPreviousPage] = useState(false); // Status untuk halaman sebelumnya
//   const [searchKey, setSearchKey] = useState(""); // Kata kunci pencarian

//   // Fungsi untuk mengambil data klasifikasi dari API dengan menggunakan useCallback agar tidak memanggil API berulang kali jika tidak ada perubahan
//   const fetchNotifications = useCallback(async (isNewSearch = false) => {
//     try {
//       // Menyusun URL API dengan query parameters
//       let url = `/notifications/all?size=2&sort=DESC`;
//     //   let url = `/notifications/all?size=${pageSize}&sort=DESC`;

//       // Jika ada kata kunci pencarian, tambahkan ke URL sebagai filter
//     //   if (searchKey !== "") {
//     //     url += `&filter=${encodeURIComponent(searchKey)}`;
//     //   }

//     if (!isNewSearch && currentCursor) {
//       url += `&cursor=${currentCursor}`;
//     }

//     const response = await api.get(url); // Melakukan request GET ke API

//       if (isNewSearch) {
//         setNotifications(response.data.payload); // Reset jika pencarian baru
//       } else {
//         setNotifications((prevNotifications) => [
//           ...prevNotifications,
//           ...response.data.payload.filter(
//             (newNotification) => !prevNotifications.some((p) => p.id === newNotification.id)
//           ), // Hindari duplikasi
//         ]);
//       }

//       setCurrentCursor(response.data.meta.next_cursor);
//       setNextCursor(response.data.meta.next_cursor);
//     } catch (error) {
//       console.error("Error fetching notifications:", error); // Menangani error jika ada masalah saat mengambil data
//     }
//   }, [currentPage]);
// //   }, [currentPage, searchKey]);

//  const handleNextCursor = () => {
//     if (nextCursor) {
//       setCurrentCursor(nextCursor);
//       fetchNotifications();
//     }
//   };

//   useEffect(() => {
//     fetchNotifications(); // Memanggil fetchNotifications setiap kali ada perubahan
//   }, [fetchNotifications]); // Dependencies: hanya dijalankan jika fetchNotifications berubah

//   const handleFilterChange = (newSearchKey) => {
//     console.log("search key  = ",newSearchKey);
//     // setSearchKey(newSearchKey);
//     // setCurrentPage(1);
//   };

//   // Fungsi untuk menangani perubahan halaman sebelumnya
//   const handlePrevious = () => {
//     if (previousPage) setCurrentPage(currentPage - 1); // Jika ada halaman sebelumnya, pindah ke halaman sebelumnya
//   };

//   // Fungsi untuk menangani perubahan halaman berikutnya
//   const handleNext = () => {
//     if (nextPage) setCurrentPage(currentPage + 1); // Jika ada halaman berikutnya, pindah ke halaman berikutnya
//   };

//   const toDetail = (notification) => {
//     console.log("detail  = ",notification);

//     if(notification.table_name === "transactions"){

//       navigate(`/transactions/detail/${notification.path_id}`)
//     }
//     // setShowNotifications(false);
//   };
//   return (
//     <>
//       <div className="mt-2 mb-2">
//         <div className="bg-white rounded-lg shadow-md px-4 py-6">
//           {/* Header dengan tombol Create */}
//           <div className="flex justify-between items-center mb-4">
//             <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
//             <button
//               className="w-22 bg-red-600 text-white rounded px-4 py-2 text-sm hover:bg-red-500 transition duration-200"
//               // onClick={() => openModal("create")} // Membuka modal untuk aksi create
//               onClick={() => navigate(`/transactions/create`)}
//             >
//               Read All
//             </button>

//           </div>

//           {/* Filter untuk pencarian */}
//           <Filter onFilterChange={handleFilterChange} />

//           <div className="border border-gray-300 rounded-lg text-gray-800 px-4 py-4">
//             {notifications.length > 0 ? (
//               notifications.map((notif) => (
//                 // <div key={notif.id} className="p-2 border-b last:border-none">
//                 <div
//                   key={notif.id}
//                   // onClick={() => console.log("notif klik")}
//                   onClick={() => toDetail(notif)}
//                   className="p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer transition-all"
//                 >
//                   <div className="flex justify-between ">
//                     <p className="text-sm font-semibold">{notif.title}</p>
//                     {!notif.has_read && (
//                       <p className="text-sm text-right text-white rounded px-1 bg-blue-600">
//                         Unread
//                       </p>
//                     )}
//                   </div>
//                   <p className="text-sm">{notif.description}</p>
//                   <p className="text-xs text-gray-500">
//                     {formatDistanceToNow(new Date(notif.created_at), {
//                       addSuffix: true,
//                       locale: id,
//                     })}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-sm text-gray-500 p-2">Tidak ada notifikasi</p>
//             )}
//             {notifications.length > 0 && (
//               <div
//                   // onClick={loadMore}
//                   onClick={handleNextCursor}

//                 className="p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer transition-all"
//               >
//                 <p className="text-sm font-semibold text-center">Load more</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
