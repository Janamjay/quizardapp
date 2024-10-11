"use client"
import ProviderStore from "@/redux/ProviderStore";
import React from "react";
import StartPage from "./StartPage";

const Root = ({dashboardData , classListData }) => {
  return (
    <div>
      <ProviderStore>
        <StartPage dashboardData={dashboardData} classListData={classListData} />
      </ProviderStore>
    </div>
  );
};

export default Root;
