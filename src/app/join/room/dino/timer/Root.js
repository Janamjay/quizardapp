"use client";
import React from "react";
import { RecoilRoot } from "recoil";
import TimerDino from "./TimerDino";
import ProviderStore from "@/redux/ProviderStore";

const Root = () => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <TimerDino />
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
