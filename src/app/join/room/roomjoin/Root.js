"use client";
import React from "react";
import { RecoilRoot } from "recoil";
import RoomLobby from "./Roomlobby";
import ProviderStore from "@/redux/ProviderStore";

const Root = () => {
  return (
    <div>
      <ProviderStore>
        <RecoilRoot>
          <RoomLobby />
        </RecoilRoot>
      </ProviderStore>
    </div>
  );
};

export default Root;
