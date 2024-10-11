import React from "react";
import Root from "./Root";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer.jsx";
import { userClass , userProfile} from "@/app/api/service.js";
import Image from "next/image";
import emailImage from "../../../public/images/email.svg";

const page = async() => {
  const classList = await userClass();
  const userProfileData = await userProfile();
  return (
    <div>
      <Navbar classListData={classList} />
      <div
        className="h-[50vh] font-Montserrat sm:h-[70vh] bg-cyan500 dark:bg-cyan600 flex items-center curved 
    sm:curve"
      >
        <div className="flex flex-col md:flex-row justify-evenly items-center w-full p-4">
          <h1 className="text-center text-white  text-4xl sm:text-6xl pb-8 sm:pt-8 font-medium font-[Montserrat]">
            Talk with Quizard team
          </h1>
        </div>
      </div>
      <div className="my-[3rem] justify-center gap-[3rem] w-full flex flex-col sm:flex-row items-center ">
        <div className="sm:w-[40%] mx-10 sm:mx-0">
          <h1 className="text-justify mb-[1rem] text-2xl text-[#212529] font-semibold font-[Montserrat]">
            Fill out the form
          </h1>
          <p className="sm:text-justify text-xl text-[#212529] font-medium mb-[1rem] font-[Montserrat]">
            Please submit your information and we will follow up with you as
            soon as possible.
          </p>
          <Root userProfileData={userProfileData}/>
        </div>
        <div className="sm:w-[30%]">
          <div className="flex justify-center w-full">
            <Image src={emailImage} width={50} height={50} alt="email" />
          </div>
          <h1 className="text-center mb-[10px] text-xl text-[#212529] font-medium font-[Montserrat]">
            Contact support
          </h1>
          <p className="text-center text-sm text-[#212529] font-[Montserrat]">
            Please feel free to write an email to us. care@quizard.app
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;

export function generateMetadata() {
  return {
    title: `Contact | ${SITE_NAME}`,
    description:
      "Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode ....",
    alternates: {
      canonical: BASE_URL + "contact",
      url: BASE_URL + "contact",
    },
    openGraph: {
      title: `Contact | ${SITE_NAME}`,
      description:
        "Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode ....",
      url: BASE_URL + "contact",
      siteName: "Quizard",
      images: [
        {
          url: BASE_URL + "quizard.png",
          width: 800,
          height: 600,
          alt: "quizard logo",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: `${SITE_NAME}`,
      title: `Contact | ${SITE_NAME}`,
      description:
        "Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode ....",
      creator: `${SITE_NAME}`,
      images: [`${BASE_URL}quizard.png`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    metadataBase: BASE_URL + "contact",
  };
}
