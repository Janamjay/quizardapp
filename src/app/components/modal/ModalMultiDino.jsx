/* eslint-disable react/prop-types */
"use client";
import "animate.css";
import { AiOutlineClose } from "react-icons/ai";

import { useState } from "react";

const ModalMultiDino = ({ isOpen, onClose, children }) => {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 400);
  };

  return (
    <div
      className={`fixed font-Montserrat ${
        isOpen ? "block" : "hidden"
      } top-0 left-0 w-full h-[85vh] sm:h-full flex items-end sm:items-center justify-center transition-opacity duration-2000 bg-gray-200 bg-opacity-50 z-50`}
    >
      <div
        className={`bg-white dark:bg-grey800 p-6 pt-3 rounded-lg shadow-lg relative  w-full sm:w-[48%] md:w-[36%] ${
          closing
            ? "animate__animated animate__fadeOutDown faster"
            : "animate__animated animate__backInUp animate__faster"
        }`}
      >
        {children}
        <button
          aria-label="close icon"
          className="px-4 pb-2 pt-3 font-[Montserrat] text-black dark:text-white rounded absolute top-0 right-0 z-100"
          onClick={handleClose}
        >
          <AiOutlineClose
            className="text-black font-[Montserrat] dark:text-white"
            style={{
              fontWeight: "bolder",
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default ModalMultiDino;
