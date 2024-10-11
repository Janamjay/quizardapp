/* eslint-disable react/prop-types */
"use client";
import { useState } from "react";
import "animate.css";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Input } from "@material-tailwind/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UpdateForget = ({ isOpen, onClose, data }) => {
  const [closing, setClosing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const nav = useRouter();

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 400);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const updatePassword = {
    password: password,
    confirm_password: confirmPassword,
    mobile: data.mobile,
  };
  const handleLogin = async () => {
    if (password === "" || confirmPassword === "") {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        text: "Feild can't be Empty",
      });
      return;
    }
    const userDataResponse = await fetch("/api/update_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updatePassword }),
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
        title: response.passwordUpdateData.message,
      });
      setIsModalOpen(true);
      handleClose();
      setPassword("");
      setConfirmPassword("");
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
        title: response.passwordUpdateData.message,
      });
    }
  };
  const handleEyeIconClick = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const handleConfirmEyeIconClick = (e) => {
    e.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div
      className={`fixed font-Montserrat z-10 ${
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
            Enter Password
          </h1>
          <div className=" flex w-full justify-center flex-col items-center mt-5">
            <div className="flex flex-col w-full gap-5 mb-5">
              <div className="relative">
                <Input
                  color="teal"
                  label="Passwword"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <button
                  aria-label="show icon"
                  className="absolute right-4 top-[0.7rem] cursor-pointer focus:outline-none"
                  onClick={handleEyeIconClick}
                >
                  {showPassword ? (
                    <FaEye className="text-teal-500" />
                  ) : (
                    <FaEyeSlash className="text-teal-500" />
                  )}
                </button>
              </div>
              <div className="relative">
                <Input
                  color="teal"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="ConfirmPassword"
                  id="ConfirmPassword"
                  autoComplete="off"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                  }}
                />
                <button
                  aria-label="show icon"
                  className="absolute right-4 top-[0.7rem] cursor-pointer focus:outline-none"
                  onClick={handleConfirmEyeIconClick}
                >
                  {showConfirmPassword ? (
                    <FaEye className="text-teal-500" />
                  ) : (
                    <FaEyeSlash className="text-teal-500" />
                  )}
                </button>
              </div>
            </div>
            <button
              aria-label="enter otp"
              type="button"
              className="text-white bg-gradient-to-r from-teal400 via-teal500 to-teal600 hover:bg-gradient-to-br 
      shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-full font-[Montserrat]"
              onClick={handleLogin}
            >
              Enter OTP
            </button>
          </div>
          <button
            className="px-4 pb-2 pt-3 text-black font-[Montserrat] rounded absolute top-0 right-0 z-100"
            onClick={handleClose}
          >
            <AiOutlineClose
              aria-label="close icon"
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

export default UpdateForget;
