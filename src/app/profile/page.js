import React from "react";
import Profile from "./Profile";
import { userClass , userProfile} from "@/app/api/service.js";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const page = async() => {
  const classList = await userClass();
  const userProfileData = await userProfile();
// console.log(userProfileData)
  return (
    <div>
      <Profile classListData={classList} userProfileData={userProfileData} />
    </div>
  );
};
export default page;

export function generateMetadata() {
  return {
    title: "Profile" + " | " + SITE_NAME,
    description:
      "Discover your inner genius with Quizard, the ultimate quiz website that offers a personalized profile page for every user.",
    alternates: {
      canonical: BASE_URL + "profile",
      url: BASE_URL + "profile",
    },
    openGraph: {
      title: "Profile" + " | " + SITE_NAME,
      description:
        "Discover your inner genius with Quizard, the ultimate quiz website that offers a personalized profile page for every user.",
      url: BASE_URL + "profile",
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
      title: `Profile | ${SITE_NAME}`,
      description:"Discover your inner genius with Quizard, the ultimate quiz website that offers a personalized profile page for every user.",
      creator:SITE_NAME,
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
    metadataBase: BASE_URL + "profile",
  };
}
