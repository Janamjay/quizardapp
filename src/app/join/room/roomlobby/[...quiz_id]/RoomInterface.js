/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// import Navbar from "../../navbar/Navbar";
"use client";
const originalConsoleError = console.error;
console.error = (...args) => {
  if (/Support for defaultProps/.test(args[0])) {
    return;
  }
  originalConsoleError(...args);
};
import React, { useState, useEffect, useRef, useCallback } from "react";
import { animated } from "react-spring";
import { RxCopy } from "react-icons/rx";
import { BsShare } from "react-icons/bs";
import { BiRightArrowCircle } from "react-icons/bi";
import { ImUsers } from "react-icons/im";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ShareModal from "@/app/components/modal/ShareModal";
import sortedUsers from "@/app/utils/user";
import back from "/public/images/result.jpg";
import OvalLoader from "@/app/utils/OvalLoader";
import { audioStateAtom } from "@/atom/audioState";
// import $ from "jquery";
import Swal from "sweetalert2";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { useRecoilState } from "recoil";
import { Howl, Howler } from "howler";
import { useParams, useRouter } from "next/navigation";
import { selectRoomData } from "@/redux/roomSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectQuizSound } from "@/redux/audioSlice";
import { setRoomFriend } from "@/redux/friendSlice";
import { getCookie } from "cookies-next";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_ENDPOINT;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const RoomInterface = ({ soketToken }) => {
  const nav = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    const tokenId = getCookie("isUserLoggedIn");
    setTokenId(tokenId);
    if (!tokenId) {
      nav.push("/start");
    }
    const classId = getCookie("class_user_id");
    setClassId(classId);
    const socketToken = soketToken;
    setSocketToken(socketToken);
    const userId = getCookie("user_id");
    setUserId(userId);
  }, []);
  // const question_set_name = params.quiz_id[0];
  const quiz_id = params.quiz_id[0];
  const location = useSelector(selectRoomData);
  const socketRef = useRef();
  const [quizData, setQuizData] = useState({});
  const [roomDetail, setRoomDetail] = useState({});
  const [isCopied, setIsCopied] = useState(false);
  const [users, setUsers] = useState(sortedUsers);
  const [animatedCards, setAnimatedCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waitModal, setWaitModal] = useState(false);
  const [waitTxt, setWaitTxt] = useState("");
  const [hostData, setHostData] = useState({});
  const [playerData, setPlayerData] = useState([]);
  const [connected, setConnected] = useState(false);
  const [actionTxt, setActionTxt] = useState("");
  const [showTxt, setShowTxt] = useState(false);
  const [quizQuesData, setQuizQuesData] = useState([]);
  const [sSQ, setSSQ] = useState([]);
  const [mSQ, setMSQ] = useState([]);
  const [mS, setMS] = useState([]);
  const [message, setMessage] = useState("");
  const [cPQ, setCPQ] = useState(0);
  const [audio, setAudio] = useState(null);
  const [joinAudio, setJoinAudio] = useState(null);
  const [audioState, setAudioState] = useRecoilState(audioStateAtom);
  const [tokenId, setTokenId] = useState(null);
  const [classId, setClassId] = useState(null);
  const [socketToken, setSocketToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  useEffect(() => {
    if (audio === null) {
      const audioInstance = new Howl({
        src: [
          location?.roomData?.quizsound?.length &&
            location?.roomData?.quizsound[9].soundFile,
        ],
        loop: true,
        volume: 1.0,
        html5: true,
      });

      setAudio(audioInstance);
    }

    if (audio && audioState.backgroundSoundOn) {
      audio.play();
    } else if (audio) {
      audio.pause();
    }

    return () => {
      if (audio) {
        audio.unload();
      }
    };
  }, [audio, audioState.backgroundSoundOn]);

  useEffect(() => {
    const audioInstance = new Howl({
      src: [
        location?.roomData?.quizsound?.length &&
          location?.roomData?.quizsound[6].soundFile,
      ],
      volume: 1.0,
      html5: true,
    });

    setJoinAudio(audioInstance);

    return () => {
      if (joinAudio) {
        joinAudio.unload();
      }
    };
  }, []);

  useEffect(() => {
    const tokenId = getCookie("isUserLoggedIn");
    setTokenId(tokenId);
    const classId = getCookie("class_user_id");
    setClassId(classId);
    const socketToken = soketToken;
    setSocketToken(socketToken);
    const userId = getCookie("user_id");
    setUserId(userId);
    socketRef.current = socketIOClient(ENDPOINT, {
      transports: ["websocket"],
      pingInterval: 75000,
      pingTimeout: 60000,
      forceNew: true,
      auth: {
        token: socketToken,
        userId: userId,
      },
    });
    socketRef.current.on("connect", () => onConnectionStateUpdate());
    socketRef.current.on("disconnect", () => onConnectionStateUpdate());

    if (location.roomData.playerId != undefined) {
      if (location.roomData.isRemovedByHost == 0) {
        socketRef.current.emit("joinRoom", {
          rpid: location.roomData.playerId,
          game_room_code: location.roomData.inviteCode,
        });
      } else {
        socketRef.current.emit(
          "joinRequest",
          {
            rpid: location.roomData.playerId,
            game_room_code: location.roomData.inviteCode,
          },
          (data) => {
            setWaitTxt(data.message);
            setWaitModal(true);
            //show modal for player waiting for host to accept request
          }
        );
      }
    }

    if (location.roomData.hostId != undefined) {
      socketRef.current.emit("joinHost", {
        host_id: location.roomData.hostId,
        game_room_code: location.roomData.inviteCode,
      });
    }
    return () => {
      socketRef.current.off("connect");
      socketRef.current.off("disconnect");
    };
  }, [
    location.roomData.playerId,
    location.roomData.hostId,
    location.roomData.inviteCode,
    // tokenId,
    socketToken,
    userId,
    classId,
  ]);

  const onConnectionStateUpdate = () => {
    setConnected(socketRef.current.connected);
    if (socketRef.current.connected) {
      if (location.roomData.playerId != undefined) {
        socketRef.current.emit(
          "gameReJoin",
          {
            game_room_code: location.roomData.inviteCode,
            rpid: location.roomData.playerId,
            quiz_id: location.roomData.quiz_id,
          },
          (data) => {}
        );
      } else {
        socketRef.current.emit(
          "gameReJoin",
          {
            game_room_code: location.roomData.inviteCode,
            gpid: location.roomData.hostId,
            quiz_id: location.roomData.quiz_id,
          },
          (data) => {}
        );
      }
    }
  };

  useEffect(() => {
    socketRef.current.on("notifyRoom", (notify) => {
      if (notify.rmplayerInfo != undefined) {
        if (notify.rmplayerInfo.user_id == location.roomData.user_id) {
          if (notify.removeStatus != undefined) {
            if (notify.removeStatus == 0) {
              Swal.fire({
                title: "Error!",
                text: "Oops! You have been kicked off the game by the host",
                icon: "error",
                confirmButtonText: "ok",
              }).then((result) => {
                if (result.isConfirmed) {
                  nav.push("/");
                }
              });
            }
          }
        } else {
          const index = playerData.findIndex(
            (item) => item.user_id == notify.rmplayerInfo.user_id
          );
          if (index > -1) {
            const rmData = playerData.filter(
              (item) => item.user_id !== notify.rmplayerInfo.user_id
            );
            setPlayerData(rmData);
          }
        }
      }

      if (notify.lvplayerInfo != undefined) {
        const index = playerData.findIndex(
          (item) => item.user_id == notify.lvplayerInfo.user_id
        );
        if (index > -1) {
          const rmData = playerData.filter(
            (item) => item.user_id !== notify.lvplayerInfo.user_id
          );
          setPlayerData(rmData);
        }
      }

      if (notify.lvHostInfo != undefined) {
        if (notify.leaveStatus == 0) {
          Swal.fire({
            title: "Oops!",
            text: "Host has left the game room",
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              onHostLeave();
            }
          });
        }
      }

      if (notify.playerInfo != undefined) {
        //if (enableSound) playPlayerJoin();
        let roomPlayerInfo = notify.playerInfo.filter(function (obj) {
          return obj.user_id != location.roomData.user_id;
        });
        let currentPlayer = notify.playerInfo.find(
          ({ user_id }) => user_id == location.roomData.user_id
        );

        if (currentPlayer !== undefined) {
          roomPlayerInfo.unshift(currentPlayer);
        }
        setPlayerData(roomPlayerInfo);
        //setAnimation();
      }

      if (notify.quizStatus != undefined) {
        if (notify.quizStatus == 1) {
          getQuizQuesData();
        }
      }

      if (notify.hostInfo != undefined) {
        setHostData(notify.hostInfo);
        //setAnimation();
      }

      if (location.roomData.hostId != undefined) {
        if (notify.playerJoinRequest == 1) {
          Swal.fire({
            title: "Join Request!",
            text: notify.message,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Accept",
            cancelButtonText: "Reject",
          }).then((result) => {
            if (result.isConfirmed) {
              onAccept(notify.playerId);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              onReject(notify.playerId);
            }
          });
        }
      }

      if (notify.playerId != undefined) {
        if (
          location.roomData.playerId != undefined &&
          location.roomData.playerId == notify.playerId
        ) {
          if (notify.requestAccepted == 1) {
            setWaitModal(false);
          } else if (notify.requestAccepted == 0) {
            setWaitModal(false);
            Swal.fire({
              title: "Error!",
              text: `Join Request! ${notify.message}`,
              icon: "error",
              confirmButtonText: "ok",
            }).then((result) => {
              if (result.isConfirmed) {
                nav.push("/");
              }
            });
          }
        }
      }

      if (
        notify.joinMessage != undefined &&
        location.roomData.playerId !== notify.playerId
      ) {
        setActionTxt(notify.joinMessage);
        if (joinAudio) {
          joinAudio.play();
        }
        setShowTxt(true);
        setTimeout(() => {
          setShowTxt(false);
        }, 3000);
      }

      if (notify.leaveMessage != undefined) {
        setActionTxt(notify.leaveMessage);
        setShowTxt(true);
        setTimeout(() => {
          setShowTxt(false);
        }, 3000);
      }

      if (notify.removeMessage != undefined) {
        setActionTxt(notify.removeMessage);
        setShowTxt(true);
        setTimeout(() => {
          setShowTxt(false);
        }, 3000);
      }
    });
    return () => {
      socketRef.current.off("notifyRoom");
    };
  }, [playerData, hostData]);

  useCallback(() => {
    const onBackPress = () => {
      Swal.fire({
        title: "Hold on!",
        text: "Are you sure you want to leave this game?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          onLeave();
        }
      });
      return false;
    };
    window.onbeforeunload = onBackPress;

    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  const onLeave = () => {
    if (socketRef.current.connected) {
      if (location.roomData.playerId != undefined) {
        socketRef.current.emit(
          "leaveRoom",
          {
            rpid: location.roomData.playerId,
            game_room_code: location.roomData.inviteCode,
            user_type: "",
          },
          (data) => {
            nav.push("/");
          }
        );
      }
      if (location.roomData.hostId != undefined) {
        socketRef.current.emit(
          "leaveRoom",
          {
            rpid: location.roomData.hostId,
            user_id: location.roomData.user_id,
            game_room_code: location.roomData.inviteCode,
            user_type: "host",
          },
          (data) => {
            // if (enableBgSound) stopLoobySound();
            nav.push("/join/room/roomjoin");
          }
        );
      }
    } else {
      if (location.roomData.playerId != undefined) {
        // if (enableBgSound) stopLoobySound();
        nav.push("/");
      }
      if (location.roomData.hostId != undefined) {
        // if (enableBgSound) stopLoobySound();
        nav.push("/join/room/roomjoin");
      }
    }
  };

  const onHostLeave = () => {
    socketRef.current.emit(
      "leaveRoom",
      {
        rpid: location.roomData.playerId,
        game_room_code: location.roomData.inviteCode,
        user_type: "",
      },
      (data) => {
        //if (enableBgSound) stopLoobySound();
        //navigate('Quiz');
        nav.push("/");
      }
    );
  };

  const onAccept = (playerId) => {
    socketRef.current.emit(
      "joinRoomRequest",
      {
        rpid: playerId,
        game_room_code: location.roomData.inviteCode,
        request_status: 1,
      },
      (data) => {}
    );
  };

  const onReject = (playerId) => {
    socketRef.current.emit(
      "joinRoomRequest",
      {
        rpid: playerId,
        game_room_code: location.roomData.inviteCode,
        request_status: 0,
      },
      (data) => {}
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModalShare = () => {
    setIsModalOpen(true);
  };
  const handleStartTimer = () => {
    GetQuiz();
  };

  const GetQuiz = async () => {
    const quiz_id = location.roomData.quiz_id;
    const game_room_code = location.roomData.inviteCode;
    const requestRoomData = {
      quiz_id,
      game_room_code,
    };
    try {
      const response = await fetch("/api/player_in_game_room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestRoomData),
      });
      // const res = await response.json();
      onStart();
      // console.log(res);
    } catch (err) {}
  };

  const onStart = () => {
    socketRef.current.emit(
      "startQuiz",
      {
        gpid: location.roomData.hostId,
        game_room_code: location.roomData.inviteCode,
      },
      (data) => {
        getQuizQuesData();
      }
    );
  };

  const getQuizQuesData = async () => {
    try {
      const quiz_id = location.roomData.quiz_id;
      const game_room_code = location.roomData.inviteCode;
      const is_enable_timer = location.roomData.checkedTimer ? 1 : 0;
      const is_random_question = location.roomData.checkedRandomQuestion
        ? 1
        : 0;
      const is_random_option = location.roomData.checkedRandomOption ? 1 : 0;
      const game_type = "multiplayer";
      const requestRoomDataStart = {
        quiz_id,
        game_room_code,
        is_enable_timer,
        is_random_question,
        is_random_option,
        game_type,
      };
      const res = await fetch("/api/room_quiz_start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestRoomDataStart),
      });
      const response = await res.json();

      setQuizQuesData(response.start_quiz);
      setSSQ(response.SingleSelectQuestion);
      setMSQ(response.MultipleSelectQuestion);
      setMS(response.Matching);
      setMessage(response.message);
      setCPQ(parseInt(response.coin_type_list[0].score_point));

      if (Array.isArray(response.start_quiz) && response.start_quiz.length) {
        onStartQuiz(
          response.start_quiz,
          response.SingleSelectQuestion,
          response.MultipleSelectQuestion,
          response.Matching,
          parseInt(response.coin_type_list[0].score_point)
        );
      }
    } catch (err) {}
  };
  const onStartQuiz = (quizData, sSQ, mSQ, mS, cPQ) => {
    // if (enableBgSound) stopLoobySound();
    socketRef.current.off("notifyRoom");
    nav.push(`/join/room/timer/${quiz_id}`);
    const roomInfo = {
      name: location.roomData.name,
      userName: location.roomData.userName,
      // token_id: location.roomData.token_id,
      user_id: location.roomData.user_id,
      class_id: location.roomData.class_id,
      quiz_id: location.roomData.quiz_id,
      quizData: quizData,
      sSQ: sSQ,
      mSQ: mSQ,
      mS: mS,
      tQues: quizData.length,
      coin: cPQ,
      inviteCode: location.roomData.inviteCode,
      playerId: location.roomData.playerId,
      hostId: location.roomData.hostId,
      checkedSound: location.roomData.checkedSound,
      checkedBackground: location.roomData.checkedBackground,
      checkedTimer: location.roomData.checkedTimer,
      // enableRead,
      checkedRandomQuestion: location.roomData.checkedRandomQuestion,
      checkedRandomOption: location.roomData.checkedRandomOption,
      type: "multi",
      playerCount: playerData.length + 1,
      quizSound: location.roomData.quizsound,
    };
    dispatch(setRoomFriend(roomInfo));
  };

  const handleRemove = (index, user) => {
    Swal.fire({
      title: "Confirmation",
      text: "Are you sure you want to remove this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        socketRef.current.emit(
          "removeRoom",
          {
            rpid: user.rpid,
            game_room_code: location.roomData.inviteCode,
          },
          (data) => {
            playerData.splice(index, 1);
            //setDoRender(!doRender);
          }
        );
      } else {
        // Swal.fire("Cancelled", "You cancelled.", "info");
      }
    });
  };

  const shareText = `*${hostData.host_name}* has Invited you to join *${location.roomData.name}*. Join using Game Code: *${location.roomData.inviteCode}*
  ${BASE_URL}start`;
  const url = `${BASE_URL}start`;
  return (
    <>
      <div
        className="min-h-screen relative select-none"
        style={{
          //   backgroundImage: `url(${back})`,
          backgroundColor: "#161A30",
        }}
      >
        {waitModal ? (
          <div
            className={`fixed 
        } top-0 left-0 w-full h-[85vh] h-full flex items-end items-center justify-center transition-opacity duration-1000  bg-gray-100 bg-opacity-10  z-50`}
          >
            <div
              className={`bg-white flex justify-center items-center dark:bg-grey800  p-6 pt-3 rounded-lg shadow-lg relative   w-[90%] sm:w-[48%] md:w-[23%] font-[Montserrat]`}
            >
              {waitTxt}
            </div>
          </div>
        ) : (
          <>
            <div className="w-full flex justify-center pt-1 md:p-0 md:py-[2rem] relative z-10 opacity-80">
              <div className="w-[98%]  md:w-[40%] bg-[#31304D] rounded-xl">
                {connected ? null : (
                  <h1 className="text-sm text-center pt-4 flex justify-center items-center gap-1 md:text-xl font-[Montserrat] text-white">
                    <span>Connecting to server</span>
                    <span>
                      <OvalLoader />
                    </span>
                  </h1>
                )}
                <div className="pt-[2rem] ">
                  <h1 className="text-xl text-center font-bold md:text-4xl font-[Montserrat] text-white">
                    {location.roomData.name}
                  </h1>
                  {location.roomData.hostId != undefined ? (
                    <h1 className="text-lg text-center py-2 md:text-md font-[Montserrat] text-white">
                      Game Invite Code
                    </h1>
                  ) : (
                    <h1 className="text-lg text-center py-2 md:text-md font-[Montserrat] text-white">
                      Game Code
                    </h1>
                  )}
                  <div className="flex justify-center items-center text-white">
                    <div className="w-fit flex justify-center items-center gap-5 py-[0.3rem] pl-[15px] border-dashed border-2 border-white rounded-lg">
                      <span className="font-[Montserrat] tracking-[2px] font-bold">
                        {location.roomData.inviteCode}
                      </span>
                      <span>
                        {location.roomData.hostId != undefined ? (
                          <CopyToClipboard
                            text={location.roomData.inviteCode}
                            onCopy={onCopyText}
                          >
                            <button
                              aria-label="copy icon"
                              className="flex justify-center items-center font-[Montserrat] pr-[10px]"
                            >
                              <RxCopy />
                            </button>
                          </CopyToClipboard>
                        ) : null}
                      </span>
                    </div>
                  </div>
                  <h1
                    className={`copy-feedback font-[Montserrat] text-white text-center ${
                      isCopied ? "active" : ""
                    }`}
                  >
                    Copied!
                  </h1>
                  {location.roomData.playerId != undefined ? (
                    <h1 className="text-lg text-center font-[Montserrat] pb-4 md:text-md  text-white">
                      waiting for host to start the game...
                    </h1>
                  ) : null}
                  {location.roomData.hostId != undefined ? (
                    <>
                      <div>
                        <h1 className="text-center text-xl font-[Montserrat] text-white ">
                          Share this code with your friends
                        </h1>
                      </div>
                      <div className="flex  justify-center items-center py-4 pb-0  text-white w-full">
                        <button
                          aria-label="invite friend"
                          className="flex justify-center mb-[40px] items-center w-fit px-5 flex-row gap-3  text-white bg-[#4B5276] 
                          font-black  text-sm  py-2.5  text-center rounded-[8px] font-[Montserrat]"
                          onClick={openModalShare}
                        >
                          <span>
                            <BsShare />
                          </span>
                          <span>Invite Friend</span>
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center  items-center  relative z-10">
              <div
                className="w-full mt-[2rem] md:mt-0 border  border-white rounded-lg py-[20px] md:pt-[5px]  md:pb-[77px] flex justify-center items-center 
      flex-col h-fit"
              >
                <div className="w-full py-[5px] relative  flex justify-end items-center">
                  {hostData != null &&
                    hostData.user_id == location.roomData.user_id &&
                    playerData.length >= 1 && (
                      <div className="flex items-center justify-center  absolute -top-[90%] md:-top-[55%]  w-full bg-slate-950 ">
                        <button
                          aria-label="start"
                          className="flex  flex-row gap-1 text-black bg-white font-extrabold text-lg px-[3rem] py-[8px] text-center font-[Montserrat] rounded-[50px] border-[1px] border-[#4ade80]"
                          onClick={handleStartTimer}
                        >
                          <span>Start</span>
                          <span className="mt-[6px]">
                            <BiRightArrowCircle />
                          </span>
                        </button>
                      </div>
                    )}
                  {showTxt && (
                    <p className="text-white font-[Montserrat] font-medium text-sm">
                      {actionTxt}
                    </p>
                  )}
                  <button
                    aria-label="player count"
                    className="flex mt-[1px] flex-row font-[Montserrat] gap-3 text-white bg-[#4B5276] font-bold text-sm px-5 py-2.5 text-center rounded-lg 
          mx-[17px]"
                  >
                    <span className="mt-[3px]">
                      <ImUsers />
                    </span>
                    <span>
                      {playerData.length + 1} / {location.roomData.room_limit}
                    </span>
                  </button>
                </div>

                <div className="text-white w-full  flex items-start justify-start  opacity-80">
                  <div className="w-full mx-[17px] grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 sm:mt-[5px]">
                    <animated.div
                      style={{
                        opacity: 1,
                        transform: "translateY(0px)",
                      }}
                      className="pr-8 pl-4 py-2 bg-[#4B5276] rounded-lg mt-[5px]"
                    >
                      <div className="flex justify-between items-center flex-row">
                        <div className="flex justify-left items-center gap-5 flex-row">
                          <img
                            src={
                              hostData.user_profile_pic === null ||
                              hostData.user_profile_pic === "" ||
                              hostData.user_profile_pic === undefined
                                ? "/images/userImage.webp"
                                : hostData.user_profile_pic
                            }
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                          <p className="font-[Montserrat] font-bold">
                            {hostData.host_name}
                          </p>
                        </div>
                        <div>
                          <p className="font-[Montserrat] font-bold">Host</p>
                        </div>
                      </div>
                    </animated.div>
                    {playerData.length ? (
                      <>
                        {playerData.map((user, ind) => (
                          <animated.div
                            key={ind}
                            style={{
                              opacity: 1,
                              transform: "translateY(0px)",
                            }}
                            className="pr-8 pl-4 py-2 bg-[#4B5276] rounded-lg  mt-[5px] "
                          >
                            <div className="flex justify-between items-center flex-row ">
                              <div className="flex justify-left items-center gap-5 flex-row">
                                <img
                                  src={
                                    user.user_profile_pic === null ||
                                    user.user_profile_pic === "" ||
                                    user.user_profile_pic === undefined
                                      ? "/images/userImage.webp"
                                      : user.user_profile_pic
                                  }
                                  alt=""
                                  className="w-10 h-10 rounded-full"
                                />
                                <p className="font-[Montserrat] font-bold">
                                  {user.player_display_name}
                                </p>
                              </div>
                              <div>
                                <p className="font-[Montserrat] font-bold">
                                  {user.user_id == location.roomData.user_id
                                    ? "You"
                                    : null}
                                  {hostData != null &&
                                  hostData.user_id ==
                                    location.roomData.user_id ? (
                                    <span
                                      onClick={() => handleRemove(ind, user)}
                                      className="absolute top-[-10px] right-[-10px] cursor-pointer bg-slate100 rounded-[50%] p-[4px] 
                                      text-[12px]"
                                    >
                                      ❌
                                    </span>
                                  ) : null}
                                </p>
                              </div>
                            </div>
                          </animated.div>
                        ))}
                      </>
                    ) : null}
                  </div>
                </div>
                {playerData.length < 1 && (
                  <p className="text-white font-[Montserrat] text-xls my-[1rem] text-center">
                    At least 2 players are required to start a game. Invite more
                    friends to join!
                  </p>
                )}
              </div>
            </div>
            <ShareModal isOpen={isModalOpen} onClose={closeModal}>
              <div>
                <h1 className="font-black text-lg dark:text-white font-[Montserrat]">
                  Share
                </h1>

                <div className="flex justify-center gap-7 mt-[1rem]">
                  <FacebookShareButton
                    url={shareText}
                    // quote={"My Quiz Score on Quizard "}
                    hashtag={"#quizard..."}
                  >
                    <FacebookIcon size={30} round={true} />
                  </FacebookShareButton>

                  <WhatsappShareButton
                    url={shareText}
                    // quote={"My Quiz Score on Quizard "}
                    hashtag={"#quizard..."}
                  >
                    <WhatsappIcon size={30} round={true} />
                  </WhatsappShareButton>
                  <EmailShareButton
                    url={shareText}
                    // quote={"My Quiz Score on Quizard "}
                    hashtag={"#quizard..."}
                  >
                    <EmailIcon size={30} round={true} />
                  </EmailShareButton>
                  <TwitterShareButton
                    url={shareText}
                    // quote={"My Quiz Score on Quizard "}
                    hashtag={"#quizard..."}
                  >
                    <TwitterIcon size={30} round={true} />
                  </TwitterShareButton>
                  <TelegramShareButton
                    url={location.roomData.share_content}
                    // quote={"My Quiz Score on Quizard "}
                    hashtag={"#quizard..."}
                  >
                    <TelegramIcon size={30} round={true} />
                  </TelegramShareButton>
                </div>
                <div className="tracking-[1px] relative">
                  <input
                    type="text"
                    defaultValue={url}
                    placeholder=""
                    readOnly
                    className="my-[1rem] pl-[1rem] pr-[3.5rem] py-[0.3rem] border rounded-lg w-[100%] h-[6vh]"
                  />
                  <CopyToClipboard text={url} onCopy={onCopyText}>
                    <button className="absolute top-1/2 right-[0.5rem] transform -translate-y-[30px] p-[0.3rem] border rounded-3xl font-[Montserrat] bg-rose200">
                      Copy
                    </button>
                  </CopyToClipboard>
                  <h1
                    className={`copy-feedback font-[Montserrat] text-center ${
                      isCopied ? "active" : ""
                    }`}
                  >
                    Copied!
                  </h1>
                </div>
              </div>
            </ShareModal>
          </>
        )}
      </div>
    </>
  );
};

export default RoomInterface;
