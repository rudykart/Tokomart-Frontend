import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Mengimpor ikon dari FontAwesome
import api from "../../api"; // Mengimpor API untuk mengambil data
import ModalForm from "./Form"; // Mengimpor komponen ModalForm untuk Create, Edit, Delete
import Filter from "./Filter"; // Mengimpor komponen Filter untuk pencarian

export default function ProductIndex() {
  // Hook untuk menyimpan state
  const [products, setProducts] = useState([]);  // Menyimpan data klasifikasi
  const [currentPage, setCurrentPage] = useState(1);  // Halaman saat ini
  const [pageSize, setPageSize] = useState(10);  // Jumlah item per halaman
  const [totalPages, setTotalPages] = useState(0);  // Total halaman
  const [totalData, setTotalData] = useState(0);  // Total Data
  const [nextPage, setNextPage] = useState(false);  // Status untuk halaman berikutnya
  const [previousPage, setPreviousPage] = useState(false);  // Status untuk halaman sebelumnya
  const [isModalOpen, setIsModalOpen] = useState(false);  // Status modal terbuka/tutup
  const [modalAction, setModalAction] = useState(null);  // Menyimpan aksi modal (create, edit, delete, detail)
  const [currentProduct, setCurrentClassification] = useState(null);  // Menyimpan klasifikasi yang dipilih
  const [searchKey, setSearchKey] = useState("");  // Kata kunci pencarian

  // Fungsi untuk mengambil data klasifikasi dari API dengan menggunakan useCallback agar tidak memanggil API berulang kali jika tidak ada perubahan
  const fetchProducts = useCallback(async () => {
    try {
      let url = `/products/${pageSize}/${currentPage}/DESC`;  // URL API dengan pagination dan sorting

      // Jika ada kata kunci pencarian, tambahkan ke URL
      if (searchKey !== "") {
        url += `/${searchKey}`;
      }

      const response = await api.get(url);  // Melakukan request GET ke API
      setProducts(response.data.payload);  // Menyimpan data klasifikasi
      setTotalPages(response.data.meta.total_pages);  // Menyimpan jumlah total halaman
      setTotalData(response.data.meta.total_data);  // Menyimpan jumlah total data
      setNextPage(response.data.meta.next_page);  // Menyimpan status halaman berikutnya
      setPreviousPage(response.data.meta.previous_page);  // Menyimpan status halaman sebelumnya
      setCurrentPage(response.data.meta.current_page);  // Menyimpan halaman saat ini
      setCurrentPage(response.data.meta.current_page);  // Menyimpan halaman saat ini
    } catch (error) {
      console.error("Error fetching products:", error);  // Menangani error jika ada masalah saat mengambil data
    }
  }, [currentPage, pageSize, searchKey]);  // Ketergantungan: hanya akan dijalankan jika currentPage, pageSize, atau searchKey berubah

  // Mengambil data klasifikasi ketika komponen dimuat atau state yang terkait berubah
  useEffect(() => {
    fetchProducts();  // Memanggil fetchProducts setiap kali ada perubahan
  }, [fetchProducts]);  // Dependencies: hanya dijalankan jika fetchProducts berubah

  // Fungsi untuk menangani perubahan kata kunci pencarian
  const handleFilterChange = (newSearchKey) => {
    setSearchKey(newSearchKey);  // Menyimpan kata kunci pencarian
    setCurrentPage(1);  // Mengatur halaman kembali ke 1 setiap kali pencarian berubah
  };

  // Fungsi untuk menangani perubahan halaman sebelumnya
  const handlePrevious = () => {
    if (previousPage) setCurrentPage(currentPage - 1);  // Jika ada halaman sebelumnya, pindah ke halaman sebelumnya
  };

  // Fungsi untuk menangani perubahan halaman berikutnya
  const handleNext = () => {
    if (nextPage) setCurrentPage(currentPage + 1);  // Jika ada halaman berikutnya, pindah ke halaman berikutnya
  };

  // Fungsi untuk membuka modal (untuk create, edit, detail, delete)
  const openModal = (action, product = null) => {
    setModalAction(action);  // Tentukan aksi yang akan dilakukan pada modal
    setCurrentClassification(product);  // Tentukan data klasifikasi yang dipilih
    setIsModalOpen(true);  // Buka modal
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);  // Menutup modal
    setCurrentClassification(null);  // Reset data klasifikasi
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
            onClick={() => openModal("create")}  // Membuka modal untuk aksi create
          >
            Create
          </button>
        </div>

        {/* Filter untuk pencarian */}
        <Filter onFilterChange={handleFilterChange} />

        {/* Tabel klasifikasi */}
        <div className="border border-gray-300 rounded-lg text-gray-800 px-4 py-6">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-[100px]">#</th>
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-1/4">Name</th>
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-1/6" >Stock</th>
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-1/6">Price</th>
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-1/5">Category</th>
                {/* <th className="border-b-2 border-gray-300 px-4 py-2 text-left  w-1/2">Actions</th> */}
                <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-[400px]" style={{ width: "2000px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => {
                  const id = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr key={product.id}>
                      <td className="border-b border-gray-300 px-4 py-2 text-left">{id}</td>
                      <td className="border-b border-gray-300 px-4 py-2 text-left">{product.name}</td>
                      <td className="border-b border-gray-300 px-4 py-2 text-left">{product.stock}</td>
                      <td className="border-b border-gray-300 px-4 py-2 text-left">{product.price}</td>
                      <td className="border-b border-gray-300 px-4 py-2 text-left">{product.category_name}</td>
                      <td className="border-b border-gray-300 px-4 py-2 text-left">
                        {/* Tombol aksi: Detail, Edit, Delete */}
                        <button
                          className="bg-blue-600 text-white px-1 rounded mr-2 hover:bg-blue-700 transition duration-200"
                          onClick={() => openModal("detail", product)}  // Menampilkan detail
                        >
                          <FontAwesomeIcon icon="fas fa-info-circle" />
                        </button>
                        <button
                          className="bg-green-500 text-white px-1 rounded mr-2 hover:bg-green-600 transition duration-200"
                          onClick={() => openModal("edit", product)}  // Menampilkan form edit
                        >
                          <FontAwesomeIcon icon="fas fa-edit" />
                        </button>
                        <button
                          className="bg-red-600 text-white px-1 rounded hover:bg-red-700 transition duration-200"
                          onClick={() => openModal("delete", product)}  // Menampilkan konfirmasi delete
                        >
                          <FontAwesomeIcon icon="fas fa-trash-alt" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="border-b border-gray-300 px-4 py-2 text-center">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Navigasi Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Show{" "}
              <select
                id="tableName"
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}  // Mengubah jumlah data per halaman
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
                  <li className={`page-item ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <button
                      className={`bg-gray-300 text-gray-700 rounded px-3 py-1 mr-2 hover:bg-gray-400 transition duration-200`}
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                    >
                      <FontAwesomeIcon icon="fa-solid fa-angles-left" className="text-gray-800" />
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
                  <li className={`page-item ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <button
                      className={`bg-gray-300 text-gray-700 rounded px-3 py-1 mr-2 hover:bg-gray-400 transition duration-200`}
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                    >
                      <FontAwesomeIcon icon="fa-solid fa-angles-right" className="text-gray-800" />
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
          closeModal={closeModal}  // Menutup modal
          reloadClassifications={fetchProducts}  // Memuat ulang data klasifikasi setelah aksi selesai
        />
      </div>
    </div>
    </>
  );
}
