"use client";
import React from "react";
import { RecoilRoot } from "recoil";
import MultiLeaderBoard from "./MultiLeaderBoard";
import ProviderStore from "@/redux/ProviderStore";

const Root = ({classListData}) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <MultiLeaderBoard classListData={classListData}/>
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
