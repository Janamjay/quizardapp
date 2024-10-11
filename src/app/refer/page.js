import React from "react";
import Refer from "./Refer";
import { userClass } from "@/app/api/service.js";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const page = async() => {
  const classList = await userClass();
  return (
    <div>
      <Refer classListData={classList} />
    </div>
  );
};
export default page;

export function generateMetadata() {
  return {
    title: "Refer & Earn" + " | " + SITE_NAME,
    description:
      "Discover endless fun and knowledge with Quizard's quiz website, where you can earn rewards while challenging your mind.",
    alternates: {
      canonical: BASE_URL + "refer",
      url: BASE_URL + "rfer",
    },
    openGraph: {
      title: "Refer & Earn" + " | " + SITE_NAME,
      description:
        "Discover endless fun and knowledge with Quizard's quiz website, where you can earn rewards while challenging your mind.",
      url: BASE_URL + "rfer",
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
      title: `Refer & Earn | ${SITE_NAME}`,
      description:"Discover endless fun and knowledge with Quizard's quiz website, where you can earn rewards while challenging your mind.",
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
    metadataBase: BASE_URL + "refer",
  };
}
