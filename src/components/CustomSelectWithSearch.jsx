import { useState, useEffect, useRef } from "react";

const CustomSelectWithSearch = ({
  options,
  value,
  onSelect,
  placeholder,
  search,
  setSearch,
  nextCursor,
  loadMore,
  disabled,
}) => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);


const [debouncedSearch, setDebouncedSearch] = useState("");
useEffect(() => {
  if (search === "") {
    setDebouncedSearch(""); // Jika dikosongkan, langsung perbarui tanpa delay
    return;
  }

  const handler = setTimeout(() => {
    setDebouncedSearch(search);
    console.log("isi searchTerm dari CustomSelectWithSearch = "+search)
  }, 500); // Delay 500ms

  return () => {
    clearTimeout(handler);
  };
}, [search]);

  // **Update opsi ketika search berubah**
  useEffect(() => {
    setFilteredOptions(
      options.filter(
        (opt) => opt.name.toLowerCase().includes(debouncedSearch.toLowerCase()) // Filter berdasarkan name
      )
    );
  // }, [debouncedSearch]);
  }, [debouncedSearch, options]);

  // **Set produk yang dipilih berdasarkan value**
  useEffect(() => {
    if (value) {
      const foundProduct = options.find((opt) => opt.id === value);
      setSelected(foundProduct || null);
    }
  // }, [value]);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option); // Kirim objek { id, name } ke parent
    if (disabled != true) {
      setIsOpen(false);
      setSearch("");
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="border border-gray-300 rounded px-2 py-1 w-full cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? selected.name : placeholder}
        {/* <span className="text-gray-500">&#9662;</span>
        ppkpkp */}
      </div>

      {isOpen && (
        // <div className="absolute w-full border border-gray-300 rounded bg-white mt-1 shadow-lg z-10"
        <div 
        className={` ${
          !disabled
            ? "absolute w-full border border-gray-300 rounded bg-white mt-1 shadow-lg z-10"
            : ""
        }`}>


          <div className="relative">
            <input
              type="text"
              hidden={disabled}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="border-b w-full px-2 py-1 pr-8"
            />
            {/* Tombol Clear Search */}
            {search && (
              <button
                onClick={() => setSearch("")}
                // className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6  bg-red-600 text-white rounded hover:bg-red-500 transition duration-200"
                         
              >
                ✕
              </button>
            )}
          </div>


          {/* <input
            type="text"
            // hidden
            hidden={disabled != false}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border-b w-full px-2 py-1"
          /> */}

          {disabled != true && (
            // <div className="relative">
            <div className="max-h-40 overflow-y-auto  z-50">
            {/* <div className="absolute top-full left-0 max-h-40 overflow-y-auto bg-white border border-gray-300 shadow-lg z-50 w-full"> */}
   
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.id} // Gunakan id sebagai key
                    className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSelect(opt)}
                  >
                    {opt.name}
                  </div>
                ))
              ) : (
                <div className="px-2 py-1 text-gray-500 text-center">No results found</div>
              )}

              {nextCursor!==null && (
                 <div
                //  key={opt.id} // Gunakan id sebagai key
                    onClick={loadMore}
                 className="px-2 py-1 text-center hover:bg-gray-200 cursor-pointer"
                //  onClick={() => handleSelect(opt)}
               >
                 -- Load more --
               </div>
            )}
            </div>
            // </div>
            
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelectWithSearch;
