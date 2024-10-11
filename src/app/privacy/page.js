import React from "react";
import Root from "./Root";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer.jsx";
import ProviderStore from "@/redux/ProviderStore";
import { userClass } from "@/app/api/service.js";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const page = async() => {
  const classList = await userClass();
  return (
    <div>
      <div>
        <Navbar classListData={classList}/>
        <div className="h-[50vh] sm:h-[70vh] bg-cyan500 dark:bg-cyan600 flex items-center curved sm:curve">
          <div className="flex flex-col md:flex-row justify-evenly items-center w-full p-4">
            <h1 className="text-center font-[Montserrat] text-white text-4xl sm:text-6xl pb-8 sm:pt-8 font-medium">
              Privacy & Cookies Policy
            </h1>
          </div>
        </div>
        <div className="my-[3rem] w-full ">
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify text-xl font-[Montserrat] text-[#212529] font-medium">
              This privacy policy sets out how quizard or quizard.app uses and
              protects any information that you give quizard or quizard.app when
              you use this website.
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify text-xl font-[Montserrat] text-[#212529] font-medium">
              quizard or quizard.app may change this policy from time to time by
              updating this page. You should check this page from time to time
              to ensure that you are happy with any changes.
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <h1 className="w-[80%] font-[Montserrat] text-justify text-xl text-[#212529] font-semibold">
              What we collect
            </h1>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify font-[Montserrat] text-xl text-[#212529] font-medium">
              We may collect the following information:
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify text-xl font-[Montserrat] text-[#212529] font-medium">
              name and job title
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify text-xl font-[Montserrat] text-[#212529] font-medium">
              contact information including email address
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify text-xl font-[Montserrat] text-[#212529] font-medium">
              demographic information such as postcode, preferences and
              interests
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify text-xl font-[Montserrat] text-[#212529] font-medium">
              other information relevant to customer surveys and/or offers
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify text-xl font-[Montserrat] text-[#212529] font-medium">
              What we do with the information we gather
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify text-xl font-[Montserrat] text-[#212529] font-medium">
              We require this information to understand your needs and provide
              you with a better service, and in particular for the following
              reasons:
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify text-xl font-[Montserrat] text-[#212529] font-medium">
              Internal record keeping. We may use the information to improve our
              products and services. We may periodically send promotional emails
              about new products, special offers or other information which we
              think you may find interesting using the email address which you
              have provided. From time to time, we may also use your information
              to contact you for market research purposes. We may contact you by
              email, phone, fax or mail. We may use the information to customise
              the website according to your interests.
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <h1 className="w-[80%] text-justify font-[Montserrat] text-xl text-[#212529] font-semibold">
              Security
            </h1>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify font-[Montserrat] text-xl text-[#212529] font-medium">
              We are committed to ensuring that your information is secure. In
              order to prevent unauthorised access or disclosure we have put in
              place suitable physical, electronic and managerial procedures to
              safeguard and secure the information we collect online.
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <h1 className="w-[80%] font-[Montserrat] text-justify text-xl text-[#212529] font-semibold">
              How we use cookies
            </h1>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] font-[Montserrat] text-justify text-xl text-[#212529] font-medium">
              A cookie is a small file which asks permission to be placed on
              your computer`s hard drive. Once you agree, the file is added and
              the cookie helps analyse web traffic or lets you know when you
              visit a particular site. Cookies allow web applications to respond
              to you as an individual. The web application can tailor its
              operations to your needs, likes and dislikes by gathering and
              remembering information about your preferences. We use traffic log
              cookies to identify which pages are being used. This helps us
              analyse data about webpage traffic and improve our website in
              order to tailor it to customer needs. We only use this information
              for statistical analysis purposes and then the data is removed
              from the system. Overall, cookies help us provide you with a
              better website, by enabling us to monitor which pages you find
              useful and which you do not. A cookie in no way gives us access to
              your computer or any information about you, other than the data
              you choose to share with us. You can choose to accept or decline
              cookies. Most web browsers automatically accept cookies, but you
              can usually modify your browser setting to decline cookies if you
              prefer. This may prevent you from taking full advantage of the
              website.
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <h1 className="w-[80%] font-[Montserrat] text-justify text-xl text-[#212529] font-semibold">
              Links to other websites
            </h1>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] font-[Montserrat] text-justify text-xl text-[#212529] font-medium">
              Our website may contain links to other websites of interest.
              However, once you have used these links to leave our site, you
              should note that we do not have any control over that other
              website. Therefore, we cannot be responsible for the protection
              and privacy of any information which you provide whilst visiting
              such sites and such sites are not governed by this privacy
              statement. You should exercise caution and look at the privacy
              statement applicable to the website in question.
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <h1 className="w-[80%] font-[Montserrat] text-justify text-xl text-[#212529] font-semibold">
              Controlling your personal information
            </h1>
          </div>
          <div className="flex justify-center w-full my-10">
            <p className="w-[80%] text-justify font-[Montserrat] text-xl text-[#212529] font-medium">
              You may choose to restrict the collection or use of your personal
              information in the following ways: whenever you are asked to fill
              in a form on the website, look for the box that you can click to
              indicate that you do not want the information to be used by
              anybody for direct marketing purposes if you have previously
              agreed to us using your personal information for direct marketing
              purposes, you may change your mind at any time by writing to or
              emailing us at care@quizard.app We will not sell, distribute or
              lease your personal information to third parties unless we have
              your permission or are required by law to do so. We may use your
              personal information to send you promotional information about
              third parties which we think you may find interesting if you tell
              us that you wish this to happen. You may request details of
              personal information which we hold about you under the Data
              Protection Act 1998. A small fee will be payable. If you would
              like a copy of the information held on you please email us at
              care@quizard.app. If you believe that any information we are
              holding on you is incorrect or incomplete, please write to or
              email us as soon as possible, at the above address. We will
              promptly correct any information found to be incorrect.
            </p>
          </div>
          <div className="flex justify-center w-full my-10">
            <h1 className="w-[80%] text-justify font-[Montserrat] text-xl text-[#212529] font-semibold">
              Contacting Us
            </h1>
          </div>
          <div className="flex justify-center w-full my-10">
            <h1 className="w-[80%] text-justify font-[Montserrat] text-xl text-[#212529] font-semibold">
              If there are any questions regarding this privacy policy you may
              contact us using the information below:
            </h1>
          </div>
          <div className="flex justify-center w-full my-10">
            <h1 className="w-[80%] text-justify font-[Montserrat] text-xl text-[#212529] font-semibold">
              Name : quizard.app
            </h1>
          </div>
          <div className="flex justify-center w-full my-10">
            <h1 className="w-[80%] text-justify font-[Montserrat] text-xl text-[#212529] font-semibold">
              E-Mail ID : care@quizard.app
            </h1>
          </div>
        </div>
        <Footer />
      </div>
      <Root/>
    </div>
  );
};

export default page;

export function generateMetadata() {
  return {
    title: "Privacy Policy" + " | " + SITE_NAME,
    description:
      "This privacy policy sets out how quizard or quizard.app uses and protects any information that you give quizard or quizard.app when you use this website.",
    alternates: {
      canonical: BASE_URL + "privacy",
      url: BASE_URL + "privacy",
    },
    openGraph: {
      title: "Privacy Policy" + " | " + SITE_NAME,
      description:
        "This privacy policy sets out how quizard or quizard.app uses and protects any information that you give quizard or quizard.app when you use this website.",
      url: BASE_URL + "privacy",
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
      title: `Privacy Policy | ${SITE_NAME}`,
      description:
        "This privacy policy sets out how quizard or quizard.app uses and protects any information that you give quizard or quizard.app when you use this website.",
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
    metadataBase: BASE_URL + "privacy",
  };
}
