import React, { useState, useEffect } from "react";
import api from "../../api";
import AddProduct from "./AddProduct";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
// import CustomSelectWithSearch from "../../components/CustomSelectWithSearch";

function TransactionCreate() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // Status modal terbuka/tutup

  const [cart, setCart] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");

  const [errors, setErrors] = useState({});
  // const [searchTermCustomer, setSearchTermCustomer] = useState("");

  const fetchCustomers = async () => {
    console.log(" cek ke  : 3");
    try {
      let url = `/customers?size=50&sort=DESC`;
      const response = await api.get(url);

      setCustomers(response.data.payload);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleProductSelected = (product) => {
    console.log("Received from child:", product);

    const existingProduct = cart.find((c) => c.id === product.id);

    if (!existingProduct) {
      console.log("ada barang sama");
      // setCart((prev) => [
      //   ...prev,
      //   { id: discount.product_id, name: discount.product_name },
      // ]);
      setCart((prevCart) => [...prevCart, { ...product, qty: 1 }]);
    } else {
      console.log("barang sudah ada");
      // alert("The product is already in your cart.");

      const showAlert = (message, duration = 3000) => {
        const alertBox = document.createElement("div");
        alertBox.textContent = message;
        alertBox.style.position = "fixed";
        alertBox.style.top = "20px";
        alertBox.style.left = "50%";
        alertBox.style.transform = "translateX(-50%)";
        alertBox.style.background = "#333";
        alertBox.style.color = "#fff";
        alertBox.style.padding = "10px 20px";
        alertBox.style.borderRadius = "5px";
        alertBox.style.zIndex = "1000";
        document.body.appendChild(alertBox);

        setTimeout(() => {
          alertBox.remove();
        }, duration);
      };

      showAlert("The product is already in your cart.");
    }
    // setSelectedProduct(product);
  };

  // Menghapus produk dari keranjang
  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // Mengubah jumlah produk di keranjang
  const updateQuantity = (index, qty) => {
    setCart((prevCart) =>
      prevCart.map((item, i) =>
        i === index ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  // Menyimpan transaksi
  // const handleSubmit = async () => {
  //   try {
  //     console.log(cart);
  //     // const transactionData = { cart };
  //     // await api.post("/transactions", transactionData);
  //     // alert("Transaction successful!");
  //     // setCart([]);
  //   } catch (error) {
  //     console.error("Transaction failed:", error);
  //   }
  // };

  const handleSubmit = async () => {
    console.log(cart);
    const userId = localStorage.getItem("user_id");
    console.log("user_id : " + userId);
    const createTransaction = {
      // ...transaction,
      customer_id: customerId,
      user_id: userId,
      products: cart.map((item) => ({
        product_id: item.id,
        quantity: item.qty,
        discount: item.discount_value,
        price: item.price,
      })),
    };

    try {
      await api.post(`/transactions`, createTransaction);

      setCart([]);
      setCustomerId("");

      setErrors({});
    } catch (error) {
      // alert("Error updating discount.");
      console.log("Error submit " + error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); // Menyimpan error di state

        console.log("Error submit " + error.response.data.errors);
      } else {
        alert("Error updating classification.");
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update setiap 1 detik

    return () => clearInterval(timer); // Cleanup interval saat komponen unmount
  }, []);

  const openModal = () => {
    setIsModalOpen(true); // Buka modal
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false); // Menutup modal
    // setCurrentClassification(null);  // Reset data klasifikasi
  };
  return (
    <>
      <div className="mt-2 mb-2">
        <div className="bg-white rounded-lg shadow-md px-4 py-6">
          {/* <h1 className="text-2xl font-bold mb-4">Create Transaction</h1> */}

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Create Transaction
            </h1>
            <div>
              <button
                className="w-21 bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-500 transition duration-200"
                onClick={() => openModal("create")} // Membuka modal untuk aksi create
              >
                + Product
              </button>
              <button
                className="w-20 bg-gray-200 text-gray-600 ml-2 rounded px-4 py-2 text-sm hover:bg-gray-300 transition duration-200"
                onClick={() => navigate(-1)} // Membuka modal untuk aksi create
              >
                Back
              </button>
            </div>
          </div>

          <div className="flex  ">
            <div className="w-[40%] mr-2 p-4 mb-4 rounded-md border border-gray-300 text-center flex flex-col items-center justify-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Transaction Time
              </h2>
              <p className="text-lg font-semibold text-blue-700">
                {currentTime.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-1xl font-mono text-gray-800">
                {currentTime.toLocaleTimeString("id-ID")}
              </p>
            </div>

            <div className="w-[25%] mx-2 p-4 mb-4 rounded-lg border border-gray-300">
              <div className=" text-gray-800">
                <label className="text-lg font-medium text-gray-700">
                  Customer
                </label>
                <select
                  id="customer"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  // className="border border-gray-300 rounded  px-4 py-2  mt-3 w-full"
                  className={`border border-gray-300 rounded  px-4 py-2  mt-3 w-full ${
                    errors.customer_id ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
                {errors.customer_id && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.customer_id.map((msg, idx) => (
                      <p key={idx}>{msg}</p>
                    ))}
                  </div>
                )}

                {/* <div
                    className="   mt-3 w-full"
                    // className="border border-gray-300 rounded  px-4 py-2  mt-3 w-full"
                  >
                    <CustomSelectWithSearch
                      options={customers}
                      value={customerId} // Set value agar produk yang dipilih tampil
                      onSelect={(selected) => setCustomerId(selected.id)} // Simpan ID produk yang dipilih
                      placeholder="Select Customer"
                      search={searchTermCustomer}
                      setSearch={setSearchTermCustomer}
                      nextCursor={null}
                      loadMore={null}
                      disabled={false} // Disable saat modalAction = "detail"
                    />
                  </div> */}
              </div>
            </div>

            <div className="w-[35%] ml-2 p-4 mb-4 rounded-lg border border-gray-300">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-lg font-medium text-gray-700">
                    Total Amount
                  </label>
                  <label className="text-lg font-semibold text-gray-900 text-right">
                    Rp{" "}
                    {cart
                      .reduce(
                        (total, item) =>
                          total +
                          (item.price -
                            item.price * (item.discount_value / 100)) *
                            item.qty,
                        0
                      )
                      .toLocaleString()}
                  </label>
                </div>

                {/* <div className="flex justify-between items-center">
                  <label className="text-lg font-medium text-gray-700">
                    Discount
                  </label>
                  <label className="text-lg font-semibold text-gray-900 text-right">
                    2.000.000
                  </label>
                </div> */}
              </div>

              {/* className="w-20 bg-gray-200 text-gray-600 ml-2 rounded px-4 py-2 text-sm hover:text-gray-600  bg-gray-300 transition duration-200" */}
              <button
                onClick={handleSubmit}
                disabled={cart.length === 0}
                className={`px-4 py-2 rounded-lg mt-3 w-full transition duration-200  
                            ${
                              cart.length === 0
                                ? "text-gray-600  bg-gray-300 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-500"
                            }
                          `}
              >
                Complete Transaction
              </button>

              {/* {cart.length > 0 && (
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg mt-3 w-full hover:bg-green-500 transition duration-200 shadow"
                >
                  Complete Transaction
                </button>
              )} */}
            </div>
          </div>

          {/* Daftar Keranjang */}
          {/* <div className="p-4  rounded-md border border-gray-300 ">
            <h2 className="text-lg font-bold">Cart</h2>
            {cart.length === 0 && <p>No items in cart.</p>}
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b p-2"
              >
                <span>
                  {item.name} - ${item.price} x
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      updateQuantity(index, Number(e.target.value))
                    }
                    className="w-12 border mx-2"
                  />
                </span>
                <button
                  onClick={() => removeFromCart(index)}
                  // className="bg-red-600 text-white px-2 py-1 rounded"
                  className="w-6 h-6 flex items-center justify-center bg-red-600 text-white rounded hover:bg-red-500 transition duration-200"
                >
                  ✕
                </button>
              </div>
            ))}
          </div> */}

          <div className="border border-gray-300 rounded-lg text-gray-800 px-4 pb-5">
            <div className="max-h-96 overflow-y-auto mt-3">
              <table className="min-w-full bg-white">
                <thead className="sticky top-0 bg-white z-10">
                  <tr>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/12">
                      #
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-2/6">
                      Name
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/12">
                      Disc (%)
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/6">
                      Disc (Rp)
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/6">
                      Normal Price
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/6">
                      Final Price
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/12">
                      Quantity
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/6">
                      Total Price
                    </th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/12">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length > 0 ? (
                    cart.map((item, index) => (
                      // {item.name} - ${item.price} x
                      <tr key={item.id || index}>
                        {/* <tr> */}
                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2 text-left">
                          {item.name}
                        </td>

                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          {item.discount_value !== 0
                            ? item.discount_value + "%"
                            : "-"}
                        </td>

                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          {item.discount_value !== 0 ? (
                            <div className="flex justify-between w-full">
                              <span className="text-left">Rp</span>
                              <span className="text-right">
                                {(
                                  item.price *
                                  (item.discount_value / 100)
                                ).toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          <div className="flex justify-between w-full">
                            <span className="text-left">Rp</span>
                            <span className="text-right">
                              {item.price.toLocaleString()}
                            </span>
                          </div>
                        </td>

                        {/* // harga setelah discount */}
                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          <div className="flex justify-between w-full">
                            <span className="text-left">Rp</span>
                            <span className="text-right">
                              {(
                                item.price -
                                item.price * (item.discount_value / 100)
                              ).toLocaleString()}
                            </span>
                          </div>
                        </td>

                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              updateQuantity(index, Number(e.target.value))
                            }
                            className="w-12 border mx-2 text-center"
                          />
                        </td>

                        {/* // harga total = harga final * qty */}
                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          <div className="flex justify-between w-full">
                            <span className="text-left">Rp</span>
                            <span className="text-right">
                              {(
                                (item.price -
                                  item.price * (item.discount_value / 100)) *
                                item.qty
                              ).toLocaleString()}
                            </span>
                          </div>
                        </td>

                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          <div className="flex justify-center">
                            <button
                              onClick={() => removeFromCart(index)}
                              className="w-6 h-6 flex items-center justify-center bg-red-600 text-white rounded hover:bg-red-500 transition duration-200"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="9"
                        className="border-b border-gray-300 px-4 py-2 text-center"
                      >
                        No Item found / let's add product
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Form */}
          <AddProduct
            isOpen={isModalOpen}
            closeModal={closeModal} // Menutup modal
            onAddProduct={handleProductSelected}
          />
        </div>
      </div>
    </>
  );
}

export default TransactionCreate;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api";

// function TransactionCreate() {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     // Fetch daftar produk
//     const fetchProducts = async () => {
//       try {
//         const response = await api.get("/products");
//         setProducts(response.data.payload);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const addToCart = (product) => {
//     const existingItem = cart.find((item) => item.id === product.id);
//     if (existingItem) {
//       setCart(
//         cart.map((item) =>
//           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
//         )
//       );
//     } else {
//       setCart([...cart, { ...product, quantity: 1 }]);
//     }
//   };

//   const updateQuantity = (id, quantity) => {
//     if (quantity <= 0) {
//       setCart(cart.filter((item) => item.id !== id));
//     } else {
//       setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
//     }
//   };

//   useEffect(() => {
//     const newTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
//     setTotal(newTotal);
//   }, [cart]);

//   const handleSubmit = async () => {
//     try {
//       const payload = { items: cart, total };
//       await api.post("/transactions", payload);
//       navigate("/transactions");
//     } catch (error) {
//       console.error("Error creating transaction:", error);
//     }
//   };

//   return (
//     <div className="mt-2 mb-2 p-4 bg-white rounded-lg shadow-md">
//       <h1 className="text-3xl font-bold text-gray-800">Create Transaction</h1>
//       <div className="grid grid-cols-3 gap-4 mt-4">
//         {/* Produk List */}
//         <div className="col-span-2 bg-gray-100 p-4 rounded">
//           <h2 className="text-lg font-semibold">Select Products</h2>
//           <div className="grid grid-cols-3 gap-4 mt-2">
//             {products.map((product) => (
//               <div
//                 key={product.id}
//                 className="p-2 bg-white shadow-md rounded cursor-pointer"
//                 onClick={() => addToCart(product)}
//               >
//                 <p className="font-semibold">{product.name}</p>
//                 <p className="text-sm text-gray-600">${product.price}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Keranjang */}
//         <div className="bg-white p-4 rounded shadow-md">
//           <h2 className="text-lg font-semibold">Cart</h2>
//           {cart.length === 0 ? (
//             <p className="text-gray-500">Cart is empty</p>
//           ) : (
//             cart.map((item) => (
//               <div key={item.id} className="flex justify-between items-center mt-2">
//                 <p>{item.name}</p>
//                 <div className="flex items-center">
//                   <button
//                     className="bg-red-500 text-white px-2 py-1 rounded"
//                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                   >
//                     -
//                   </button>
//                   <p className="px-4">{item.quantity}</p>
//                   <button
//                     className="bg-green-500 text-white px-2 py-1 rounded"
//                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//           <h3 className="mt-4 font-semibold">Total: ${total}</h3>
//           <button
//             className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
//             onClick={handleSubmit}
//           >
//             Complete Transaction
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TransactionCreate;

// import { useParams } from "react-router-dom";
// import React, { useState, useEffect, useCallback } from "react";
// import api from "../../api";
// import defaultImage from "../../../public/default.png";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// function TransactionCreate() {
//   const { id } = useParams();
//   const baseUrl = "http://localhost:5053/uploads";

//   const navigate = useNavigate();
//   const [errors, setErrors] = useState({});
//   const [name, setName] = useState("");
//   const [category, setCategory] = useState("");
//   const [price, setPrice] = useState("");
//   const [stock, setStock] = useState("");
//   const [mainImage, setMainImage] = useState("");
//   const [categories, setCategories] = useState([]);

//   const [idImage, setIdImage] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Menggabungkan images dan previewImages
//   const [allImages, setAllImages] = useState([]);
//   const [filesToUpload, setFilesToUpload] = useState([]);
//   const [filesToDelete, setFilesToDelete] = useState([]);

//   // Fetch Categories
//   useEffect(() => {
//     setMainImage(defaultImage);
//     const fetchCategory = async () => {
//       try {
//         const response = await api.get("/products/category/list");
//         setCategories(response.data.payload);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategory();
//   }, []);

//   // Fungsi untuk menghapus gambar (baik dari server maupun yang baru diupload)
//   const removeImage = (index) => {
//     const imageToRemove = allImages[index];

//     if (imageToRemove.type === "server") {
//       setFilesToDelete((prev) => [...prev, imageToRemove.file_path]); // Simpan untuk dihapus dari backend
//     } else {
//       setFilesToUpload((prev) => prev.filter((_, i) => i !== index)); // Hapus dari daftar upload
//     }

//     setAllImages((prev) => prev.filter((_, i) => i !== index)); // Hapus dari tampilan
//   };

//   // Fungsi untuk menangani upload gambar baru
//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       const newImages = files.map((file) => ({
//         type: "local",
//         url: URL.createObjectURL(file),
//         file: file,
//       }));

//       setFilesToUpload((prev) => [...prev, ...files]); // Simpan file untuk diupload
//       setAllImages((prev) => [...prev, ...newImages]); // Tampilkan preview di UI
//     }
//   };

//   // Fungsi untuk menyimpan perubahan
//   const handleSubmit = async () => {
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("category", category);
//     formData.append("price", price);
//     formData.append("stock", stock);

//     try {
//       formData.forEach((value, key) => {
//         console.log(key, value);
//       });

//       await api.post("/transactions", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       navigate("/transactions");
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.errors) {
//         setErrors(error.response.data.errors); // Menyimpan error di state
//       } else {
//         alert("An error occurred while create the product.");
//       }
//       console.error("Error create product:", error);
//     }
//   };

//   const handleCancel = () => {
//     navigate(-1); // Kembali ke halaman sebelumnya
//   };

//   const openModal = (imageIdx = null) => {
//     setIdImage(imageIdx); // Tentukan data klasifikasi yang dipilih
//     setIsModalOpen(true); // Buka modal
//   };

//   // Fungsi untuk menutup modal
//   const closeModal = () => {
//     setIsModalOpen(false); // Menutup modal
//     // setCurrentDiscount(null); // Reset data klasifikasi
//   };

//   return (
//     <>
//       <div className="mt-2 mb-2">
//         <div className="bg-white rounded-lg shadow-md px-4 py-6">
//           <h1 className="text-3xl font-bold text-gray-800">Create Product</h1>

//           <div className="">
//             <button
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               onClick={handleSubmit}
//             >
//               Save
//             </button>
//             <button
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mx-4"
//               onClick={handleCancel}
//             >
//               Cancel
//             </button>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

// export default TransactionCreate;
