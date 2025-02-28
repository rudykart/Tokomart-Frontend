import { useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import api from "../../api";
import defaultImage from "../../../public/default.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SetMainImage from "./SetMainImage";

function ProductCreate() {
  const { id } = useParams();
  const baseUrl = "http://localhost:5053/uploads";

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

  // Fetch Categories
  useEffect(() => {
    setMainImage(defaultImage);
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
    formData.append("price", price);
    formData.append("stock", stock);
    // formData.append("price", Number(price) || 0);
    // formData.append("stock", Number(stock) || 0);

    // Tambahkan file yang akan diupload
    filesToUpload.forEach((file) => {
      formData.append("files", file);
    });

    if (idImage !== null) {
      // formData.append("index_main_image",Number(idImage));
      // setMainImage(idImage !== null ? idImage.toString() : "");
      formData.append("index_main_image", idImage);
      // formData.append("index_main_image", idImage !== null ? idImage.toString() : "");
    }

    try {
      console.log("Submitting product mainImage:", mainImage);
      console.log("Submitting product idImage:", idImage);
      console.log("Submitting product submit:", formData);
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // console.log("response : ", response);
      // if (response.status === 200) {
      //   alert("Product updated successfully!");
      //   setFilesToUpload([]);
      //   setFilesToDelete([]);
      // }
      navigate("/products");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); // Menyimpan error di state
      } else {
        alert("An error occurred while create the product.");
      }
      console.error("Error create product:", error);
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
    if(idImage!=null){

      console.log("index all image :", idImage);

      const indexImage = idImage;
      const newMainImage = allImages[indexImage];
  
      console.log("newMainImage :", newMainImage);
      setMainImage(newMainImage.url);
    }

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
          <h1 className="text-3xl font-bold text-gray-800">Create Product</h1>

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
              Save
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mx-4"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>


          {/* {allImages.length !=0 && ( */}
            <SetMainImage
            isOpen={isModalOpen}
            closeModal={closeModal}
            idImage={idImage}
            reloadMainImage={reloadMainImage}
          />
          {/* )} */}

          
        </div>
      </div>
    </>
  );
}

export default ProductCreate;
