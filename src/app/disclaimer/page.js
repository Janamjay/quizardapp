import React from "react";
import Root from "./Root";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer.jsx";
import { userClass } from "@/app/api/service.js";
import { cookies } from "next/headers"; 
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const page = async () => {
  const classList = await userClass();
  return (
    <div>
      <Navbar classListData={classList} />
      <div
        className="h-[50vh] font-Montserrat sm:h-[70vh] bg-cyan500 dark:bg-cyan600 flex items-center curved 
    sm:curve"
      >
        <div className="flex flex-col md:flex-row justify-evenly items-center w-full p-4">
          <h1 className="text-center text-white text-4xl sm:text-6xl font-[Montserrat] pb-8 sm:pt-8 font-medium">
            Disclaimer
          </h1>
        </div>
      </div>
      <div className="my-[3rem] w-full ">
        <div className="flex justify-center w-full my-10">
          <p className="w-[80%] text-justify text-xl text-[#212529] font-medium font-[Montserrat]">
            The information is provided by quizard or quizard.app and while we
            endeavour to keep the information up to date and correct, we make no
            representations or warranties of any kind, express or implied, about
            the completeness, accuracy, reliability, suitability or availability
            with respect to the website or the information, products, services,
            or related graphics contained on the website for any purpose. Any
            reliance you place on such information is therefore strictly at your
            own risk.
          </p>
        </div>
        <div className="flex justify-center w-full my-10">
          <p className="w-[80%] text-justify text-xl text-[#212529] font-medium font-[Montserrat]">
            quizard or quizard.app do not claim the ownership of the
            content(questions, solutions etc.) used in Mock Tests. The content
            has been submitted by volunteers and the questions have been picked
            from various sources.
          </p>
        </div>
        <div className="flex justify-center w-full my-10">
          <p className="w-[80%] text-justify text-xl text-[#212529] font-medium font-[Montserrat]">
            In no event will we be liable for any loss or damage including
            without limitation, indirect or consequential loss or damage, or any
            loss or damage whatsoever arising from loss of data or profits
            arising out of, or in connection with, the use of this website.
            Through this website you are able to link to other websites which
            are not under the control of quizard. We have no control over the
            nature, content and availability of those sites. The inclusion of
            any links does not necessarily imply a recommendation or endorse the
            views expressed within them.
          </p>
        </div>
        <div className="flex justify-center w-full my-10">
          <p className="w-[80%] text-justify text-xl text-[#212529] font-medium font-[Montserrat]">
            Every effort is made to keep the website up and running smoothly.
            However, quizard takes no responsibility for, and will not be liable
            for, the website being temporarily unavailable due to technical
            issues beyond our control.
          </p>
        </div>
      </div>
      <Footer />
      <Root/>
    </div>
  );
};

export default page;

export function generateMetadata() {
  return {
    title: "Disclaimer" + " | " + SITE_NAME,
    description:
      "The information is provided by quizard or quizard.app and while we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website",
    alternates: {
      canonical: BASE_URL + "disclaimer",
      url: BASE_URL + "disclaimer",
    },
    openGraph: {
      title: "Disclaimer" + " | " + SITE_NAME,
      description:
        "The information is provided by quizard or quizard.app and while we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website",
      url: BASE_URL + "disclaimer",
      siteName: SITE_NAME,
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
      card: SITE_NAME,
      title: "Disclaimer" + " | " + SITE_NAME,
      description:
        "The information is provided by quizard or quizard.app and while we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website",
      creator: SITE_NAME,
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
    metadataBase: BASE_URL + "disclaimer",
  };
}
