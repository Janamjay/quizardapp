/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Footer = ({ show }) => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <>
      {/* <div className="scroll-to-top flex w-full justify-end items-center pr-[2rem] mb-[-25px] sm:mb-0">
        {isVisible && (
          <div onClick={scrollToTop}>
            <h3>
              <svg
                fill="#000000"
                width="50px"
                height="50px"
                viewBox="0 0 24 24"
                id="up-arrow-circle"
                data-name="Flat Color"
                xmlns="http://www.w3.org/2000/svg"
                className="icon flat-color"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <circle
                    id="primary"
                    cx="12"
                    cy="12"
                    r="10"
                    style={{fill:"#29bcc7"}}
                  ></circle>
                  <path
                    id="secondary"
                    d="M14.83,9.5,12.69,6.38a.82.82,0,0,0-1.38,0L9.17,9.5A1,1,0,0,0,9.86,11H11v6a1,1,0,0,0,2,0V11h1.14A1,1,0,0,0,14.83,9.5Z"
                    style={{fill:"#fff"}}
                  ></path>
                </g>
              </svg>
            </h3>
          </div>
        )}
      </div> */}
      <footer
        className={`px-7 dark:border-t-[1px] dark:border-white ${
          show ? "hidden sm:block" : ""
        }  lg:px-9 font-Montserrat  bg-cyan500 dark:bg-grey800`}
      >
        <div className="flex flex-col-reverse justify-between pt-5 pb-20 sm:pb-5  dark:border-[#475569] lg:flex-row">
          <p className="text-sm font-[Montserrat] text-white">
            Quizard © Copyright {currentYear} . All rights reserved.
          </p>
          <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row cursor-pointer">
            <Link href={"/about"}>
              <li className="text-sm font-[Montserrat] text-white hover:text-gray-100 transition-colors duration-300 hover:text-deep-purple-accent-400">
                About Us
              </li>
            </Link>
            <Link href={"/contact"}>
              <li className="text-sm font-[Montserrat] text-white hover:text-gray-100 transition-colors duration-300 hover:text-deep-purple-accent-400">
                Contact Us
              </li>
            </Link>
            <Link href={"/privacy"}>
              <li className="text-sm font-[Montserrat] text-white hover:text-gray-100 transition-colors duration-300 hover:text-deep-purple-accent-400">
                Privacy &amp; Cookies Policy
              </li>
            </Link>
            <Link href={"/terms-conditions"}>
              <li className="text-sm font-[Montserrat] text-white hover:text-gray-100 transition-colors duration-300 hover:text-deep-purple-accent-400">
                Terms and Conditions
              </li>
            </Link>
            <Link href={"/disclaimer"}>
              <li className="text-sm font-[Montserrat] text-white hover:text-gray-100 transition-colors duration-300 hover:text-deep-purple-accent-400">
                Disclaimer
              </li>
            </Link>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
