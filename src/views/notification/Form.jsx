import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../../api";

const ModalForm = (props) => {
  const { isOpen, modalAction, product, closeModal, reloadClassifications } =
    props;

  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (modalAction === "edit" && product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setPrice(product.price || "");
      setStock(product.stock || "");
      setImages([]); // Reset images untuk edit
    } else if (modalAction === "create") {
      resetForm();
    }
  }, [modalAction, product]);

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

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setStock("");
    setImages([]);
    setErrors({});
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category); // Pastikan ini benar (id atau name)
    formData.append("price", Number(price) || 0); // Konversi ke angka
    formData.append("stock", Number(stock) || 0); // Konversi ke angka

    // images.forEach((image, index) => formData.append(`files[${index}]`, image));
    images.forEach((image, index) => formData.append("files", image));

    try {
      let response;
      if (modalAction === "edit") {
        console.error("isi data :", formData);

        // response = await api.put(`/products/${product.id}`, formData, {
        //   headers: { "Content-Type": "multipart/form-data" },
        // });
        // alert("Product updated successfully!");
      } else if (modalAction === "create") {
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });

        response = await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // alert("Product created successfully!");
      }

      // Pastikan respons API berhasil sebelum mereset form
      if (response?.status === 200 || response?.status === 201) {
        resetForm();
        closeModal();
        reloadClassifications();
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      const errorMessages = error.response?.data?.errors || {
        message: "An error occurred.",
      };
      setErrors(errorMessages);

      // Menampilkan pesan error jika ada
      if (errorMessages.message) {
        alert(errorMessages.message);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/products/${product.id}`);
      alert("Product deleted successfully!");
      handleCancel();
      reloadClassifications(); 
    } catch (error) {
      alert("Error deleting product.");
    }
  };
  const handleCancel = () => {
    resetForm();
    closeModal();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-1/2">
          <h2 className="text-2xl font-semibold mb-4 capitalize">
            {modalAction} Product
          </h2>

          <div>
              <p>Are you sure you want to delete this product {product.name}?</p>
            </div>
          {/* <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-2 py-1 border rounded ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block mb-2">Price</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full px-2 py-1 border rounded ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && <p className="text-red-500">{errors.price}</p>}
            </div>

            <div>
              <label className="block mb-2">Stock</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={`w-full px-2 py-1 border rounded ${
                  errors.stock ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.stock && <p className="text-red-500">{errors.stock}</p>}
            </div>

            <div>
              <label className="block mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2 py-1 border rounded"
              >
                <option value="">Select Category</option>
                {categories.map((kategori) => (
                  <option key={kategori.id} value={kategori.id}>
                    {kategori.name}
                  </option>
                ))}
              </select>
            </div>
          </div> */}

          {/* <div>
            <label className="block mb-2">Images</label>
            <div className="border rounded">
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="w-full px-2 py-1 mt-2"
              />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative px-3 pb-3">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`preview-${idx}`}
                      className="w-full h-24 object-cover border-2 border-gray-300 rounded" // Menambahkan border di sini
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      onClick={() => removeImage(idx)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              </div>
              </div> */}

          <div className="flex justify-between mt-6"><button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
          {/* 
              <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleSubmit}
            >
              {modalAction === "edit" ? "Save Changes" : "Create"}
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
             */}
        </div>
      </div>
    )
  );
};

ModalForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalAction: PropTypes.oneOf(["create", "edit", "detail", "delete"]),
  product: PropTypes.object,
  closeModal: PropTypes.func.isRequired,
  reloadClassifications: PropTypes.func.isRequired,
};

export default ModalForm;
