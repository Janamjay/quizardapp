"use client";
import React from "react";
import Result from "./Result";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = ({classListData ,resultData}) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <Result classListData={classListData} resultData={resultData}/>
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
