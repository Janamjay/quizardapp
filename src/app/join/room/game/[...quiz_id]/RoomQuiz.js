/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect, useRef } from "react";
import { Howl, Howler } from "howler";
import coin from "/public/images/coin.png";
import anime from "animejs";
import Navbar from "@/app/components/navbar/Navbar";
import { FiArrowRightCircle } from "react-icons/fi";
import { GiSpeaker } from "react-icons/gi";
import Modal from "@/app/components/modal/Modal";
import ReactSwitch from "react-switch";
import CountUp from "react-countup";
import ModalTimer from "@/app/components/modal/ModalTimer";
import { useRecoilState } from "recoil";
import { quizResultsState } from "@/atom/quizState";
import { audioStateAtom } from "@/atom/audioState";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import ProgressLine from "@/app/components/progress/ProgressLine";
import "animate.css";
import { LeafPoll } from "react-leaf-polls";
import "react-leaf-polls/dist/index.css";
import socketIOClient from "socket.io-client";
import axios from "axios";
import OvalLoader from "@/app/utils/OvalLoader";
import Swal from "sweetalert2";
import { Reorder } from "framer-motion";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectRoomFriend } from "@/redux/friendSlice";
import { setquizInfo } from "@/redux/quizSlice";
// import Image from "next/image";
import { selectRoomData } from "@/redux/roomSlice";
import DOMPurify from "dompurify";
import { getCookie } from "cookies-next";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_ENDPOINT;

function sortArray(array) {
  array.sort((a, b) => a.ranks - b.ranks);
  return array;
}

const originalConsoleError = console.error;
console.error = (...args) => {
  if (/validateDOMNesting|Received NaN/.test(args[0])) {
    return;
  }
  originalConsoleError(...args);
};

const customTheme = {
  textColor: "black",
  mainColor: "#00B87B",
  backgroundColor: "#d6d3d1",
};
const defaultImage = "/images/userImage.webp";

