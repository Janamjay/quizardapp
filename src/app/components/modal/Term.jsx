/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
"use client";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { GoDotFill } from "react-icons/go";

const Term = ({ isOpen, onClose }) => {
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
      className={`fixed font-Montserrat z-50 ${
        isOpen ? "block" : "hidden"
      }  top-0 left-0 w-full h-[90vh] sm:h-full flex items-end sm:items-center justify-center transition-opacity duration-2000 bg-gray-200 bg-opacity-50`}
    >
      <div
        className={`bg-white dark:bg-grey800 absolute  p-6 pt-3 rounded-lg shadow-lg w-full sm:w-[48%]
         md:w-[45%] ${
           closing
             ? "animate__animated animate__fadeOutDown faster"
             : "animate__animated animate__backInUp animate__faster"
         }`}
      >
        <div>
          <div className=" flex w-full justify-center flex-col items-center mt-5 text-black dark:text-white">
            <h1 className="font-bold font-[Montserrat]">
              Please note the following conditions for referral rewards:
            </h1>
          </div>
          <div className="mt-5 text-black dark:text-white text-justify">
            <div className="flex justify-start items-start gap-5 mb-2">
              <GoDotFill className="text-[20px] font-[Montserrat]" />
              <p className="leading-5 font-[Montserrat]">
                All Sarthaks users can participate in the Invite & Earn program.
              </p>
            </div>
            <div className="flex justify-start items-start gap-[21px] mb-2">
              <GoDotFill className="text-[37px]" />
              <p className="leading-5 font-[Montserrat]">
                There is no limit on the maximum number of people who can use a
                referral code. Friends can use the referral code shared during
                signup through App.
              </p>
            </div>
            <div className="flex justify-start items-start gap-5 mb-2">
              <GoDotFill className="text-[20px]" />
              <p className="leading-5 font-[Montserrat]">
                The coins earned gets credited directly to user's wallet on
                Sarthaks.
              </p>
            </div>
            <div className="flex justify-start items-start gap-5 mb-7 sm:mb-2">
              <GoDotFill className="text-[20px]" />
              <p className="leading-5 font-[Montserrat]">
                The coins earned get credited instantly into the user's wallet
                after Sign Up.
              </p>
            </div>
          </div>
          <button
            aria-label="close icon"
            className="px-4 pb-2 pt-3 font-[Montserrat] text-black rounded absolute top-0 right-0 z-100"
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
    </div>
  );
};

export default Term;
