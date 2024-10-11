"use client";
import React from "react";
import { RecoilRoot } from "recoil";
import Timer from "./Timer";
import ProviderStore from "@/redux/ProviderStore";

const Root = () => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <Timer />
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
