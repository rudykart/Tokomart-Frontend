import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../api";
import Filter from "./Filter";
import { useNavigate } from "react-router-dom";

export default function TransactionIndex() {
  // Hook untuk menyimpan state

  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0); 
  const [totalData, setTotalData] = useState(0); 
  const [nextPage, setNextPage] = useState(false);
  const [previousPage, setPreviousPage] = useState(false); 
  const [searchKey, setSearchKey] = useState(""); 

  const fetchProducts = useCallback(async () => {
    try {
      // Menyusun URL API dengan query parameters
      let url = `/transactions?size=${pageSize}&page=${currentPage}&sort=DESC`;

      // Jika ada kata kunci pencarian, tambahkan ke URL sebagai filter
      if (searchKey !== "") {
        url += `&filter=${encodeURIComponent(searchKey)}`;
      }

      const response = await api.get(url);
      setTransactions(response.data.payload);
      setTotalPages(response.data.meta.total_pages); 
      setTotalData(response.data.meta.total_data);
      setNextPage(response.data.meta.next_page); 
      setPreviousPage(response.data.meta.previous_page);
      setCurrentPage(response.data.meta.current_page); 
      setCurrentPage(response.data.meta.current_page);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [currentPage, pageSize, searchKey]); 

  useEffect(() => {
    fetchProducts(); 
  }, [fetchProducts]);

  // Fungsi untuk menangani perubahan kata kunci pencarian
  const handleFilterChange = (newSearchKey) => {
    setSearchKey(newSearchKey);
    setCurrentPage(1); // Mengatur halaman kembali ke 1 setiap kali pencarian berubah
  };

  // Fungsi untuk menangani perubahan halaman sebelumnya
  const handlePrevious = () => {
    if (previousPage) setCurrentPage(currentPage - 1); 
  };

  // Fungsi untuk menangani perubahan halaman berikutnya
  const handleNext = () => {
    if (nextPage) setCurrentPage(currentPage + 1); 
  };


  return (
    <>
      <div className="mt-2 mb-2">
        <div className="bg-white rounded-lg shadow-md px-4 py-6">
          {/* Header dengan tombol Create */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Transaction</h1>
            <button
              className="w-20 bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-500 transition duration-200"
              // onClick={() => openModal("create")} // Membuka modal untuk aksi create
              onClick={() => navigate(`/transactions/create`)}
            >
              Create
            </button>
          </div>

          {/* Filter untuk pencarian */}
          <Filter onFilterChange={handleFilterChange} />

          <div className="border border-gray-300 rounded-lg text-gray-800 px-4 py-6">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/12">
                    #
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-1/4">
                    Trasaction Date
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-1/8">
                    Customer
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-1/8">
                  Cashier
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/10">
                    Total Item
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/6">
                    Total Amount
                  </th>
                  <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => {
                    const number = (currentPage - 1) * pageSize + index + 1;
                    return (
                      <tr key={transaction.transaction_id}>
                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          {number}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2 text-left">
                          {new Date(transaction.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2 text-left">
                          {transaction.customer_name}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2 text-left">
                          {transaction.user_name}
                        </td>
                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          {transaction.total_item_purchased}
                        </td>

                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          {transaction.total_amount !== 0 ? (
                            <div className="flex justify-between w-full">
                              <span className="text-left">Rp</span>
                              <span className="text-right">
                                {(transaction.total_amount).toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="border-b border-gray-300 px-4 py-2 text-center">
                          {/* Tombol aksi: Detail, Edit, Delete */}
                          <button
                            className="bg-blue-600 text-white px-1 rounded mr-2 hover:bg-blue-700 transition duration-200"
                            // onClick={() => openModal("detail", transaction)} // Menampilkan detail
                          onClick={() => navigate(`/transactions/detail/${transaction.transaction_id}`)} 
                          >
                            <FontAwesomeIcon icon="fas fa-info-circle" />
                          </button>


                          {/* <button
                            className="bg-green-500 text-white px-1 rounded mr-2 hover:bg-green-600 transition duration-200"
                            onClick={() => openModal("edit", transaction)} // Menampilkan form edit
                          >
                            <FontAwesomeIcon icon="fas fa-edit" />
                          </button>
                          <button
                            className="bg-red-600 text-white px-1 rounded hover:bg-red-700 transition duration-200"
                            onClick={() => openModal("delete", transaction)} // Menampilkan konfirmasi delete
                          >
                            <FontAwesomeIcon icon="fas fa-trash-alt" />
                          </button> */}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="border-b border-gray-300 px-4 py-2 text-center"
                    >
                      No transactions found
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
                  onChange={(e) => setPageSize(e.target.value)} // Mengubah jumlah data per halaman
                  className="border rounded px-2 py-1 w-14"
                >
                  <option value="5">5</option>
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
          {/* <ModalForm
            isOpen={isModalOpen}
            modalAction={modalAction}
            product={currentProduct}
            closeModal={closeModal} // Menutup modal
            reloadClassifications={fetchProducts} // Memuat ulang data klasifikasi setelah aksi selesai
          /> */}
        </div>
      </div>
    </>
  );
}
