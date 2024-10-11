"use client";
import React from "react";
import FormContact from "./FormContact";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = ({userProfileData }) => {
  return (
    <ProviderStore>
      <RecoilRoot>
        <div>
          <FormContact userProfileData={userProfileData} />
        </div>
      </RecoilRoot>
    </ProviderStore>
  );
};

export default Root;
