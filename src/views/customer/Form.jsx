import React, { useState, useEffect } from "react";
import api from "../../api";

export default function ModalForm({
  isOpen,
  modalAction,
  customer,
  closeModal,
  reloadCustomers,
}) {
  // State hooks untuk form
  const [errors, setErrors] = useState({});
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [member, setMember] = useState("");

  // Update form state ketika customer berubah
  useEffect(() => {
    if (modalAction === "edit" && customer) {
      setName(customer.name);
      setPhoneNumber(customer.phone_number);
      setEmail(customer.email);
      setMember(customer.member);
    }
    // Reset field jika modalAction adalah 'create'
    if (modalAction === "create") {
      setName("");
      setPhoneNumber("");
      setEmail("");
      setMember("");
    }
  }, [modalAction, customer]); // Re-run ketika modalAction atau customer berubah

  const handleEditSubmit = async () => {
    const updatedCustomer = {
      ...customer,
      name,
      phone_number: phoneNumber,
      email: email,
      member: member,
    };

    try {
      await api.put(`/customers/${updatedCustomer.id}`, updatedCustomer);
      alert("Customer updated successfully!");
      handleCancelButton();
      reloadCustomers(); // Memuat ulang data setelah perubahan
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); // Menyimpan error di state
      } else {
        alert("Error updating customer.");
      }
    }
  };

  const handleCreateSubmit = async () => {
    const newClassification = {
      name,
      phone_number: phoneNumber,
      email: email,
      member: member,
    };

    try {
      await api.post("/customers", newClassification);
      alert("Customer created successfully!");
      handleCancelButton();
      reloadCustomers(); // Memuat ulang data setelah penambahan
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); // Menyimpan error di state
      } else {
        alert("Error creating customer.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/customers/${customer.id}`);
      alert("Customer deleted successfully!");
      handleCancelButton();
      reloadCustomers(); // Memuat ulang data setelah penghapusan
    } catch (error) {
      alert("Error deleting customer.");
    }
  };

  const handleCancelButton = () => {
    closeModal();
    setErrors({});
    setName("");
    setPhoneNumber("");
    setMember("");
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
            Customer
          </h2>

          {/* Detail Modal */}
          {modalAction === "detail" && (
            <div>
            {/* Name */}
            <div className="mb-4 flex items-start">
              <label htmlFor="name" className="text-md text-gray-700 w-32">
                Name
              </label>
              <div className="flex-1">
                <input
                  id="name"
                  type="text"
                  value={customer.name}
                  disabled
                  className={`border rounded px-2 py-1 w-full border-gray-300`}
                  placeholder="Enter the name of the classification"
                />
              </div>
            </div>

            <div className="mb-4 flex items-start">
              <label
                htmlFor="phoneNumber"
                className="text-md text-gray-700 w-32"
              >
                Phone Number
              </label>
              <div className="flex-1">
                <input
                  id="phoneNumber"
                  type="text"
                  value={customer.phone_number}
                  disabled
                  className={`border rounded px-2 py-1 w-full border-gray-300`}
                  placeholder="Enter the phone Number of the classification"
                />
              </div>
            </div>

            
            <div className="mb-4 flex items-start">
                <label
                  htmlFor="email"
                  className="text-md text-gray-700 w-32"
                >
                  Email
                </label>
                <div className="flex-1">
                  <input
                    id="email"
                    type="text"
                    value={customer.email}
                    disabled
                    className={`border rounded px-2 py-1 w-full border-gray-300`}
                    placeholder="Enter the phone Number of the classification"
                  />
                </div>
              </div>

            <div className="mb-4 flex items-start">
              <label
                htmlFor="member"
                className="text-md text-gray-700 w-32"
              >
                Member
              </label>
              <div className="flex-1">
                <input
                  id="member"
                  type="text"
                  value={customer.member}
                  disabled
                  className={`border rounded px-2 py-1 w-full border-gray-300`}
                  placeholder="Enter the phone Number of the classification"
                />
              </div>
            </div>

          </div>
          )}

          {/* Edit dan Create Modal */}
          {(modalAction === "edit" || modalAction === "create") && (
            <div>
              {/* Name */}
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

              <div className="mb-4 flex items-start">
                <label
                  htmlFor="phoneNumber"
                  className="text-md text-gray-700 w-32"
                >
                  Phone Number
                </label>
                <div className="flex-1">
                  <input
                    id="phoneNumber"
                    type="number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`border rounded px-2 py-1 w-full ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter the phone Number of the classification"
                  />
                  {errors.phoneNumber && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber.map((msg, idx) => (
                        <p key={idx}>{msg}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-start">
                <label
                  htmlFor="email"
                  className="text-md text-gray-700 w-32"
                >
                  Email
                </label>
                <div className="flex-1">
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`border rounded px-2 py-1 w-full ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter the phone Number of the classification"
                  />
                  {errors.email && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.email.map((msg, idx) => (
                        <p key={idx}>{msg}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-start">
                <label
                  htmlFor="member"
                  className="text-md text-gray-700 w-32"
                >
                  Member
                </label>
                <div className="flex-1">
                  <input
                    id="member"
                    type="text"
                    value={member}
                    onChange={(e) => setMember(e.target.value)}
                    className={`border rounded px-2 py-1 w-full ${
                      errors.member ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter the phone Number of the classification"
                  />
                  {errors.member && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.member.map((msg, idx) => (
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
              <p>Are you sure you want to delete this customer?</p>
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
