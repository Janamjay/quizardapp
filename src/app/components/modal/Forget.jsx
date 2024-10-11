/* eslint-disable react/prop-types */
"use client";
import { useState, useEffect } from "react";
import Otp from "./Otp";
import "animate.css";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const Forget = ({ isOpen, onClose }) => {
  const [closing, setClosing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [nationalNumber, setNationalNumber] = useState("");

  const handlePhoneChange = (value) => {
    if (value) {
      setPhone(value);
      const phoneNumber = parsePhoneNumber(value.toString());
      if (phoneNumber) {
        setCountryCode(phoneNumber.countryCallingCode);
        setNationalNumber(phoneNumber.nationalNumber);
      }
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const dataForget = {
    mobile: nationalNumber,
    country_code: countryCode,
  };
  const openModalOtp = async () => {
    if (!isValidPhoneNumber(phone)  && phone.trim() !== "") {
      const userDataResponse = await fetch("/api/forget_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataForget }),
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
        // setPhone("");
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
          title: "something went wrong",
        });
      }
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
  function isValidPhoneNumber(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  }

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 400);
  };
  return (
    <>
      <Otp
        isOpen={isModalOpen}
        onClose={closeModal}
        data={dataForget}
        openOtp={openModalOtp}
      />
      <div
        className={`fixed z-10  ${
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
            <h1 className="font-black text-lg font-[Montserrat] dark:text-white">
              Forget Password
            </h1>
            <div className=" flex w-full justify-center flex-col gap-5 items-center mt-5">
              <PhoneInput
                className={`custom-phone-input w-full font-[Montserrat] h-fit border-2 ${
                  isFocused ? "border-teal-500 " : "border-gray-500"
                } px-2 rounded-[5px]`}
                placeholder="Phone"
                value={phone}
                onChange={(value) => handlePhoneChange(value)}
                defaultCountry="IN"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <button
                type="button"
                aria-label="get otp"
                className="text-white bg-gradient-to-r from-teal400 via-teal500 to-teal600 hover:bg-gradient-to-br 
              shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-full font-[Montserrat]"
                onClick={openModalOtp}
              >
                Get OTP
              </button>
            </div>
            <button
              aria-label="close icon"
              className="px-4 pb-2 pt-3 text-black rounded font-[Montserrat] absolute top-0 right-0 z-100"
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

export default Forget;
