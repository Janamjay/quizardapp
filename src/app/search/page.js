import React from 'react'
import SearchItem from './SearchItem'
import { userClass } from "@/app/api/service.js";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const page = async() => {
  const classList = await userClass();
  return (
    <div>
      <SearchItem classListData={classList} />
    </div>
  )
}

export default page

export function generateMetadata() {
    return {
      title:"Search items",
      description:"Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode ....",
      alternates: {
        canonical: BASE_URL + "search",
      url: BASE_URL + "search",
      },
      openGraph: {
        title: "Search items",
        description:
          "Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode ....",
          url: BASE_URL + "search",
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
        title: `Search items | ${SITE_NAME}`,
        description:"Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode.",
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
      metadataBase: BASE_URL + "search",
    };
  }
