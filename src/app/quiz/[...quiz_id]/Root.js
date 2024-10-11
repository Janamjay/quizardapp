"use client";
import React from "react";
import Description from "./Description";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = ({classListData , quizDetail }) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <Description classListData={classListData} quizDetail={quizDetail}/>
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
