"use client";
import React from "react";
import { RecoilRoot } from "recoil";
import RoomQuizD from "./RoomQuizD";
import ProviderStore from "@/redux/ProviderStore";

const Root = ({classListData , soketToken}) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <RoomQuizD classListData={classListData}  soketToken={soketToken}/>
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
