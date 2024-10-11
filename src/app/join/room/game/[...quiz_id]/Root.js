"use client";
import React from "react";
import RoomQuiz from "./RoomQuiz";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = ({classListData , soketToken}) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <RoomQuiz classListData={classListData}  soketToken={soketToken}/>
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;