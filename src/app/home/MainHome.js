/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import StartPageHome from "./StartPageHome";
import { RecoilRoot } from "recoil";
import dynamic from "next/dynamic";
import ProviderStore from "@/redux/ProviderStore";
import Cookies from "js-cookie";
import { getCookie, setCookie } from "cookies-next";

const MainHome = ({ dashboardData, classListData, userProfileData  }) => {
  const fetchData = () => {
    try {
      const apiData = userProfileData;
      const formattedCoinScore = apiData.user_coin;
      const coinScore =
        formattedCoinScore > 1000
          ? (formattedCoinScore / 1000).toFixed(1) + "k"
          : formattedCoinScore;
      setCookie("score", coinScore);
    } catch (error) {}
  };
  fetchData();

  return (
    <ProviderStore>
      <RecoilRoot>
        <StartPageHome
          dashboardData={dashboardData}
          classListData={classListData}
        />
      </RecoilRoot>
     </ProviderStore>
  );
};
// export default MainHome;

export default dynamic(() => Promise.resolve(MainHome), { ssr: true });
