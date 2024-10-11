"use client";
import React from "react";
import Privacy from "./Privacy";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = () => {
  return (
    <ProviderStore>
      <RecoilRoot>
        <div>
          <Privacy />
        </div>
      </RecoilRoot>
    </ProviderStore>
  );
};

export default Root;
