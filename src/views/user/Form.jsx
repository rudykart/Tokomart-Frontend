import React, { useState, useEffect } from "react";
import api from "../../api";

export default function ModalForm({
  isOpen,
  modalAction,
  user,
  closeModal,
  reloadUsers,
}) {
  // const ModalForm = (props) => {

  // const ModalForm = (props) => {
  //   const { isOpen, modalAction, product, closeModal, reloadClassifications } =
  //     props;

  // State hooks untuk form
  const [errors, setErrors] = useState({});
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [member, setMember] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // Update form state ketika user berubah
  useEffect(() => {
    console.log(modalAction);
    console.log(user);
    if (modalAction === "edit" && user) {
      setName(user.name);
      setUsername(user.username);
      // setEmail(user.email);
      setRole(user.role);
    }
    // Reset field jika modalAction adalah 'create'
    if (modalAction === "create") {
      setName("");
      setUsername("");
      setPassword("");
      setRole("");
    }
  }, [modalAction, user]); // Re-run ketika modalAction atau user berubah

  // const handleEditSubmit = async () => {
  //   const updatedUser = {
  //     ...user,
  //     name,
  //     username,
  //     password,
  //     role: role,
  //   };

  //   try {
  //     await api.put(`/users/${updatedUser.id}`, updatedUser);
  //     alert("Customer updated successfully!");
  //     handleCancelButton();
  //     reloadUsers(); // Memuat ulang data setelah perubahan
  //   } catch (error) {
  //     if (error.response && error.response.data && error.response.data.errors) {
  //       setErrors(error.response.data.errors); // Menyimpan error di state
  //     } else {
  //       alert("Error updating user.");
  //     }
  //   }
  // };

  // const handleCreateSubmit = async () => {
  //   const newClassification = {
  //     name,
  //     username,
  //     password,
  //     role: role,
  //   };

  //   try {
  //     await api.post("/users", newClassification);
  //     alert("Customer created successfully!");
  //     handleCancelButton();
  //     reloadUsers(); // Memuat ulang data setelah penambahan
  //   } catch (error) {
  //     if (error.response && error.response.data && error.response.data.errors) {
  //       setErrors(error.response.data.errors); // Menyimpan error di state
  //     } else {
  //       alert("Error creating user.");
  //     }
  //   }
  // };

  const handleSubmit = async () => {
    const newUser = {
      name,
      username,
      password,
      role: role,
    };

    try {
      if (modalAction === "create") {
        await api.post("/users", newUser);
      } else if (modalAction === "edit") {
        await api.put(`/users/${user.id}`, newUser);
      }
      handleCancelButton();
      reloadUsers(); // Memuat ulang data setelah penambahan
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); // Menyimpan error di state
      } else {
        alert("Error creating user.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${user.id}`);
      alert("Customer deleted successfully!");
      handleCancelButton();
      reloadUsers(); // Memuat ulang data setelah penghapusan
    } catch (error) {
      alert("Error deleting user.");
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
            User
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
                    value={user.name}
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
                    value={user.phone_number}
                    disabled
                    className={`border rounded px-2 py-1 w-full border-gray-300`}
                    placeholder="Enter the phone Number of the classification"
                  />
                </div>
              </div>

              <div className="mb-4 flex items-start">
                <label htmlFor="email" className="text-md text-gray-700 w-32">
                  Email
                </label>
                <div className="flex-1">
                  <input
                    id="email"
                    type="text"
                    value={user.email}
                    disabled
                    className={`border rounded px-2 py-1 w-full border-gray-300`}
                    placeholder="Enter the phone Number of the classification"
                  />
                </div>
              </div>

              <div className="mb-4 flex items-start">
                <label htmlFor="member" className="text-md text-gray-700 w-32">
                  Member
                </label>
                <div className="flex-1">
                  <input
                    id="member"
                    type="text"
                    value={user.member}
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
                    placeholder="Enter name "
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
                  htmlFor="username"
                  className="text-md text-gray-700 w-32"
                >
                  Username
                </label>
                <div className="flex-1">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`border rounded px-2 py-1 w-full ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter username"
                  />
                  {errors.username && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.username.map((msg, idx) => (
                        <p key={idx}>{msg}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-start">
                <label
                  htmlFor="password"
                  className="text-md text-gray-700 w-32"
                >
                  Password
                </label>
                <div className="flex-1">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`border rounded px-2 py-1 w-full ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter password"
                  />
                  {errors.password && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.password.map((msg, idx) => (
                        <p key={idx}>{msg}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-start">
                <label htmlFor="role" className="text-md text-gray-700 w-32">
                  Role
                </label>
                <div className="flex-1">
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`border rounded px-2 py-1 w-full ${
                      errors.role ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>

                  {errors.role && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.role.map((msg, idx) => (
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
              <p>Are you sure you want to delete this user?</p>
            </div>
          )}

          <div className="mt-4 flex justify-between">
            {modalAction === "delete" && (
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            )}

            {/* {(modalAction === "create" || modalAction === "edit") && ( */}
            {["create", "edit"].includes(modalAction) && (
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {modalAction === "edit" ? "Save Changes" : "Save"}
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

// ModalForm.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   modalAction: PropTypes.oneOf(["create", "edit", "detail", "delete"]),
//   product: PropTypes.object,
//   closeModal: PropTypes.func.isRequired,
//   reloadClassifications: PropTypes.func.isRequired,
// };

// export default ModalForm;
