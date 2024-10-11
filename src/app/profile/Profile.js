/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
//
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Navigation from "../components/navigationBar/Navigation";
import { FaUserTie } from "react-icons/fa6";
import { BsGenderAmbiguous } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { BiUserCircle, BiSolidContact } from "react-icons/bi";
import Swal from "sweetalert2";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";
import { updateUser } from "../api/service";
import pass from "../../../public/images/pass.png";
import Cookies from "js-cookie";
import { getCookie, setCookie } from "cookies-next";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Image from "next/image";
import emailImage from "../../../public/images/email.svg";
import {
  parsePhoneNumber,
  getCountryCallingCode,
} from "react-phone-number-input";
import { Input } from "@material-tailwind/react";
import DNALoader from "../utils/DNALoader";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Resizer from "react-image-file-resizer";

const Profile = ({ classListData, userProfileData }) => {
  const [userProfilePassword, setUserProfilePassword] = useState(true);
  const [reload, setReload] = useState(false);
  const [userData, setUserData] = useState({});
  const [userDataCoin, setUserDataCoin] = useState({});
  const [fullNameEditMode, setFullNameEditMode] = useState(false);
  const [genderEditMode, setGenderEditMode] = useState(false);
  const [emailEditMode, setEmailEditMode] = useState(false);
  const [contactEditMode, setContactEditMode] = useState(false);
  const [dobEditMode, setDobEditMode] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  const [updatedFullName, setUpdatedFullName] = useState("");
  const [updatedGender, setUpdatedGender] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedDob, setUpdatedDob] = useState("");
  const [updatedImage, setUpdatedImage] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [value, setValue] = useState();
  const [loading, setLoading] = useState(true);
  let countryName;
  const defaultImage =
    "/images/userImage.webp";

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = userProfileData;
      setUserData(response.user_details);
      setUserDataCoin(response);
      setCountryCode(response.user_details.country_code);
      setCountry(response.user_details.country);
      setUpdatedFullName(response.user_details.user_name);
      setUpdatedEmail(response.user_details.email);
      setImage(response.user_details.user_profile_pic);
      setPhone(response.user_details.mobile);
      setUpdatedGender(response.user_details.gender);
      setUpdatedDob(response.user_details.age);
      setLoading(false);

      const formattedCoinScore = response.user_coin;
      const coinScore =
        formattedCoinScore > 1000
          ? (formattedCoinScore / 1000).toFixed(1) + "k"
          : formattedCoinScore;

      setCookie("score", coinScore);
    } catch (error) {}
  };

  const handleEditModeToggleFullName = () => {
    setFullNameEditMode(true);
    setShowUpdateButton(true);
  };
  const handleEditModeToggleName = () => {
    setGenderEditMode(true);
    setShowUpdateButton(true);
  };
  const handleEditModeToggleEmail = () => {
    setEmailEditMode(true);
    setShowUpdateButton(true);
  };
  const handleEditModeTogglePhone = () => {
    setDobEditMode(true);
    setShowUpdateButton(true);
  };
  const handleEditModeToggleContact = () => {
    setContactEditMode(true);
    setShowUpdateButton(true);
  };

  const handleEditModeSubmit = async () => {
    try {
      if (
        (fullNameEditMode && !updatedFullName) ||
        (emailEditMode && !updatedEmail) ||
        (contactEditMode && !phone) ||
        (dobEditMode && !updatedDob)
      ) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "error",
          title: "Please fill in all the required fields.",
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", updatedFullName);
      formData.append(
        "gender",
        genderEditMode ? updatedGender : userData.gender
      );
      formData.append("email", emailEditMode ? updatedEmail : userData.email);
      formData.append("mobile", contactEditMode ? phone : userData.mobile);
      formData.append("dob", dobEditMode ? updatedDob : userData.age);
      formData.append("profile_image", updatedImage);
      formData.append("country_code", countryCode ? countryCode : 91);
      formData.append(
        "country_name",
        country ? country : userData.user_country
      );
      const updatedUserDataResponse = await fetch("/api/profile_update", {
        method: "POST",
        body: formData,
      });
      const response = await updatedUserDataResponse.json();
      fetchData();
      setLoading(false);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: response,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      // console.log(error);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Update the Mobile also",
      });
    }

    setFullNameEditMode(false);
    setGenderEditMode(false);
    setEmailEditMode(false);
    setContactEditMode(false);
    setDobEditMode(false);
    setShowUpdateButton(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Resizer.imageFileResizer(
          file,
          300, // Width
          300, // Height
          "JPEG", // Format
          100, // Quality
          0, // Rotation
          (uri) => {
            const resizedFile = dataURLtoFile(uri, "resized_image.jpeg");
            setImage(URL.createObjectURL(resizedFile));
            setUpdatedImage(resizedFile);
            setShowUpdateButton(true);
          },
          "base64"
        );
      } else {
        setImage(URL.createObjectURL(file));
        setUpdatedImage(file);
        setShowUpdateButton(true);
      }
    }
  };
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  useEffect(() => {
    if (value) {
      const phoneNumber = parsePhoneNumber(value);
      setPhone(phoneNumber?.nationalNumber);
      countryName = phoneNumber?.country;
      setCountry(phoneNumber?.country);
      if (countryName) {
        setCountryCode(parseInt(getCountryCallingCode(countryName)));
      }
    }
  }, [value]);

  const formatDate = (dob) => {
    if (!dob) return "";

    const date = new Date(dob);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}-${formattedMonth}-${year}`;
  };

  const handlePassword = () => {
    setUserProfilePassword(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const updatePasswordData = {
      mobile: userData.mobile,
      old_password: oldPassword,
      password: password,
      confirm_password: password,
    };
    if (oldPassword == "") {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        text: "Old password can't be empty",
      });
      return;
    }
    if (oldPassword.trim().length < 8) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        text: "Old Password must be 8 characters long",
      });
      return;
    }
    if (password == "") {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        text: "New Password can't be empty.",
      });
      return;
    }
    if (password.trim().length < 8) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        text: "New Password must be 8 characters long",
      });
      return;
    }
    if (confirmPassword == "") {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        text: "Confirm New password can't be empty",
      });
      return;
    }
    if (confirmPassword.trim().length < 8) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        text: "Confirm New Password must be 8 characters long",
      });
      return;
    }
    if (password != confirmPassword) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        text: "New Password and Confirm New Password should be same",
      });
      return;
    }
    const userDataResponse = await fetch("/api/update_logged_user_password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updatePasswordData }),
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
      setUserProfilePassword(true);
      setPassword("");
      setConfirmPassword("");
      setOldPassword("");
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
    return;
  };

  const handleEyeIconClickOld = (e) => {
    e.preventDefault();
    setShowOldPassword(!showOldPassword);
  };
  const handleEyeIconClickPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const handleEyeIconClickConfirm = (e) => {
    e.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };
  const styleShadow = "text-quizard-style";
  return (
    <ProviderStore>
      <RecoilRoot>
        <Navbar classListData={classListData} shadow={styleShadow} />
        {loading ? (
          <DNALoader />
        ) : (
          <div key={reload}>
            <div className="wave-container relative select-none pt-[4rem] bg-cyan400 dark:bg-cyan600 ">
              <div className="ml-[1.5rem] sm:ml-[5rem] h-[25vh] sm:h-[30vh] xxl:h-[40vh] hidden sm:flex justify-start items-center ">
                <div className="flex flex-col gap-y-3 text-white">
                  <h1 className="text-2xl font-[Montserrat] sm:text-3xl xl:text-4xl">
                    {userData && userData.user_name}
                  </h1>
                  <h4 className="text-xl sm:text-2xl font-[Montserrat] truncate max-w-[150px] sm:max-w-full ml-1">
                    {userData && userData.email}
                  </h4>
                </div>
              </div>
              <div className="w-full flex justify-center absolute top-[51%] sm:top-[62%] lg:top-[50%]  xl:top-[31%]">
                <div className="w-full h-full">
                  <div className="relative w-[80px] h-[80px] sm:w-[130px] sm:h-[130px] xl:w-[150px] xl:h-[150px] left-[60%] xl:left-[63%] xxl:left-[60%]">
                    <label
                      htmlFor="image"
                      className="cursor-pointer absolute top-0 right-0 w-full h-full rounded-[50%] border-[3px] border-cyan-400"
                    >
                      {userProfilePassword == true ? (
                        <>
                          <input
                            type="file"
                            id="image"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                          />
                          <FiEdit
                            className="absolute top-[94%] left-[77%] transform -translate-x-1/2 -translate-y-1/2 text-red-600 z-100 
                          text-[1rem] sm:text-[1.5rem] xl:text-[1.8rem]"
                          />
                        </>
                      ) : null}
                      <img
                        src={image == null ? defaultImage : image}
                        alt="user"
                        className="w-full h-full rounded-[50%]"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <>
              {userProfilePassword ? (
                <div className="w-full px-[1rem] pt-[3rem] select-none sm:pt-[4rem] lg:pt-3 flex justify-center items-center flex-col gap-6 pb-[6rem] sm:pb-8">
                  <div className="flex justify-start items-center gap-3 w-full xl:px-[3.5rem]">
                    <div className="rounded-[50%] shadow-xl w-[60px] h-[60px] bg-gray-300 flex items-center justify-center">
                      <FaUserTie className=" text-2xl sm:text-3xl" />
                    </div>
                    <div className="ml-4">
                      <label className="text-gray-600 font-[Montserrat] sm:text-2xl">
                        Full Name
                      </label>
                      {fullNameEditMode ? (
                        <div className="flex gap-3 justify-start items-center">
                          <input
                            autoFocus
                            type="text"
                            value={updatedFullName}
                            onChange={(e) => {
                              setUpdatedFullName(e.target.value);
                            }}
                            className="w-[80%] font-[Montserrat] text-black font-bold p-1 rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex gap-3 justify-start items-center">
                          <p className="font-semibold font-[Montserrat] max-w-full sm:text-xl">
                            {userData && userData.user_name}
                          </p>
                          <p
                            className="cursor-pointer font-[Montserrat]"
                            onClick={handleEditModeToggleFullName}
                          >
                            <FiEdit />
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-3 w-full xl:px-[3.5rem]">
                    <div className="rounded-[50%] shadow-xl w-[60px] h-[60px] bg-gray-300 flex items-center justify-center">
                      <BsGenderAmbiguous className="text-cyan400 text-2xl sm:text-3xl" />
                    </div>
                    <div className="ml-4">
                      <h1 className="text-gray-600 sm:text-2xl font-[Montserrat]">
                        Gender
                      </h1>
                      {genderEditMode ? (
                        <div className="flex gap-3 font-[Montserrat] justify-start items-center text-black font-bold p-1">
                          <input
                            type="radio"
                            value={updatedGender}
                            name="gender"
                            checked={updatedGender === "Male"}
                            onChange={() => setUpdatedGender("Male")}
                          />
                          Male
                          <input
                            type="radio"
                            value={updatedGender}
                            name="gender"
                            checked={updatedGender === "Female"}
                            onChange={() => setUpdatedGender("Female")}
                          />
                          Female
                        </div>
                      ) : (
                        <div className="flex gap-3 justify-start items-center">
                          <span className="font-semibold font-[Montserrat] max-w-full sm:text-xl">
                            {userData && userData.gender}
                          </span>
                          <span
                            className="cursor-pointer"
                            onClick={handleEditModeToggleName}
                          >
                            <FiEdit />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-3 w-full xl:px-[3.5rem]">
                    <div className="rounded-[50%] shadow-xl h-[60px] w-[80px] sm:w-[65px] bg-gray-300 flex items-center justify-center">
                      <BiUserCircle className="text-red600 text-2xl sm:text-3xl" />
                    </div>
                    <div className="ml-4 w-full">
                      <h1 className="text-gray-600 font-[Montserrat] sm:text-2xl">
                        Email
                      </h1>
                      {emailEditMode ? (
                        <div className="flex gap-3 justify-start items-center ">
                          <input
                            autoFocus
                            type="text"
                            value={updatedEmail}
                            onChange={(e) => {
                              setUpdatedEmail(e.target.value);
                            }}
                            className=" text-black w-full sm:w-[30%] font-[Montserrat] font-bold p-1 rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex gap-3 justify-start items-center">
                          <span className="font-semibold font-[Montserrat] max-w-full sm:text-xl">
                            {userData && userData.email}
                          </span>
                          <span
                            className="cursor-pointer"
                            onClick={handleEditModeToggleEmail}
                          >
                            <FiEdit />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-start items-center  gap-3 w-full xl:px-[3.5rem]">
                    <div className="rounded-[50%] shadow-xl w-[60px] h-[60px] bg-gray-300 flex items-center justify-center">
                      <BiSolidContact className="text-[#ec4899] text-2xl sm:text-3xl" />
                    </div>
                    <div className="ml-4">
                      <h1 className="text-gray-600 sm:text-2xl">Contact</h1>
                      {contactEditMode ? (
                        <div className="flex gap-3 justify-start items-center">
                          <PhoneInput
                            autoFocus
                            defaultCountry="IN"
                            type="text"
                            value={phone ? `+${countryCode}${phone}` : ""}
                            onChange={setValue}
                            className="w-[80%] text-black font-[Montserrat] font-bold p-1 rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex gap-3 justify-start items-center">
                          <span className="flex gap-0 font-semibold font-[Montserrat] max-w-full sm:text-xl">
                            +
                            <input
                              className="w-[23px] font-[Montserrat] bg-transparent"
                              value={countryCode}
                              disabled
                            />
                            -{userData && userData.mobile}
                          </span>
                          <span
                            className="cursor-pointer"
                            onClick={handleEditModeToggleContact}
                          >
                            <FiEdit />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-3 w-full xl:px-[3.5rem]">
                    <div className="rounded-[50%] shadow-xl w-[60px] h-[60px] bg-gray-300 flex items-center justify-center">
                      <LiaBirthdayCakeSolid className="text-brown-400 text-2xl sm:text-3xl" />
                    </div>
                    <div className="ml-4">
                      <h1 className="text-gray-600 font-[Montserrat] sm:text-2xl">
                        DOB
                      </h1>
                      {dobEditMode ? (
                        <div className="flex gap-3 justify-start items-center">
                          <input
                            autoFocus
                            type="date"
                            value={updatedDob}
                            onChange={(e) => {
                              setUpdatedDob(e.target.value);
                            }}
                            className="w-[100%] font-[Montserrat] text-black font-bold p-1 rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex gap-3 justify-start items-center">
                          <span className="font-semibold font-[Montserrat] max-w-full sm:text-xl">
                            {userData && formatDate(userData.age)}
                          </span>
                          <span
                            className="cursor-pointer"
                            onClick={handleEditModeTogglePhone}
                          >
                            <FiEdit />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-start items-center gap-3 w-full xl:px-[3.5rem]">
                    <div className="rounded-[50%] shadow-xl w-[60px] h-[60px] bg-gray-300 flex items-center justify-center">
                      <Image src={pass} alt="" width={50} height={50} />
                    </div>
                    <div className="ml-4">
                      <div
                        className="flex gap-3 justify-start items-center cursor-pointer"
                        onClick={handlePassword}
                      >
                        <span className="font-semibold font-[Montserrat] max-w-full sm:text-xl">
                          Change Password
                        </span>
                        <span className="cursor-pointer">
                          {/* <FiEdit /> */}
                        </span>
                      </div>
                    </div>
                  </div>
                  {showUpdateButton && (
                    <button
                      aria-label="update profile"
                      className="w-[90%] sm:w-[50%] text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-bold rounded-lg text-sm px-5 py-2.5 text-center font-[Montserrat]"
                      onClick={handleEditModeSubmit}
                    >
                      Update Profile
                    </button>
                  )}
                </div>
              ) : (
                <div className="my-[3rem] justify-center gap-[3rem] select-none w-full flex flex-col sm:flex-row items-center ">
                  <div className="sm:w-[40%] mx-10 sm:mx-0">
                    <h1 className="text-justify font-[Montserrat] mb-[1rem] text-2xl text-[#212529] font-semibold">
                      Change Password
                    </h1>
                    <form onSubmit={handlePasswordUpdate}>
                      <div className="flex flex-col gap-5">
                        <div className="relative">
                          <Input
                            color="teal"
                            label="Old Password"
                            type={showOldPassword ? "text" : "password"}
                            name="oldPassword"
                            id="oldPassword"
                            autoComplete="off"
                            value={oldPassword}
                            onChange={(e) => {
                              setOldPassword(e.target.value);
                            }}
                          />
                          <button
                            aria-label="show icon"
                            className="absolute right-4 top-[0.7rem] cursor-pointer focus:outline-none"
                            onClick={handleEyeIconClickOld}
                          >
                            {showOldPassword ? (
                              <FaEye className="text-teal-500" />
                            ) : (
                              <FaEyeSlash className="text-teal-500" />
                            )}
                          </button>
                        </div>
                        <div className="relative">
                          <Input
                            color="teal"
                            label="New Password"
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
                            onClick={handleEyeIconClickPassword}
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
                            label="Confirm New Password"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            id="confirmPassword"
                            autoComplete="off"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                            }}
                          />
                          <button
                            aria-label="show icon"
                            className="absolute right-4 top-[0.7rem] cursor-pointer focus:outline-none"
                            onClick={handleEyeIconClickConfirm}
                          >
                            {showConfirmPassword ? (
                              <FaEye className="text-teal-500" />
                            ) : (
                              <FaEyeSlash className="text-teal-500" />
                            )}
                          </button>
                        </div>
                      </div>
                      {oldPassword == "" &&
                      password == "" &&
                      confirmPassword == "" ? (
                        <button
                          aria-label="back button"
                          type="button"
                          className="text-white bg-gradient-to-r from-teal400 via-teal500 to-teal600 hover:bg-gradient-to-br 
                      shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 
                      text-center  my-5 w-full font-[Montserrat]"
                          onClick={() => setUserProfilePassword(true)}
                        >
                          Go back
                        </button>
                      ) : (
                        <button
                          aria-label="update password"
                          type="submit"
                          className="text-white bg-gradient-to-r from-teal400 via-teal500 to-teal600 hover:bg-gradient-to-br 
                      shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 
                      text-center  my-5 w-full font-[Montserrat]"
                        >
                          Update Password
                        </button>
                      )}
                    </form>
                  </div>
                  <div className="sm:w-[30%] pb-[2rem] sm:pb-0">
                    <div className="flex justify-center w-full">
                      <Image
                        src={emailImage}
                        width={50}
                        height={50}
                        alt="email"
                      />
                    </div>
                    <h1 className="text-center font-[Montserrat] mb-[10px] text-xl text-[#212529] font-medium">
                      Contact support
                    </h1>
                    <p className="text-center font-[Montserrat] text-sm text-[#212529] ">
                      Please feel free to write an email to us.
                      care@quizard.app
                    </p>
                  </div>
                </div>
              )}
            </>
          </div>
        )}
        <Navigation />
      </RecoilRoot>
    </ProviderStore>
  );
};

export default Profile;
