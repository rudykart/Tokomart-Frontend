import React, { useState, useEffect } from "react";
import api from "../../api";

import CustomSelectWithSearch from "../../components/CustomSelectWithSearch";

export default function ModalForm({
  isOpen,
  modalAction,
  discount,
  closeModal,
  reloadDiscounts,
}) {
  // State hooks untuk form
  const [errors, setErrors] = useState({});

  const [discountValue, setDiscountValue] = useState("");
  const [productId, setProductId] = useState("");
  const [startAt, setStartAt] = useState("");
  const [expiredAt, setExpiredAt] = useState("");

  // const products = ["Apple", "Banana", "Orange", "Grapes", "Watermelon"];
  const [products, setProducts] = useState([]); // Menyimpan data produk
  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [nextCursor, setNextCursor] = useState(null);

  
  // useEffect(() => {
  //   // if (modalAction != null) {
    
  //   console.log(" cek ke  : 4");
  //   console.log(" modalAction  : "+modalAction);
  //   // console.log(" productId  : "+productId);
  //   if (
  //     (modalAction === "edit" && discount != null) ||
  //     (modalAction === "detail" && discount != null)
  //   ) {console.log(" cek edit");
  //     console.log(" discount  : ", discount);
  //     setDiscountValue(discount.discount_value);
  //     setProductId(discount.product_id);
  //     setStartAt(discount.start_at);
  //     setExpiredAt(discount.expired_at);
  //     console.log(" productId  : "+productId);
  //   }
  //   // Reset field jika modalAction adalah 'create'
  //   if (modalAction === "create") {
  //     // setName("");
  //     // setDescription("");
  //     // setTableName("");
  //   }
  //   // if (modalAction === "detail" || modalAction === "edit") {
  //   //   const existingProduct = products.find(
  //   //     (p) => p.id === discount.product_id
  //   //   );

  //   //   if (!existingProduct) {
  //   //     // Tambahkan produk ke daftar products
  //   //     setProducts((prev) => [
  //   //       ...prev,
  //   //       { id: discount.product_id, name: discount.product_name },
  //   //     ]);
  //   //   }
  //   // }
  // // }
  // // console.log(" discount.product_id  : "+discount.product_id);
  // }, [modalAction, discount]); // Re-run ketika modalAction atau discount berubah
  // }, [modalAction, discount]); // Re-run ketika modalAction atau discount berubah

  // Fetch daftar fetchProducts ketika baru mulai
  useEffect(() => {
    fetchProducts(true);
  }, []);

  
  useEffect(() => {
    // if (modalAction != null) {
    
    console.log(" cek ke  : 4");
    console.log(" modalAction  : "+modalAction);
    // console.log(" productId  : "+productId);
    if (
      (modalAction === "edit" && discount != null) ||
      (modalAction === "detail" && discount != null)
    ) {console.log(" cek edit");
      console.log(" discount  : ", discount);
      setDiscountValue(discount.discount_value);
      setProductId(discount.product_id);
      setStartAt(discount.start_at);
      setExpiredAt(discount.expired_at);
      console.log(" productId  : "+productId);
    }
    // Reset field jika modalAction adalah 'create'
    if (modalAction === "create") {
      // setName("");
      // setDescription("");
      // setTableName("");
    }
    // if (modalAction === "detail" || modalAction === "edit") {
    //   const existingProduct = products.find(
    //     (p) => p.id === discount.product_id
    //   );

    //   if (!existingProduct) {
    //     // Tambahkan produk ke daftar products
    //     setProducts((prev) => [
    //       ...prev,
    //       { id: discount.product_id, name: discount.product_name },
    //     ]);
    //   }
    // }
  // }
  // console.log(" discount.product_id  : "+discount.product_id);
  }, [modalAction, discount]); // Re-run ketika modalAction atau discount berubah

  useEffect(() => {
    
    console.log(" cek ke  : 1");
    if (searchTerm === "") {
      setDebouncedSearch(""); // Jika dikosongkan, langsung perbarui tanpa delay
      // fetchProducts(true);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      console.log("isi searchTerm dari form = " + searchTerm);
      // fetchProducts(true);
    }, 1000); // Delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // **Update opsi ketika search berubah**
  useEffect(() => {
    setSearchTerm(debouncedSearch);
    console.log(" cek ke  : 2");
  }, [debouncedSearch]);

  const fetchProducts = async (isNewSearch = false) => {
    console.log(" cek ke  : 3");
    try {
      let url = `/products/dropdown?size=50&sort=DESC`;
      if (searchTerm !== "") {
        const searchKey = `${encodeURIComponent(searchTerm)}`;
        url += `&search=${searchKey}`;
      }

      if (!isNewSearch && nextCursor) {
        url += `&cursor=${nextCursor}`;
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

      

      // setCurrentCursor(response.data.meta.next_cursor); // Perbarui currentCursor setelah response diterima
      setNextCursor(response.data.meta.next_cursor);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const loadMore = () => {
    fetchProducts(false);
    console.log("-- masuk load more --");
    console.log(" next cursor  : ", nextCursor);
  };


  const handleEditSubmit = async () => {
    const updatedDiscount = {
      ...discount,
      discount_value: Number(discountValue),
      product_id: productId,
      start_at: startAt ? new Date(startAt).toISOString() : null,
      expired_at: expiredAt ? new Date(expiredAt).toISOString() : null,
    };

    try {
      await api.put(`/discounts/${updatedDiscount.id}`, updatedDiscount);
      // alert("Discount updated successfully!");
      handleCancelButton();
      reloadDiscounts(); // Memuat ulang data setelah perubahan
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); // Menyimpan error di state

        console.log("Error submit " + error.response.data.errors);
      } else {
        alert("Error updating discount.");
      }
    }
  };

  const handleCreateSubmit = async () => {
    const newDiscount = {
      discount_value: Number(discountValue),
      product_id: productId,
      start_at: startAt ? new Date(startAt).toISOString() : null,
      expired_at: expiredAt ? new Date(expiredAt).toISOString() : null,
    };

    try {
      console.log(" submit " + newDiscount);
      await api.post("/discounts", newDiscount);
      // alert("Discount created successfully!");
      handleCancelButton();
      reloadDiscounts(); // Memuat ulang data setelah penambahan
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); // Menyimpan error di state
        console.error("Error submit " + error);
      } else {
        alert("Error creating discount.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/discounts/${discount.id}`);
      alert("Discount deleted successfully!");
      handleCancelButton();
      reloadDiscounts(); // Memuat ulang data setelah penghapusan
    } catch (error) {
      alert("Error deleting discount.");
    }
  };

  const handleCancelButton = () => {
    closeModal();
    setErrors({});
    setDiscountValue("");
    setProductId("");
    setStartAt("");
    setExpiredAt("");
    // setModalAction(null);
    // modalAction=null;
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-1/2">
          <h2 className="text-2xl font-semibold mb-4">
            {modalAction === "detail"
              ? "Detail"
              : modalAction === "edit"
              ? "Edit"
              : modalAction === "create"
              ? "Create"
              : "Delete"}{" "}
            Discount
          </h2>
          <h2 className="text-2xl font-semibold mb-4">{debouncedSearch}</h2>

          {/* Edit dan Create Modal */}
          {(modalAction === "edit" ||
            modalAction === "create" ||
            modalAction === "detail") && (
            <div>
              <div className="mb-4 flex items-start">
                {/* Label */}
                <label
                  htmlFor="tableName"
                  className="text-md text-gray-700 w-32"
                >
                  Product
                </label>

                {/* Dropdown */}
                <div className="flex-1">
                  <div
                    className={` ${
                      errors.product_id ? "border rounded border-red-500" : ""
                    }`}
                  >
                    <CustomSelectWithSearch
                      options={products}
                      value={productId} // Set value agar produk yang dipilih tampil
                      onSelect={(selected) => setProductId(selected.id)} // Simpan ID produk yang dipilih
                      placeholder="Select Product"
                      search={searchTerm}
                      setSearch={setSearchTerm}
                      nextCursor={nextCursor}
                      loadMore={loadMore}
                      disabled={modalAction === "detail"} // Disable saat modalAction = "detail"
                    />
                  </div>
                  {errors.product_id && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.product_id.map((msg, idx) => (
                        <p key={idx}>{msg}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-start">
                <label htmlFor="startAt" className="text-md text-gray-700 w-32">
                  Start At
                </label>
                <div className="flex-1">
                  <input
                    id="startAt"
                    type="datetime-local"
                    value={startAt}
                    disabled={modalAction === "detail"}
                    onChange={(e) => setStartAt(e.target.value)}
                    className={`border rounded px-2 py-1 w-full ${
                      errors.start_at ? "border-red-500" : "border-gray-300"
                    }`}
                  />

                  {errors.start_at && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.start_at.map((msg, idx) => (
                        <p key={idx}>{msg}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-start">
                <label
                  htmlFor="expiredAt"
                  className="text-md text-gray-700 w-32"
                >
                  Expired At
                </label>
                <div className="flex-1">
                  <input
                    disabled={modalAction === "detail"}
                    id="expiredAt"
                    type="datetime-local"
                    value={expiredAt}
                    onChange={(e) => setExpiredAt(e.target.value)}
                    className={`border rounded px-2 py-1 w-full ${
                      errors.expired_at ? "border-red-500" : "border-gray-300"
                    }`}
                  />

                  {errors.expired_at && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.expired_at.map((msg, idx) => (
                        <p key={idx}>{msg}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-start">
                <label
                  htmlFor="discountValue"
                  className="text-md text-gray-700 w-32"
                >
                  Discount
                </label>
                <div className="flex-1">
                  <input
                    disabled={modalAction === "detail"}
                    id="discountValue"
                    type="number"
                    min="0"
                    max="100"
                    value={discountValue}
                    onChange={(e) => {
                      let value = parseInt(e.target.value, 10);

                      if (isNaN(value)) value = 0; // Jika kosong, tetap 0
                      if (value > 100) value = 100; // Maksimal 100
                      if (value < 0) value = 0; // Minimal 0

                      setDiscountValue(value);
                    }}
                    className={`border rounded px-2 py-1 w-full ${
                      errors.discount_value
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter the value of the discount"
                  />
                  {errors.discount_value && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.discount_value.map((msg, idx) => (
                        <p key={idx}>{msg}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {modalAction === "delete" && (
            <div>
              <p>Are you sure you want to delete this discount?</p>
            </div>
          )}

          <div className="mt-4 flex justify-between">
            {modalAction === "delete" ? (
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            ) : modalAction === "create" ? (
              <button
                onClick={handleCreateSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            ) : (
              <button
                onClick={handleEditSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {modalAction === "edit" ? "Save Changes" : "Close"}
              </button>
            )}
            <button
              onClick={handleCancelButton}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
}
