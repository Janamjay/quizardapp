import React from "react";
import Root from "./Root";
import { userClass, leaderboardData, userProfile } from "@/app/api/service.js";
import { cookies } from "next/headers";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const page = async ({ params }) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const userProfileData = await userProfile(token);
  const page = 1;
  const quizIdArray = params?.quiz_id || [];
  const quiz_id = quizIdArray;
  const classList = await userClass();
  const leaderboardUserData = await leaderboardData({ quiz_id, page });
  // console.log(leaderboardUserData)
  return (
    <div>
      <Root
        classListData={classList}
        leaderboardUserData={leaderboardUserData}
        userProfileData={userProfileData}
      />
    </div>
  );
};

export default page;

export async function generateMetadata({ params }) {
  const quizIdArray = params?.quiz_id || [];
  const quizId = quizIdArray;
  return {
    title: `Leaderboard | ${SITE_NAME}`,
    description:
      "Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode.",
    alternates: {
      canonical: BASE_URL + "join/quiz/leaderboard/" + quizId,
      url: BASE_URL + "join/quiz/leaderboard/" + quizId,
    },
    openGraph: {
      title: `Leaderboard | ${SITE_NAME}`,
      description:
        "Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode.",
      url: BASE_URL + "join/quiz/leaderboard/" + quizId,
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
      title: `Leaderboard | ${SITE_NAME}`,
      description:
        "Play Different Type of Quiz From different Topics With different types of Mode Like Dino Mode.",
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
    metadataBase: BASE_URL + "join/quiz/leaderboard/" + quizId,
  };
}
