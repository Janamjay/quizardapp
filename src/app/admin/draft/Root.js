"use client";
import React from "react";
import ProviderStore from "@/redux/ProviderStore";
import { RecoilRoot } from "recoil";
import Draft from "./Draft";

const Root = ({userName }) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <Draft userName={userName}/>
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;