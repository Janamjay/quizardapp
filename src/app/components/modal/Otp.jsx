/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
"use client";
import { useState, useEffect } from "react";
import "animate.css";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import UpdateForget from "./UpdateForget";


const Otp = ({ isOpen, onClose, data, openOtp }) => {
  const [closing, setClosing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userOTP, setUserOTP] = useState("");
  const [resendTimer, setResendTimer] = useState(30);

  const resendOtpAgain = () => {
    let interval;
    interval = setInterval(() => {
      setResendTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(interval);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (isOpen) {
      resendOtpAgain();
    }
  }, [isOpen]);

  const handleClose = () => {
    setClosing(true);
    setResendTimer(30);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 400);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResendTimer();
  };
  const otpData = {
    otp: userOTP,
    mobile: data.mobile,
  };
  const handleLogin = async () => {
    if (userOTP === "") {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        text: "Please enter the OTP.",
      });
      return;
    }
    const userDataResponse = await fetch("/api/verify_otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otpData }),
    });
    const response = await userDataResponse.json();
    if (response) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        title: response,
      });
      setIsModalOpen(true);
      handleClose();
      setUserOTP("");
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: "Please enter 10 digit Mobile Number",
      });
    }
  };

  const resendOtp = () => {
    openOtp();
    setResendTimer(30);
    resendOtpAgain()
  };

  return (
    <>
      <UpdateForget isOpen={isModalOpen} onClose={closeModal} data={otpData} />
      <div
        className={`fixed z-10 font-Montserrat ${
          isOpen ? "block" : "hidden"
        }  top-0 left-0 w-full h-[85vh] sm:h-full flex items-end sm:items-center justify-center transition-opacity duration-2000 bg-gray-200 bg-opacity-50`}
      >
        <div
          className={`bg-white dark:bg-grey800 absolute p-6 pt-3 rounded-lg shadow-lg w-full sm:w-[48%] md:w-[25%]  ${
            closing
              ? "animate__animated animate__fadeOutDown faster"
              : "animate__animated animate__backInUp animate__faster"
          }`}
        >
          <div>
            <h1 className="font-black text-lg dark:text-white font-[Montserrat]">
              Enter OTP
            </h1>
            <div className=" flex w-full justify-center flex-col items-center mt-5">
              <input
                className=" placeholder:text-black font-bold block bg-white border border-cyan-300 rounded-md py-3 px-7 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm h-[46px] w-full font-[Montserrat]"
                placeholder="Enter OTP"
                type="text"
                name="otp"
                value={userOTP}
                onChange={(e) => {
                  setUserOTP(e.target.value);
                }}
              />
              <div className="my-3 select-none font-[Montserrat]">
                <p>
                  Didn't received OTP?
                  <span
                    className={`text-teal-900 font-black font-[Montserrat] cursor-pointer ml-1 ${
                      resendTimer > 0 ? "opacity-50 pointer-events-none" : ""
                    }`}
                    onClick={resendOtp}
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer} seconds`
                      : "Resend OTP"}
                  </span>
                </p>
              </div>
              <button
                aria-label="verify otp"
                type="button"
                className="text-white select-none bg-gradient-to-r from-teal400 via-teal500 to-teal600 hover:bg-gradient-to-br 
          shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-full font-[Montserrat]"
                onClick={handleLogin}
              >
                Verify OTP
              </button>
            </div>
            <button
              aria-label="close icon"
              className="px-4 pb-2 pt-3 text-black font-[Montserrat] rounded absolute top-0 right-0 z-100"
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
    </>
  );
};

export default Otp;
