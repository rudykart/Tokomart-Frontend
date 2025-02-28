import React, { useState, useEffect } from "react";

function Filter({ onFilterChange }) {

  const [searchName, setSearchName] = useState(""); // State untuk search

  // Membuat searchKey berdasarkan input user
  // const searchKey = useMemo(() => {
  //   const keyParts = [];
  //   if (searchName) keyParts.push(`name=${searchName}`);
  //   return keyParts.join("&");
  // }, [searchName]);

  // Memanggil onFilterChange untuk mengirimkan searchKey ke parent
  const onFilterChangeOnClick = () => {
    onFilterChange(searchName);
    // onFilterChange(searchKey);
  };

  const handleClear = () => {
    setSearchName("")
    onFilterChange("");
    // onFilterChange(searchKey);
  };
  
  // Fungsi untuk menangani pencarian
  const handleSearch = (e) => setSearchName(e.target.value);


  return (
    <>
      <div>
        <div className="mb-4 w-full flex flex-row items-center space-x-2">

          <select
            id="tableName"
            value={searchName}
            onChange={handleSearch}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          >
            <option value="">Show all notifications</option>
            <option value="unread">Show unread notifications</option>
            <option value="has_read">Show read notifications</option>
          </select>

          <button
            className="w-20 bg-blue-600 text-white rounded px-4 py-2 text-sm hover:bg-blue-500 transition duration-200"
            onClick={onFilterChangeOnClick} // Trigger search on click
          >
            Search
          </button>
          <button
            className="w-20 bg-gray-200 text-gray-600 rounded px-4 py-2 text-sm hover:bg-gray-300 transition duration-200"
            onClick={handleClear}
            // onClick={() => {
            //   setSearchName("");
            //   onFilterChange(""); // Clear filters
            // }}
          >
            Clear
          </button>
        </div>

      </div>
    </>
  );
}

export default Filter;
