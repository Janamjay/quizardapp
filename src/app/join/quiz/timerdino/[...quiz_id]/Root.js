"use client";
import React from "react";
import TimerPage from "./TimerPage";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = () => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <TimerPage />
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
