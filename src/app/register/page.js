import React from "react";
import Register from "./Register";
import { userClass, googleAuthRedirect } from "@/app/api/service.js";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;

const page = async () => {
  const classList = await userClass();
  const googleRedirect = await googleAuthRedirect();
  return (
    <div>
      <Register classListData={classList} googleRedirect={googleRedirect} />
    </div>
  );
};

export default page;

export function generateMetadata() {
  return {
    title: "Register" + " | " + SITE_NAME,
    description:
      "Sign up on Quizard, the go-to destination for challenging quizzes and exciting trivia.",
    alternates: {
      canonical: BASE_URL + "register",
      url: BASE_URL + "register",
    },
    openGraph: {
      title: "Register" + " | " + SITE_NAME,
      description:
        "Sign up on Quizard, the go-to destination for challenging quizzes and exciting trivia.",
      url: BASE_URL + "register",
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
      title: `Register | ${SITE_NAME}`,
      description:
        "Sign up on Quizard, the go-to destination for challenging quizzes and exciting trivia.",
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
    metadataBase: BASE_URL + "register",
  };
}
