import React from "react";
import Root from "./Root"
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer.jsx";
import { userClass } from "@/app/api/service.js";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;
const page = async() => {
  const classList = await userClass();
  return (
    <div className="font-Montserrat">
      <Navbar classListData={classList} />
      <div
        className="h-[50vh] sm:h-[70vh] bg-cyan500 dark:bg-cyan600 flex items-center curved 
      sm:curve"
      >
        <div className="flex flex-col md:flex-row justify-evenly items-center w-full p-4">
          <h1 className="text-center text-white font-[Montserrat] text-4xl sm:text-6xl pb-8 sm:pt-8 font-medium">
            About Quizard
          </h1>
        </div>
      </div>
      <div className="my-[3rem] w-full ">
        <div className="flex justify-center w-full my-7">
          <p className="w-[80%] text-left text-xl font-[Montserrat] text-[#212529] font-medium">
            Welcome to Quizard, where the thrill of learning intertwines
            seamlessly with the joy of entertainment! Born from a passion for
            knowledge and a commitment to fostering intellectual curiosity,
            QUIZARD stands as a beacon in the online quiz game realm.
          </p>
        </div>
        <div className="flex justify-center w-full my-7">
          <h1 className="w-[80%] text-xl font-[Montserrat] text-[#212529] font-bold">
            🌐 Our Vision:
          </h1>
        </div>
        <div className="flex justify-center w-full ">
          <p className="w-[80%] text-left text-xl font-[Montserrat] text-[#212529] font-medium">
            At Quizard, we believe in the transformative power of education, and
            we{"'"}ve channeled this belief into a dynamic online platform. Our
            vision is to create an engaging space that caters to students,
            teachers, and working professionals alike, offering a unique blend
            of learning and leisure.
          </p>
        </div>
        <div className="flex justify-center w-full my-7">
          <h1 className="w-[80%] text-xl font-[Montserrat] text-[#212529] font-bold">
            🌟 Knowledge Meets Fun:
          </h1>
        </div>
        <div className="flex justify-center w-full ">
          <p className="w-[80%] text-left text-xl font-[Montserrat] text-[#212529] font-medium">
            Welcome to a world where every question isn{"'"}t just a query but a
            gateway to a world of possibilities. Quizard is more than just an
            online quiz game platform; it{"'"}s a celebration of intellect, a
            fusion of education and entertainment. Here, learning is not a task;
            it{"'"}s an adventure waiting to unfold.
          </p>
        </div>
        <div className="flex justify-center w-full my-7">
          <h1 className="w-[80%] text-xl font-[Montserrat] text-[#212529] font-bold">
            🤔 Challenge Yourself:
          </h1>
        </div>
        <div className="flex justify-center w-full ">
          <p className="w-[80%] text-left text-xl font-[Montserrat] text-[#212529] font-medium">
            Ready to test your wits? Quizard invites you to challenge yourself
            with a myriad of quizzes covering diverse topics. From science to
            pop culture, history to technology, our quizzes are crafted to
            stimulate your mind, encouraging you to delve into the depths of
            your knowledge and emerge victorious.
          </p>
        </div>
        <div className="flex justify-center w-full my-7">
          <h1 className="w-[80%] text-xl font-[Montserrat] text-[#212529] font-bold">
            🌐 For Everyone, Everywhere:
          </h1>
        </div>
        <div className="flex justify-center w-full ">
          <p className="w-[80%] text-left text-xl font-[Montserrat] text-[#212529] font-medium">
            Whether you{"'"}re a student seeking a break from textbooks, a
            teacher looking to add a dash of excitement to your lessons, or a
            working professional wanting to unwind with a mental workout,
            Quizard is your go-to destination. Our platform is designed to cater
            to a diverse audience, fostering a sense of community through the
            shared love of learning.
          </p>
        </div>
        <div className="flex justify-center w-full my-7">
          <h1 className="w-[80%]  text-xl font-[Montserrat] text-[#212529] font-bold">
            👫 Compete and Connect:
          </h1>
        </div>
        <div className="flex justify-center w-full ">
          <p className="w-[80%] text-left text-xl font-[Montserrat] text-[#212529] font-medium">
            Join Quizard to compete with friends, colleagues, or fellow
            enthusiasts. Our platform isn{"'"}t just about individual
            achievement; it{"'"}s about the camaraderie that blossoms when minds
            meet in friendly competition. Connect with like-minded individuals,
            share insights, and celebrate the joy of collective knowledge.
          </p>
        </div>
      </div>
      <Footer />
      <Root/>
    </div>
  );
};

export default page;

export function generateMetadata() {
  return {
    title: "About" + " | " + SITE_NAME,
    description:
      "Welcome to Quizard, where the thrill of learning intertwines seamlessly with the joy of entertainment! Born from a passion for knowledge and a commitment to fostering intellectual curiosity, QUIZARD stands as a beacon in the online quiz game realm.",
    alternates: {
      canonical: BASE_URL + "about",
      url: BASE_URL + "about",
    },
    openGraph: {
      title: "About" + " | " + SITE_NAME,
      description:
        "Quizard is your go-to online quiz platform, tailored for K-12 students and individuals gearing up for JEE, NEET, CBSE BOARD Exams, and various competitive assessments. ",
      url: BASE_URL + "about",
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
      title: "About" + " | " + SITE_NAME,
      description: "Quizard is your go-to online quiz platform, tailored for K-12 students and individuals gearing up for JEE, NEET, CBSE BOARD Exams, and various competitive assessments.",
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
    metadataBase: BASE_URL + "about",
  };
}
