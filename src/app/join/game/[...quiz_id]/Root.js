"use client";
import React from "react";
import Quiz from "./Quiz";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = ({ classListData, quizPlayData, quizDetails }) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <Quiz
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
