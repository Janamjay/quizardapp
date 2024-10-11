import MainHome from "../app/home/MainHome.js";
/* eslint-disable @next/next/no-img-element */
// eslint-disable-next-line no-unused-vars
import React from "react";
import kid from "/public/images/kid.png";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/navbar/Navbar";
import {
  dashBoardQuizTest,
  userClass,
  userProfile,
} from "@/app/api/service.js";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
import { cookies } from "next/headers";
import OvalLoader from "@/app/utils/OvalLoader";

export default async function page({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const dashboardData = await dashBoardQuizTest();
  const classList = await userClass();
  const userProfileData = await userProfile(token);


  function getDateTimezone() {
    var currentDate = new Date();
    var isoStringWithoutMilliseconds = currentDate.toISOString();
    var milliseconds = currentDate.getMilliseconds();
    var isoStringWithMilliseconds = isoStringWithoutMilliseconds.slice(0, -1) + '.' + ('00' + milliseconds).slice(-3) + 'Z';
    return isoStringWithMilliseconds;
  }

  const article = {
    "@context": "http://schema.org",
    "@type": "Article",
    name: SITE_NAME,
    description:
      "Play Live Quiz of Quiz From different Topics With different types of Mode Like Dino Mode.",
    headline:
      "Play Live Quiz of Quiz From different Topics With different types of Mode Like Dino Mode.",
    "@id": BASE_URL,
    image: BASE_URL + "quizard.png",
    dateModified: getDateTimezone(),
    datePublished: getDateTimezone(),
    author: {
      name: SITE_NAME,
      url: BASE_URL,
    },
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "image": BASE_URL + "quizard.png",
    "url": BASE_URL,
    "logo": BASE_URL + "quizard.png",
    "name": SITE_NAME,
    "description":"Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode.",
    "email": "care@quizard.app",
  };

  const styleShadow = "text-quizard-style";
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <div className="dark:bg-grey800">
        <Navbar classListData={classList} shadow={styleShadow} />
        <div className="h-[100vh] sm:h-[90vh] bg-cyan500 dark:bg-cyan600 flex items-center curved sm:curve">
          <div className="flex flex-col md:flex-row justify-evenly items-center w-full mt-[-1rem] sm:mt-0 py-4  px-[12px] sm:px-4 lg:pt-[4rem]">
            <img
              src="/images/kid.png"
              alt="kid"
              className="h-[20vh] select-none sm:h-[30vh] lg:h-[40vh] mb-6 sm:mb-0"
              priority="true"
            />
            <div className="text-center sm:text-center  px-3 pb-5 sm:pt-5">
              <h1 className="text-4xl sm:text-5xl hidden text-banner-style  font-[700] sm:block font-[Montserrat] lg:text-6xl text-white ">
                Play Quiz
              </h1>
              <p className="text-white font-[Montserrat]  mt-3 text-left font-[700] sm:mt-6 text-base sm:text-lg lg:w-96">
                Welcome to Quizard, where knowledge meets fun! Unleash your
                intellect with our captivating quizzes spanning various topics.
                Challenge yourself, compete with friends, and embark on a
                journey of discovery. Engage in brain-teasing trivia that
                entertains and educates. Quizard - Where every question unlocks
                a world of possibilities!
              </p>
              <Link href="/start">
                <div className="flex justify-center select-none sm:justify-center mt-6">
                  <button className="bg-[rgb(255,255,0)] font-[Montserrat]  font-[700] text-black py-2 px-6 border-[1px] border-[rgb(255,255,0)] rounded">
                    Start Quiz
                  </button>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <MainHome
          dashboardData={dashboardData}
          classListData={classList}
          userProfileData={userProfileData}
          userToken = {token}
        />
      </div>
    </>
  );
}

export function generateMetadata() {
  return {
    title: SITE_NAME,
    description:
      "Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode.",
    alternates: {
      canonical: BASE_URL,
      url: BASE_URL,
    },
    openGraph: {
      title: SITE_NAME,
      description:
        "Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode.",
      url: BASE_URL,
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
      title: SITE_NAME,
      description:
        "Play Live Quiz of Quiz From different Topics With different types of Mode Like Dino Mode.",
      creator: SITE_NAME,
      images: [`${BASE_URL}quizard.png`],
    },
    robots: {
      index: false,
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
    metadataBase: BASE_URL,
  };
}
