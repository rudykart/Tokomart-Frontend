import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const SetMainImage = (props) => {
  const { isOpen, closeModal, idImage, reloadMainImage } = props;

  const handleSubmit = async () => {

  };

  const setMainImage = () => {
    closeModal();
    reloadMainImage();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-3/2">
          <h2 className="text-2xl font-semibold mb-4">
            Image Option
          </h2>
          
            <div>
              <p>Are you sure you want to set this main Image ?</p>
              <h1>image index = {idImage}</h1>
            </div>
          
          
          <div className="mt-4 flex justify-between">
            <button
              onClick={setMainImage}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Set Main Image
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    )
  );
};

SetMainImage.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  idImage: PropTypes.object,
  reloadMainImage: PropTypes.object,
};

export default SetMainImage;
