import React from 'react'
import Root from './Root'
import { cookies } from "next/headers";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;

const page = () => {
  const cookieStore = cookies();
  const soketId = cookieStore.get("tokenid")?.value;
  return (
    <div>
      <Root soketToken={soketId} />
    </div>
  )
}

export default page

export async function generateMetadata({ params }) {
  const quizIdArray = params?.quiz_id || [];
  const quizId = quizIdArray; 
  return {
    title: `Room lobby dino mode | ${SITE_NAME}`,
    description:
      "Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode ....",
    alternates: {
      canonical: BASE_URL + "join/room/roomlobbydino/" + quizId,
      url: BASE_URL + "join/room/roomlobbydino/" + quizId,
    },
    openGraph: {
      title: `Room lobby dino mode | ${SITE_NAME}`,
      description:
        "Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode ....",
        url: BASE_URL + "join/room/roomlobbydino/" + quizId,
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
      title: `Room lobby dino mode | ${SITE_NAME}`,
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
    metadataBase: BASE_URL + "join/room/roomlobbydino/" + quizId,
  };
}