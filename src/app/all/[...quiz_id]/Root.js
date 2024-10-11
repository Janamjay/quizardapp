"use client";
import React from "react";
import ViewAll from "./ViewAll";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = ({classListData , quizDetail , chapterLists  }) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <ViewAll classListData={classListData} quizDetail={quizDetail} chapterLists={chapterLists} />
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
