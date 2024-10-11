import React from 'react'
import CreateQuiz from "./CreateQuiz"
import { cookies } from "next/headers"; 
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME; 

const page = () => {
  const cookieStore = cookies();
  const userName = cookieStore.get("user")?.value;
  return (
    <div>
      <CreateQuiz userName={userName}/>
    </div>
  )
}

export default page

export function generateMetadata() {
  return {
    title: "Create Quiz" + " | " + SITE_NAME,
    description:
      "Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode.",
    alternates: {
      canonical: BASE_URL,
      url: BASE_URL,
    },
    openGraph: {
      title: "Create Quiz" + " | " + SITE_NAME,
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
      title: "Create Quiz" + " | " + SITE_NAME,
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