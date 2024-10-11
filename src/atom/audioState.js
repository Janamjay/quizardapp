"use client";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({ key: "audioState" });

export const audioStateAtom = atom({
  key: "audioState",
  default: {
    soundOn: true,
    backgroundSoundOn: true,
    clock: true,
    resultStatus: false,
  },
  effects_UNSTABLE: [persistAtom],
});
