/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { RecoilRoot } from "recoil";
import MainHome from "@/app/home/MainHome";
import DNALoader from "@/app/utils/DNALoader";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Modal from "@/app/components/modal/Modal";
import { userClass, userUpdateClassLogin } from "@/app/api/service";
import { setCookie } from "cookies-next";

const Callback = ({ googleLogin, classListData }) => {
  const searchParams = useSearchParams();
  const [fetching, setFetching] = useState(true);
  const [selectedSubCourse, setSelectedSubCourse] = useState("");
  const [classList, setClassList] = useState([]);
  const [isFocusedSelect, setIsFocusedSelect] = useState(false);
  const nav = useRouter();

  useEffect(() => {
    fetchData();
    setClassList(classListData.classes);
    const subCourseIds = classListData.classes.map(
      (course) => course.sub_course_id
    );
  }, []);

  const fetchData = async () => {
    const post = searchParams.toString();
    try {
      const userDataResponse = await fetch("/api/process_google_auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post }),
      });
      if (!userDataResponse.ok) {
      }
      const res = await userDataResponse.json();
      const user = res.user;
      const classId = res.class_id;
      if (classId != null) {
        setCookie("class_user_id", classId);
        setFetching(false)
        nav.push("/");
      } else {
        setFetching(false);
      }
    } catch (error) {}
  };

  const classId = selectedSubCourse;
  const updateClassLists = async () => {
    try {
      if (selectedSubCourse !== "") {
        const post = { classId: classId };
        const response = await fetch("/api/google_class_update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post }),
        });
        // setCookie("class_user_id", classId);
        // console.log(classId)
        nav.push("/");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "success",
          title: `${user} you are successfully logged in`,
        }).then(() => {});
      }
    } catch (error) {}
  };

  const handleSelectChange = (e) => {
    setSelectedSubCourse(e.target.value);
  };

  useEffect(() => {
    if (selectedSubCourse !== "") {
      updateClassLists();
    }
  }, [selectedSubCourse]);
  return (
    <div>
      <RecoilRoot>
        <div
          className={`fixed z-50  top-0 left-0 w-full h-full flex items-end sm:items-center justify-center transition-opacity duration-2000 bg-gray-100 bg-opacity-10 font-[Montserrat]`}
        >
          <div
            className={` absolute w-full h-full p-6 pt-3 rounded-lg shadow-lg `}
          >
            <div>
              {fetching ? (
                <DNALoader />
              ) : (
                <div
                  className={`fixed z-50 
                         top-0 left-0 w-full h-[85vh] sm:h-full flex items-center justify-center transition-opacity duration-2000 bg-gray-100 bg-opacity-10`}
                >
                  <div
                    className={`bg-white dark:bg-grey800 absolute  p-6 pt-3 rounded-lg shadow-lg w-full sm:w-[48%] md:w-[25%] 
                           `}
                  >
                    <div>
                      <h1 className="font-black text-lg font-[Montserrat] dark:text-white">
                        Select class
                      </h1>
                      <select
                        value={selectedSubCourse}
                        onChange={handleSelectChange}
                        className={`border-2 border-gray500 font-[Montserrat] rounded-[5px] h-[35px] w-full mt-5 dark:border-white  ${
                          isFocusedSelect
                            ? "border-teal-500 "
                            : "border-gray-500"
                        }`}
                        onFocus={() => setIsFocusedSelect(true)}
                        onBlur={() => setIsFocusedSelect(false)}
                      >
                        <option value="" disabled>
                          Select Sub Course
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
                            >
                              {course.sub_course_name}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </RecoilRoot>
    </div>
  );
};

export default Callback;
