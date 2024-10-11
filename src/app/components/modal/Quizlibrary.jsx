"use client"
import "animate.css";
import { AiOutlineClose } from "react-icons/ai";
import { useState } from "react";
// eslint-disable-next-line react/prop-types
const Quizlibrary = ({ isOpen, onClose, children }) => {
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
      } top-0 left-0 w-full h-[100vh] flex items-center sm:items-center justify-end transition-opacity duration-1000  bg-gray-800 bg-opacity-80  z-[1200]`}
    >
      <div
        className={`bg-white dark:bg-grey800  relative h-screen  w-full sm:w-[66%] ${
          closing
            ? "animate__animated animate__fadeOutRightBig faster"
            : "animate__animated animate__fadeInRightBig animate__faster"
        }`}
      >
        {children}
        <button
          aria-label="close icon"
          className=" p-2 font-[Montserrat] text-black bg-white rounded-l-[4px] absolute  top-2 left-[-31px] z-10"
          onClick={handleClose}
        >
          <AiOutlineClose
            className=""
            style={{
              fontWeight: "bolder",
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default Quizlibrary;
