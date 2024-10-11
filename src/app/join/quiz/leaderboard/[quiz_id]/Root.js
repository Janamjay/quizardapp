"use client";
import React from "react";
import { RecoilRoot } from "recoil";
import LeaderBoard from "./LeaderBoard";
import ProviderStore from "@/redux/ProviderStore";

const Root = ({ classListData, leaderboardUserData }) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <LeaderBoard
            classListData={classListData}
            leaderboardUserData={leaderboardUserData}
          />
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
