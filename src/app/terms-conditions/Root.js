"use client";
import React from "react";
import Terms from "./Terms";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = () => {
  return (
    <ProviderStore>
      <RecoilRoot>
        <div>
          <Terms />
        </div>
      </RecoilRoot>
    </ProviderStore>
  );
};

export default Root;
