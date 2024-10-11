/* eslint-disable react/prop-types */
"use client";
import { useState } from "react";
import "animate.css";
import { AiOutlineClose } from "react-icons/ai";

const ShareModal = ({ isOpen, onClose, children }) => {
  const [closing] = useState(false);

  const handleClose = () => {
    onClose();
  };
  return (
    <div
      className={`fixed font-Montserrat z-50 ${
        isOpen ? "block" : "hidden"
      }  top-0 left-0 w-full h-[85vh] sm:h-full flex items-end sm:items-center justify-center transition-opacity duration-2000 bg-gray-200 bg-opacity-50`}
    >
      <div
        className={`bg-white dark:bg-grey800 absolute  p-6 pt-3 rounded-lg shadow-lg w-full sm:w-[48%] md:w-[25%] ${
          closing
            ? "animate__animated animate__fadeOutDown faster"
            : "animate__animated animate__backInUp animate__faster"
        }`}
      >
        {children}
        <button
          aria-label="close icon"
          className="px-4 pb-2 pt-3 text-black font-[Montserrat] rounded absolute top-0 right-0 z-100 "
        >
          <AiOutlineClose
            className="text-black font-[Montserrat] dark:text-white"
            style={{
              fontWeight: "bolder",
            }}
            onClick={handleClose}
          />
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
