"use client";
import React from "react";
import RoomInterface from "./RoomInterface";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Root = ({ soketToken}) => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <RoomInterface soketToken={soketToken}/>
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
