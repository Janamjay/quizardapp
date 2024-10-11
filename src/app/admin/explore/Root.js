"use client";
import React from "react";
import ProviderStore from "@/redux/ProviderStore";
import { RecoilRoot } from "recoil";
import Explore from "./Explore";

const Root = ({userName , dashboardData}) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <Explore  userName={userName} dashboardData={dashboardData}/>
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;