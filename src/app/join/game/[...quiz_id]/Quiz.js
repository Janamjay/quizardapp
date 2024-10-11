/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect, useRef } from "react";
import {  getCookie } from "cookies-next";
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
import "animate.css";
import back from "/public/images/quizpage.jpg";
import { LeafPoll } from "react-leaf-polls";
import "react-leaf-polls/dist/index.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectQuizSound } from "@/redux/audioSlice";
import DNALoader from "@/app/utils/DNALoader";
import DOMPurify from "dompurify";

const customTheme = {
  textColor: "black",
  mainColor: "#00B87B",
  backgroundColor: "#d6d3d1",
};
const originalConsoleError = console.error;
console.error = (...args) => {
  if (/validateDOMNesting|Received NaN/.test(args[0])) {
    return;
  }
  originalConsoleError(...args);
};
const Quiz = ({ classListData, quizPlayData, quizDetails }) => {

  const params = useParams();
  const pathname = usePathname();
  const quiz_id = params.quiz_id[0];
  const quizSound = useSelector(selectQuizSound);

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

  const [guess, setGuess] = useState(false);
  const [msg, setMsg] = useState("");
  const [chosenLetters, setChosenLetters] = useState([]);
  const [displayWord, setDisplayWord] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [wordContainerBgColor, setWordContainerBgColor] =
    useState("[#8080802b]");
  const [selectedLetters, setSelectedLetters] = useState([]);

  const [enterAnimation, setEnterAnimation] = useState("");
  const [exitAnimation, setExitAnimation] = useState("");

  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [unattemptedQuestions, setUnattemptedQuestions] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [checkedSound, setCheckedSound] = useState(true);
  const [checkedBackground, setCheckedBackground] = useState(true);
  const [audioState, setAudioState] = useRecoilState(audioStateAtom);
  const [coinAnimations, setCoinAnimations] = useState([]);
  const coinsRef = useRef([]);
  const collectButtonRef = useRef(null);
  const moveCoinsAnimation = useRef(null);
  const navigate = useRouter();
  const [quizDetail, setQuizDetail] = useState({});
  const [quizSetting, setQuizSetting] = useState([]);
  const [quizStart, setQuizStart] = useState([]);
  const [quizSingle, setQuizSingle] = useState([]);
  const [quizMulti, setQuizMulti] = useState([]);
  const [quizMatch, setQuizMatch] = useState([]);
  const [quizGuess, setQuizGuss] = useState([]);
  const [quizCoin, setQuizCoin] = useState([]);
  const [status, setStatus] = useState(false);

  const [spentTime, setSpentTime] = useState(
    quizStart[currentQuestion]?.question_timming
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;
    if (quizStart.length > 0 && currentQuestion < quizStart.length) {
      interval = setInterval(() => {
        setSpentTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      setSpentTime(0);
    };
  }, [currentQuestion, quizStart]);

  async function progressSaveApi(id) {
    const question_id = quizStart[currentQuestion].question_id;
    const ans = id == undefined ? 0 : id;
    const quuestionType = quizStart[currentQuestion].category;
    const quizSpentTime =
      isModalOpen === true
        ? quizStart[currentQuestion]?.question_timming
        : spentTime;

    const progressSaveData = {
      quiz_id,
      question_id,
      ans,
      quuestionType,
      quizSpentTime,
    };
    const quizSaveResponse = await fetch("/api/quiz_progress_save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(progressSaveData),
    });
  }

  async function progressEndApi() {
    const quiz_length = quizStart.length;

    const progressSaveData = {
      quiz_id,
      quiz_length,
    };
    const quizSaveResponse = await fetch("/api/quiz_end", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(progressSaveData),
    });
  }

  useEffect(() => {
    const tokenId = getCookie("isUserLoggedIn");
    setAudioState({ ...audioState, resultStatus: true });

    async function fetchData() {
      try {
        const quizStartResponse = quizPlayData;
        setQuizStart(quizStartResponse.start_quiz);
        setQuizSingle(quizStartResponse.SingleSelectQuestion);
        setQuizMulti(quizStartResponse.MultipleSelectQuestion);
        setQuizMatch(quizStartResponse.Matching);
        setQuizGuss(quizStartResponse.Guess);
        setQuizCoin(quizStartResponse.coin_type_list);
        setLoading(false);

        const quizDetailsResponse = quizDetails;
        setQuizDetail(quizDetailsResponse.quiz_details);
        setQuizSetting(quizDetailsResponse.quiz_setting);
        setLoading(false);
      } catch (err) {}
    }

    if (tokenId) {
      fetchData();
    } else {
      navigate.push(`/quiz/${quiz_id}/`);
    }
  }, []);

  useEffect(() => {
    if (audio === null) {
      const audioInstance = new Howl({
        src: [quizSound.length && quizSound[0].soundFile],
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
      src: [quizSound.length && quizSound[1].soundFile],
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
      src: [quizSound.length && quizSound[2].soundFile],
      volume: 1.0,
      html5: true,
    });

    setIncorrectAudio(audioInstance);

    return () => {
      if (incorrectAudio) {
        incorrectAudio.unload();
      }
    };
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
  };

  useEffect(() => {
    setShowCorrectAnswer(false);
    setEnterAnimation("animate__animated animate__fadeInRightBig ");
  }, [currentQuestion]);

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

  const moveToNextQuestion = () => {
    setIsPlaying(false);
    clearInterval(interval);
    setStatus(false);
    // if (audio) {
    //   audio.pause();
    // }
    if (currentQuestion < quizStart.length - 1) {
      setExitAnimation("animate__animated animate__fadeOutLeftBig");

      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption("");
        setShowCorrectAnswer(false);
        // setTimer(60);
        setIsPlaying(true);
        // if (audio && audioState.backgroundSoundOn && !isModalOpen) {
        //   audio.play();
        // }
        setEnterAnimation("animate__animated animate__fadeInRightBig");
        setExitAnimation("");
        setOptionSelected(false);
      }, 500);
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
  }

  const handleOptionSelect = (selectedOption) => {
    progressSaveApi(selectedOption.id);
    if (!showCorrectAnswer) {
      setIsPlaying(false);
      clearInterval(interval);

      const updatedQuestions = [...quizStart];
      updatedQuestions[currentQuestion].selectedOption = selectedOption;

      setSelectedOption(selectedOption);
      // setUnattemptedQuestions(unattemptedQuestions - 1);

      const isCorrect = selectedOption.id == quizStart[currentQuestion].answer;

      if (isCorrect) {
        setScoreCounting(scoreCounting + 4);
        startAnimation();
        if (audioState && audioState.soundOn) {
          animateAudio.play();
        }
      } else if (incorrectAudio && audioState.soundOn) {
        incorrectAudio.play();
      }
      setShowCorrectAnswer(true);
      setStatus(true);
      // if (audio) {
      //   audio.pause();
      // }
    }
  };

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

      const updatedQuestions = [...quizStart];
      updatedQuestions[currentQuestion].selectedOptions = selectedOptions;

      const areSelectedOptionsCorrect =
        JSON.stringify(selectedOptions.sort()) ===
        JSON.stringify(quizStart[currentQuestion].correctAnswers.sort());

      if (areSelectedOptionsCorrect) {
        setScoreCounting(scoreCounting + 4);
        startAnimation();
      }

      setShowCorrectAnswer(true);
      if (audio) {
        audio.pause();
      }
      setOptionSelected(false);
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
  //       quizStart[currentQuestion].correctAnswers[0];
  //     const correctAnswerText =
  //       quizStart[currentQuestion].options[correctAnswerIndex].text;

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
  //     quizStart[currentQuestion].correctAnswers[0];
  //   const correctAnswerText =
  //     quizStart[currentQuestion].options[correctAnswerIndex].text;

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
  //     quizStart[currentQuestion].correctAnswers[0];
  //   const formattedCorrectAnswer = quizStart[currentQuestion].options[
  //     correctAnswerIndex
  //   ].text
  //     .toLowerCase()
  //     .replace(/\s+/g, "");

  //   const formattedUserGuess = chosenLetters.join("").toLowerCase();
  //   return formattedCorrectAnswer === formattedUserGuess;
  // };

  // const guessFunction = () => {
  //   const correctAnswerIndex =
  //     quizStart[currentQuestion].correctAnswers[0];
  //   const correctAnswerText =
  //     quizStart[currentQuestion].options[correctAnswerIndex].text;

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
  const startAnimation = () => {
    const coinElements = coinsRef.current;
    const collectButtonElement = collectButtonRef.current;

    let buttonCenterX =
      collectButtonElement.offsetLeft + collectButtonElement.offsetWidth / 2;
    let buttonCenterY =
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
            coinElement.style.display = "none";
            anime.set(coinElement, {
              translateX: 0,
              translateY: 0,
              opacity: 1,
            });
            // if (animateAudio) {
            //   animateAudio.pause();
            // }
          },
        });
      }
    });

    setCoinAnimations(animations);
    animations.forEach((animation) => {
      if (animation) {
        animation.play();
      }
    });
  };

  const submitQuiz = (quiz_id) => {
    // progressSaveApi();
    progressEndApi();
    // const totalQuestions = quizStart.length;
    // let correctAnswers = 0;
    // let unattempted = 0;

    // quizStart.forEach((question, index) => {
    //   if (
    //     question.category === "single" &&
    //     (question.selectedOption === undefined ||
    //       question.selectedOption === "")
    //   ) {
    //     unattempted++;
    //   } else if (
    //     question.category === "multi" &&
    //     (question.selectedOptions === undefined ||
    //       question.selectedOptions.length === 0)
    //   ) {
    //     unattempted++;
    //   } else if (question.category === "single") {
    //     const selectedOptionText = question.selectedOption.text;
    //     const selectedOptionIndex = question.options.findIndex(
    //       (option) => option.text === selectedOptionText
    //     );
    //     if (selectedOptionIndex !== -1) {
    //       if (question.options[selectedOptionIndex].isCorrect) {
    //         correctAnswers++;
    //       }
    //     }
    //   } else if (question.category === "multi") {
    //     const areSelectedOptionsCorrect =
    //       JSON.stringify(question.selectedOptions.sort()) ===
    //       JSON.stringify(question.correctAnswers.sort());

    //     if (areSelectedOptionsCorrect) {
    //       correctAnswers++;
    //     }
    //   }
    // });

    // const wrongAnswers = totalQuestions - (correctAnswers + unattempted);
    // const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    navigate.push(`/join/quiz/result/${quiz_id}`);

    setQuizResults;
    setQuizResults((prevResults) => ({
      ...prevResults,
      scoreCounting: scoreCounting,
      totalQuestions: quizStart.length,
      status: 1,
      // correctAnswers: correctAnswers,
      // wrongAnswers: wrongAnswers,
      // unattemptedQuestions: unattempted,
      // percentage: percentage,
    }));
  };
  // const correctAnswerIndex =
  //   quizStart[currentQuestion].correctAnswers[0];
  // const correctAnswerText =
  //   quizStart[currentQuestion].options[correctAnswerIndex].text;
  // let displayIndex = 0;

  return (
    <>
      {loading ? (
        <DNALoader />
      ) : (
        <div
          className=" bg-center select-none relative bg-cover bg-no-repeat min-h-screen overflow-x-hidden"
          style={{
            backgroundColor: "#1B363E",
          }}
        >
          <ModalTimer isOpen={isModalOpen} onClose={closeModal} />
          <div className=" hidden">
            <Navbar
              scoreCounting={scoreCounting}
              classListData={classListData}
            />
          </div>
          <div className="w-full fixed z-50">
            <div>
              <div className="flex items-center justify-between py-4 pl-[30px] px-7  rounded-lg relative z-10 bg-[#1B363E]">
                <div className="text-xl md:text-4xl cursor-pointer text-yellow400 max-w-[135px] sm:max-w-full truncate">
                  <h1 className="  truncate font-[Montserrat]">
                    {quizDetail.question_set_name}
                  </h1>
                </div>
                <div className="flex justify-between items-center gap-[1rem] md:gap-[2rem]">
                  <div className="text-lg md:text-[2rem]  relative z-10">
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
                                <span className="text-black font-[Montserrat] font-semibold text-base  dark:text-white">
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
                  <div className="w-[70px] ">
                    <button
                      aria-label="score"
                      ref={collectButtonRef}
                      type="button"
                      className="  rounded-full  text-base md:text-xl text-yellow400 bg-[#b940b5] h-[40px] pl-[10px] pr-[15px] py-[10px]  md:pl-2.5 md:pr-[1.3rem]  absolute right-5 top-1/2 transform -translate-y-1/2 flex items-center font-[Montserrat]"
                    >
                      <span className="mr-2 h-[20px] w-[20px]">
                        <img
                          src="/images/coin.png"
                          alt=""
                          className="w-[20px]"
                        />
                      </span>
                      <CountUp
                        end={scoreCounting}
                        duration={2.5}
                        className="font-black max-w-[15px] min-w-[15px] font-[Montserrat] "
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`flex flex-col items-end md:items-center lg:items-center relative z-10`}
          >
            <div className="quiz-card mt-[5rem] bg-[#0f0f0f2b]  w-full">
              <div className=" py-[1rem] hidden sm:block  relative z-10">
                <h1 className=" text-lg md:text-xl font-[Montserrat] flex justify-center items-center text-white ">
                  Time Remaining :
                </h1>
              </div>
              {/* below mobile */}
              <div className="flex justify-between items-center sm:hidden">
                <div className="mt-5 relative z-10">
                  <h1 className=" text-center text-white font-[Montserrat]">
                    Question {currentQuestion + 1} of {quizStart.length}
                  </h1>
                </div>
                <div className="pt-[1rem] sm:pt-0 flex justify-center items-center rounded-full   relative z-10">
                  <h1 className="max-w-[56px] max-h-[56px] text-lg md:text-xl  flex justify-center items-center rounded-[50%] p-5 text-white  relative font-[Montserrat] z-10">
                    <CountdownCircleTimer
                      key={currentQuestion}
                      isPlaying={isPlaying}
                      duration={quizStart[currentQuestion]?.question_timming}
                      colors={[["#D14081"]]}
                      strokeWidth={4}
                      strokeLinecap="round"
                      size={46}
                      trailColor="#EDEDED"
                      onComplete={() => {
                        // if (
                        //   quizStart[currentQuestion]?.question_timming ===
                        //   quizStart[currentQuestion]?.question_timming
                        // )
                        {
                          setIsModalOpen(true);
                          progressSaveApi();
                        }
                        //  else {
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
                <h1 className="max-w-[56px] max-h-[56px] text-lg md:text-xl  flex justify-center items-center rounded-[50%] p-5 text-white  relative z-10">
                  <CountdownCircleTimer
                    key={currentQuestion}
                    isPlaying={isPlaying}
                    duration={quizStart[currentQuestion]?.question_timming}
                    colors={[["#D14081"]]}
                    strokeWidth={4}
                    strokeLinecap="round"
                    size={56}
                    trailColor="#EDEDED"
                    onComplete={() => {
                      // if (
                      //   quizStart[currentQuestion]?.question_timming ===
                      //   quizStart[currentQuestion]?.question_timming
                      // )
                      {
                        progressSaveApi();
                        setIsModalOpen(true);
                      }
                      // else {
                      //   moveToNextQuestion();
                      // }
                    }}
                  >
                    {renderTime}
                  </CountdownCircleTimer>
                </h1>
              </div>
              <div className="hidden sm:block mt-5 relative z-10">
                <h1 className=" text-center text-white font-[Montserrat]">
                  Question {currentQuestion + 1} of {quizStart.length}
                </h1>
              </div>
              <div
                className={`${enterAnimation} ${exitAnimation}  relative z-10`}
              >
                <div className=" pb-2 mt-4 md:mt-4 text-left text-lg sm:mx-[3rem]  relative z-10 flex flex-col items-left text-white ">
                  {/* <Image
                src={quizStart[currentQuestion].question.image}
                alt=""
                className="mb-1  md:max-w-[100%] max-h-[18vh] md:max-h-[12vh] xl:max-h-[20vh] rounded-lg  "
              /> */}
                  <div
                  // className={`${
                  //   quizStart[currentQuestion].question.image ? "" : ""
                  // }`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          quizStart[currentQuestion]?.question_name.replace(
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
                    quizStart[currentQuestion]?.options.some(
                      (option) => option.image
                    )
                      ? ""
                      : "flex justify-center items-center "
                  }`}
                >
                  {quizStart.length &&
                    quizStart[currentQuestion]?.category === "poll" && (
                      <LeafPoll
                        key={quizStart[currentQuestion].id}
                        type="multiple"
                        results={quizStart[currentQuestion].options}
                        theme={customTheme}
                        onVote={vote}
                      />
                    )}
                  {quizStart.length &&
                    quizStart[currentQuestion]?.category === "m" && (
                      <ol
                        className={`flex flex-wrap justify-center mt-4 mb-[5rem] sm:mb-[6rem] ${
                          quizStart[currentQuestion].options.some(
                            (option) => option.image
                          )
                            ? "flex-row gap-3 md:gap-0 md:justify-between"
                            : "flex-col w-[100%] md:w-[70%] items-center gap-3 justify-center"
                        }`}
                      >
                        {quizStart[currentQuestion].options.map(
                          (option, index) => (
                            <li
                              key={option.id}
                              onClick={() =>
                                handleOptionSelect(option, option.id)
                              }
                              className={`sm:hover:shadow-[0px_0px_0px_2px_#ffc500]  py-[15px] cursor-pointer h-fit  ${
                                option.image
                                  ? "w-[45%]  md:max-w-[11rem]"
                                  : "w-full "
                              } rounded-lg ${
                                showCorrectAnswer &&
                                quizStart[currentQuestion].answer == option.id
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
                              {quizStart[currentQuestion].answer == option.id &&
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
                                className={`text-sm   ${
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
                  {quizStart.length &&
                    quizStart[currentQuestion]?.category === "multi" && (
                      <ol
                        className={`flex flex-wrap justify-center mt-4 ${
                          quizStart[currentQuestion].options.some(
                            (option) => option.image
                          )
                            ? "flex-row gap-3 md:gap-0 md:justify-between"
                            : "flex-col w-[100%] md:w-[70%] items-center gap-3 justify-center"
                        }`}
                      >
                        {quizStart[currentQuestion].options.map(
                          (option, index) => (
                            <li
                              key={index}
                              onClick={() =>
                                handleOptionMultiSelect(option, index)
                              }
                              className={`text-center sm:hover:shadow-[0px_0px_0px_2px_#1B363E] py-[5px] cursor-pointer min-h-[49px] ${
                                option.image
                                  ? "w-[45%] md:max-w-[11rem]"
                                  : "w-full"
                              } rounded-lg ${
                                showCorrectAnswer
                                  ? quizStart[
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
                                !quizStart[
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
                                      : "custom-list-image-not-available"
                                  }`}
                                ></span>
                              </div>
                              {quizStart[
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
                  {quizStart.length &&
                    quizStart[currentQuestion]?.category === "fill" && (
                      <div className="flex justify-center flex-col">
                        <div
                          className={`word-container bg-${wordContainerBgColor} py-2 rounded-lg`}
                        >
                          {correctAnswerText.split("").map((letter, index) => {
                            if (letter === " ") {
                              // If the character is a space, render an empty button
                              return (
                                <div
                                  key={index}
                                  className="letter invisible"
                                ></div>
                              );
                            } else {
                              // If it's not a space, render the chosen letter based on the current displayIndex
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
                              aria-label="remove letter"
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
                              aria-label="reset"
                              onClick={restartGameFunction}
                              disabled={!chosenLetters.length}
                              className="guess-button"
                            >
                              Reset
                            </button>
                            {chosenLetters.length ===
                              correctAnswerText.replace(/\s+/g, "").length && (
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
              </div>
              {status == true ? (
                <div className="pb-4 font-[Montserrat] flex fixed bottom-0 left-0 items-center bg-[#1B363E] justify-center w-full z-10">
                  {currentQuestion !== quizStart.length - 1 ? (
                    <div className="w-full flex justify-center items-center">
                      {currentQuestion !== quizStart.length - 1 && (
                        <button
                          aria-label="Next Question"
                          onClick={moveToNextQuestion}
                          disabled={
                            quizStart[currentQuestion]?.category !== "poll" &&
                            quizStart[currentQuestion]?.category !== "fill" &&
                            (!selectedOption || timer <= 0)
                          }
                          className={`
                    flex justify-center items-center gap-[11px]  mb-2 mt-6 md:mt-4 py-2 
                    bg-[#006778] text-white rounded-xl  w-[100%] sm:w-[35%] mx-[20px] 
                    hover:bg-[#006778] text-[16px] sm:text-lg
                    ${optionSelected ? "hidden" : ""}
                    ${
                      quizStart[currentQuestion]?.category !== "poll" &&
                      quizStart[currentQuestion]?.category !== "fill" &&
                      (!selectedOption || timer <= 0)
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }
                    `}
                        >
                          <span>Next Question</span>
                          <span>
                            <FiArrowRightCircle />
                          </span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {currentQuestion === quizStart.length - 1 && (
                        <div className="w-full flex justify-center font-[Montserrat] items-center">
                          <button
                            aria-label="submit quiz"
                            onClick={() => submitQuiz(quiz_id)}
                            className=" flex justify-center items-center gap-[11px]  mb-2 mt-6 md:mt-4 py-2
                            bg-[#006778] text-white rounded-xl  w-[100%] sm:w-[35%] mx-[20px]
                      hover:bg-[#006778] text-[16px] sm:text-lg"
                          >
                            <span>Submit Quiz</span>
                            <span>
                              <FiArrowRightCircle />
                            </span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                  {quizStart[currentQuestion]?.category === "multi" && (
                    <button
                      aria-label="check answer"
                      onClick={checkAnswers}
                      className={` mb-2 mt-6 md:mt-4 font-[Montserrat] py-2 px-4  bg-[#006778] cursor-pointer text-white rounded-xl  w-full mds:w-[80%]  hover:bg-[#360330] text-[16px] sm:text-lg ${
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
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Quiz;
