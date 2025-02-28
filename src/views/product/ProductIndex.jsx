
import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import api from "../../api"; 
import ModalForm from "./Form";
import Filter from "./Filter"; 
import defaultImage from "../../../public/default.png";
import { useNavigate } from "react-router-dom";

export default function ProductIndex() {
  // Hook untuk menyimpan state
  const baseUrl = "http://localhost:5053/uploads/";

  const navigate = useNavigate();
  const [products, setProducts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [pageSize, setPageSize] = useState(10); 
  const [totalPages, setTotalPages] = useState(0); 
  const [totalData, setTotalData] = useState(0); 
  const [nextPage, setNextPage] = useState(false); 
  const [previousPage, setPreviousPage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [currentProduct, setCurrentClassification] = useState(null); 
  const [searchKey, setSearchKey] = useState(""); 

  const fetchProducts = useCallback(async () => {
    try {
      // Menyusun URL API dengan query parameters
      let url = `/products?size=${pageSize}&page=${currentPage}&sort=DESC`;

      // Jika ada kata kunci pencarian, tambahkan ke URL sebagai filter
      if (searchKey !== "") {
        url += `&filter=${encodeURIComponent(searchKey)}`;
      }

      const response = await api.get(url); 
      setProducts(response.data.payload); 
      setTotalPages(response.data.meta.total_pages);
      setTotalData(response.data.meta.total_data);
      setNextPage(response.data.meta.next_page); 
      setPreviousPage(response.data.meta.previous_page);
      setCurrentPage(response.data.meta.current_page);
      setCurrentPage(response.data.meta.current_page);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [currentPage, pageSize, searchKey]); // Ketergantungan: hanya akan dijalankan jika currentPage, pageSize, atau searchKey berubah

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); 

  const handleFilterChange = (newSearchKey) => {
    setSearchKey(newSearchKey);
    setCurrentPage(1); 
  };

  // Fungsi untuk menangani perubahan halaman sebelumnya
  const handlePrevious = () => {
    if (previousPage) setCurrentPage(currentPage - 1);
  };

  // Fungsi untuk menangani perubahan halaman berikutnya
  const handleNext = () => {
    if (nextPage) setCurrentPage(currentPage + 1);
  };

  // Fungsi untuk membuka modal (untuk create, edit, detail, delete)
  const openModal = (action, product = null) => {
    setModalAction(action); 
    setCurrentClassification(product);
    setIsModalOpen(true); 
  };

  const closeModal = () => {
    setIsModalOpen(false); 
    setCurrentClassification(null); 
  };

  return (
    <>
      <div className="mt-2 mb-2">
        <div className="bg-white rounded-lg shadow-md px-4 py-6">
          {/* Header dengan tombol Create */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Product</h1>
            <button
              className="w-20 bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-500 transition duration-200"
              // onClick={() => openModal("create")} // Membuka modal untuk aksi create
              onClick={() => navigate(`/products/create`)}
            >
              Create
            </button>
          </div>

          {/* Filter untuk pencarian */}
          <Filter onFilterChange={handleFilterChange} />

          {/* <img
            src={defaultImage}
            alt="asa"
            // className="w-40 h-40 object-cover rounded-md"
            className="w-40 h-40  rounded-md"
          /> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.length > 0 ? (
              products.map((product, index) => {
                const id = (currentPage - 1) * pageSize + index + 1;
                const imageUrl = product.main_image
                  ? `${baseUrl}${product.main_image}`
                  : defaultImage;
                // const imageUrl = product.main_image ? `${api.get("/upload/"+product.main_image)}` : defaultImage;

                // const imageUrl = product.main_image ? product.main_image : "../../assets/default";

                return (
                  <div
                    key={product.id}
                    className="bg-white shadow-md rounded-lg p-4 border border-gray-300 "
                  >
                    <h3 className="text-lg font-semibold">{product.name}</h3>

                    {/* Gambar Produk */}

                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover my-2 rounded-md border border-gray-300 "
                    />

                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <label>Stock: {product.stock}</label>
                      <label>Rp. {product.price}</label>
                    </div>

                    <p className="text-gray-600 text-sm">
                      Category: {product.category_name}
                    </p>
                    {/* <p className="text-gray-600 text-sm">
                      image name : {imageUrl}
                    </p> */}

                    {/* Tombol aksi */}
                    <div className="mt-4 flex space-x-2">

                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200"
                        onClick={() => navigate(`/products/${product.id}`)} // ➜ Detail
                      >
                        <FontAwesomeIcon icon="fas fa-info-circle" />
                      </button>

                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => navigate(`/products/edit/${product.id}`)} // ➜ Edit
                      >
                        <FontAwesomeIcon icon="fas fa-edit" />
                      </button>

                      {/* <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200"
                        onClick={() => openModal("detail", product)}
                      >
                        <FontAwesomeIcon icon="fas fa-info-circle" />
                      </button>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200"
                        onClick={() => openModal("edit", product)}
                      >
                        <FontAwesomeIcon icon="fas fa-edit" />
                      </button> */}
                      
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition duration-200"
                        onClick={() => openModal("delete", product)}
                      >
                        <FontAwesomeIcon icon="fas fa-trash-alt" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No products found
              </div>
            )}
          </div>

          {/* Navigasi Pagination */}
          <div className="border border-gray-300 rounded-lg text-gray-800 px-4 py-6 mt-3">
            <div className=" flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Show{" "}
                <select
                  id="tableName"
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)} // Mengubah jumlah data per halaman
                  className="border rounded px-2 py-1 w-14"
                >
                  <option value="2">2</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>{" "}
                data from {totalData} total data | Total Pages {totalPages}
              </span>

              {/* Navigasi untuk halaman sebelumnya, halaman berikutnya, dan halaman tengah */}
              <div>
                <nav aria-label="Page navigation example">
                  <ul className="pagination justify-content-center flex items-center space-x-2">
                    {/* Tombol halaman sebelumnya */}
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <button
                        className={`bg-gray-300 text-gray-700 rounded px-3 py-1 mr-2 hover:bg-gray-400 transition duration-200`}
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                      >
                        <FontAwesomeIcon
                          icon="fa-solid fa-angles-left"
                          className="text-gray-800"
                        />
                      </button>
                    </li>

                    {(() => {
                      const pageNumbers = [];
                      let startPage, endPage;

                      const pageView = ({ number }) => {
                        return (
                          <li key={i} className="page-item">
                            <button
                              className={`rounded py-1 mr-2 text-gray-800 ${
                                currentPage === i
                                  ? "bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-200 px-3 font-semibold"
                                  : ""
                              }`}
                              onClick={() => setCurrentPage(number)}
                            >
                              {i}
                            </button>
                          </li>
                        );
                      };

                      // Case 1: Halaman pertama
                      if (currentPage === 1) {
                        if (totalPages <= 5) {
                          startPage = 1;
                          endPage = totalPages;
                        } else {
                          startPage = 1;
                          endPage = 5;
                        }
                      }
                      // Case 2: Halaman terakhir
                      else if (currentPage === totalPages) {
                        if (totalPages <= 5) {
                          startPage = 1;
                          endPage = totalPages;
                        } else {
                          startPage = totalPages - 4;
                          endPage = totalPages;
                        }
                      }
                      // Case 3: Halaman tengah (di antara halaman pertama dan terakhir)
                      else {
                        if (totalPages <= 5) {
                          startPage = 1;
                          endPage = totalPages;
                        } else {
                          startPage = Math.max(currentPage - 2, 1); // Tidak kurang dari halaman 1
                          endPage = Math.min(currentPage + 2, totalPages); // Tidak lebih dari totalPages
                        }
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pageNumbers.push(
                          <li key={i} className="page-item">
                            <button
                              className={`rounded py-1 mr-2 text-gray-800 ${
                                currentPage === i
                                  ? "bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-200 px-3 font-semibold"
                                  : ""
                              }`}
                              onClick={() => setCurrentPage(i)}
                            >
                              {i}
                            </button>
                          </li>
                        );
                      }

                      return pageNumbers;
                    })()}

                    {/* Tombol halaman berikutnya */}
                    <li
                      className={`page-item ${
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <button
                        className={`bg-gray-300 text-gray-700 rounded px-3 py-1 mr-2 hover:bg-gray-400 transition duration-200`}
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                      >
                        <FontAwesomeIcon
                          icon="fa-solid fa-angles-right"
                          className="text-gray-800"
                        />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          {/* Modal Form */}
          <ModalForm
            isOpen={isModalOpen}
            modalAction={modalAction}
            product={currentProduct}
            closeModal={closeModal} // Menutup modal
            reloadClassifications={fetchProducts} // Memuat ulang data klasifikasi setelah aksi selesai
          />
        </div>
      </div>
    </>
  );
}
