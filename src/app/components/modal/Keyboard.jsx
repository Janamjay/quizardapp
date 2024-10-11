"use client";
import "animate.css";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
// eslint-disable-next-line react/prop-types
const Keyboard = ({ isOpen, onClose, children }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div
      className={`fixed ${
        isOpen ? "block" : "hidden"
      } top-0  left-0 w-full h-full flex items-start justify-center transition-opacity duration-1000  bg-gray-800 bg-opacity-80  z-[1300]`}
    >
      <div
        className={`bg-white dark:bg-grey800 mt-[3rem] lg:mt-[6rem] p-5 pt-3 rounded-lg shadow-lg relative   w-full sm:w-[50%] `}
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
              fontSize: "20px",
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
