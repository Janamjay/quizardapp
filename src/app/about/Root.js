"use client"
import React from "react";
import About from "./About";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = () => {
  return (
    <ProviderStore>
      <RecoilRoot>
        <div>
          <About />
        </div>
      </RecoilRoot>
    </ProviderStore>
  );
};

export default Root;
