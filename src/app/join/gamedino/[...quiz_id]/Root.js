"use client";
import React from "react";
import QuizD from "./QuizD";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = ({ classListData, quizPlayData, quizDetails }) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <QuizD
            classListData={classListData}
            quizPlayData={quizPlayData}
            quizDetails={quizDetails}
          />
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
