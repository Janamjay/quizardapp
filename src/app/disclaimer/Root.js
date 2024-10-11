"use client"
import React from "react";
import Disclaimer from "./Disclaimer";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = () => {
  return (
    <ProviderStore>
      <RecoilRoot>
        <div>
          <Disclaimer />
        </div>
      </RecoilRoot>
    </ProviderStore>
  );
};

export default Root;
