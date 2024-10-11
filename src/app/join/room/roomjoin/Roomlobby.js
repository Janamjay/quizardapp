/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use client";
import "animate.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactSwitch from "react-switch";
import { useRecoilState } from "recoil";
import { audioStateAtom } from "@/atom/audioState";
import { selectRoomData } from "@/redux/roomSlice";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setRoomData } from "@/redux/roomSlice.js";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";
import { getCookie } from "cookies-next";

const RoomLobby = () => {
  const nav = useRouter();
  const user = getCookie("user");
  const dispatch = useDispatch();
  const loc = useSelector(selectRoomData);
  const location = loc.roomData;
  const [checkedSound, setCheckedSound] = useState(true);
  const [checkedBackground, setCheckedBackground] = useState(true);
  const [userName, setUserName] = useState(user);
  const [audio, setAudio] = useRecoilState(audioStateAtom);
  const [quizSetting, setQuizSetting] = useState(location.settingData);

  useEffect(() => {
    const isEnableTimer = location?.data?.is_enable_timer;
    setAudio({ ...audio, clock: isEnableTimer && isEnableTimer });
  }, []);

  const roomLobby = async () => {
    const quiz_id = location.data.quiz_id;
    const game_pin_id = location.data.gpid;
    const gameroom_code = location.data.game_room_code;
    const user_name = userName;
    try {
      const requestRoomDataStart = {
        quiz_id,
        game_pin_id,
        gameroom_code,
        user_name,
      };
      const response = await fetch("/api/room_join_team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestRoomDataStart),
      });
      const res = await response.json();
      if (res.is_roomFull == 0) {
        if (res.is_rejected_by_host == 0) {
          const roomData = {
            name: location.data.question_set_name,
            inviteCode: location.data.game_room_code,
            playerId: res.player_id,
            isRemovedByHost: res.is_removedBy_host,
            room_limit: res.room_limit,
            user_id: location.userId,
            quiz_id: location.data.quiz_id,
            class_id: location.data.sub_course_id,
            // token_id: location.token,
            checkedSound: checkedSound,
            checkedBackground: checkedBackground,
            checkedTimer: location.data.is_enable_timer,
            checkedRandomQuestion: location.data.is_random_question,
            checkedRandomOption: location.data.is_random_option,
            quizsound: location.quizsound,
          };
          dispatch(setRoomData(roomData));
          nav.push(`/join/room/roomlobby/${location.data.quiz_id}`);
        }
      }
    } catch (err) {}
  };

  const handleChangeSound = (nextChecked) => {
    setCheckedSound(nextChecked);
    const newQuizSetting = quizSetting.map((setting) => {
      if (setting?.parameter_code === "SE") {
        return { ...setting, parameterValue: nextChecked ? 1 : 0 };
      }
      return setting;
    });
    setQuizSetting(newQuizSetting);
    setAudio({ ...audio, soundOn: nextChecked });
  };

  const handleChangeBackground = (nextChecked) => {
    setCheckedBackground(nextChecked);
    const newQuizSetting = quizSetting.map((setting) => {
      if (setting.parameter_code === "BS") {
        return { ...setting, parameterValue: nextChecked ? 1 : 0 };
      }
      return setting;
    });
    setQuizSetting(newQuizSetting);
    setAudio({ ...audio, backgroundSoundOn: nextChecked });
  };

  const handleRoom = () => {
    if (userName.trim() === "") {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "Please fill in the Name field.",
      });
    } else {
      roomLobby();
    }
  };
  return (
    <>
      <ProviderStore>
        <RecoilRoot>
          <div
            className={`fixed
      } top-0 left-0 w-full h-[85vh] select-none h-full flex items-end items-center justify-center transition-opacity duration-1000  bg-gray-100 bg-opacity-10  z-50`}
          >
            <div
              className={`bg-white dark:bg-grey800  p-6 pt-3 rounded-lg shadow-lg relative   w-full sm:w-[48%] md:w-[23%] `}
            >
              <div>
                <input
                  className=" placeholder:text-black font-[Montserrat] font-semibold block bg-white border border-cyan-300 rounded-md py-5 px-3 mb-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm h-[40px]   mt-[2rem] w-full"
                  placeholder="Enter Name"
                  type="text"
                  name="code"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <button
                  aria-label="continue"
                  className="bg-cyan500 hover:bg-cyan600 text-white font-semibold hover:text-white py-2 px-6 border border-cyan-500 hover:border-transparent rounded flex items-center justify-center w-full font-[Montserrat]"
                  onClick={() => handleRoom(location.data.quiz_id)}
                >
                  Continue
                </button>
              </div>
              <h2 className="text-xl mt-4 font-bold font-[Montserrat] mb-2 dark:text-white">
                Game Settings
              </h2>

              {quizSetting &&
                quizSetting.length &&
                quizSetting.map((setting, index) => (
                  <div key={index}>
                    {setting.parameter_code === "SE" && (
                      <div className="mt-6 flex justify-between">
                        <span className="text-black font-[Montserrat] font-semibold dark:text-white">
                          Sound Effects
                        </span>
                        <span className="mr-3">
                          <ReactSwitch
                            onChange={handleChangeSound}
                            checked={
                              setting.parameterValue === 1 ? true : false
                            }
                            className="react-switch"
                            height={20}
                            width={45}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                          />
                        </span>
                      </div>
                    )}
                    {setting.parameter_code === "BS" && (
                      <div className="mt-2 flex justify-between">
                        <span className="text-black font-[Montserrat] font-semibold dark:text-white">
                          Background Sound
                        </span>
                        <span className="mr-3">
                          <ReactSwitch
                            onChange={handleChangeBackground}
                            checked={
                              setting.parameterValue === 1 ? true : false
                            }
                            className="react-switch"
                            height={20}
                            width={45}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                          />
                        </span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </RecoilRoot>
      </ProviderStore>
    </>
  );
};

export default RoomLobby;
