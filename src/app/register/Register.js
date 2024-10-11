/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import { Input, Button } from "@material-tailwind/react";
import google from "../../../public/images/google.png";
import apple from "../../../public/images/apple.png";
import { useState } from "react";
import back from "../../../public/images/login.png";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
// import Image from "next/image";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";
import VerifyOtp from "../components/modal/VerifyOtp";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { userClass, addUser } from "@/app/api/service";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = ({ classListData, googleRedirect }) => {
  const nav = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubCourse, setSelectedSubCourse] = useState("");
  const [classList, setClassList] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedSelect, setIsFocusedSelect] = useState(false);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [country, setCountry] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [newUserId, setNewUserId] = useState("");
  const [validReferStatus, setValidReferStatus] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    refferal: "",
  });
  const [externalLoginRedirect, setExternalLoginRedirect] = useState("");
  useEffect(() => {
    classLists();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = googleRedirect;
        setExternalLoginRedirect(response.redirectUrl);
      } catch (error) {}
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formattedPhone) {
      const phoneNumber = parsePhoneNumber(formattedPhone.toString());
      if (phoneNumber) {
        setPhone(phoneNumber.nationalNumber);
        setCountryCode(phoneNumber.countryCallingCode);
        setCountry(phoneNumber.country);
      } else {
        setPhone("");
        setCountryCode("");
        setCountry("");
      }
    }
  }, [formattedPhone]);

  useEffect(() => {
    setFormData({
      ...formData,
      phone: phone,
      countryCode: countryCode,
      country: country,
    });
  }, [phone, countryCode, country]);

  const handlePhoneChange = (value) => {
    setFormattedPhone(value);
  };
  const classLists = async () => {
    try {
      const response = classListData;
      setClassList(response.classes);
      const subCourseIds = response.classes.map(
        (course) => course.sub_course_id
      );
    } catch (error) {}
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const handleLogin = () => {
    nav.push("/login");
  };

  const registerUser = async () => {
    const updatedUserDataResponse = await fetch("/api/register_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formData }),
    });
    const response = await updatedUserDataResponse.json();
    if (response == undefined) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: "SOMETHING WENT WRONG",
      });
      return;
    } else if (response != undefined) {
      setNewUserId(response.user_id);
      if (response.otp_status == 0) {
        openModal();
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
          title: response.message,
        });
      } else {
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
          icon: "info",
          title: response.message,
        });
      }
    }
  };

  const validateReferral = async () => {
    const referralCode = {
      refferral_code: formData.refferal,
    };
    try {
      const response = await fetch("/api/validate_refferal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ referralCode }),
      });
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        title: response.message,
      }).then(() => {
        registerUser();
        setValidReferStatus(1);
      });
    } catch (error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: error.response.message,
      });
      return;
    }
  };
  const handlesubmitUser = async (e) => {
    try {
      e && e.preventDefault();
      if (formData.name.trim() === "") {
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
          title: "Name can't be empty",
        });
        return;
      }

      if (!isValidEmail(formData.email)) {
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
          title: "Please enter a valid email address.",
        });
        return;
      }
      if (formData.email.trim() === "") {
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
          title: "Email address can't be empty",
        });
        return;
      }
      if (formData.phone.trim() === "") {
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
          title: "Mobile number can't be empty",
        });
        return;
      }

      if (!isValidPhoneNumber(phone)) {
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
          title: "Please enter a valid 10-digit phone number.",
        });
        return;
      }
      if (formData.password.trim() == "") {
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
          title: "Password can't be empty",
        });
        return;
      }
      if (formData.password.trim().length < 8) {
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
          title: "Password must be 8 characters long",
        });
        return;
      }

      if (formData.confirmPassword.trim() == "") {
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
          title: "Confirm password can't be empty.",
        });
        return;
      }
      if (formData.confirmPassword.trim().length < 8) {
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
          title: "Confirm Password must be 8 characters long",
        });
        return;
      }
      if (formData.password.trim() !== formData.confirmPassword.trim()) {
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
          title: "Password and confirm password are not same",
        });
        return;
      }
      if (selectedSubCourse == "") {
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
          title: "Please Select Class",
        });
        return;
      }

      if (formData.refferal != "" && validReferStatus == 0) {
        validateReferral();
      } else {
        registerUser();
      }
    } catch (error) {}
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  function isValidPhoneNumber(phone) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  }
  const otpData = {
    mobile: phone,
    refferal: formData.refferal,
    user_id: newUserId,
    email: formData.email,
  };

  const handleGoogle = () => {
    nav.push(externalLoginRedirect);
  };

  const handleEyeIconClickPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const handleEyeIconClickConfirm = (e) => {
    e.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <ProviderStore>
      <RecoilRoot>
        <VerifyOtp
          isOpen={isModalOpen}
          onClose={closeModal}
          otpData={otpData}
          onSubmit={handlesubmitUser}
        />
        <div className="dark:bg-lightBlack select-none">
          <div className="bg-[url('/images/loginBack.jpg')] bg-center  bg-no-repeat bg-cover h-[35vh] lg:clip "></div>
          <Navbar classListData={classListData} />
          <div className="w-full flex justify-center items-start md:items-center flex-col lg:flex-row -mt-[7rem] lg:-mt-[40px] ">
            <div className="w-[45%] md:flex md:justify-center">
              <div className="md:ml-0 w-full lg:max-w-lg rounded-lg hidden lg:block">
                <img
                  src="/images/quizard_log.svg"
                  alt=""
                  className="w-[100%] rounded-xl"
                />
              </div>
            </div>
            <div className="w-full lg:w-[45%] flex justify-center  bg-white dark:bg-lightBlack rounded-lg">
              <div className="p-6 w-full">
                <h1 className="text-4xl font-[Montserrat] font-bold text-center dark:text-white">
                  Register
                </h1>
                <p className="text-xl font-[Montserrat] mt-3 text-center dark:text-white">
                  Hello Welcome 😊
                </p>
                <div className="w-full flex justify-center mt-[1rem] mb-0">
                  <form
                    onSubmit={handlesubmitUser}
                    className="w-[70%] flex  gap-3 flex-col"
                  >
                    <div className="flex justify-center flex-col gap-4 w-full">
                      <Button
                        aria-label="google signup"
                        size="md"
                        variant="outlined"
                        color="blue-gray"
                        className="flex items-center gap-3 justify-center text-[10px] sm:text-[12px] py-[5px] dark:text-white font-[Montserrat]"
                        onClick={handleGoogle}
                      >
                        <img
                          src="/images/google.png"
                          alt="metamask"
                          className="h-6 w-6"
                        />
                        Signup with Google
                      </Button>
                      {/* <Button
                        size="md"
                        variant="outlined"
                        color="blue-gray"
                        className="flex items-center gap-3 justify-center text-[8px] sm:text-[11px] py-[5px] dark:text-white"
                      >
                        <Image
                          src={apple}
                          alt="metamask"
                          width={24}
                          height={24}
                        />
                        Continue with Apple
                      </Button>*/}
                    </div>
                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-gray400 dark:border-white "></div>
                      <span className="flex-shrink mx-4 font-[Montserrat] text-gray400 dark:text-white">
                        or
                      </span>
                      <div className="flex-grow border-t border-gray400 dark:border-white"></div>
                    </div>
                    <Input
                      color="teal"
                      label="Name"
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="off"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className=" font-bold font-[Montserrat] dark:text-white"
                    />
                    <Input
                      color="teal"
                      label="Email"
                      type="text"
                      name="email"
                      id="email"
                      autoComplete="off"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className=" font-bold font-[Montserrat] dark:text-white"
                    />
                    <PhoneInput
                      className={`custom-phone-input dark:bg-lightBlack  font-[Montserrat] h-fit border-[1px] ${
                        isFocused ? "border-teal-500 " : "border-gray-500"
                      } pl-2 rounded-[5px]`}
                      placeholder="Phone"
                      value={formattedPhone}
                      defaultCountry="IN"
                      onChange={(value) => handlePhoneChange(value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                    <div className="relative">
                      <Input
                        color="teal"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        autoComplete="off"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className=" font-bold  font-[Montserrat] dark:text-white"
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
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        autoComplete="off"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className=" font-bold font-[Montserrat] dark:text-white"
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
                    <select
                      value={selectedSubCourse}
                      onChange={(e) => {
                        setSelectedSubCourse(e.target.value);
                        setFormData({
                          ...formData,
                          selectedSubCourse: e.target.value,
                        });
                      }}
                      className={`border-[1px] border-gray500 font-[Montserrat] dark:text-white dark:bg-lightBlack px-2.5 rounded-[5px] h-[35px] dark:border-white  ${
                        isFocusedSelect
                          ? " border-teal-500 "
                          : "border-gray-500"
                      }`}
                      onFocus={() => setIsFocusedSelect(true)}
                      onBlur={() => setIsFocusedSelect(false)}
                    >
                      <option
                        value=""
                        disabled
                        className="dark:text-white dark:bg-lightBlack"
                      >
                        Select Class
                      </option>
                      {classList
                        .filter(
                          (course) =>
                            !["JEE Main", "JEE Advanced", "NEET"].includes(
                              course.sub_course_name
                            )
                        )
                        .map((course) => (
                          <option
                            key={course.sub_course_id}
                            value={course.sub_course_id}
                            className="dark:text-white dark:bg-lightBlack"
                          >
                            {course.sub_course_name}
                          </option>
                        ))}
                    </select>
                    <div className="sm:flex gap-2 justify-between w-full items-center">
                      <p className="sm:w-[70%] font-[Montserrat] pb-3 sm:pb-0 text-[13px] dark:text-white">
                        Have a Refferal Code !!
                      </p>
                      <Input
                        className="sm:w-[100%] font-[Montserrat] dark:text-white"
                        color="teal"
                        label="Refferal Code"
                        type="text"
                        name="refferal"
                        id="refferal"
                        autoComplete="off"
                        value={formData.refferal}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            refferal: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex  items-start sm:items-center ">
                      <p className="text-[11px] font-[Montserrat] text-justify dark:text-white">
                        By clicking Reister , you agree to our
                        <Link
                          href={"/terms-conditions"}
                          className="text-blue-900 dark:text-green-500 font-semibold"
                        >
                          &nbsp; Terms & Conditions
                        </Link>
                        &nbsp; ,
                        <Link
                          href={"/privacy"}
                          className="text-blue-900 dark:text-green-500 font-semibold"
                        >
                          &nbsp; Privacy Policy
                        </Link>
                        &nbsp; and
                        <Link
                          href={"/privacy"}
                          className="text-blue-900 dark:text-green-500 font-semibold"
                        >
                          &nbsp; Cookies Policy
                        </Link>
                        . You may receive SMS notifications from us and can opt
                        out at any time.
                      </p>
                    </div>
                    <div className="w-full">
                      <button
                        aria-label="register button"
                        type="submit"
                        className="text-white bg-gradient-to-r from-teal400 via-teal500 to-teal600 hover:bg-gradient-to-br 
                    shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-bold rounded-lg text-sm px-5 font-[Montserrat] py-2.5 text-center w-full"
                      >
                        Register
                      </button>
                    </div>
                    <div className="text-center">
                      <p className="text-md font-[Montserrat] dark:text-white">
                        Have an Account ?
                        <span
                          className="text-teal500 font-bold cursor-pointer"
                          onClick={handleLogin}
                        >
                          &nbsp; Login
                        </span>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RecoilRoot>
    </ProviderStore>
  );
};

export default Register;
