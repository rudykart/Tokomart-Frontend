import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import api from "../../api";
import defaultImage from "../../../public/default.png";
import { useNavigate } from "react-router-dom";

function ProductDetail() {
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

    // Tambahkan file yang akan diupload
    filesToUpload.forEach((file) => {
      formData.append("files", file);
    });

    // Tambahkan file yang akan dihapus
    if (filesToDelete.length > 0) {
      formData.append("delete_file_paths", JSON.stringify(filesToDelete));
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
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    }
  };

  const handleCancel = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };
  return (
    <>
      <div className="mt-2 mb-2">
        <div className="bg-white rounded-lg shadow-md px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Detail Product</h1>

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
                    disabled
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-2 py-1 border rounded"
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
                    disabled
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2 py-1 border rounded"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
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
                  htmlFor="discountValue"
                  className="text-md text-gray-700 w-20"
                >
                  price
                </label>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    disabled
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-2 py-1 border rounded"
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
                  htmlFor="discountValue"
                  className="text-md text-gray-700 w-20"
                >
                  Stock
                </label>
                <div className="flex-1">
                  <input
                    type="number"
                    min="0"
                    disabled
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-2 py-1 border rounded"
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
            </div>
          </div>

          {/* Upload Gambar Baru */}
          <div className="mt-4">
          </div>

          <div>
            {/* Daftar Gambar */}
            <div className="grid grid-cols-3 gap-5 mt-2 mb-4">
              {allImages.map((img, idx) => (
                <div key={idx} className="relative  pb-3">
                  <img
                    src={img.url}
                    alt={`preview-${idx}`}
                    className="w-full aspect-[4/3] object-cover   rounded-md border border-gray-300"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 "
              onClick={handleCancel}
            >
              Cancel 
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
