import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../api";

function Filter({ onFilterChange }) {  // Tambahkan prop onFilterChange

  const [searchName, setSearchName] = useState("");  // State untuk search
  const [category, setCategory] = useState(""); 
  // const [tableName, setTableName] = useState("");    // State untuk filter Table Name
  // const [fieldName, setFieldName] = useState("");    // State untuk filter Field Name
  const [categories, setCategories] = useState([]);
  // const [tables, setTables] = useState([]);          // Data tabel
  // const [fields, setFields] = useState([]);          // Data field berdasarkan tabel
  const [isFilterVisible, setIsFilterVisible] = useState(false);  // Visibilitas filter

  // Fetch data tabel
  // useEffect(() => {
  //   const fetchTables = async () => {
  //     try {
  //       const response = await api.get("/tableconstants/tables");
  //       setTables(response.data.payload);
  //     } catch (error) {
  //       console.error("Error fetching tables", error);
  //     }
  //   };

  //   fetchTables();
  // }, []);

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

  // Membuat searchKey berdasarkan input user
  const searchKey = useMemo(() => {
    const keyParts = [];
    
    console.log("E categorie:", category);
    if (searchName) keyParts.push(`name=${searchName}`);
    if (category) keyParts.push(`category=${category}`);
    
    // if (tableName) keyParts.push(`table_name=${tableName}`);
    // if (fieldName) keyParts.push(`field_name=${fieldName}`);
    return keyParts.join("&");
  }, [searchName, category]);

  
  // Memanggil onFilterChange untuk mengirimkan searchKey ke parent
  const onFilterChangeOnClick = () => {
    onFilterChange(searchKey);
  };

  // Fungsi toggle untuk menampilkan filter
  const toggleFilter = () => setIsFilterVisible(!isFilterVisible);

  // Fungsi untuk menangani pencarian
  const handleSearch = (e) => setSearchName(e.target.value);

  // Fungsi untuk menangani perubahan tabel
  const handleTableChange = (e) => {
    setCategory(e.target.value);
    // setFieldName("");  // Reset fieldName ketika tableName berubah
  };

  // Fungsi untuk menangani perubahan field
  const handleFieldChange = (e) => setFieldName(e.target.value);

  return (
    <>
      <div>
        <div className="mb-4 w-full flex flex-row items-center space-x-2">
          <input
            type="text"
            id="search"
            value={searchName}
            onChange={handleSearch}
            // onChange={handleSearch}
            className="border border-gray-300 rounded px-2 py-1 w-full"
            placeholder="Search..."
          />
          <button
            className="w-20 bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-500 transition duration-200"
            onClick={onFilterChangeOnClick} // Trigger search on click
          >
            Search
          </button>
          <button
            className="w-20 bg-gray-200 text-gray-600 rounded px-4 py-2 text-sm hover:bg-gray-300 transition duration-200"
            onClick={() => {
              setSearchName(""); setTableName(""); setFieldName("");
              onFilterChange(""); // Clear filters
            }}
          >
            Clear
          </button>
        </div>

        <div className="mt-3 mb-2">
          <button
            className="bg-gray-300 hover:bg-gray-200 text-gray-800 py-0.5 px-1 rounded-md transition-all mr-2 mb-1"
            onClick={toggleFilter}
          >
            <FontAwesomeIcon icon="fa-solid fa-filter" className="text-gray-800" />
          </button>
          <span className="text-sm text-gray-600">Add filter by</span>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isFilterVisible ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="border border-gray-300 rounded-lg text-gray-800 px-4 py-6 mt-2 mb-2">
              <div className="flex items-center">
                <label htmlFor="tableName" className="text-md text-gray-700 w-32">Category</label>
                <select
                  id="tableName"
                  value={category}
                  // onChange={setCategory(e.target.value)}
                  
                onChange={(e) => setCategory(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                >
                  <option value="">Select Category</option>
                  {categories.map((categori) => (
                    <option key={categori.id} value={categori.id}>
                      {categori.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Filter;
