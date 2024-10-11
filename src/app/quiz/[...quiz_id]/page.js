import React from "react";
import Root from "./Root";
import axios from "axios";
import { userClass, quizDetailId } from "@/app/api/service.js";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_BASE_URL = process.env.QUIZARD_APP_API;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;

const page = async ({ params }) => {
  const classList = await userClass();
  const quizIdArray = params?.quiz_id || [];
  const quiz_id = quizIdArray[0];
  const quizDetail = await quizDetailId({ quiz_id });
  const requestData = {
    params: {
      quiz_id: quiz_id,
    },
  };
  const subject = await axios.get(
    API_BASE_URL + "quiz-details-by-id",
    requestData
  );
  const quizUrlSlug = quizIdArray.join("/");

  let educationalLevel = "intermediate";

  switch (subject.data.quiz_details.difficulty_level) {
    case "Easy":
      educationalLevel = "beginner";
      break;
    case "Medium":
      educationalLevel = "intermediate";
      break;
    case "Hard":
      educationalLevel = "advanced";
      break;
    default:
      educationalLevel = "intermediate";
  }

  function getQuestionType(questionCategory) {
    let eduQuestionType = "Multiple choice";
    switch (questionCategory) {
      case "m":
        eduQuestionType = "Multiple choice";
        break;
      case "MCQ":
        eduQuestionType = "Checkbox";
        break;
      default:
        eduQuestionType = "Multiple choice";
    }
    return eduQuestionType;
  }
  function getDateTimezone(date) {
    const originalDateString = date ? date : new Date();
    const originalDate = new Date(originalDateString.replace(" ", "T") + "Z");

    const formattedDateString = originalDate.toISOString();
    return formattedDateString;
  }

  let className = subject.data.quiz_details.sub_course_name.replace("Class", "Grade");
  function educationalLevelTargetName() {
    let educationalLevelTargetName = "";
    switch (className.toUpperCase()) {
      case "DEFAULT":
        educationalLevelTargetName =
          subject.data.quiz_details.subject_name +
          ": " +
          subject.data.quiz_details.chapter_name;
        break;
      default:
        educationalLevelTargetName =
        className +
          ": " +
          subject.data.quiz_details.subject_name +
          ": " +
          subject.data.quiz_details.chapter_name;
    }
    return educationalLevelTargetName;
  }

  const jsonLd = {
    "@context": "http://schema.org",
    "@type": "Article",
    name: subject.data.quiz_details.question_set_name,
    description: subject.data.quiz_details.question_set_name,
    headline: subject.data.quiz_details.question_set_name,
    "@id": `${BASE_URL}quiz/${quizUrlSlug}`,
    image: BASE_URL + "quizard.png",
    dateModified: getDateTimezone(subject.data.quiz_details.updated_at),
    datePublished: getDateTimezone(subject.data.quiz_details.created_at),
    author: {
      name: SITE_NAME,
      url: BASE_URL,
    },
  };

  const jsonLdPracticeProblemSchema = {
    "@context": "http://schema.org",
    "@type": "Quiz",
    name: subject.data.quiz_details.question_set_name,
    about: {
      "@type": "Thing",
      name: subject.data.quiz_details.question_set_name,
    },
    typicalAgeRange: "7-60",
    educationalLevel: educationalLevel,
    assesses: subject.data.quiz_details.chapter_name,
    educationalAlignment: [
      {
        "@type": "AlignmentObject",
        alignmentType: "educationalSubject",
        targetName: subject.data.quiz_details.subject_name,
      },
      {
        "@type": "AlignmentObject",
        alignmentType: "educationalLevel",
        targetName: educationalLevelTargetName(),
      },
    ],
    hasPart: subject.data.quizQuestionData
      .slice(0, 5)
      .map((questionData, index) => {
        return {
          "@type": "Question",
          eduQuestionType: getQuestionType(questionData.category),
          learningResourceType: "Practice problem",
          name: questionData.question_name,
          text: questionData.question_name,
          comment: {
            "@type": "Comment",
            text: questionData.question_name,
          },
          encodingFormat: "text/html",
          suggestedAnswer: questionData.options.map((option) => {
            return {
              "@type": "Answer",
              position: option.id,
              encodingFormat: "text/html",
              text: option.value,
              comment: {
                "@type": "Comment",
                text: option.value,
              },
            };
          }),
          acceptedAnswer: {
            "@type": "Answer",
            position: parseInt(questionData.answer),
            encodingFormat: "text/html",
            text: questionData.options.find(
              (option) =>
                option.id.toString() === questionData.answer.toString()
            ).value,
            comment: {
              "@type": "Comment",
              text: questionData.options.find(
                (option) =>
                  option.id.toString() === questionData.answer.toString()
              ).value,
            },
            answerExplanation: {
              "@type": "Comment",
              text: questionData.options.find(
                (option) =>
                  option.id.toString() === questionData.answer.toString()
              ).value,
            },
          },
        };
      }),
  };

  const jsonLdEducationQnASchema = {
    "@context": "https://schema.org/",
    "@type": "Quiz",
    about: {
      "@type": "Thing",
      name: subject.data.quiz_details.question_set_name,
    },
    educationalAlignment: [
      {
        "@type": "AlignmentObject",
        alignmentType: "educationalSubject",
        targetName: "Biology",
      },
    ],
    hasPart: subject.data.quizQuestionData
      .slice(0, 5)
      .map((questionData, index) => {
        return {
          "@context": "https://schema.org/",
          "@type": "Question",
          eduQuestionType: "Flashcard",
          encodingFormat: "text/html",
          text: questionData.question_name,
          acceptedAnswer: {
            "@type": "Answer",
            encodingFormat: "text/html",
            text: questionData.options.find(
              (option) =>
                option.id.toString() === questionData.answer.toString()
            ).value,
          },
        };
      }),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdPracticeProblemSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdEducationQnASchema),
        }}
      />
      <Root classListData={classList} quizDetail={quizDetail} />
    </div>
  );
};

export default page;

export async function generateMetadata({ params }) {
  const quizIdArray = params?.quiz_id || [];
  const quizId = quizIdArray[0];
  const requestData = {
    params: {
      quiz_id: quizId,
    },
  };
  const subject = await axios.get(
    API_BASE_URL + "quiz-details-by-id",
    requestData
  );
  const quizUrlSlug = quizIdArray.join("/");
  return {
    title: `${subject.data.quiz_details.question_set_name} | ${SITE_NAME}`,
    description: `${subject.data.quiz_details.question_set_name}`,
    alternates: {
      canonical: `${BASE_URL}quiz/${quizUrlSlug}`,
      url: `${BASE_URL}quiz/${quizUrlSlug}`,
    },
    openGraph: {
      title: `${subject.data.quiz_details.question_set_name} | ${SITE_NAME}`,
      description: `${subject.data.quiz_details.question_set_name} `,
      url: `${BASE_URL}quiz/${quizUrlSlug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: subject.data.quiz_details.quizbannerimg ? subject.data.quiz_details.quizbannerimg  : `${BASE_URL}quizard.png`,
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
      title: subject.data.quiz_details.question_set_name,
      description: subject.data.quiz_details.question_set_name,
      creator: SITE_NAME,
      images: subject.data.quiz_details.quizbannerimg ? subject.data.quiz_details.quizbannerimg  : `${BASE_URL}quizard.png`,
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
    metadataBase: `${BASE_URL}quiz/${quizUrlSlug}`,
  };
}
