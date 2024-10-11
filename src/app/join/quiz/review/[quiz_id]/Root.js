"use client";
import React from "react";
import Review from "./Review";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = ({classListData , quizSolutions }) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <Review classListData={classListData} quizSolutions={quizSolutions}/>
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
