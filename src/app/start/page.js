import React from "react";
import Root from "./Root";
import { dashBoardQuizTest, userClass } from "@/app/api/service.js";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const page = async () => {
  const dashboardData = await dashBoardQuizTest();
  const classList = await userClass();

  function getDateTimezone() {
    var currentDate = new Date();
    var isoStringWithoutMilliseconds = currentDate.toISOString();
    var milliseconds = currentDate.getMilliseconds();
    var isoStringWithMilliseconds =
      isoStringWithoutMilliseconds.slice(0, -1) +
      "." +
      ("00" + milliseconds).slice(-3) +
      "Z";
    return isoStringWithMilliseconds;
  }
  const article = {
    "@context": "http://schema.org",
    "@type": "Article",
    name: "Live Quiz" + " | " + SITE_NAME,
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

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <Root dashboardData={dashboardData} classListData={classList} />
    </div>
  );
};

export default page;

export function generateMetadata() {
  return {
    title: "Live Quiz" + " | " + SITE_NAME,
    description:
      "Play Live Quiz of Quiz From different Topics With different types of Mode Like Dino Mode.",
    alternates: {
      canonical: BASE_URL + "start",
      url: BASE_URL + "start",
    },
    openGraph: {
      title: "Live Quiz" + " | " + SITE_NAME,
      description:
        "Play Live Quiz of Quiz From different Topics With different types of Mode Like Dino Mode.",
      url: BASE_URL + "start",
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
      title: `Live Quiz | ${SITE_NAME}`,
      description:
        "Play Live Quiz of Quiz From different Topics With different types of Mode Like Dino Mode.",
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
    metadataBase: BASE_URL + "start",
  };
}
