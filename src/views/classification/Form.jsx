import React, { useState, useEffect } from "react";
import api from "../../api";

export default function ModalForm({
  isOpen,
  modalAction,
  classification,
  closeModal,
  reloadClassifications,
}) {
  
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tableName, setTableName] = useState("");
  const [fieldName, setFieldName] = useState("");

  
  const [tables, setTables] = useState([]);
  const [fields, setFields] = useState([]);

  
  useEffect(() => {
    if (modalAction === "edit" && classification) {
      setName(classification.name);
      setDescription(classification.description);
      setTableName(classification.table_name);
      setFieldName(classification.field_name);
    }
    

    if (modalAction === "create") {
      setName("");
      setDescription("");
      setTableName("");
      setFieldName("");
    }
  }, [modalAction, classification]);

  // Fetch daftar tabel
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await api.get("/tableconstants/tables");
        setTables(response.data.payload); 
      } catch (error) {
        console.error("Error fetching tables", error);
      }
    };

    fetchTables();
  }, []);

  
  useEffect(() => {
    if (tableName) {
      const fetchFields = async () => {
        try {
          const response = await api.get(`/tableconstants/${tableName}/fields`);
          setFields(response.data.payload); 
        } catch (error) {
          console.error("Error fetching fields", error);
        }
      };

      fetchFields();
    }
  }, [tableName]);

  const handleEditSubmit = async () => {
    const updatedClassification = {
      ...classification,
      name,
      description,
      table_name: tableName,
      field_name: fieldName,
    };

    try {
      await api.put(
        `/classifications/${updatedClassification.id}`,
        updatedClassification
      );
      alert("Classification updated successfully!");
      handleCancelButton();
      reloadClassifications(); // Memuat ulang data setelah perubahan
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); // Menyimpan error di state
        
        console.log("Error submit " + error.response.data.errors);
      } else {
        alert("Error updating classification.");
      }
    }
  };

  const handleCreateSubmit = async () => {
    const newClassification = {
      name,
      description,
      table_name: tableName,
      field_name: fieldName,
    };

    try {
      await api.post("/classifications", newClassification);
      alert("Classification created successfully!");
      handleCancelButton();
      reloadClassifications(); // Memuat ulang data setelah penambahan
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); // Menyimpan error di state
        console.error("Error submit " + error);
      } else {
        alert("Error creating classification.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/classifications/${classification.id}`);
      alert("Classification deleted successfully!");
      handleCancelButton();
      reloadClassifications(); // Memuat ulang data setelah penghapusan
    } catch (error) {
      alert("Error deleting classification.");
    }
  };

  const handleCancelButton = () => {
    closeModal();
    setErrors({});
    setName("");
    setTableName("");
    setFieldName("");
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
            Classification
          </h2>

          {/* Detail Modal */}
          {modalAction === "detail" && (
            <div>
              <div className="mb-4 flex items-center">
                <label htmlFor="name" className="text-md text-gray-700 w-32">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={classification.name}
                  disabled
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  placeholder="Enter the name of the classification"
                />
              </div>

              <div className="mb-4 flex items-start">
                <label
                  htmlFor="description"
                  className="text-md text-gray-700 w-32"
                >
                  Description
                </label>
                <div className="flex flex-col w-full">
                  <textarea
                    id="description"
                    value={classification.description}
                    disabled
                    className="border border-gray-300 rounded px-2 py-1 h-32" // Mengatur tinggi textarea
                    placeholder="Enter the description of the classification"
                  />
                </div>
              </div>

              <div className="mb-4 flex items-center">
                <label
                  htmlFor="tableName"
                  className="text-md text-gray-700 w-32"
                >
                  Table Name
                </label>
                <input
                  id="tableName"
                  type="text"
                  value={classification.table_name}
                  disabled
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  placeholder="Enter the table name associated with the classification"
                />
              </div>

              <div className="mb-4 flex items-center">
                <label
                  htmlFor="fieldName"
                  className="text-md text-gray-700 w-32"
                >
                  Field Name
                </label>
                <input
                  id="fieldName"
                  type="text"
                  value={classification.field_name}
                  disabled
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                  placeholder="Enter the field name associated with the classification"
                />
              </div>
            </div>
          )}

          {/* Edit dan Create Modal */}
          {(modalAction === "edit" || modalAction === "create") && (
            <div>
            {/* Name Field */}
            <div className="mb-4 flex items-start">
              <label htmlFor="name" className="text-md text-gray-700 w-32">
                Name
              </label>
              <div className="flex-1">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`border rounded px-2 py-1 w-full ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter the name of the classification"
                />
                {errors.name && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.name.map((msg, idx) => (
                      <p key={idx}>{msg}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          
            {/* Description Field */}
            <div className="mb-4 flex items-start">
              <label htmlFor="description" className="text-md text-gray-700 w-32">
                Description
              </label>
              <div className="flex-1">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`border rounded px-2 py-1 w-full h-32 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter the description of the classification"
                />
                {errors.description && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.description.map((msg, idx) => (
                      <p key={idx}>{msg}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          
            {/* Table Name Field */}
            <div className="mb-4 flex items-start">
              <label htmlFor="tableName" className="text-md text-gray-700 w-32">
                Table Name
              </label>
              <div className="flex-1">
                <select
                  id="tableName"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className={`border rounded px-2 py-1 w-full ${
                    errors.table_name ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Table</option>
                  {tables.map((table) => (
                    <option key={table.table_name} value={table.table_name}>
                      {table.table_name}
                    </option>
                  ))}
                </select>
                {errors.table_name && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.table_name.map((msg, idx) => (
                      <p key={idx}>{msg}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          
            {/* Field Name Field */}
            <div className="mb-4 flex items-start">
              <label htmlFor="fieldName" className="text-md text-gray-700 w-32">
                Field Name
              </label>
              <div className="flex-1">
                <select
                  id="fieldName"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className={`border rounded px-2 py-1 w-full ${
                    errors.field_name ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Field</option>
                  {fields.map((field) => (
                    <option key={field.field_name} value={field.field_name}>
                      {field.field_name}
                    </option>
                  ))}
                </select>
                {errors.field_name && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.field_name.map((msg, idx) => (
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
              <p>Are you sure you want to delete this product ?</p>
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
