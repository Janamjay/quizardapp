/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
"use client";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import coin from "../../../../public/images/coin.png";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Switcher from "../darktheme/Switcher";
import Image from "next/image";
import dynamic from "next/dynamic";
import { userClass, userUpdateClass } from "@/app/api/service";
import Swal from "sweetalert2";
import { setCookie, getCookie, deleteCookie } from "cookies-next";

const Navbar = ({
  bgColor,
  startColor,
  startbg,
  borderBottom,
  searchQuery,
  setSearchQuery,
  score,
  path,
  classListData,
  shadow,
}) => {
  const pathname = usePathname();
  const [keyForRerender, setKeyForRerender] = useState(false);
  const [navColor, setnavColor] = useState("transparent");
  const [selectedClass, setSelectedClass] = useState("");
  const [classId, setClassId] = useState([]);
  const [apiClassId, setApiClassId] = useState();
  const [userClasssId, setUserClassId] = useState("");
  const [classList, setClassList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [input, setInput] = useState("");
  const [loggedUser, setloggeduser] = useState("");
  const [localClasssName, setLocalClassName] = useState("");
  const Links = [
    { name: "Live Quiz", link: "/start" },
    // { name: "Refer & Earn", link: "/refer" },
  ];
  const [open, setOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [userDataCoin, setUserDataCoin] = useState();
  const navbarRef = useRef(null);
  const nav = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("selectedClass");
      setLocalClassName(storedValue);
    }
    setClassList(classListData.classes);
    const subCourseIds = classListData.classes.map(
      (course) => course.sub_course_id
    );
    setClassId(subCourseIds);
  }, []);

  useEffect(() => {
    // classLists();
    const isLoggedIn = getCookie("isUserLoggedIn");
    const coinScore = getCookie("score");
    const apiClassId = getCookie("class_user_id");
    const userClasssId = getCookie("class_name");
    const defaultClass = getCookie("default_class_user_id");
    setUserDataCoin(coinScore);
    setloggeduser(isLoggedIn);
    setApiClassId(apiClassId);
    // setLocalClassName(defaultClass);
    setUserClassId(userClasssId);
  }, []);

  const handleHome = () => {
    nav.push("/");
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (searchQuery || input) {
      nav.push(`/search?q=${searchQuery || input}`);
    }
  };
  const listenScrollEvent = () => {
    window.scrollY > 20
      ? setnavColor(bgColor || startbg || "#22d3ee")
      : setnavColor("transparent");
  };

  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    return () => {
      window.removeEventListener("scroll", listenScrollEvent);
    };
  }, [bgColor]);

  useEffect(() => {
    const closeNavbar = (event) => {
      if (
        open &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", closeNavbar);

    return () => {
      document.removeEventListener("mousedown", closeNavbar);
    };
  }, [open]);

  const handlelogOut = async () => {
    const logoutResponse = await fetch("/api/logout_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await logoutResponse.json();
    if (res.success) {
      nav.push("/");
      setKeyForRerender(true);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        title: res.message,
      }).then(() => {
        window.location.reload();
      });
    }
  };
  const handleSearchInputChange = (e) => {
    if (setSearchQuery) {
      setSearchQuery(e.target.value);
    } else {
      setInput(e.target.value);
    }
  };

  // const classLists = async () => {
  //   try {
  //     const response = await userClass();
  //     // if (!loggedUser) {
  //     //   const defaultClassId = response.data.classes[0].sub_course_id;
  //     //   setCookie("default_class_user_id", defaultClassId);
  //     //   localStorage.setItem("selectedClass", defaultClassId);
  //     // }
  //     setClassList(response.data.classes);
  //     const subCourseIds = response.data.classes.map(
  //       (course) => course.sub_course_id
  //     );
  //     setClassId(subCourseIds);
  //   } catch (error) {
  //     if (error.response && error.response.status == 401) {
  //     }
  //   }
  // };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    const id = classList.find(
      (course) => course.sub_course_name === e.target.value
    )?.sub_course_id;
    setSelectedClassId(id);
    setClassId(id);
    // console.log(id);
  };

  useEffect(() => {
    if (selectedClassId !== null) {
      if (selectedClassId) {
        setCookie("class_user_id", selectedClassId, {
          // httpOnly: true,
          // sameSite: true,
          // secure: true,
        });
        // console.log(selectedClassId);
        setUserClassId(selectedClass);
        setCookie("class_name", selectedClass);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "success",
          title: "Class updated successfully",
        }).then(() => {
          window.location.reload();
        });
        if (!loggedUser) {
          setCookie("selectedClass", selectedClass);
          setCookie("class_user_id", selectedClassId, {
            // httpOnly: true,
            // sameSite: true,
            // secure: true,
          });
          setLocalClassName(selectedClass);
          setApiClassId(selectedClassId);
          if (pathname == path) {
            nav.push("/");
          }
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
          });
          Toast.fire({
            icon: "success",
            title: "Class updated successfully",
          }).then(() => {
            window.location.reload();
          });
        }
      } else {
        setCookie("class_user_id", apiClassId);
        updateClassLists();
      }
      // if (loggedUser) {
      //   updateClassLists(loggedUser);
      // }
    }
  }, [selectedClassId, selectedClass]);
  const updateClassLists = async (loggedUser, classId) => {
    try {
      const post = { loggedUser: loggedUser, classId: classId };
      const response = await fetch("/api/update_user_class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post }),
      });
      // const response = await userUpdateClass(loggedUser, classId);
      if (response.message) {
        if (pathname == path) {
          nav.push("/");
        }
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
          window.location.reload();
        });
      }
    } catch (error) {}
  };

  return (
    <div
      key={keyForRerender}
      className={`w-full select-none font-Montserrat fixed top-0 left-0 z-50  ${
        borderBottom
          ? "border-b-[3px] border-gray-300 dark:border-gray-700"
          : ""
      }`}
    >
      <div
        className={`md:flex items-center justify-between  dark:bg-cyan600 pr-7 py-2 `}
        style={{
          backgroundColor: startbg ? startbg : navColor,
        }}
      >
        <div className="flex justify-between items-center">
          <div
            onClick={() => setOpen(!open)}
            className={`text-xl z-[200] mt-[-2px] sm:mt-0 px-4  cursor-pointer md:hidden ${
              startColor === "text-cyan500" ? "text-cyan500" : "text-white"
            }`}
          >
            {open ? <FaTimes /> : <FaBars />}
          </div>
          <div
            className={` text-4xl  w-full  sm:mr-0 cursor-pointer md:pl-[55px] text-[rgb(255,255,0)]  flex items-center  justify-start sm:justify-center    ${
              startColor === "text-cyan500"
                ? "text-[rgb(255,255,0)]"
                : "text-[rgb(255,255,0)]"
            } md:justify-start`}
            onClick={handleHome}
          >
            <p className={`title pt-1 font-Lollipop ${shadow}`}>
              {isSearchVisible && window.innerWidth <= 640 ? "" : "Quizard"}
            </p>
          </div>

          <div
            className={`flex justify-between ${
              loggedUser && keyForRerender == false ? "gap-[3.7rem]" : ""
            } `}
          >
            {/* <div className="">
              {
                <div
                  className={`relative z-10  md:hidden ${
                    startColor === "text-cyan500"
                      ? "text-cyan500"
                      : "text-white"
                  }`}
                >
                  {isSearchVisible ? (
                    <>
                      <input
                        type="search"
                        name="serch"
                        placeholder="Search"
                        value={searchQuery || input}
                        onChange={handleSearchInputChange}
                        className="bg-white font-bold   text-[rgb(255,255,0)] hover:text-white w-[200px]  border-2 border-gray-500 text-black h-10 px-5 pr-10 mr-[1.8rem] rounded-full text-sm focus:outline-none"
                      />
                      <button
                        onClick={toggleSearch}
                        className="absolute right-0 top-0 mt-3 mr-[2.5rem] "
                      >
                        <svg
                          className={`h-4 w-4 fill-current ${
                            startColor === "text-cyan500"
                              ? "text-cyan500"
                              : "text-blue-500"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          version="1.1"
                          id="Capa_1"
                          x="0px"
                          y="0px"
                          viewBox="0 0 56.966 56.966"
                          style={{
                            enableBackground: "new 0 0 56.966 56.966",
                          }}
                          xmlSpace="preserve"
                          width="512px"
                          height="512px"
                        >
                          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="relative ">
                      <button
                        onClick={toggleSearch}
                        className="mt-3 mr-[1.5rem] text-bold"
                      >
                        <svg
                          className="h-4 w-4 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          version="1.1"
                          id="Capa_1"
                          x="0px"
                          y="0px"
                          viewBox="0 0 56.966 56.966"
                          style={{
                            enableBackground: "new 0 0 56.966 56.966",
                          }}
                          xmlSpace="preserve"
                          width="512px"
                          height="512px"
                        >
                          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              }
            </div> */}
            <div className="block md:hidden"></div>
            {loggedUser && keyForRerender == false && (
              <div>
                <button
                  aria-label="score"
                  type="button"
                  className="text-lg  bg-[#0084AF] h-[40px] md:pb-5 px-2.5 rounded-full md:hidden absolute right-5 top-1/2 transform -translate-y-1/2 flex items-center"
                >
                  <span className="mr-2 text-yellow400">
                    <Image src={coin} alt="" width={20} />
                  </span>
                  <span className="font-black font-[Montserrat] text-yellow-300 ">
                    {score || userDataCoin ? userDataCoin : 0}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
        <ul
          className="hidden md:flex space-x-8"
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* <li>
            <div
              className={`relative ${
                startColor === "text-cyan500" ? "text-cyan500" : "text-white"
              }`}
            >
              {isSearchVisible ? (
                <>
                  <input
                    type="search"
                    name="serch"
                    placeholder="Search"
                    value={searchQuery || input}
                    onChange={handleSearchInputChange}
                    className="bg-white font-bold   text-[rgb(255,255,0)] hover:text-white border-2 border-gray-500 text-black h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
                  />
                  <button
                    onClick={toggleSearch}
                    className="absolute right-0 top-0 mt-3 mr-4"
                  >
                    <svg
                      className={`h-4 w-4 fill-current ${
                        startColor === "text-cyan500"
                          ? "text-cyan500"
                          : "text-blue-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      id="Capa_1"
                      x="0px"
                      y="0px"
                      viewBox="0 0 56.966 56.966"
                      style={{ enableBackground: "new 0 0 56.966 56.966" }}
                      xmlSpace="preserve"
                      width="512px"
                      height="512px"
                    >
                      <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                    </svg>
                  </button>
                </>
              ) : (
                <button onClick={toggleSearch} className="mt-3 mr-4 text-bold">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    id="Capa_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 56.966 56.966"
                    style={{ enableBackground: "new 0 0 56.966 56.966" }}
                    xmlSpace="preserve"
                    width="512px"
                    height="512px"
                  >
                    <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                  </svg>
                </button>
              )}
            </div>
          </li> */}
          <li>
            <Switcher />
          </li>
          {Links.map((link) => (
            <li key={link.name} className="text-xl">
              <Link
                href={link.link}
                className={` font-bold font-[Montserrat]  text-[rgb(255,255,0)] hover:text-white ${
                  startColor === "text-cyan500"
                    ? "text-[rgb(255,255,0)]"
                    : "text-[rgb(255,255,0)]"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {loggedUser && keyForRerender == false ? (
            <>
              {/* <li key="Leaderboard" className="text-xl">
                <Link
                  href="/leaderboard"
                  className={` font-bold   text-[rgb(255,255,0)] hover:text-white duration-500 ${
                    startColor === "text-cyan500"
                      ? "text-cyan500"
                      : "text-white"
                  }`}
                >
                  Leaderboard
                </Link>
              </li> */}
              {/* <li key="Activity" className="text-xl">
                <Link
                  href={loggedUser ? "/activity" : "/"}
                  className={` font-bold   text-[rgb(255,255,0)] hover:text-white duration-500 ${
                    startColor === "text-cyan500"
                      ? "text-cyan500"
                      : "text-white"
                  }`}
                >
                  Activity
                </Link>
              </li> */}
              <li key="profile" className="text-xl">
                <Link
                  href="/profile"
                  className={` font-bold  font-[Montserrat] text-[rgb(255,255,0)] hover:text-white ${
                    startColor === "text-[rgb(255,255,0)]"
                      ? "text-cyan500"
                      : "text-[rgb(255,255,0)]"
                  }`}
                >
                  Profile
                </Link>
              </li>
              {/* <li key="create" className="text-xl">
                <Link
                  href="/admin"
                  className={` font-bold   text-[rgb(255,255,0)] hover:text-white duration-500 ${
                    startColor === "text-cyan500"
                      ? "text-cyan500"
                      : "text-white"
                  }`}
                >
                  Create Quiz
                </Link>
              </li> */}
              <select
                id="classDropdown"
                value={
                  loggedUser && keyForRerender == false
                    ? userClasssId
                    : userClasssId
                }
                onChange={handleClassChange}
                className={`text-xl font-bold font-[Montserrat] text-[rgb(255,255,0)] hover:text-white cursor-pointer bg-inherit border-0 outline-none ${
                  startColor === "text-cyan500"
                    ? "text-[rgb(255,255,0)]"
                    : "text-[rgb(255,255,0)]"
                }`}
              >
                {classList
                  .filter(
                    (course) =>
                      !["NEET", "JEE Main", "JEE Advanced"].includes(
                        course.sub_course_name
                      )
                  )
                  .map((course) => (
                    <option
                      key={course.sub_course_id}
                      value={course.sub_course_name}
                      className="text-black font-[Montserrat]"
                    >
                      {course.sub_course_name}
                    </option>
                  ))}
              </select>
              <li
                key="logout"
                className={`text-xl font-bold font-[Montserrat] text-[rgb(255,255,0)] hover:text-white cursor-pointer ${
                  startColor === "text-cyan500"
                    ? "text-[rgb(255,255,0)]"
                    : "text-[rgb(255,255,0)]"
                }`}
                onClick={handlelogOut}
              >
                Logout
              </li>
              <button
                aria-label="score"
                type="button"
                className="text-xl font-[Montserrat] bg-[#0084AF] h-[40px] pt-[5px] pb-[5px] md:pb-[5px] px-2.5 rounded-full flex items-center"
              >
                <span className="mr-2 text-yellow400">
                  <Image src={coin} alt="" className="w-[15px] sm:w-[20px]" />
                </span>
                <span className="font-black font-[Montserrat] text-yellow-300 ">
                  {score || userDataCoin ? userDataCoin : 0}
                </span>
              </button>
            </>
          ) : (
            <>
              <select
                id="classDropdown"
                value={
                  loggedUser && keyForRerender == false
                    ? userClasssId
                    : userClasssId
                }
                onChange={handleClassChange}
                className={`text-xl font-bold font-[Montserrat] text-[rgb(255,255,0)] hover:text-white cursor-pointer bg-inherit border-0 outline-none ${
                  startColor === "text-cyan500"
                    ? "text-[rgb(255,255,0)]"
                    : "text-[rgb(255,255,0)]"
                }`}
              >
                {classList
                  .filter(
                    (course) =>
                      !["NEET", "JEE Main", "JEE Advanced"].includes(
                        course.sub_course_name
                      )
                  )
                  .map((course) => (
                    <option
                      key={course.sub_course_id}
                      value={course.sub_course_name}
                      className="text-black font-[Montserrat]"
                    >
                      {course.sub_course_name}
                    </option>
                  ))}
              </select>
              <li key="Login" className="text-xl">
                <Link
                  href="/login"
                  className={` font-bold font-[Montserrat] text-[rgb(255,255,0)] hover:text-white ${
                    startColor === "text-cyan500"
                      ? "text-[rgb(255,255,0)]"
                      : "text-[rgb(255,255,0)]"
                  }`}
                >
                  Login
                </Link>
              </li>
              <li key="Register" className="text-xl">
                <Link
                  href="/register"
                  className={` font-bold font-[Montserrat] text-[rgb(255,255,0)] hover:text-white ${
                    startColor === "text-cyan500"
                      ? "text-[rgb(255,255,0)]"
                      : "text-[rgb(255,255,0)]"
                  }`}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <div
        ref={navbarRef}
        className={`fixed md:hidden top-0 left-0 w-1/2 bg-cyan500  dark:bg-cyan600 h-screen transition-all  duration-300 ease-in transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } `}
        style={{
          backgroundColor: `${bgColor || startbg} `,
        }}
      >
        {loggedUser && keyForRerender == false ? (
          <ul className="flex pt-[4rem]   flex-col items-start py-3 px-7">
            <li key="classList" className="text-xl mb-3">
              <select
                id="classDropdown"
                value={
                  loggedUser && keyForRerender == false
                    ? userClasssId
                    : userClasssId
                }
                onChange={handleClassChange}
                className={`ml-[-5px] font-black font-[Montserrat] text-base  bg-inherit border-0 outline-none ${
                  startColor === "text-cyan500"
                    ? "text-[rgb(255,255,0)]"
                    : "text-[rgb(255,255,0)]"
                }`}
              >
                {classList
                  .filter(
                    (course) =>
                      !["NEET", "JEE Main", "JEE Advanced"].includes(
                        course.sub_course_name
                      )
                  )
                  .map((course) => (
                    <option
                      key={course.sub_course_id}
                      value={course.sub_course_name}
                      className="text-black font-[Montserrat]"
                    >
                      {course.sub_course_name}
                    </option>
                  ))}
              </select>
            </li>
            {/* <li key="Leaderboard" className="text-xl mb-3">
              <Link
                href="/leaderboard"
                className={`text-base font-bold   text-[rgb(255,255,0)] hover:text-white duration-500   ${
                  startColor === "text-cyan500" ? "text-cyan500" : "text-white"
                }`}
              >
                Leaderboard
              </Link>
            </li> */}
            <li
              key="profile"
              className="text-xl w-full cursor-pointer block mb-3"
            >
              <Link
                href="/profile"
                className={`text-base block cursor-pointer font-[Montserrat] font-black ${
                  startColor === "text-cyan500"
                    ? "text-[rgb(255,255,0)]"
                    : "text-[rgb(255,255,0)]"
                }`}
              >
                Profile
              </Link>
            </li>
            {/* <li key="create" className="text-xl mb-3">
              <Link
                href="/admin"
                className={`text-base font-bold   text-[rgb(255,255,0)] hover:text-white duration-500 ${
                  startColor === "text-cyan500" ? "text-cyan500" : "text-white"
                }`}
              >
                Create Quiz
              </Link>
            </li> */}
            {/* <li key="activity" className="text-xl mb-3">
              <Link
                href={loggedUser ? "/activity" : "/"}
                className={`text-base font-bold   text-[rgb(255,255,0)] hover:text-white duration-500 ${
                  startColor === "text-cyan500" ? "text-cyan500" : "text-white"
                }`}
              >
                Activity
              </Link>
            </li> */}
            {Links.map((link) => (
              <li key={link.name} className="mb-3 w-full cursor-pointer ">
                <Link
                  href={link.link}
                  className={`text-base font-black block font-[Montserrat] cursor-pointer  ${
                    startColor === "text-cyan500"
                      ? "text-[rgb(255,255,0)]"
                      : "text-[rgb(255,255,0)]"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            <li
              key="Logout"
              className={`text-base font-black w-full font-[Montserrat] cursor-pointer block mb-3  ${
                startColor === "text-cyan500"
                  ? "text-[rgb(255,255,0)]"
                  : "text-[rgb(255,255,0)]"
              }`}
              onClick={handlelogOut}
            >
              LogOut
            </li>
            <li className="">
              <Switcher />
            </li>
          </ul>
        ) : (
          <ul className="flex pt-[4rem] flex-col items-start py-3 px-7">
            <select
              id="classDropdown"
              value={
                loggedUser && keyForRerender == false
                  ? userClasssId
                  : userClasssId
              }
              onChange={handleClassChange}
              className={` mb-3 ml-[-5px] font-black text-base font-[Montserrat]  bg-inherit  border-0 outline-none ${
                startColor === "text-cyan500"
                  ? "text-[rgb(255,255,0)]"
                  : "text-[rgb(255,255,0)]"
              }`}
            >
              {classList
                .filter(
                  (course) =>
                    !["NEET", "JEE Main", "JEE Advanced"].includes(
                      course.sub_course_name
                    )
                )
                .map((course) => (
                  <option
                    key={course.sub_course_id}
                    value={course.sub_course_name}
                    className="text-black font-[Montserrat]"
                  >
                    {course.sub_course_name}
                  </option>
                ))}
            </select>
            <li className="mb-3 w-full cursor-pointer font-[Montserrat]">
              <Link
                href="/start"
                className={`text-base  font-black font-[Montserrat] block cursor-pointer  ${
                  startColor === "text-cyan500"
                    ? "text-[rgb(255,255,0)]"
                    : "text-[rgb(255,255,0)]"
                }`}
              >
                Live Quiz
              </Link>
            </li>
            <li className="mb-3 w-full cursor-pointer ">
              <Link
                href="/start"
                className={`text-base  font-black block cursor-pointer font-[Montserrat] ${
                  startColor === "text-cyan500"
                    ? "text-[rgb(255,255,0)]"
                    : "text-[rgb(255,255,0)]"
                }`}
              >
                Enter Code
              </Link>
            </li>
            {/* <li className="mb-3 ">
              <Link
                href="/refer"
                className={`text-base  font-bold   text-[rgb(255,255,0)] hover:text-white duration-500 ${
                  startColor === "text-cyan500" ? "text-cyan500" : "text-white"
                }`}
              >
                Refer & Earn
              </Link>
            </li> */}
            <li className="mb-3 w-full cursor-pointer ">
              <Link
                href="/login"
                className={`text-base  font-black block cursor-pointer font-[Montserrat]  ${
                  startColor === "text-cyan500"
                    ? "text-[rgb(255,255,0)]"
                    : "text-[rgb(255,255,0)]"
                }`}
              >
                Login
              </Link>
            </li>
            <li className="mb-3 w-full cursor-pointer ">
              <Link
                href="/register"
                className={`text-base font-black block font-[Montserrat] cursor-pointer  ${
                  startColor === "text-cyan500"
                    ? "text-[rgb(255,255,0)]"
                    : "text-[rgb(255,255,0)]"
                }`}
              >
                Register
              </Link>
            </li>
            <li className="">
              <Link href="">
                <Switcher />
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

// export default Navbar;

export default dynamic(() => Promise.resolve(Navbar), { ssr: false });
