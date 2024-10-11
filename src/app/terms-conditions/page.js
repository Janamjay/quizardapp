/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Root from "./Root";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer.jsx";
import { userClass } from "@/app/api/service.js";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;

const page = async() => {
  const classList = await userClass();
  return (
    <div>
      <div>
        <Navbar classListData={classList} />
        <div
          className="h-[50vh] sm:h-[70vh] bg-cyan500 dark:bg-cyan600 flex items-center curved 
      sm:curve"
        >
          <div className="flex flex-col md:flex-row justify-evenly items-center w-full p-4">
            <h1 className="text-center text-white font-[Montserrat] text-4xl sm:text-6xl pb-8 sm:pt-8 font-medium">
              Terms & Conditions
            </h1>
          </div>
        </div>
        <div className="my-[3rem] w-full ">
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify text-xl font-[Montserrat] text-[#212529] font-medium">
              Welcome to our website. If you continue to browse and use this
              website you are agreeing to comply with and be bound by the
              following terms and conditions of use, which together with our
              privacy policy govern quizard's (or quizard.app) relationship with
              you in relation to this website.
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify text-xl font-[Montserrat] text-[#212529] font-medium">
              The term 'quizard' or 'www.quizard.app' or 'quizard' or
              'quizard.app' or 'us' or 'we' refers to the owner of the website.
              The term 'you' refers to the user or viewer of our website.
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify text-xl font-[Montserrat] text-[#212529] font-medium">
              The use of this website is subject to the following terms of use:
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify text-xl font-[Montserrat] text-[#212529] font-medium">
              The content of the pages of this website is for your general
              information and use only. It is subject to change without notice.
              Neither we nor any third parties provide any warranty or guarantee
              as to the accuracy, timeliness, performance, completeness or
              suitability of the information and materials found or offered on
              this website for any particular purpose. You acknowledge that such
              information and materials may contain inaccuracies or errors and
              we expressly exclude liability for any such inaccuracies or errors
              to the fullest extent permitted by law. Your use of any
              information or materials on this website is entirely at your own
              risk, for which we shall not be liable. It shall be your own
              responsibility to ensure that any products, services or
              information available through this website meet your specific
              requirements. This website contains material which is owned by or
              licensed to us. This material includes, but is not limited to, the
              design, layout, look, appearance and graphics. All the questions
              in the quizard Test Series need not be owned or created by us.
              Some questions might be copied or modified from already available
              material either online or in written/hard form. Reproduction is
              prohibited other than in accordance with the copyright notice,
              which forms part of these terms and conditions. All trade marks
              reproduced in this website which are not the property of, or
              licensed to, the operator are acknowledged on the website.
              Unauthorised use of this website may give rise to a claim for
              damages and/or be a criminal offence. From time to time this
              website may also include links to other websites. These links are
              provided for your convenience to provide further information. They
              do not signify that we endorse the website(s). We have no
              responsibility for the content of the linked website(s). You may
              not create a link to this website from another website or document
              without quizard's prior written consent. Your use of this website
              and any dispute arising out of such use of the website is subject
              to the laws of India or other regulatory authority.
            </p>
          </div>
        </div>
        <Footer />
        <Root />
      </div>
    </div>
  );
};

export default page;

export function generateMetadata() {
  return {
    title: "Terms and Conditions" + " | " + SITE_NAME,
    description:
      "Welcome to our website. If you continue to browse and use this website you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern quizard's (or quizard.app) relationship with you in relation to this website.",
    alternates: {
      canonical: BASE_URL + "terms-conditions",
      url: BASE_URL + "terms-conditions",
    },
    openGraph: {
      title: "Terms and Conditions",
      description:
        "Welcome to our website. If you continue to browse and use this website you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern quizard's (or quizard.app) relationship with you in relation to this website.",
      url: BASE_URL + "terms-conditions",
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
      title: `Terms and Conditions | ${SITE_NAME}`,
      description:
        "Welcome to our website. If you continue to browse and use this website you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern quizard's (or quizard.app) relationship with you in relation to this website.",
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
    metadataBase: BASE_URL + "terms-conditions",
  };
}
