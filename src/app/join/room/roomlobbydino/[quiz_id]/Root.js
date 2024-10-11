"use client";
import React from "react";
import { RecoilRoot } from "recoil";
import RoomInterfaceDino from "./RoomInterfaceDino";
import ProviderStore from "@/redux/ProviderStore";

const Root = ({ soketToken }) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <RoomInterfaceDino soketToken={soketToken} />
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
