/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

"use client";
import Navbar from "../components/navbar/Navbar";
import { Input, Button } from "@material-tailwind/react";
import google from "../../../public/images/google.png";
import apple from "../../../public/images/apple.png";
import { useState, useEffect } from "react";
import Forget from "../components/modal/Forget";
import back from "../../../public/images/login.png";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { RecoilRoot } from "recoil";
import axios from "axios";
import ProviderStore from "@/redux/ProviderStore";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { setCookie, getCookie, hasCookie } from "cookies-next";

const Login = ({ classListData, googleRedirect }) => {
  const nav = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userList, setUserList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const [externalLoginRedirect, setExternalLoginRedirect] = useState("");
  const [isPhoneInput, setIsPhoneInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = googleRedirect;
        setExternalLoginRedirect(response.redirectUrl);
      } catch (error) {}
    };

    fetchData();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModalForget = () => {
    setIsModalOpen(true);
  };

  const handleRegister = () => {
    nav.push("/register");
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (email == "") {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: "Email or mobile number is required",
      });
      return;
    }
    if (!isValidEmail(email) && !isValidPhoneNumber(email)) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: "Email or Mobile number should be valid",
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
        title: "Password can't be empty",
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
        title: "Password must be 8 characters long",
      });
      return;
    }
    const post = { userId: email, password: password };

    try {
      const userDataResponse = await fetch("/api/login_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post }),
      });
      const res = await userDataResponse.json();

      if (res.success) {
        const user = res.user;

        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "success",
          title: `${user} you are successfully logged in`,
        });
        if (redirectParam) {
          // nav.push(`/quiz/${redirectParam}`);
          window.location.href=`/quiz/${redirectParam}`;
        } else {
          // nav.push("/");
          window.location.href="/";
          setTimeout(() => {
            // window.location.reload();
          }, 1000);
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
          title: "Incorrect username or password.",
        });
      }
    } catch (e) {
      if (e.response && e.response.status === 422) {
      }
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
    }
  };

  const handleGoogle = () => {
    nav.push(externalLoginRedirect);
  };

  const handleEmailChange = (e) => {
    const inputValue = e.target.value;

    const startsWithNumber = /^\d/.test(inputValue);

    setIsPhoneInput(startsWithNumber);

    if (startsWithNumber) {
      const phoneNumber = inputValue.slice(0, 10);
      setEmail(phoneNumber);
    } else {
      setEmail(inputValue);
    }
  };
  const handleEyeIconClick = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  function isValidPhoneNumber(email) {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(email);
  }
  return (
    <ProviderStore>
      <RecoilRoot>
        <Forget isOpen={isModalOpen} onClose={closeModal} />
        <div className="dark:bg-lightBlack select-none min-h-screen overflow-hidden">
          <div className="bg-[url('/images/loginBack.jpg')] bg-center  bg-no-repeat bg-cover h-[35vh] lg:clip "></div>
          <Navbar classListData={classListData} />
          <div className="w-full  font-Montserrat flex justify-center items-start md:items-center flex-col lg:flex-row -mt-[7rem] lg:-mt-[56px] ">
            <div className="w-[45%] md:flex md:justify-center">
              <div className="md:ml-0 w-full lg:max-w-lg rounded-lg hidden lg:block">
                <img
                  src="/images/quizard_log.svg"
                  alt=""
                  className="w-[100%] rounded-xl"
                />
              </div>
            </div>
            <div className="w-full lg:w-[45%] flex justify-center bg-white dark:bg-lightBlack rounded-lg">
              <div className="p-6 w-full">
                <h1 className="text-4xl font-bold text-center font-[Montserrat] dark:text-white">
                  Login
                </h1>
                <p className="text-xl mt-3 text-center font-[Montserrat] dark:text-white">
                  Hello Welcome
                </p>
                <div className="w-full flex justify-center mt-[1rem] mb-0">
                  <form
                    onSubmit={handleSubmitLogin}
                    className="w-[70%] flex  gap-3 flex-col"
                  >
                    <div className="flex justify-center flex-col gap-4 w-full ">
                      <Button
                        aria-label="google button"
                        size="md"
                        variant="outlined"
                        color="blue-gray"
                        className="flex items-center font-[Montserrat] gap-3 justify-center text-[10px] sm:text-[12px] py-[5px] dark:text-white"
                        onClick={handleGoogle}
                      >
                        <img
                          src="/images/google.png"
                          alt="metamask"
                          className="h-6 w-6"
                        />
                        Sign in with Google
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
                          height={24}
                          width={24}
                        />
                        Continue with Apple
                      </Button> */}
                    </div>
                    <div className="relative flex items-center ">
                      <div className="flex-grow border-t border-gray400 dark:border-white"></div>
                      <span className="flex-shrink mx-4 font-[Montserrat] text-gray400 dark:text-white">
                        or
                      </span>
                      <div className="flex-grow border-t border-gray400 dark:border-white"></div>
                    </div>
                    {isPhoneInput ? (
                      <Input
                        color="teal"
                        label="Phone Number"
                        value={email}
                        onChange={handleEmailChange}
                        className=" font-bold font-[Montserrat] dark:text-white"
                      />
                    ) : (
                      <Input
                        color="teal"
                        label="Email or Phone"
                        value={email}
                        onChange={handleEmailChange}
                        className=" font-bold font-[Montserrat] dark:text-white"
                      />
                    )}
                    <div className="relative">
                      <Input
                        color="teal"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className=" font-bold font-[Montserrat] dark:text-white"
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
                    <div className="flex justify-end ">
                      <p
                        className="text-teal-500 font-[Montserrat] font-bold dark:text-white hover:cursor-pointer ml-[13px] lg:ml-0"
                        onClick={openModalForget}
                      >
                        Forget Password
                      </p>
                    </div>
                    <div className="w-full">
                      <button
                        aria-label="login button"
                        type="submit"
                        className="text-white bg-gradient-to-r from-teal400 via-teal500 to-teal600 hover:bg-gradient-to-br 
                  shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-full  font-[Montserrat]"
                      >
                        Login
                      </button>
                    </div>
                    <div className="text-center">
                      <p className="text-md dark:text-white font-[Montserrat]">
                        Don`t have an Account ?
                        <span
                          className="text-teal500 cursor-pointer font-[Montserrat] font-bold"
                          onClick={handleRegister}
                        >
                          &nbsp; Register
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

export default Login;
