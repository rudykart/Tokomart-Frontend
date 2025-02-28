import { useParams } from "react-router-dom";
import React, { useState, useEffect,useCallback } from "react";
import api from "../../api";
import defaultImage from "../../../public/default.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SetMainImage from "./SetMainImage";

function ProductEdit() {
  const { id } = useParams();
  const baseUrl = "http://localhost:5053/uploads/";

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [categories, setCategories] = useState([]);

  const [idImage, setIdImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Menggabungkan images dan previewImages
  const [allImages, setAllImages] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [filesToDelete, setFilesToDelete] = useState([]);

  // Fetch Data Product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        const product = response.data.payload;

        setName(product.name);
        setCategory(product.category);
        setPrice(product.price);
        setStock(product.stock);
        setMainImage(
          product.main_image ? baseUrl + product.main_image : defaultImage
        );
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchAttachments = async () => {
      try {
        const response = await api.get(`/attachments/${id}/products`);
        const attachments = response.data.payload;

        // Gabungkan ke allImages dengan tipe "server"
        setAllImages(
          attachments.map((img) => ({
            type: "server",
            url: baseUrl + img.file_name,
            file_path: img.file_path,
          }))
        );
      } catch (error) {
        console.error("Error fetching attachments:", error);
      }
    };

    fetchProduct();
    fetchAttachments();
  }, [id]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get("/products/category/list");
        setCategories(response.data.payload);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategory();
  }, []);

  // Fungsi untuk menghapus gambar (baik dari server maupun yang baru diupload)
  const removeImage = (index) => {
    const imageToRemove = allImages[index];

    if (imageToRemove.type === "server") {
      setFilesToDelete((prev) => [...prev, imageToRemove.file_path]); // Simpan untuk dihapus dari backend
    } else {
      setFilesToUpload((prev) => prev.filter((_, i) => i !== index)); // Hapus dari daftar upload
    }

    setAllImages((prev) => prev.filter((_, i) => i !== index)); // Hapus dari tampilan
  };

  // Fungsi untuk menangani upload gambar baru
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => ({
        type: "local",
        url: URL.createObjectURL(file),
        file: file,
      }));

      setFilesToUpload((prev) => [...prev, ...files]); // Simpan file untuk diupload
      setAllImages((prev) => [...prev, ...newImages]); // Tampilkan preview di UI
    }
  };

  // Fungsi untuk menyimpan perubahan
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", Number(price) || 0);
    formData.append("stock", Number(stock) || 0);

    if (idImage !== null) {
      // formData.append("index_main_image",Number(idImage));
      // setMainImage(idImage !== null ? idImage.toString() : "");
      formData.append("index_main_image", idImage);
      // formData.append("index_main_image", idImage !== null ? idImage.toString() : "");
    }

    // Tambahkan file yang akan diupload
    filesToUpload.forEach((file) => {
      formData.append("files", file);
    });

    // Tambahkan file yang akan dihapus
    if (filesToDelete.length > 0) {
      // formData.append("delete_file_paths", JSON.stringify(filesToDelete));
      formData.append("delete_file_paths",filesToDelete);
    }

    try {
      console.log("Submitting product update:", formData);
      const response = await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("Product updated successfully!");
        setFilesToUpload([]);
        setFilesToDelete([]);
      }
      
      navigate("/products");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); 
      } else {
        alert("An error occurred while updating the product.");
      }
      console.error("Error updating product:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  const openModal = (imageIdx = null) => {
    setIdImage(imageIdx); // Tentukan data klasifikasi yang dipilih
    setIsModalOpen(true); // Buka modal
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false); // Menutup modal
    // setCurrentDiscount(null); // Reset data klasifikasi
  };

  const reloadMainImage = useCallback(async () => {
    
    console.log("index all image :", idImage);

    const indexImage = idImage
    const newMainImage = allImages[indexImage];

    
    console.log("newMainImage :", newMainImage);
    setMainImage(newMainImage.url);

    // if (imageToRemove.type === "server") {
    //   setFilesToDelete((prev) => [...prev, imageToRemove.file_path]); // Simpan untuk dihapus dari backend
    // } else {
    //   setFilesToUpload((prev) => prev.filter((_, i) => i !== index)); // Hapus dari daftar upload
    // }

    // setAllImages((prev) => prev.filter((_, i) => i !== index)); // Hapus dari tampilan
  }, [idImage]);
  return (
    <>
      <div className="mt-2 mb-2">
        <div className="bg-white rounded-lg shadow-md px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>

          {/* Form Edit Produk */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <img
                src={mainImage}
                alt={name}
                className="w-full aspect-[4/3] object-cover my-2 rounded-md border border-gray-300"
              />
            </div>

            <div>
              <div className="mb-4 flex items-start">
                <label
                  htmlFor="discountValue"
                  className="text-md text-gray-700 w-20"
                >
                  Name
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`border rounded px-2 py-1 w-full ${
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
                </div>
              </div>

              <div className="mb-4 flex items-start">
                <label
                  htmlFor="Category"
                  className="text-md text-gray-700 w-20"
                >
                  Category
                </label>
                <div className="flex-1">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`border rounded px-2 py-1 w-full ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.category.map((msg, idx) => (
                        <p key={idx}>{msg}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-start">
                <label
                  htmlFor="discountValue"
                  className="text-md text-gray-700 w-20"
                >
                  price
                </label>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`border rounded px-2 py-1 w-full ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.price && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.price.map((msg, idx) => (
                        <p key={idx}>{msg}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-start">
                <label
                  htmlFor="discountValue"
                  className="text-md text-gray-700 w-20"
                >
                  Stock
                </label>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className={`border rounded px-2 py-1 w-full ${
                      errors.stock ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.stock && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.stock.map((msg, idx) => (
                        <p key={idx}>{msg}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Upload Gambar Baru */}
          <div className="mt-4">
            <div className="mt-8 mb-6">
              {/* <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"> */}
              <label className="w-20 bg-gray-200 text-gray-600 rounded px-4 py-2 text-sm hover:bg-gray-300 transition duration-200">
                Upload File
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            {/* Daftar Gambar */}
            <div className="grid grid-cols-3 gap-5 mt-2 mb-4">
              {allImages.map((img, idx) => (
                <div key={idx} className="relative  pb-3">
                  <img
                    src={img.url}
                    alt={`preview-${idx}`}
                    className="w-full aspect-[4/3] object-cover rounded-md border border-gray-300"
                  />
                  <button
                    className="absolute top-0 left-0 bg-gray-500 hover:bg-gray-700 text-white rounded px-1"
                    // onClick={() => mainImage(idx)}
                    onClick={() => openModal(idx)}
                  >
                    <FontAwesomeIcon icon="fa-solid fa-gear" />
                  </button>
                  <button
                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-700 text-white rounded px-1"
                    onClick={() => removeImage(idx)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mx-4"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          <SetMainImage
            isOpen={isModalOpen}
            closeModal={closeModal}
            idImage={idImage}
            reloadMainImage={reloadMainImage}
          />
        </div>
      </div>
    </>
  );
}

export default ProductEdit;










// import { useParams } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import api from "../../api";
// import defaultImage from "../../../public/default.png";

// function ProductEdit() {
//   const { id } = useParams();
//   const baseUrl = "http://localhost:5053/uploads/";

//   const [errors, setErrors] = useState({});
//   const [name, setName] = useState("");
//   // const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [price, setPrice] = useState("");
//   const [stock, setStock] = useState("");
//   const [mainImage, setMainImage] = useState("");
//   const [images, setImages] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [previewImages, setPreviewImages] = useState([]); // State untuk preview gambar
//   const [filesToUpload, setFilesToUpload] = useState([]); // State untuk file yang akan diupload
//   const [filesToDelete, setFilesToDelete] = useState([]); // State untuk file yang akan dihapus

//   // Fetch Data Product by ID
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await api.get(/products/${id});
//         const product = response.data.payload;

//         // Set State dengan data produk yang diambil
//         setName(product.name);
//         // setDescription(product.description);
//         setCategory(product.category);
//         setPrice(product.price);
//         setStock(product.stock);
//         if (product.main_image == null || product.main_image == "") {
//           setMainImage(defaultImage);
//         } else {
//           setMainImage(baseUrl + product.main_image);
//         }

//         console.log(" product:", product);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       }
//     };

//     const fetchAttachment = async () => {
//       try {
//         const response = await api.get(/attachments/${id}/products);
//         const attachments = response.data.payload;
//         setImages(attachments || []);
//         console.log(" attachments :", attachments);
//       } catch (error) {
//         console.error("Error fetching attachments:", error);
//       }
//     };

//     fetchProduct();
//     fetchAttachment();
//   }, [id]);

//   // Fetch Categories
//   useEffect(() => {
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

//   // Fungsi untuk menghapus gambar
//   const removeImage = async (index) => {
//     const imageToRemove = images[index];
//     // setFilesToDelete((prevFiles) => [...prevFiles, imageToRemove.file_name]); // Tambahkan file yang akan dihapus
//     setFilesToDelete((prevFiles) => [...prevFiles, imageToRemove.file_path]); // Tambahkan file yang akan dihapus
//     setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Hapus dari daftar gambar
//   };

//   // Fungsi untuk menangani upload gambar baru
//   const handleImageUpload = (e) => {
//     const files = e.target.files;
//     if (files.length > 0) {
//       const fileList = Array.from(files);
//       setFilesToUpload((prevFiles) => [...prevFiles, ...fileList]); // Tambahkan file yang akan diupload

//       // Buat preview gambar
//       const previewUrls = fileList.map((file) => URL.createObjectURL(file));
//       setPreviewImages((prevPreviews) => [...prevPreviews, ...previewUrls]);
//     }
//   };

//   // Fungsi untuk menyimpan perubahan
//   const handleSubmit = async () => {
    
//     const formData = new FormData();
//     formData.append("name", name);
//     // formData.append("description", description);
//     formData.append("category", category); // Pastikan ini benar (id atau name)
//     formData.append("price", Number(price) || 0); // Konversi ke angka
//     formData.append("stock", Number(stock) || 0); // Konversi ke angka

//     // Tambahkan file yang akan diupload
//     filesToUpload.forEach((file) => {
//       formData.append("files", file);
//     });

//     // Tambahkan file yang akan dihapus
//     if (filesToDelete.length > 0) {
//       // formData.append("delete_file_paths", JSON.stringify(filesToDelete));
//       formData.append("delete_file_paths", filesToDelete);
//     }

//     try {
      
//       console.log("updating product:", formData);
//       console.log("isi delete dile :", filesToDelete);
//       const response = await api.put(/products/${id}, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.status === 200) {
//         alert("Product updated successfully!");
//         // Reset state setelah berhasil update
//         setFilesToUpload([]);
//         setFilesToDelete([]);
//         setPreviewImages([]);
//       }
//     } catch (error) {
//       console.error("Error updating product:", error);
//       alert("An error occurred while updating the product.");
//     }
//   };

//   return (
//     <>
//       <div className="mt-2 mb-2">
//         <div className="bg-white rounded-lg shadow-md px-4 py-6">
//           {/* Header dengan tombol Create */}
//           <div className="flex justify-between items-center mb-4">
//             <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
//           </div>

//           {/* Gambar Utama */}
//           <img
//             src={mainImage}
//             alt={name}
//             className="w-full h-40 object-cover my-2 rounded-md border border-gray-300"
//           />

//           {/* Daftar Gambar */}
//           <div className="grid grid-cols-3 gap-2 mt-2">
//             {images.map((img, idx) => (
//               <div key={idx} className="relative px-3 pb-3">
//                 <img
//                   src={baseUrl + img["file_name"]}
//                   alt={preview-${idx}}
//                   className="w-full h-24 object-cover border-2 border-gray-300 rounded"
//                 />
//                 <button
//                   className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
//                   onClick={() => removeImage(idx)}
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Preview Gambar Baru */}
//           <div className="grid grid-cols-3 gap-2 mt-2">
//             {previewImages.map((preview, idx) => (
//               <div key={idx} className="relative px-3 pb-3">
//                 <img
//                   src={preview}
//                   alt={preview-${idx}}
//                   className="w-full h-24 object-cover border-2 border-gray-300 rounded"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Tombol Upload Gambar Baru */}
//           <div className="mt-4">
//             <input
//               type="file"
//               multiple
//               onChange={handleImageUpload}
//               className="w-full px-2 py-1 border rounded"
//             />
//           </div>

//           {/* Form Edit Produk */}
//           <div className="grid grid-cols-2 gap-4 mt-4">
//             <div>
//               <label className="block mb-2">Name</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className={w-full px-2 py-1 border rounded ${
//                   errors.name ? "border-red-500" : "border-gray-300"
//                 }}
//               />
//               {errors.name && <p className="text-red-500">{errors.name}</p>}
//             </div>

//             <div>
//               <label className="block mb-2">Price</label>
//               <input
//                 type="number"
//                 min="0"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 className={w-full px-2 py-1 border rounded ${
//                   errors.price ? "border-red-500" : "border-gray-300"
//                 }}
//               />
//               {errors.price && <p className="text-red-500">{errors.price}</p>}
//             </div>

//             <div>
//               <label className="block mb-2">Stock</label>
//               <input
//                 type="number"
//                 min="0"
//                 value={stock}
//                 onChange={(e) => setStock(e.target.value)}
//                 className={w-full px-2 py-1 border rounded ${
//                   errors.stock ? "border-red-500" : "border-gray-300"
//                 }}
//               />
//               {errors.stock && <p className="text-red-500">{errors.stock}</p>}
//             </div>

//             <div>
//               <label className="block mb-2">Category</label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="w-full px-2 py-1 border rounded"
//               >
//                 <option value="">Select Category</option>
//                 {categories.map((kategori) => (
//                   <option key={kategori.id} value={kategori.id}>
//                     {kategori.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Tombol Submit */}
//           <div className="mt-4">
//             <button
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
//               onClick={handleSubmit}
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ProductEdit;