const RoomQuiz = ({ classListData, soketToken }) => {
  const socketRef = useRef();
  const navigate = useRouter();
  const params = useParams();
  const question_set_name = params.quiz_id[0];
  const quiz_id = params.quiz_id[1];
  const loc = useSelector(selectRoomFriend);
  const location = loc.roomInfo;
  const dispatch = useDispatch();
  let interval;
  const [isPlaying, setIsPlaying] = useState(true);
  const [audio, setAudio] = useState(null);
  const [animateAudio, setAnimateAudio] = useState(null);
  const [incorrectAudio, setIncorrectAudio] = useState(null);
  const [scoreCounting, setScoreCounting] = useState(0);
  const [quizResults, setQuizResults] = useRecoilState(quizResultsState);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [optionSelected, setOptionSelected] = useState(false);
  const [timer, setTimer] = useState(60);
  const [show, setShow] = useState(true);

  const [enterAnimation, setEnterAnimation] = useState("");
  const [exitAnimation, setExitAnimation] = useState("");

  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [unattemptedQuestions, setUnattemptedQuestions] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [audioState, setAudioState] = useRecoilState(audioStateAtom);

  const coinsRef = useRef([]);
  const collectButtonRef = useRef(null);
  const moveCoinsAnimation = useRef(null);

  const totalCount = location?.quizData?.length;

  const [guess, setGuess] = useState(false);
  const [msg, setMsg] = useState("");
  const [chosenLetters, setChosenLetters] = useState([]);
  const [displayWord, setDisplayWord] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [wordContainerBgColor, setWordContainerBgColor] =
    useState("[#8080802b]");
  const [selectedLetters, setSelectedLetters] = useState([]);

  const [spentTime, setSpentTime] = useState(
    location?.quizData?.[currentQuestion]?.question_timming
  );
  const [completedModal, setCompletedModal] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [isDisableEnd, setIsDisableEnd] = useState(false);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [allRankData, setAllRankData] = useState([]);
  const [playerCountC, setPlayerCountC] = useState(0);
  const [checkedTimer, setCheckedTimer] = useState(location.checkedTimer);
  const [checkedSound, setCheckedSound] = useState(location.checkedSound);
  const [checkedBackground, setCheckedBackground] = useState(
    location.checkedBackground
  );
  const [connected, setConnected] = useState();
  const [tokenId, setTokenId] = useState(null);
  const [socketToken, setSocketToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [quizSetting, setQuizSetting] = useState([]);
  const [classId, setClassId] = useState(null);

  useEffect(() => {
    const tokenId = getCookie("isUserLoggedIn");
    setTokenId(tokenId);
    setTokenId(tokenId);
    if (!tokenId) {
      navigate.push("/start");
    }
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
    if (location.playerId != undefined) {
      socketRef.current.emit(
        "gameReJoin",
        {
          game_room_code: location.inviteCode,
          rpid: location.playerId,
          quiz_id: location.quiz_id,
        },
        (data) => {}
      );
    } else {
      socketRef.current.emit(
        "gameReJoin",
        {
          game_room_code: location.inviteCode,
          gpid: location.hostId,
          quiz_id: location.quiz_id,
        },
        (data) => {}
      );
    }
    return () => {
      socketRef.current.off("connect");
      socketRef.current.off("disconnect");
    };
  }, []);

  const onConnectionStateUpdate = () => {
    setConnected(socketRef.current.connected);
    if (socketRef.current.connected) {
      if (location.playerId != undefined) {
        socketRef.current.emit(
          "gameReJoin",
          {
            game_room_code: location.inviteCode,
            rpid: location.playerId,
            quiz_id: location.quiz_id,
          },
          (data) => {}
        );
      } else {
        socketRef.current.emit(
          "gameReJoin",
          {
            game_room_code: location.inviteCode,
            gpid: location.hostId,
            quiz_id: location.quiz_id,
          },
          (data) => {}
        );
      }
    } else {
      // setModalVisible(true);
      // setIsPlaying(false);
    }
  };

  useEffect(() => {
    socketRef.current.on("notifyRoom", (notify) => {
      if (notify.allPlayerRank !== undefined) {
        if (currentQuestion + 1 >= totalCount)
          setTimeout(() => {
            setAnimation(notify.allPlayerRank);
          }, 250);
      }
      if (notify.completed_player !== undefined)
        setPlayerCountC(notify.completed_player);
      if (notify.quizEndStatus !== undefined) {
        if (notify.quizEndStatus == 1) {
          setEndModal(true);
          setTimeout(() => {
            setIsPlaying(false);
            submitQuiz();
          }, 2500);
        }
      }
      if (notify.completed !== undefined) {
        if (notify.completed == 1) {
          setIsDisableEnd(true);
          setTimeout(() => {
            setCompletedModal(true);
            setTimeout(() => {
              submitQuiz();
            }, 2500);
          }, 2500);
        }
      }
    });
    return () => {
      socketRef.current.off("notifyRoom");
    };
  }, [allRankData]);

  const onEndGame = () => {
    if (location.playerCount - playerCountC > 1) {
      Swal.fire({
        title: "Hold on!",
        text: `${
          location.playerCount - playerCountC
        } players are still playing the game. Are you sure you want to end this quiz?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          socketRef.current.emit(
            "endQuiz",
            {
              game_room_code: location.inviteCode,
              quiz_id: location.quiz_id,
            },
            (data) => {}
          );
        }
      });
    } else {
      Swal.fire({
        title: "Hold on!",
        text: `${
          location.playerCount - playerCountC
        } player is still playing the game. Are you sure you want to end this quiz?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          socketRef.current.emit(
            "endQuiz",
            {
              game_room_code: location.inviteCode,
              quiz_id: location.quiz_id,
            },
            (data) => {}
          );
        }
      });
    }
  };

  const setAnimation = (data) => {
    if (currentQuestion == 0) {
      setAllRankData(data);
    } else {
      setTimeout(() => {
        const result = [];
        if (data != undefined)
          allRankData.forEach((element) => {
            data.find((item) => {
              if (item.user_id === element.user_id) {
                result.push(item);
              }
            });
          });
        const sort = sortArray(result);
        setAllRankData(sort);
      }, 1000);
    }
  };

  const roomProgressSave = async (id) => {
    const quiz_id = location.quiz_id;
    const quesID = location?.quizData?.[currentQuestion].question_id;
    const ans = id == undefined ? 0 : id;
    const question_type = location?.quizData?.[currentQuestion].category;
    const time =
      isModalOpen === true
        ? location?.quizData?.[currentQuestion]?.question_timming
        : spentTime;
    const room_code = location.inviteCode;
    const allQuestions = currentQuestion + 1;

    const progressDataRoom = {
      quiz_id,
      quesID,
      ans,
      question_type,
      time,
      room_code,
      allQuestions,
    };
    const quizSaveResponse = await fetch("/api/quiz_progress_save_room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(progressDataRoom),
    });
    const response = await quizSaveResponse.json();
    if (response.success) {
      setTimeout(() => {
        getLeaderBoard();
      }, 2000);
    }
  };

  const getLeaderBoard = () => {
    socketRef.current.emit(
      "liveLeaderBoard",
      {
        quiz_id: location.quiz_id,
        user_id: location.user_id,
        game_room_code: location.inviteCode,
      },
      (data) => {
        if (currentQuestion == 0) {
          setAnimation(data.allPlayerRank);
        } else {
          setTimeout(() => {
            setAnimation(data.allPlayerRank);
          }, 100);
        }
      }
    );
  };

  useEffect(() => {
    if (currentQuestion <= location?.quizData?.length) {
      interval = setInterval(() => {
        setSpentTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      setSpentTime(0);
    };
  }, [currentQuestion]);

  useEffect(() => {
    let intervalId;
    let isMouseDown = false;

    function startTimer() {
      intervalId = setInterval(
        () => {
          setShow(true);
          moveToNextQuestion();
          if (currentQuestion === location?.quizData?.length - 1) {
            setShow(false);
          }
        },
        show ? 60000 : 5000
      );
    }
    if (!isModalOpen) {
      startTimer();
    }

    function handleMouseDown() {
      clearInterval(intervalId);
      isMouseDown = true;

      const progressBars = document.querySelectorAll(".progressVisualPart ");
      progressBars.forEach((bar) => {
        bar.classList.add("paused");
      });
    }

    function handleMouseUp() {
      if (isMouseDown) {
        startTimer();
        isMouseDown = false;
        const progressBars = document.querySelectorAll(".progressVisualPart");
        progressBars.forEach((bar) => {
          bar.classList.remove("paused");
        });
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchstart", handleMouseDown);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchstart", handleMouseDown);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [currentQuestion, show, isModalOpen]);

  useEffect(() => {
    if (audio === null) {
      const audioInstance = new Howl({
        src: [location?.quizSound?.length && location.quizSound[0].soundFile],
        loop: true,
        volume: 1.0,
        html5: true,
      });

      setAudio(audioInstance);
    }

    if (audio && audioState.backgroundSoundOn && !isModalOpen) {
      audio.play();
    } else if (audio) {
      audio.pause();
    }

    return () => {
      if (audio) {
        audio.unload();
      }
    };
  }, [audio, audioState.backgroundSoundOn, isModalOpen]);

  useEffect(() => {
    const audioInstance = new Howl({
      src: [location?.quizSound?.length && location.quizSound[1].soundFile],
      volume: 1.0,
      html5: true,
    });

    setAnimateAudio(audioInstance);

    return () => {
      if (animateAudio) {
        animateAudio.unload();
      }
    };
  }, []);

  useEffect(() => {
    const audioInstance = new Howl({
      src: [location?.quizSound?.length && location.quizSound[2].soundFile],
      volume: 1.0,
      html5: true,
    });
    setIncorrectAudio(audioInstance);

    return () => {
      if (incorrectAudio) {
        incorrectAudio.unload();
      }
    };
  }, [location.quizSound]);

  useEffect(() => {
    async function fetchData() {
      const post = { quiz_id: location.quiz_id };
      try {
        const response = await fetch("/api/quiz_detail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post }),
        });
        const quizDetailsResponse = await response.json();
        setQuizSetting(quizDetailsResponse.quiz_setting);
      } catch (err) {}
    }

    fetchData();
  }, []);

  const handleChangebackground = (nextChecked) => {
    setCheckedBackground(nextChecked);
    const newQuizSetting = quizSetting.map((setting) => {
      if (setting.parameter_code === "BS") {
        setting.parameterValue = nextChecked ? 1 : 0;
        setQuizSetting(setting);
        setAudioState({ ...audioState, backgroundSoundOn: nextChecked });
      }
      return setting;
    });
    setQuizSetting(newQuizSetting);
  };
  const handleChangeSound = (nextChecked) => {
    setCheckedSound(nextChecked);
    const newQuizSetting = quizSetting.map((setting) => {
      if (setting.parameter_code === "SE") {
        setting.parameterValue = nextChecked ? 1 : 0;
        setQuizSetting(setting);
        setAudioState({ ...audioState, soundOn: nextChecked });
      }
      return setting;
    });
    setQuizSetting(newQuizSetting);
  };

  const openModal1 = () => {
    setIsModalOpen1(true);
  };

  const closeModal1 = () => {
    setIsModalOpen1(false);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    moveToNextQuestion();
    setEnterAnimation("animate__animated animate__fadeInRightBig");
  };

  useEffect(() => {
    setShowCorrectAnswer(false);
    setEnterAnimation("animate__animated animate__fadeInRightBig");
  }, [currentQuestion]);

  const moveToNextQuestion = () => {
    if (currentQuestion < location?.quizData?.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
      setShowCorrectAnswer(false);
      // setTimer(60);
      setIsPlaying(true);
      setExitAnimation("animate__animated animate__fadeOutLeftBig");

      moveCoinsAnimation.current = null;

      setEnterAnimation("animate__animated animate__fadeInRightBig");
      setExitAnimation("");
      setShow(true);
    }
  };
  function vote(item, results) {
    // Here you probably want to manage
    // and return the modified data to the server.
    setIsPlaying(false);
    clearInterval(interval);
    if (audio) {
      audio.pause();
    }
    setTimeout(() => {
      setShow(false);
    }, 2000);
  }

  const handleOptionSelect = (selectedOption) => {
    roomProgressSave(selectedOption.id);
    if (!showCorrectAnswer) {
      setIsPlaying(false);
      clearInterval(interval);

      const updatedQuestions = [...location.quizData];
      const updatedQuestion = { ...updatedQuestions[currentQuestion] };
      updatedQuestion.selectedOption = selectedOption;
      updatedQuestions[currentQuestion] = updatedQuestion;
      setSelectedOption(selectedOption);

      const isCorrect =
        selectedOption.id == location?.quizData?.[currentQuestion].answer;

      if (isCorrect) {
        setScoreCounting(scoreCounting + 4);
        startAnimation();
        if (audioState && audioState.soundOn) {
          animateAudio.play();
        }
      } else {
        if (incorrectAudio && audioState.soundOn) {
          incorrectAudio.play();
        }
      }

      setShowCorrectAnswer(true);
      setTimeout(() => {
        setShow(false);
      }, 2000);
    }
  };
  // useEffect(() => {
  //   if (wrongGuesses >= 3) {
  //     window.alert("Game Over! You made too many wrong guesses.");
  //     restartGameFunction();
  //   }
  // }, [wrongGuesses]);

  // const shuffle = (array) => {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  // };
  // const letterSelectFunction = (letter, index) => {
  //   if (!selectedLetters.includes(index)) {
  //     setChosenLetters([...chosenLetters, letter]);
  //     setSelectedLetters([...selectedLetters, index]);

  //     const correctAnswerIndex =
  //       location?.quizData?.[currentQuestion].correctAnswers[0];
  //     const correctAnswerText =
  //       location?.quizData?.[currentQuestion].options[correctAnswerIndex].text;

  //     if (!correctAnswerText.includes(letter)) {
  //       setWrongGuesses(wrongGuesses + 1);
  //     }
  //   }
  // };

  // const displayLettersFunction = () => {
  //   return shuffledLetters.map((letter, index) => (
  //     <button
  //       key={index}
  //       onClick={() => letterSelectFunction(letter, index)}
  //       disabled={selectedLetters.includes(index) || guess}
  //       className={`letter-button ${
  //         selectedLetters.includes(index) ? "selected" : ""
  //       }`}
  //     >
  //       {letter}
  //     </button>
  //   ));
  // };

  // useEffect(() => {
  //   const correctAnswerIndex =
  //     location?.quizData?.[currentQuestion].correctAnswers[0];
  //   const correctAnswerText =
  //     location?.quizData?.[currentQuestion].options[correctAnswerIndex].text;

  //   const letters = correctAnswerText.split("").filter((char) => char !== " ");
  //   shuffle(letters);
  //   setShuffledLetters(letters);
  // }, [currentQuestion]);
  // const removeCharacterFunction = () => {
  //   setChosenLetters(chosenLetters.slice(0, -1));
  //   setSelectedLetters(selectedLetters.slice(0, -1));
  //   if (!checkWordGuessedFunction(correctAnswerText)) {
  //     setGuess(false);
  //     setWordContainerBgColor("[#8080802b]");
  //   } else {
  //     setChosenLetters(chosenLetters);
  //   }
  // };

  // const checkWordGuessedFunction = () => {
  //   const correctAnswerIndex =
  //     location?.quizData?.[currentQuestion].correctAnswers[0];
  //   const formattedCorrectAnswer = location?.quizData?.[currentQuestion].options[
  //     correctAnswerIndex
  //   ].text
  //     .toLowerCase()
  //     .replace(/\s+/g, "");

  //   const formattedUserGuess = chosenLetters.join("").toLowerCase();
  //   return formattedCorrectAnswer === formattedUserGuess;
  // };

  // const guessFunction = () => {
  //   const correctAnswerIndex =
  //     location?.quizData?.[currentQuestion].correctAnswers[0];
  //   const correctAnswerText =
  //     location?.quizData?.[currentQuestion].options[correctAnswerIndex].text;

  //   if (checkWordGuessedFunction(correctAnswerText)) {
  //     setScoreCounting(scoreCounting + 4);
  //     setQuizResults((prevResults) => ({
  //       ...prevResults,
  //       scoreCounting: prevResults.scoreCounting + 4,
  //     }));
  //     startAnimation();
  //     setIsPlaying(false);
  //     clearInterval(interval);
  //     if (audio) {
  //       audio.pause();
  //     }
  //     setWordContainerBgColor("green-500");
  //     setGuess(true);
  //     setTimeout(() => {
  //       setShow(false);
  //     }, 2000);
  //   } else {
  //     setDisplayWord(true);
  //     setWordContainerBgColor("red-500");
  //   }
  //   setGuess(true);
  // };

  // const restartGameFunction = () => {
  //   setMsg("");
  //   setChosenLetters([]);
  //   setDisplayWord(false);
  //   setWrongGuesses(0);
  //   setSelectedLetters([]);
  //   if (!checkWordGuessedFunction(correctAnswerText)) {
  //     setGuess(false);
  //     setWordContainerBgColor("[#8080802b]");
  //   } else {
  //     setChosenLetters(chosenLetters);
  //   }
  // };

  const handleOptionMultiSelect = (selectedOption, index) => {
    if (!showCorrectAnswer) {
      setIsPlaying(false);
      clearInterval(interval);
      const updatedSelectedOptions = [...selectedOptions];
      if (updatedSelectedOptions.includes(index)) {
        updatedSelectedOptions.splice(updatedSelectedOptions.indexOf(index), 1);
      } else {
        updatedSelectedOptions.push(index);
      }
      setSelectedOptions(updatedSelectedOptions);
      setSelectedOption(selectedOption);
      setUnattemptedQuestions(unattemptedQuestions - 1);
      setOptionSelected(true);
      if (audio) {
        audio.pause();
      }
    }
  };

  const checkAnswers = () => {
    if (!showCorrectAnswer) {
      setIsPlaying(false);
      clearInterval(interval);

      const updatedQuestions = [...location.quizData];
      updatedQuestions[currentQuestion].selectedOptions = selectedOptions;

      const areSelectedOptionsCorrect =
        JSON.stringify(selectedOptions.sort()) ===
        JSON.stringify(
          location?.quizData?.[currentQuestion].correctAnswers.sort()
        );

      if (areSelectedOptionsCorrect) {
        setScoreCounting(scoreCounting + 4);
        startAnimation();
      }

      setShowCorrectAnswer(true);
      if (audio) {
        audio.pause();
      }
      setOptionSelected(false);
      setTimeout(() => {
        setShow(false);
      }, 2000);
    }
  };
  const renderTime = ({ remainingTime }) => {
    const currentTime = useRef(remainingTime);
    const prevTime = useRef(null);
    const isNewTimeFirstTick = useRef(false);
    const [, setOneLastRerender] = useState(0);

    if (currentTime.current !== remainingTime) {
      isNewTimeFirstTick.current = true;
      prevTime.current = currentTime.current;
      currentTime.current = remainingTime;
    } else {
      isNewTimeFirstTick.current = false;
    }
    if (remainingTime === 0) {
      setTimeout(() => {
        setOneLastRerender((val) => val + 1);
      }, 20);
    }

    const isTimeUp = isNewTimeFirstTick.current;

    return (
      <div className="time-wrapper">
        <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
          {remainingTime}
        </div>
      </div>
    );
  };
  const startAnimation = () => {
    if (!moveCoinsAnimation.current) {
      const coinElements = coinsRef.current;
      const collectButtonElement = collectButtonRef.current;

      const buttonCenterX =
        collectButtonElement.offsetLeft + collectButtonElement.offsetWidth / 2;
      const buttonCenterY =
        collectButtonElement.offsetTop + collectButtonElement.offsetHeight / 2;

      coinElements.forEach((coinElement) => {
        if (coinElement) {
          coinElement.style.display = "block";
          coinElement.style.zIndex = "100";
        }
      });
      // if (animateAudio && audioState.soundOn) {
      //   animateAudio.play();
      // } else {
      //   animateAudio.pause();
      // }
      const delay = 100;
      const animations = coinElements.map((coinElement, index) => {
        if (coinElement) {
          const coinCenterX =
            coinElement.getBoundingClientRect().left +
            coinElement.offsetWidth / 2;
          const coinCenterY =
            coinElement.getBoundingClientRect().top +
            coinElement.offsetHeight / 2;

          const translateX = buttonCenterX - coinCenterX;
          const translateY = buttonCenterY - coinCenterY;
          const setIndex = index % 4;
          return anime({
            targets: coinElement,
            translateX: translateX,
            translateY: translateY,
            easing: "easeOutQuad",
            duration: 1000,
            delay: setIndex * delay,
            opacity: 0,
            complete: () => {
              // if (animateAudio) {
              //   animateAudio.pause();
              // }
            },
          });
        }
        return null;
      });

      moveCoinsAnimation.current = animations;
    }

    moveCoinsAnimation.current.forEach((animation) => {
      if (animation) {
        animation.play();
      }
    });
  };

  const submitQuiz = () => {
    // const totalQuestions = location?.quizData?.length;
    // let correctAnswers = 0;
    // let unattempted = 0;

    // location.quizData.forEach((question) => {
    //   if (question.selectedOption !== undefined) {
    //     const selectedOptionText = question.selectedOption.text;
    //     const selectedOptionIndex = question.options.findIndex(
    //       (option) => option.text === selectedOptionText
    //     );

    //     if (selectedOptionIndex !== -1) {
    //       if (question.options[selectedOptionIndex].isCorrect) {
    //         correctAnswers++;
    //       }
    //     }
    //   } else {
    //     unattempted++;
    //   }
    // });

    // const wrongAnswers = totalQuestions - (correctAnswers + unattempted);
    // const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
    setCompletedModal(true);
    setTimeout(() => {
      setEndModal(false);
    }, 500);
    socketRef.current.off("notifyRoom");
    // navigate.push("/mutlileaderboard", {
    //   state: {
    //     name: location.name,
    //     token: location.token_id,
    //     userId: location.user_id,
    //     quiz_id: location.quiz_id,
    //     class_id: location.class_id,
    //     // userCoin,
    //     // showConfetti: 1,
    //     inviteCode: location.inviteCode,
    //     hostId: location.hostId,
    //     playerId: location.playerId,
    //     quizSound: location.quizSound,
    //   },
    // });
    navigate.push("/join/room/roomleaderboard");
    const quizInfo = {
      name: location.name,
      // token: location.token_id,
      userId: location.user_id,
      quiz_id: location.quiz_id,
      class_id: location.class_id,
      // userCoin,
      // showConfetti: 1,
      inviteCode: location.inviteCode,
      hostId: location.hostId,
      playerId: location.playerId,
      quizSound: location.quizSound,
    };
    dispatch(setquizInfo(quizInfo));

    setQuizResults((prevResults) => ({
      ...prevResults,
      scoreCounting: scoreCounting,
      totalQuestions: location?.quizData?.length,
      // correctAnswers: correctAnswers,
      // wrongAnswers: wrongAnswers,
      // unattemptedQuestions: unattempted,
      // percentage: percentage,
    }));
  };
  // const correctAnswerIndex =
  //   location?.quizData?.[currentQuestion].correctAnswers[0];
  // const correctAnswerText =
  //   location?.quizData?.[currentQuestion].options[correctAnswerIndex].text;
  // let displayIndex = 0;
  return (
    <>
      <div
        className=" bg-center relative select-none  bg-cover bg-no-repeat min-h-[100vh] overflow-x-hidden"
        style={{
          // backgroundImage: `url(${back})`,
          backgroundColor: "#1B363E",
        }}
      >
        <ModalTimer isOpen={isModalOpen} onClose={closeModal} />
        <div className=" hidden">
          <Navbar scoreCounting={scoreCounting} classListData={classListData} />
        </div>
        <div className="w-full fixed z-50 ">
          <div>
            <div className="flex items-center justify-between py-4 pl-[30px] px-7 rounded-lg bg-[#1B363E] relative z-10">
              <div className="text-xl md:text-4xl cursor-pointer text-yellow-400 max-w-[135px] sm:max-w-full truncate">
                <h1 className="truncate font-[Montserrat]">{location.name}</h1>
              </div>
              <div className="flex justify-between items-center gap-[1rem] md:gap-[2rem] ">
                <div className="text-lg md:text-[2rem] relative z-10">
                  <div>
                    <Modal isOpen={isModalOpen1} onClose={closeModal1}>
                      <h2 className="text-sm font-bold font-[Montserrat] text-black dark:text-white mb-2">
                        Game Settings
                      </h2>
                      {quizSetting.map((setting, index) => (
                        <div key={index}>
                          {setting.parameter_code === "SE" && (
                            <div className="mt-6 flex justify-between">
                              <span className="text-black font-[Montserrat] font-semibold text-base dark:text-white">
                                Sound Effects
                              </span>
                              <span className="mr-3">
                                <ReactSwitch
                                  onChange={handleChangeSound}
                                  checked={
                                    audioState.soundOn == true ? true : false
                                  }
                                  className="react-switch"
                                  height={20}
                                  width={45}
                                  uncheckedIcon={
                                    audioState.soundOn == true ? true : false
                                  }
                                  checkedIcon={
                                    audioState.soundOn == true ? true : false
                                  }
                                  onColor="#86d3ff"
                                  onHandleColor="#2693e6"
                                />
                              </span>
                            </div>
                          )}
                          {setting.parameter_code === "BS" && (
                            <div className="mt-2 flex justify-between">
                              <span className="text-black font-semibold font-[Montserrat] text-base  dark:text-white">
                                Background Sound
                              </span>
                              <span className="mr-3">
                                <ReactSwitch
                                  onChange={handleChangebackground}
                                  checked={
                                    audioState.backgroundSoundOn == true
                                      ? true
                                      : false
                                  }
                                  className="react-switch"
                                  height={20}
                                  width={45}
                                  uncheckedIcon={
                                    audioState.backgroundSoundOn == true
                                      ? true
                                      : false
                                  }
                                  checkedIcon={
                                    audioState.backgroundSoundOn == true
                                      ? true
                                      : false
                                  }
                                  onColor="#86d3ff"
                                  onHandleColor="#2693e6"
                                />
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </Modal>
                  </div>
                  <GiSpeaker
                    className="text-white text-[22px] sm:text-[25px]"
                    onClick={openModal1}
                  />
                </div>
                <div className="w-[70px]">
                  <button
                    aria-label="score"
                    ref={collectButtonRef}
                    type="button"
                    className="rounded-full text-base md:text-xl text-yellow400 bg-[#b940b5] h-[40px] pl-[10px] pr-[15px] py-[10px]  md:pl-2.5 md:pr-[1.3rem]  absolute right-5 top-1/2 transform -translate-y-1/2 flex items-center font-[Montserrat]"
                  >
                    <span className="mr-2 h-[20px] w-[20px]">
                      <img src="/images/coin.png" alt="" className="w-[20px]" />
                    </span>
                    <CountUp
                      end={scoreCounting}
                      duration={2.5}
                      className="font-black max-w-[15px] min-w-[15px] font-[Montserrat]"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {show ? (
          <>
            <div
              className={`flex flex-col items-end md:items-center lg:items-center relative z-10  `}
            >
              <div className="quiz-card w-full mt-[5rem] bg-[#0f0f0f2b]">
                {audioState.clock ? (
                  <>
                    <div className=" py-[1rem] hidden sm:block  relative z-10">
                      <h1 className=" text-lg md:text-xl font-[Montserrat] flex justify-center items-center text-white ">
                        Time Remaining :
                      </h1>
                    </div>
                    {/* below mobile */}
                    <div className="flex justify-between items-center sm:hidden">
                      <div className="mt-5 relative z-10">
                        <h1 className=" text-center text-white font-[Montserrat]">
                          Question {currentQuestion + 1} of{" "}
                          {location?.quizData?.length}
                        </h1>
                      </div>
                      <div className="pt-[1rem] sm:pt-0 flex justify-center items-center rounded-full   relative z-10">
                        <h1 className="max-w-[56px] max-h-[56px] text-lg md:text-xl  flex justify-center items-center rounded-[50%] p-5 text-white font-[Montserrat] relative z-10">
                          <CountdownCircleTimer
                            key={currentQuestion}
                            isPlaying={isPlaying}
                            duration={
                              location?.quizData?.[currentQuestion]
                                ?.question_timming
                            }
                            colors={[["#D14081"]]}
                            strokeWidth={4}
                            strokeLinecap="round"
                            size={56}
                            trailColor="#EDEDED"
                            onComplete={() => {
                              // if (
                              //   location?.quizData?.[currentQuestion]
                              //     ?.question_timming ===
                              //   location?.quizData?.[currentQuestion]?.question_timming
                              // )
                              setIsModalOpen(true);
                              roomProgressSave();
                              // else {
                              //   moveToNextQuestion();
                              // }
                            }}
                          >
                            {renderTime}
                          </CountdownCircleTimer>
                        </h1>
                      </div>
                    </div>
                    {/* above mobile */}
                    <div className="hidden  pt-[1rem] sm:pt-0 sm:flex justify-center items-center rounded-full   relative z-10">
                      <h1 className="max-w-[56px] max-h-[56px] text-lg md:text-xl  flex justify-center items-center rounded-[50%] p-5 text-white font-[Montserrat] relative z-10">
                        <CountdownCircleTimer
                          key={currentQuestion}
                          isPlaying={isPlaying}
                          duration={
                            location?.quizData?.[currentQuestion]
                              ?.question_timming
                          }
                          colors={[["#D14081"]]}
                          strokeWidth={4}
                          strokeLinecap="round"
                          size={56}
                          trailColor="#EDEDED"
                          onComplete={() => {
                            // if (
                            //   location?.quizData?.[currentQuestion]
                            //     ?.question_timming ===
                            //   location?.quizData?.[currentQuestion]?.question_timming
                            // )
                            setIsModalOpen(true);
                            roomProgressSave();
                            // else {
                            //   moveToNextQuestion();
                            // }
                          }}
                        >
                          {renderTime}
                        </CountdownCircleTimer>
                      </h1>
                    </div>
                  </>
                ) : null}
                <div className="hidden sm:block mt-5 relative z-10">
                  <h1 className=" text-center text-white font-[Montserrat]">
                    Question {currentQuestion + 1} of{" "}
                    {location?.quizData?.length}
                  </h1>
                </div>
                <div
                  className={`${enterAnimation} ${exitAnimation}  relative z-10`}
                >
                  <div className=" pb-2 md:mt-4 text-left sm:mx-[3rem] text-lg flex flex-col items-left text-white relative z-10">
                    {/* <img
                    src={location?.quizData?.[currentQuestion].question.image}
                    alt=""
                    className="mb-1  md:max-w-[100%] max-h-[18vh] md:max-h-[12vh] xl:max-h-[20vh] rounded-lg  "
                  /> */}
                    <div
                    // className={`${
                    //   location?.quizData?.[currentQuestion].question.image ? "" : ""
                    // }`}
                    >
                      {/* {ReactHtmlParser(
                      location?.quizData?.[currentQuestion]?.question_name
                    )} */}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            location?.quizData?.[
                              currentQuestion
                            ]?.question_name.replace(
                              /\\\((.*?)\\\)/g,
                              (match, mathExpression) => {
                                try {
                                  return katex.renderToString(mathExpression, {
                                    throwOnError: false,
                                  });
                                } catch (error) {
                                  return match;
                                }
                              }
                            )
                          ),
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className={`${
                      location?.quizData?.[currentQuestion].options.some(
                        (option) => option.image
                      )
                        ? ""
                        : "flex justify-center items-center"
                    }`}
                  >
                    {location?.quizData?.length &&
                      location?.quizData?.[currentQuestion]?.category ===
                        "poll" && (
                        <LeafPoll
                          key={location?.quizData?.[currentQuestion].id}
                          type="multiple"
                          results={
                            location?.quizData?.[currentQuestion].options
                          }
                          theme={customTheme}
                          onVote={vote}
                        />
                      )}
                    {location?.quizData?.length &&
                      location?.quizData?.[currentQuestion]?.category ===
                        "m" && (
                        <ol
                          className={`flex flex-wrap justify-center mt-4 mb-[5rem] sm:mb-[6rem] ${
                            location?.quizData?.[currentQuestion].options.some(
                              (option) => option.image
                            )
                              ? "flex-row gap-3 md:gap-0 md:justify-between"
                              : "flex-col w-[100%] md:w-[70%] items-center gap-3 justify-center"
                          }`}
                        >
                          {location?.quizData?.[currentQuestion].options.map(
                            (option, index) => (
                              <li
                                key={option.id}
                                onClick={() =>
                                  handleOptionSelect(option, option.id)
                                }
                                className={`sm:hover:shadow-[0px_0px_0px_2px_#ffc500]  py-[15px] cursor-pointer h-fit ${
                                  option.image
                                    ? "w-[45%]  md:max-w-[11rem]"
                                    : "w-full"
                                } rounded-lg ${
                                  showCorrectAnswer &&
                                  location?.quizData?.[currentQuestion]
                                    .answer == option.id
                                    ? "bg-green-500 text-white zoom-animation"
                                    : selectedOption === option
                                    ? "bg-red-700 text-white shake-animation "
                                    : "bg-white text-black font-bold"
                                }
                            `}
                                style={{
                                  borderRadius: "12px",
                                }}
                              >
                                {location?.quizData?.[currentQuestion].answer ==
                                  option.id &&
                                  Array.from({ length: 4 }).map(
                                    (_, coinIndex) => (
                                      <img
                                        key={coinIndex}
                                        ref={(el) =>
                                          (coinsRef.current[
                                            index * 4 + coinIndex
                                          ] = el)
                                        }
                                        src="/images/coin.png"
                                        alt="coin"
                                        style={{
                                          position: "absolute",
                                          width: "30px",
                                          height: "30px",
                                          display: "none",
                                        }}
                                      />
                                    )
                                  )}
                                <div className=" rounded-lg ">
                                  {option.image && (
                                    <img
                                      src={option.image}
                                      alt=""
                                      className="mb-2 mx-auto max-w-[100%] max-h-[12vh] md:max-h-[15vh] xl:max-h-[15vh] rounded-lg "
                                    />
                                  )}
                                </div>
                                <div
                                  className={`text-sm ${
                                    option.image
                                      ? "text-center"
                                      : "flex justify-start h-fit items-center ml-[47px] sm:ml-[57px]  pr-[3px] sm:pr-[30px]"
                                  }`}
                                >
                                  <div className="flex justify-center items-center h-fit">
                                    <div className="relative ">
                                      <span
                                        className={`custom-list  ${
                                          option.image
                                            ? "custom-list"
                                            : "custom-list-image-not-available1"
                                        }`}
                                      ></span>
                                    </div>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(
                                          option.value.replace(
                                            /\\\((.*?)\\\)/g,
                                            (match, mathExpression) => {
                                              try {
                                                return katex.renderToString(
                                                  mathExpression,
                                                  {
                                                    throwOnError: false,
                                                  }
                                                );
                                              } catch (error) {
                                                return match;
                                              }
                                            }
                                          )
                                        ),
                                      }}
                                    />
                                  </div>
                                </div>
                              </li>
                            )
                          )}
                        </ol>
                      )}
                    {location?.quizData?.length &&
                      location?.quizData?.[currentQuestion].category ===
                        "multi" && (
                        <ol
                          className={`flex flex-wrap justify-center mt-4 ${
                            location?.quizData?.[currentQuestion].options.some(
                              (option) => option.image
                            )
                              ? "flex-row gap-3 md:gap-0 md:justify-between"
                              : "flex-col w-[100%] md:w-[70%] items-center gap-3 justify-center"
                          }`}
                        >
                          {location?.quizData?.[currentQuestion].options.map(
                            (option, index) => (
                              <li
                                key={index}
                                onClick={() =>
                                  handleOptionMultiSelect(option, index)
                                }
                                className={`text-center hover:shadow-[0px_0px_0px_2px_#ed8936] py-[5px] cursor-pointer min-h-[49px] ${
                                  option.image
                                    ? "w-[45%] md:max-w-[11rem]"
                                    : "w-full"
                                } rounded-lg ${
                                  showCorrectAnswer
                                    ? location.quizData[
                                        currentQuestion
                                      ].correctAnswers.includes(index)
                                      ? "bg-green-700 text-white"
                                      : selectedOptions.includes(index)
                                      ? "bg-red-700 text-white"
                                      : "bg-white text-black"
                                    : selectedOptions.includes(index)
                                    ? "bg-orange-400 text-white"
                                    : "bg-white text-black"
                                } ${
                                  showCorrectAnswer &&
                                  selectedOptions.includes(index) &&
                                  !location.quizData[
                                    currentQuestion
                                  ].correctAnswers.includes(index)
                                    ? "zoom-animation"
                                    : ""
                                }`}
                                style={{
                                  borderRadius: "12px",
                                }}
                              >
                                <div className="w-[100%] relative">
                                  <span
                                    className={`custom-list ${
                                      option.image
                                        ? "custom-list"
                                        : "custom-list-image-not-available1"
                                    }`}
                                  ></span>
                                </div>
                                {location.quizData[
                                  currentQuestion
                                ].correctAnswers.includes(index) &&
                                  Array.from({ length: 4 }).map(
                                    (_, coinIndex) => (
                                      <img
                                        key={coinIndex}
                                        ref={(el) =>
                                          (coinsRef.current[
                                            index * 4 + coinIndex
                                          ] = el)
                                        }
                                        src="/images/coin.png"
                                        alt="coin"
                                        style={{
                                          position: "absolute",
                                          width: "30px",
                                          height: "30px",
                                          display: "none",
                                        }}
                                      />
                                    )
                                  )}
                                <div className="rounded-lg">
                                  {option.image && (
                                    <img
                                      src={option.image}
                                      alt=""
                                      className="mb-2 mx-auto max-w-[100%] max-h-[12vh] md:max-h-[15vh] xl:max-h-[15vh] rounded-lg"
                                    />
                                  )}
                                </div>
                                <h1
                                  className={`text-sm font-semibold ${
                                    option.image
                                      ? ""
                                      : "flex justify-start items-center ml-[47px] sm:ml-[57px] "
                                  }`}
                                >
                                  {option.text}
                                </h1>
                              </li>
                            )
                          )}
                        </ol>
                      )}
                    {location?.quizData?.length &&
                      location?.quizData?.[currentQuestion].category ===
                        "fill" && (
                        <div className="flex justify-center flex-col">
                          <div
                            className={`word-container bg-${wordContainerBgColor} py-2 rounded-lg`}
                          >
                            {correctAnswerText
                              .split("")
                              .map((letter, index) => {
                                if (letter === " ") {
                                  return (
                                    <div
                                      key={index}
                                      className="letter invisible"
                                    ></div>
                                  );
                                } else {
                                  const chosenLetter =
                                    chosenLetters[displayIndex] || "";
                                  displayIndex++;
                                  return (
                                    <div
                                      key={index}
                                      className={`letter visible ${
                                        chosenLetter ? "visible" : ""
                                      }`}
                                    >
                                      {chosenLetter}
                                    </div>
                                  );
                                }
                              })}
                            {Array.from({ length: 4 }).map((_, coinIndex) => (
                              <img
                                key={coinIndex}
                                ref={(el) => (coinsRef.current[coinIndex] = el)}
                                src="/images/coin.png"
                                alt="coin"
                                style={{
                                  position: "absolute",
                                  width: "30px",
                                  height: "30px",
                                  display: "none",
                                }}
                              />
                            ))}
                          </div>
                          <div className="button-section">
                            <div className="guess-section">
                              <button
                                aria-label="remover letter"
                                onClick={removeCharacterFunction}
                                disabled={!chosenLetters.length || msg}
                                className="remove-button"
                              >
                                Remove Letter
                              </button>
                            </div>
                            <div className="letter-selection bg-dimBlack rounded-lg py-1">
                              {displayLettersFunction()}
                            </div>
                            <div className="flex gap-1">
                              <button
                                aria-label="guess"
                                onClick={restartGameFunction}
                                disabled={!chosenLetters.length}
                                className="guess-button"
                              >
                                Reset
                              </button>
                              {chosenLetters.length ===
                                correctAnswerText.replace(/\s+/g, "")
                                  .length && (
                                <button
                                  aria-label="guess"
                                  onClick={guessFunction}
                                  disabled={guess}
                                  className="guess-button"
                                >
                                  Guess
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                  <div className="pb-4 flex items-center justify-center">
                    {location?.quizData?.length &&
                      location?.quizData?.[currentQuestion].category ===
                        "multi" && (
                        <button
                          aria-label="check answer"
                          onClick={checkAnswers}
                          className={` mb-2 mt-6 md:mt-4 py-2 px-4  bg-[#571555] cursor-pointer text-white rounded-xl  w-[90%] mds:w-[30%] m-auto hover:bg-[#360330] text-[16px] sm:text-lg ${
                            showCorrectAnswer
                              ? "hidden"
                              : optionSelected
                              ? ""
                              : "hidden"
                          }`}
                        >
                          Check Answer
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="pt-[4.5rem] ">
            <ProgressLine
              label="Full progressbar"
              visualParts={[
                {
                  percentage: "100%",
                  color: "yellow",
                },
              ]}
            />
            <div
              className={`flex flex-col justify-center items-center relative z-10 ${enterAnimation} ${exitAnimation}`}
            >
              <div className="w-full md:w-[40%] h-screen mb-[10rem] bg-[#1B363E] rounded-lg py-2">
                <Reorder.Group values={allRankData} onReorder={setAllRankData}>
                  <table className="w-full border-separate border-spacing-y-3 px-3">
                    {allRankData.map((user, ind) => {
                      return (
                        <Reorder.Item
                          as="tr"
                          value={user.ranks}
                          key={user.ranks}
                          className={`shadow-[0px_0px_0px_1px_#F8FF95] relative z-10 rounded-lg hover:scale-105 transition duration-500 ${
                            location.user_id == user.user_id
                              ? "bg-[#006778]"
                              : "bg-[#8080802b]"
                          }`}
                        >
                          <td className="text-white text-lg py-2 px-2 sm:px-2 text-center rounded-tl-lg rounded-bl-lg font-[Montserrat]">
                            {ind + 1}
                          </td>
                          <td className="py-2 font-[Montserrat] w-[78px] sm:w-[70px] md:w-[5rem] pl-[30px] md:pl-[38px] relative">
                            <span
                              className={`rounded-full w-3 h-3 absolute top-[31px] right-[66px] transform translate-x-2 -translate-y-2 ${
                                user.quiz_complete_status
                                  ? "bg-gray-400"
                                  : " bg-green-400"
                              }`}
                              title={
                                user.quiz_complete_status
                                  ? "completed"
                                  : "stillPlaying"
                              }
                            ></span>
                            <img
                              src={
                                user.user_profile === null ||
                                user.user_profile === "" ||
                                user.user_profile === undefined
                                  ? defaultImage
                                  : user.user_profile
                              }
                              alt="userImage"
                              className="w-10 h-10 rounded-full"
                            />
                          </td>
                          <td className="text-white font-[Montserrat] text-lg py-2 pl-[5px]">
                            {user.user_name}
                          </td>
                          <td className="w-[19px]">
                            <img
                              src="/images/coin.png"
                              alt=""
                              className="w-[20px]"
                            />
                          </td>
                          <td className="font-[Montserrat] text-white text-lg px-1 rounded-tr-lg rounded-br-lg">
                            {user.user_coin}
                          </td>
                        </Reorder.Item>
                      );
                    })}
                  </table>
                </Reorder.Group>
              </div>
            </div>
            <div className=" flex items-center justify-center bg-[#1B363E]">
              <div className="fixed z-50 bottom-0 w-full bg-[#1B363E]">
                {currentQuestion === location?.quizData?.length - 1 &&
                completedModal == false ? (
                  <p
                    className={`text-center text-white ${
                      location.hostId != undefined ? "mt-4" : "my-4"
                    }`}
                  >
                    Please wait for others to complete the game
                  </p>
                ) : null}
                {currentQuestion !== location?.quizData?.length - 1 && (
                  <button
                    aria-label="next question"
                    onClick={moveToNextQuestion}
                    disabled={!selectedOption || timer <= 0}
                    className="flex justify-center items-center gap-[11px]  mb-4 mt-6 md:mt-4 py-2 px-4  bg-[#006778] cursor-pointer text-white rounded-xl  w-[90%] mds:w-[30%] m-auto hover:bg-[#006778] font-[Montserrat]"
                  >
                    <span>Next Question</span>
                    <span>
                      <FiArrowRightCircle />
                    </span>
                  </button>
                )}
                {currentQuestion === location?.quizData?.length - 1 &&
                  location.hostId != undefined && (
                    <button
                      aria-label="end game"
                      onClick={() => onEndGame()}
                      className="flex justify-center items-center gap-[11px] mb-4 mt-6 md:mt-4 py-2 px-4  bg-[#006778] cursor-pointer text-white rounded-xl  w-[90%] mds:w-[30%] m-auto hover:bg-[#006778] font-[Montserrat]"
                    >
                      <span>End Game</span>
                      <span>
                        <FiArrowRightCircle />
                      </span>
                    </button>
                  )}
              </div>
            </div>
            {completedModal ? (
              <div
                className={`fixed 
               } top-0 left-0 w-full h-[85vh] h-full flex items-end items-center justify-center transition-opacity duration-1000  bg-gray-100 bg-opacity-10  z-50`}
              >
                <div
                  className={`bg-white dark:bg-grey800 p-6 pt-3 rounded-lg shadow-lg relative   w-full sm:w-[48%] md:w-[23%] font-[Montserrat]`}
                >
                  <p className="text-center text-black dark:text-white font-bold">
                    All Done!
                  </p>
                  <div className="flex justify-center font-[Montserrat] items-center gap-1">
                    <span>
                      <OvalLoader />
                    </span>
                    <span>
                      <p className="text-black dark:text-white">
                        Game Completed! Showing result
                      </p>
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
            {endModal ? (
              <div
                className={`fixed 
    } top-0 left-0 w-full h-[85vh] h-full flex items-end items-center justify-center transition-opacity duration-1000  bg-gray-100 bg-opacity-10  z-50`}
              >
                <div
                  className={`bg-white dark:bg-grey800  p-6 rounded-lg shadow-lg relative  w-full sm:w-[48%] md:w-[23%] `}
                >
                  <div className="flex justify-center font-[Montserrat] items-center gap-1">
                    <span>
                      <OvalLoader />
                    </span>
                    <span>
                      <p className="text-black dark:text-white">Game Over !!</p>
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};

export default RoomQuiz;
