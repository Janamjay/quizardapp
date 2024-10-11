import React from "react";
import axios from "axios";
import Root from "./Root";
import { userClass, quizDetails, chapterList } from "@/app/api/service.js";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_BASE_URL = process.env.QUIZARD_APP_API;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;

const Page = async ({ params }) => {
  const page = 1;
  const quizIdArray = params?.quiz_id || [];
  const subjectId = quizIdArray[0];
  const classList = await userClass();
  const quizDetail = await quizDetails({ subjectId, page });
  const chapterLists = await chapterList({ subjectId });
  return (
    <div>
      <Root
        classListData={classList}
        quizDetail={quizDetail}
        chapterLists={chapterLists}
      />
    </div>
  );
};

export default Page;

export async function generateMetadata({ params }) {
  const quizIdArray = params?.quiz_id || [];
  const subjectId = quizIdArray[0];
  const requestData = {
    params: {
      subject_id: subjectId,
    },
  };
  const subject = await axios.get(
    API_BASE_URL + "quiz-details-by-subject",
    requestData
  );
  const quizUrlSlug = quizIdArray.join("/");
  return {
    title: `${subject.data.subjectMetaData.subject_meta_title} | ${SITE_NAME}`,
    description: subject.data.subjectMetaData.subject_meta_description,
    alternates: {
      canonical: `${BASE_URL}all/${quizUrlSlug}`,
      url: `${BASE_URL}all/${quizUrlSlug}`,
    },
    openGraph: {
      title: `${subject.data.subjectMetaData.chapter_nsubject_meta_titleame} | ${SITE_NAME}`,
      description: subject.data.subjectMetaData.subject_meta_description,
      url: `${BASE_URL}all/${quizUrlSlug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: `${BASE_URL}quizard.png`,
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
      title: subject.data.subjectMetaData.subject_meta_title,
      description: subject.data.subjectMetaData.subject_meta_description,
      // siteId: '1467726470533754880',
      creator: SITE_NAME,
      // creatorId: '1467726470533754880',
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
    metadataBase: `${BASE_URL}all/${quizUrlSlug}`,
  };
}
