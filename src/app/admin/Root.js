"use client";
import React from "react";
import ProviderStore from "@/redux/ProviderStore";
import { RecoilRoot } from "recoil";
import Admin from "./Admin";

const Root = ({ userName, dashboardData }) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <Admin userName={userName} dashboardData={dashboardData} />
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
