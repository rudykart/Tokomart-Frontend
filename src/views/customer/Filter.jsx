import React, { useState,  useMemo } from "react";

function Filter({ onFilterChange }) {  // Tambahkan prop onFilterChange

  const [searchName, setSearchName] = useState("");  // State untuk search

  // Membuat searchKey berdasarkan input user
  const searchKey = useMemo(() => {
    const keyParts = [];
    if (searchName) keyParts.push(`name=${searchName}`);
    return keyParts.join("&");
  }, [searchName]);

  
  // Memanggil onFilterChange untuk mengirimkan searchKey ke parent
  const onFilterChangeOnClick = () => {
    onFilterChange(searchKey);
  };


  // Fungsi untuk menangani pencarian
  const handleSearch = (e) => setSearchName(e.target.value);

  return (
    <>
      <div>
        <div className="mb-4 w-full flex flex-row items-center space-x-2">
          <input
            type="text"
            id="search"
            value={searchName}
            onChange={handleSearch}
            className="border border-gray-300 rounded px-2 py-1 w-full"
            placeholder="Search..."
          />
          <button
            className="w-20 bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-500 transition duration-200"
            onClick={onFilterChangeOnClick} 
          >
            Search
          </button>
          <button
            className="w-20 bg-gray-200 text-gray-600 rounded px-4 py-2 text-sm hover:bg-gray-300 transition duration-200"
            onClick={() => {
              setSearchName(""); onFilterChange("");
            }}
          >
            Clear
          </button>
        </div>

      </div>
    </>
  );
}

export default Filter;
