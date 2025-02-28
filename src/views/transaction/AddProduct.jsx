import React, { useState, useEffect } from "react";
import api from "../../api";

export default function AddProduct({ isOpen, closeModal, onAddProduct }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  const [currentCursor, setCurrentCursor] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);

  useEffect(() => {
    fetchProduct(true); // Saat searchQuery berubah, lakukan fetch ulang dengan reset data
  }, [searchQuery]);

  const fetchProduct = async (isNewSearch = false) => {
    try {
      let url = `/products/transaction?size=5&sort=DESC`;
      if (searchQuery !== "") {
        const searchKey = `name=${encodeURIComponent(searchQuery)}`;
        url += `&filter=${searchKey}`;
      }
  
      if (!isNewSearch && currentCursor) {
        url += `&cursor=${currentCursor}`;
      }
  
      const response = await api.get(url);
  
      if (isNewSearch) {
        setProducts(response.data.payload); // Reset jika pencarian baru
      } else {
        setProducts((prevProducts) => [
          ...prevProducts,
          ...response.data.payload.filter(
            (newProduct) => !prevProducts.some((p) => p.id === newProduct.id)
          ), // Hindari duplikasi
        ]);
      }
  
      setCurrentCursor(response.data.meta.next_cursor); // Perbarui currentCursor setelah response diterima
      setNextCursor(response.data.meta.next_cursor);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  

  const handleSearch = () => {
    setCurrentCursor(null);
    setNextCursor(null);
    setSearchQuery(searchTerm);
    // fetchProduct(true); // Reset produk saat pencarian baru
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchQuery("");
    // setProducts([]);
    setCurrentCursor(null);
    setNextCursor(null);
    // handleSearch();
  };

  const handleCancelButton = () => {
    closeModal();
  };

  const handleNextCursor = () => {
    if (nextCursor) {
      setCurrentCursor(nextCursor);
      fetchProduct();
    }
  };

  const handleAddProduct = (product) => {
    onAddProduct(product);
    closeModal();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg sm:w-1/2 md:w-2/8 xl:w-2/8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Add Product</h1>
            <button
              className="w-6 h-6 flex items-center justify-center bg-red-600 text-white rounded hover:bg-red-500 transition duration-200"
              onClick={handleCancelButton}
            >
              ✕
            </button>
          </div>

          <div className="mb-4 w-full flex flex-row items-center space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-full"
              placeholder="Search..."
            />
            <button
              onClick={handleSearch}
              className="w-20 bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-500 transition duration-200"
            >
              Search
            </button>
            <button
              onClick={clearSearch}
              className="w-20 bg-gray-200 text-gray-600 rounded px-4 py-2 text-sm hover:bg-gray-300 transition duration-200"
            >
              Clear
            </button>
          </div>

          <div className="border border-gray-300 rounded-lg text-gray-800 px-4 pb-5">
            <div className="max-h-96 overflow-y-auto mt-3">
              <table className="min-w-full bg-white">
                <thead className="sticky top-0 bg-white z-10">
                  <tr>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-center w-1/4">#</th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-1/4">Name</th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-1/4">Category</th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-1/6">Stock</th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-1/6">Price</th>
                    <th className="border-b-2 border-gray-300 px-4 py-2 text-left w-1/6">Discount</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product, index) => (
                      <tr
                        key={product.id}
                        onClick={() => handleAddProduct(product)}
                        className="hover:bg-gray-200 hover:px-4 hover:rounded-xl hover:shadow-md transition-all duration-300 ease-in-out"
                      >
                        <td className="border-b border-gray-300 px-4 py-2 text-center">{index+1}</td>
                        <td className="border-b border-gray-300 px-4 py-2 text-left">{product.name}</td>
                        <td className="border-b border-gray-300 px-4 py-2 text-left">{product.category_name}</td>
                        <td className="border-b border-gray-300 px-4 py-2 text-right">{product.stock}</td>
                        <td className="border-b border-gray-300 px-4 py-2 text-right">{product.price}</td>
                        <td className="border-b border-gray-300 px-4 py-2 text-center">{product.discount_value !== 0 ? product.discount_value + "%" : "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="border-b border-gray-300 px-4 py-2 text-center">
                        No products found / let's find product
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {nextCursor && (
                <button
                  onClick={handleNextCursor}
                  className="block mx-auto mt-5 bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-500 transition duration-200"
                >
                  Load More
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
