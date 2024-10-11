/* eslint-disable react/prop-types */
import Link from "next/link";
import { useEffect, useState } from "react";

const FooterSmall = ({ bgColor, textColor }) => {
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
                    style={{ fill: "#29bcc7" }}
                  ></circle>
                  <path
                    id="secondary"
                    d="M14.83,9.5,12.69,6.38a.82.82,0,0,0-1.38,0L9.17,9.5A1,1,0,0,0,9.86,11H11v6a1,1,0,0,0,2,0V11h1.14A1,1,0,0,0,14.83,9.5Z"
                    style={{ fill: "#fff" }}
                  ></path>
                </g>
              </svg>
            </h3>
          </div>
        )}
      </div> */}
      <div
        className={` px-7 dark:border-t-[1px] dark:border-white flex font-Montserrat  flex-col-reverse justify-between py-5 pb-[6rem] sm:pb-5  border-t border-[#374151] lg:flex-row bg-gray50  
      dark:bg-dimBlack ${bgColor}`}
      >
        <p
          className={`text-sm font-black font-[Montserrat] text-gray600 dark:text-white ${textColor}`}
        >
          Quizard © Copyright {currentYear} . All rights reserved.
        </p>
        <ul className="flex flex-col mb-3 space-y-2 lg:mb-0 sm:space-y-0 sm:space-x-5 sm:flex-row  cursor-pointer">
          <Link href={"/about"}>
            <li
              className={`text-sm text-gray600 font-[Montserrat] hover:text-black font-black dark:text-white transition-colors duration-300 hover:text-deep-purple-accent-400  ${textColor}`}
            >
              About Us
            </li>
          </Link>
          <Link href={"/contact"}>
            <li
              className={`text-sm text-gray600 hover:text-black font-black dark:text-white transition-colors duration-300 hover:text-deep-purple-accent-400 font-[Montserrat]  ${textColor}`}
            >
              Contact Us
            </li>
          </Link>
          <Link href={"/privacy"}>
            <li
              className={`text-sm text-gray600 hover:text-black  font-black dark:text-white transition-colors duration-300 hover:text-deep-purple-accent-400 font-[Montserrat] ${textColor}`}
            >
              Privacy &amp; Cookies Policy
            </li>
          </Link>
          <Link href={"/terms-conditions"}>
            <li
              className={`text-sm text-gray600 hover:text-black  font-black dark:text-white transition-colors duration-300 hover:text-deep-purple-accent-400 font-[Montserrat] ${textColor}`}
            >
              Terms and Conditions
            </li>
          </Link>
          <Link href={"/disclaimer"}>
            <li
              className={`text-sm text-gray600 hover:text-black  font-black dark:text-white transition-colors duration-300 hover:text-deep-purple-accent-400 font-[Montserrat] ${textColor}`}
            >
              Disclaimer
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
};

export default FooterSmall;
