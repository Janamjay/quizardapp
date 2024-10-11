"use client"
import "animate.css";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
// eslint-disable-next-line react/prop-types
const ImageUpload = ({ isOpen, onClose, children }) => {
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
      className={`fixed ${
        isOpen ? "block" : "hidden"
      } top-0 left-0 w-full h-[85vh] sm:h-full flex items-end sm:items-center justify-center transition-opacity duration-1000  bg-gray-800 bg-opacity-80  z-[1300]`}
    >
      <div
        className={`bg-white dark:bg-grey800  p-6 pt-3 rounded-lg shadow-lg relative   w-full sm:w-[35%] md:w-[35%] ${
          closing
            ? "animate__animated animate__fadeOutDown faster"
            : "animate__animated animate__backInUp animate__faster"
        }`}
      >
        {children}
        <button
        aria-label="close icon"
          className=" px-4 pb-2 font-[Montserrat] pt-3 text-black dark:text-white rounded  absolute  top-0 right-0 z-10"
          onClick={handleClose}
        >
          <AiOutlineClose
            className="text-black dark:text-white"
            style={{
              fontWeight: "bolder",
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default ImageUpload;
