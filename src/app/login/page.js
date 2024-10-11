import React from "react";
import Login from "./Login";
import { userClass , googleAuthRedirect} from "@/app/api/service.js";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const page = async() => {
  const classList = await userClass();
  const googleRedirect = await googleAuthRedirect()
  return (
    <div>
      <Login classListData={classList}  googleRedirect={googleRedirect}/>
    </div>
  );
};

export default page;

export function generateMetadata() {
  return {
    title: "Login" + " | " + SITE_NAME,
    description:
      "Discover the world of knowledge and challenge yourself with Quizard's captivating quizzes.",
    alternates: {
      canonical: BASE_URL + "login",
      url: BASE_URL + "login",
    },
    openGraph: {
      title: "Login" + " | " + SITE_NAME,
      description:
        "Discover the world of knowledge and challenge yourself with Quizard's captivating quizzes.",
      url: BASE_URL + "login",
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
      title: `Login | ${SITE_NAME}`,
      description:"Discover the world of knowledge and challenge yourself with Quizard's captivating quizzes.",
      creator:SITE_NAME,
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
    metadataBase: BASE_URL + "login",
  };
}
