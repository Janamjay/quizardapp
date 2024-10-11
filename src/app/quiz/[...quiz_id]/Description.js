/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";
import { AiFillQuestionCircle } from "react-icons/ai";
import { MdRefresh } from "react-icons/md";
import { BsArrowRightCircle } from "react-icons/bs";
import { BiUserPlus } from "react-icons/bi";
import Footer from "@/app/components/footer/Footer";
import { useState, useEffect } from "react";
import Modal from "../../components/modal/Modal";
import ModalDino from "../../components/modal/ModalDino";
import Modal2 from "../../components/modal/Modal2";
import ReactSwitch from "react-switch";
import Navbar from "../../components/navbar/Navbar";
import Navigation from "../../components/navigationBar/Navigation";
import { useRecoilState } from "recoil";
import { audioStateAtom } from "../../../atom/audioState";
import quizImage from "../../../../public/images/quiz.png";
import back from "../../../../public/images/description.jpg";
import SinglePlay from "../../components/modal/SinglePlay";
import MultiPlay from "../../components/modal/MultiPlay";
import Rules from "../../components/modal/Rules";
import RulesMulti from "../../components/modal/RulesMulti";
import dino from "../../../../public/images/dinomode.png";
import normal from "../../../../public/images/normal.png";
import ModalMultiDino from "../../components/modal/ModalMultiDino";
import DNALoader from "../../utils/DNALoader.js";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { quizDetailId } from "@/app/api/service";
import { useDispatch } from "react-redux";
import { setQuizSound } from "../../../redux/audioSlice";
import { setRoomData } from "../../../redux/roomSlice";
import Cookies from "js-cookie";
import { getCookie } from "cookies-next";
import DOMPurify from "dompurify";
import katex from "katex";
import "katex/dist/katex.min.css";

const Description = ({ classListData, quizDetail }) => {
  const user = getCookie("user");
  const params = useParams();
  const quiz_id = params.quiz_id[0];
  const dispatch = useDispatch();
  Cookies.set("quizName", quizDetail.quiz_details.question_set_name);
  const loading = false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSingle, setIsModalSingle] = useState(false);
  const [isModalMulti, setIsModalMulti] = useState(false);
  const [isModalMultiDino, setIsModalMultiDino] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [rulesModal, setRulesModal] = useState(false);
  const [rulesModalMulti, setRulesModalMulti] = useState(false);

  const [checkedSound, setCheckedSound] = useState(true);
  const [checkedBackground, setCheckedBackground] = useState(true);
  const [checkedTimer, setCheckedTimer] = useState(true);
  const [checkedRandomQuestion, setCheckedRandomQuestion] = useState(true);
  const [checkedRandomOption, setCheckedRandomOption] = useState(true);
  const [checkedReviewOption, setCheckedReviewOption] = useState(true);
  const [audio, setAudio] = useRecoilState(audioStateAtom);
  const [userName, setUserName] = useState(user);
  const [quizData, setQuizData] = useState({});
  const [questionData, setQuestionData] = useState([]);
  const [quizSetting, setQuizSetting] = useState([]);
  const [quizsound, setQuizsound] = useState([]);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [classId, setClassId] = useState(null);

  const nav = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("audioState");
    }
    const token = getCookie("isUserLoggedIn");
    setToken(token);
    const userId = getCookie("user_id");
    setUserId(userId);
    const classId = getCookie("class_user_id");
    setClassId(classId);
  }, []);

  const user_id = userId;
  // const token_id = token;
  const class_id = classId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = quizDetail;
        setQuizData(response.quiz_details);
        setQuestionData(response.quizQuestionData);
        setQuizSetting(response.quiz_setting);
        setQuizsound(response.Quiz_Sound);
        setLoading(false);
      } catch (error) {}
    };
    fetchData();
  }, []);

  const fetchQuizSound = (quiz_id) => {
    return async (dispatch) => {
      try {
        const quizSound = quizDetail.Quiz_Sound;
        dispatch(setQuizSound(quizSound));
      } catch (error) {}
    };
  };

  const createRoom = async () => {
    try {
      const user_name = userName;
      const is_enable_timer = checkedTimer ? 1 : 0;
      const is_random_question = checkedRandomQuestion ? 1 : 0;
      const is_random_option = checkedRandomOption ? 1 : 0;
      const joinHostApiData = {
        quiz_id,
        user_name,
        is_enable_timer,
        is_random_question,
        is_random_option,
      };
      const response = await fetch("/api/join_host_game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(joinHostApiData),
      });
      const res = await response.json();
      const roomData = {
        name: quizData.question_set_name,
        inviteCode: res.game_room_code,
        hostId: res.host_id,
        share_content: res.share_content,
        share_image: res.share_image,
        room_limit: res.room_limit,
        userName,
        user_id,
        quiz_id,
        class_id,
        // token_id,
        checkedSound,
        checkedBackground,
        checkedTimer,
        checkedRandomQuestion,
        checkedRandomOption,
        quizsound: quizsound,
      };
      dispatch(setRoomData(roomData));
      nav.push(`/join/room/roomlobby/${quiz_id}`);
    } catch (err) {}
  };
  const createDinoRoom = async () => {
    try {
      const user_name = userName;
      const is_enable_timer = checkedTimer ? 1 : 0;
      const is_random_question = checkedRandomQuestion ? 1 : 0;
      const is_random_option = checkedRandomOption ? 1 : 0;
      const joinHostApiData = {
        quiz_id,
        user_name,
        is_enable_timer,
        is_random_question,
        is_random_option,
      };
      const response = await fetch("/api/join_host_game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(joinHostApiData),
      });
      const res = await response.json();
      const roomData = {
        name: quizData.question_set_name,
        inviteCode: res.game_room_code,
        hostId: res.host_id,
        share_content: res.share_content,
        share_image: res.share_image,
        room_limit: res.room_limit,
        userName,
        user_id,
        quiz_id,
        class_id,
        // token_id,
        checkedSound,
        checkedBackground,
        checkedTimer,
        checkedRandomQuestion,
        checkedRandomOption,
        quizsound: quizsound,
      };
      dispatch(setRoomData(roomData));
      nav.push(`/join/room/roomlobbydino/${quiz_id}`);
    } catch (err) {}
  };
  const handleChangeSound = (nextChecked) => {
    setCheckedSound(nextChecked);
    const newQuizSetting = quizSetting.map((setting) => {
      if (setting.parameter_code === "SE") {
        setting.parameterValue = nextChecked ? 1 : 0;
        setQuizSetting(setting);
        setAudio({ ...audio, soundOn: nextChecked });
      }
      return setting;
    });
    setQuizSetting(newQuizSetting);
  };

  const handleChangeBackground = (nextChecked) => {
    setCheckedBackground(nextChecked);
    const newQuizSetting = quizSetting.map((setting) => {
      if (setting.parameter_code === "BS") {
        setting.parameterValue = nextChecked ? 1 : 0;
        setQuizSetting(setting);
        setAudio({ ...audio, backgroundSoundOn: nextChecked });
      }
      return setting;
    });
    setQuizSetting(newQuizSetting);
  };
  const handleTimer = (nextChecked) => {
    setCheckedTimer(nextChecked);
    const newQuizSetting = quizSetting.map((setting) => {
      if (setting.parameter_code === "TM") {
        setting.parameterValue = nextChecked ? 1 : 0;
        setQuizSetting(setting);
        setAudio({ ...audio, clock: nextChecked });
      }
      return setting;
    });
    setQuizSetting(newQuizSetting);
  };
  const handleRandomQuestion = (nextChecked) => {
    setCheckedRandomQuestion(nextChecked);
    const newQuizSetting = quizSetting.map((setting) => {
      if (setting.parameter_code === "RQ") {
        setting.parameterValue = nextChecked ? 1 : 0;
        setQuizSetting(setting);
      }
      return setting;
    });
    setQuizSetting(newQuizSetting);
  };
  const handleRandomOption = (nextChecked) => {
    setCheckedRandomOption(nextChecked);
    const newQuizSetting = quizSetting.map((setting) => {
      if (setting.parameter_code === "RO") {
        setting.parameterValue = nextChecked ? 1 : 0;
        setQuizSetting(setting);
      }
      return setting;
    });
    setQuizSetting(newQuizSetting);
  };
  const handleReviewOption = (nextChecked) => {
    setCheckedReviewOption(nextChecked);
    const newQuizSetting = quizSetting.map((setting) => {
      if (setting.parameter_code === "RW") {
        setting.parameterValue = nextChecked ? 1 : 0;
        setQuizSetting(setting);
      }
      return setting;
    });
    setQuizSetting(newQuizSetting);
  };
  const openModal1 = () => {
    setRulesModal(true);
    setIsModalSingle(false);
  };

  const openRules = () => {
    setRulesModal(false);
    setIsModalOpen1(true);
  };
  const closeModal1 = () => {
    setIsModalOpen1(false);
  };
  const openModalMultiDino = () => {
    setRulesModalMulti(true);
    setIsModalMulti(false);
  };

  const openMultiRules = () => {
    setRulesModalMulti(false);
    setIsModalMultiDino(true);
  };
  const closeModalMultiDino = () => {
    setIsModalMultiDino(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
    setIsModalSingle(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModalSingle = () => {
    const currentURL = params.quiz_id;
    const redirectURL = currentURL.join("/");
    if (token) {
      setIsModalSingle(true);
    } else {
      nav.push(`/login?redirect=${redirectURL}`);
    }
  };

  const closeModalSingle = () => {
    setIsModalSingle(false);
  };
  const closeModalRules = () => {
    setRulesModal(false);
  };
  const closeModalRulesMulti = () => {
    setRulesModalMulti(false);
  };
  const openModalMulti = () => {
    const currentURL = params.quiz_id;
    const redirectURL = currentURL.join("/");
    if (token) {
      setIsModalMulti(true);
    } else {
      nav.push(`/login?redirect=${redirectURL}`);
    }
  };

  const closeModalMulti = () => {
    setIsModalMulti(false);
  };

  const openModal2 = () => {
    setIsModalOpen2(true);
    setIsModalMulti(false);
  };

  const closeModal2 = () => {
    setIsModalOpen2(false);
  };

  const handleStartTimer = (quiz_id) => {
    dispatch(fetchQuizSound(quiz_id));
    nav.push(`/join/quiz/timer/${quiz_id}`);
  };
  const handleStartTimerDino = (quizze_id) => {
    dispatch(fetchQuizSound(quizze_id));
    nav.push(`/join/quiz/timerdino/${quizze_id}`);
  };
  const handleResult = (quiz_id) => {
    if (token) {
      dispatch(fetchQuizSound(quiz_id));
      nav.push(`/join/quiz/result/${quiz_id}`);
    } else {
      nav.push("/login");
    }
  };
  const handleRoom = (userName) => {
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
      createRoom();
    }
  };

  const handleRoomDino = (userName) => {
    if (userName.trim() == "") {
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
      createDinoRoom();
    }
  };
  return (
    <>
      {loading ? (
        <DNALoader />
      ) : (
        <>
          <Rules isOpen={rulesModal} onClose={closeModalRules}>
            <h2 className="text-xl font-bold mb-8 font-[Montserrat] dark:text-white ">
              Dino Mode Rules:
            </h2>
            <ul>
              <li className="mb-2 text-[12px] font-[Montserrat] sm:text-base dark:text-white">
                <span className="font-semibold font-[Montserrat]">
                  Correct Answers:
                </span>{" "}
                Each correct answer slows down the dino&apos;s speed and
                increases the coin speed. Knowledge mastery rewards you with
                control over the race.
              </li>
              <li className="mb-2 text-[12px] font-[Montserrat] sm:text-base dark:text-white">
                <span className="font-semibold font-[Montserrat]">
                  Incorrect Answers:
                </span>{" "}
                Mistakes accelerate the dino&apos;s pace, creating a thrilling
                challenge. Precision is key to maintaining control.
              </li>
              <li className="mb-2 text-[12px] font-[Montserrat] sm:text-base dark:text-white">
                <span className="font-semibold font-[Montserrat]">
                  Life Option:
                </span>{" "}
                Attain more than 10 coins to unlock a life option. This extra
                life provides a safety net, prolonging the game.
              </li>
              <li className="mb-2 text-[12px] font-[Montserrat] sm:text-base dark:text-white">
                <span className="font-semibold font-[Montserrat]">
                  Game Over:
                </span>{" "}
                If you fail to gather 10 coins or if the dino speed surpasses a
                critical point, it&apos;s game over. Strategic answering is your
                ticket to survival in the dino world!
              </li>
            </ul>
            <div className="flex w-full justify-center mt-[2.5rem]  ">
              <button
                aria-label="next"
                className="bg-cyan500 hover:bg-cyan600 text-white font-bold hover:text-white py-2 px-6 border border-cyan-500 hover:border-transparent rounded flex items-center justify-center w-full font-[Montserrat]"
                onClick={openRules}
              >
                Next
              </button>
            </div>
          </Rules>
          <RulesMulti isOpen={rulesModalMulti} onClose={closeModalRulesMulti}>
            <h2 className="text-xl font-bold font-[Montserrat] mb-8 dark:text-white ">
              Dino Mode Rules:
            </h2>
            <ul>
              <li className="mb-2 text-[12px] font-[Montserrat] sm:text-base dark:text-white">
                <span className="font-semibold font-[Montserrat]">
                  Correct Answers:
                </span>{" "}
                Each correct answer slows down the dino&apos;s speed and
                increases the coin speed. Knowledge mastery rewards you with
                control over the race.
              </li>
              <li className="mb-2 text-[12px] font-[Montserrat] sm:text-base dark:text-white">
                <span className="font-semibold font-[Montserrat]">
                  Incorrect Answers:
                </span>{" "}
                Mistakes accelerate the dino&apos;s pace, creating a thrilling
                challenge. Precision is key to maintaining control.
              </li>
              <li className="mb-2 text-[12px] font-[Montserrat] sm:text-base dark:text-white">
                <span className="font-semibold font-[Montserrat]">
                  Life Option:
                </span>{" "}
                Attain more than 10 coins to unlock a life option. This extra
                life provides a safety net, prolonging the game.
              </li>
              <li className="mb-2 text-[12px] font-[Montserrat] sm:text-base dark:text-white">
                <span className="font-semibold font-[Montserrat]">
                  Game Over:
                </span>{" "}
                If you fail to gather 10 coins or if the dino speed surpasses a
                critical point, it&apos;s game over. Strategic answering is your
                ticket to survival in the dino world!
              </li>
            </ul>
            <div className="flex w-full justify-center mt-[2.5rem]  ">
              <button
                aria-label="next"
                className="bg-cyan500 hover:bg-cyan600 text-white font-bold hover:text-white py-2 px-6 border border-cyan-500 hover:border-transparent rounded flex items-center justify-center w-full font-[Montserrat]"
                onClick={openMultiRules}
              >
                Next
              </button>
            </div>
          </RulesMulti>
          <SinglePlay isOpen={isModalSingle} onClose={closeModalSingle}>
            <div>
              <h1 className="font-black text-lg font-[Montserrat] dark:text-white">
                Choose Mode
              </h1>
              <div className=" flex w-full justify-center gap-3 items-center mt-5">
                <div className="">
                  <img
                    src="/images/normal.png"
                    alt="normalmode"
                    width="200px"
                    onClick={openModal}
                    className="rounded-lg cursor-pointer"
                  />
                  <h2 className="text-center font-[Montserrat] font-bold mt-1 cursor-pointer dark:text-white">
                    Normal Mode
                  </h2>
                </div>
                <div className="">
                  <img
                    src="/images/dinomode.png"
                    alt="dinomode"
                    width="200px"
                    onClick={openModal1}
                    className="rounded-lg cursor-pointer"
                  />
                  <h2 className="text-center font-[Montserrat] font-bold mt-1 cursor-pointer dark:text-white">
                    Dino Mode
                  </h2>
                </div>
              </div>
            </div>
          </SinglePlay>
          <MultiPlay isOpen={isModalMulti} onClose={closeModalMulti}>
            <div>
              <h1 className="font-black font-[Montserrat] text-lg dark:text-white">
                Choose Mode
              </h1>
              <div className=" flex w-full justify-center gap-3 items-center mt-5">
                <div className="">
                  <img
                    src="/images/normal.png"
                    alt="normalmode"
                    width="200px"
                    onClick={openModal2}
                    className="rounded-lg cursor-pointer"
                  />
                  <h2 className="text-center font-[Montserrat] font-bold mt-1 cursor-pointer dark:text-white">
                    Normal Mode
                  </h2>
                </div>
                <div className="">
                  <img
                    src="/images/dinomode.png"
                    alt="dinomode"
                    width="200px"
                    onClick={openModalMultiDino}
                    className="rounded-lg cursor-pointer"
                  />
                  <h2 className="text-center font-[Montserrat] font-bold mt-1 cursor-pointer dark:text-white">
                    Dino Mode
                  </h2>
                </div>
              </div>
            </div>
          </MultiPlay>
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <h2 className="text-xl font-[Montserrat] font-bold mb-2 dark:text-white">
              Game Settings
            </h2>
            {quizSetting.map((setting, index) => (
              <div key={index}>
                {setting.parameter_code === "SE" && (
                  <div className="mt-6 flex justify-between">
                    <span className="text-black font-[Montserrat] font-semibold dark:text-white">
                      Sound Effects
                    </span>
                    <span className="mr-3">
                      <ReactSwitch
                        onChange={handleChangeSound}
                        checked={setting.parameterValue === 1 ? true : false}
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
                        checked={setting.parameterValue === 1 ? true : false}
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
            <div className="flex w-full justify-center mt-[2.5rem]  ">
              <button
                aria-label="continue"
                className="bg-cyan500 hover:bg-cyan600 text-white font-bold hover:text-white py-2 px-6 border border-cyan-500 hover:border-transparent rounded flex items-center justify-center w-full font-[Montserrat]"
                onClick={() => handleStartTimer(quiz_id)}
              >
                Continue
              </button>
            </div>
          </Modal>
          <ModalDino isOpen={isModalOpen1} onClose={closeModal1}>
            <h2 className="text-xl font-[Montserrat] font-bold mb-2 dark:text-white">
              Game Settings Dino
            </h2>
            {quizSetting.map((setting, index) => (
              <div key={index}>
                {setting.parameter_code === "SE" && (
                  <div className="mt-6 flex justify-between">
                    <span className="text-black font-[Montserrat] font-semibold dark:text-white">
                      Sound Effects
                    </span>
                    <span className="mr-3">
                      <ReactSwitch
                        onChange={handleChangeSound}
                        checked={setting.parameterValue === 1 ? true : false}
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
                        checked={setting.parameterValue === 1 ? true : false}
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
            <div className="flex w-full justify-center mt-[2.5rem]  ">
              <button
                aria-label="continue"
                className="bg-cyan500 hover:bg-cyan600 text-white font-bold hover:text-white py-2 px-6 border border-cyan-500 hover:border-transparent rounded flex items-center justify-center w-full font-[Montserrat]"
                onClick={() => handleStartTimerDino(quizData.quizze_id)}
              >
                Continue
              </button>
            </div>
          </ModalDino>
          <ModalMultiDino
            isOpen={isModalMultiDino}
            onClose={closeModalMultiDino}
          >
            <h2 className="text-lg font-[Montserrat] font-bold mb-2 text-center dark:text-white">
              Play With Friends Dino
            </h2>
            <div>
              <input
                className="font-semibold block bg-white border border-cyan-300 rounded-md py-5 px-3 mb-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm h-[40px] font-[Montserrat]  mt-[2rem] w-full"
                placeholder="Enter Name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <button
                aria-label="continue"
                className="bg-cyan500 hover:bg-cyan600 text-white font-bold hover:text-white py-2 px-6 border border-cyan-500 hover:border-transparent rounded flex items-center justify-center w-full font-[Montserrat]"
                onClick={() => handleRoomDino(userName)}
              >
                Continue
              </button>
            </div>
            <h2 className="text-xl font-bold mb-1 font-[Montserrat] text-center mt-[2rem] dark:text-white">
              Game Settings
            </h2>
            {quizSetting.map((setting, index) => (
              <div key={index}>
                {setting.parameter_code === "SE" && (
                  <div className="mt-6 flex justify-between">
                    <span className="text-black font-[Montserrat] font-semibold dark:text-white">
                      Sound Effects
                    </span>
                    <span className="mr-3">
                      <ReactSwitch
                        onChange={handleChangeSound}
                        checked={setting.parameterValue === 1 ? true : false}
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
                        checked={setting.parameterValue === 1 ? true : false}
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
                {setting.parameter_code === "TM" && (
                  <div className="mt-2 flex justify-between">
                    <span className="text-black font-[Montserrat] font-semibold dark:text-white">
                      Timer
                    </span>
                    <span className="mr-3">
                      <ReactSwitch
                        onChange={handleTimer}
                        checked={setting.parameterValue === 1 ? true : false}
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
                {setting.parameter_code === "RQ" && (
                  <div className="mt-2 flex justify-between">
                    <span className="text-black font-[Montserrat] font-semibold dark:text-white">
                      Randomize Questions
                    </span>
                    <span className="mr-3">
                      <ReactSwitch
                        onChange={handleRandomQuestion}
                        checked={setting.parameterValue === 1 ? true : false}
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
                {setting.parameter_code === "RO" && (
                  <div className="mt-2 flex justify-between">
                    <span className="text-black font-[Montserrat] font-semibold dark:text-white">
                      Randomize Options
                    </span>
                    <span className="mr-3">
                      <ReactSwitch
                        onChange={handleRandomOption}
                        checked={setting.parameterValue === 1 ? true : false}
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
                {setting.parameter_code === "RW" && (
                  <div className="mt-2 flex justify-between">
                    <span className="text-black font-[Montserrat] font-semibold dark:text-white">
                      Review Questions
                    </span>
                    <span className="mr-3">
                      <ReactSwitch
                        onChange={handleReviewOption}
                        checked={setting.parameterValue === 1 ? true : false}
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
          </ModalMultiDino>
          <Modal2 isOpen={isModalOpen2} onClose={closeModal2}>
            <h2 className="text-lg font-bold font-[Montserrat] mb-2 text-center dark:text-white">
              Play With Friends
            </h2>
            <div>
              <input
                className=" font-[Montserrat]  font-semibold block bg-white border border-cyan-300 rounded-md py-5 px-3 mb-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 md:text-sm h-[40px] mt-[2rem] w-full"
                placeholder="Enter Name"
                type="text"
                name="code"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <button
                aria-label="continue"
                className="bg-cyan500 hover:bg-cyan600  text-white font-bold hover:text-white py-2 px-6 border border-cyan-500 hover:border-transparent rounded flex items-center justify-center w-full font-[Montserrat]"
                onClick={() => handleRoom(userName)}
              >
                Continue
              </button>
            </div>
            <h2 className="text-xl font-[Montserrat] font-bold mb-1 text-center mt-[2rem] dark:text-white">
              Game Settings
            </h2>
            {quizSetting.map((setting, index) => (
              <div key={index}>
                {setting.parameter_code === "SE" && (
                  <div className="mt-6 flex justify-between">
                    <span className="text-black font-semibold font-[Montserrat] dark:text-white">
                      Sound Effects
                    </span>
                    <span className="mr-3">
                      <ReactSwitch
                        onChange={handleChangeSound}
                        checked={setting.parameterValue === 1 ? true : false}
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
                        checked={setting.parameterValue === 1 ? true : false}
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
                {setting.parameter_code === "TM" && (
                  <div className="mt-2 flex justify-between">
                    <span className="text-black font-[Montserrat] font-semibold dark:text-white">
                      Timer
                    </span>
                    <span className="mr-3">
                      <ReactSwitch
                        onChange={handleTimer}
                        checked={setting.parameterValue === 1 ? true : false}
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
                {setting.parameter_code === "RQ" && (
                  <div className="mt-2 flex justify-between">
                    <span className="text-black font-[Montserrat] font-semibold dark:text-white">
                      Randomize Questions
                    </span>
                    <span className="mr-3">
                      <ReactSwitch
                        onChange={handleRandomQuestion}
                        checked={setting.parameterValue === 1 ? true : false}
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
                {setting.parameter_code === "RO" && (
                  <div className="mt-2 flex justify-between">
                    <span className="text-black font-[Montserrat] font-semibold dark:text-white">
                      Randomize Options
                    </span>
                    <span className="mr-3">
                      <ReactSwitch
                        onChange={handleRandomOption}
                        checked={setting.parameterValue === 1 ? true : false}
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
                {setting.parameter_code === "RW" && (
                  <div className="mt-2 flex justify-between">
                    <span className="text-black font-[Montserrat] font-semibold dark:text-white">
                      Review Questions
                    </span>
                    <span className="mr-3">
                      <ReactSwitch
                        onChange={handleReviewOption}
                        checked={setting.parameterValue === 1 ? true : false}
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
          </Modal2>
          <Navbar
            startColor="text-white"
            startbg="#100424"
            classListData={classListData}
          />
          <div
            className="pt-[72px] min-h-screen pb-[5rem] sm:pb-5 flex flex-col justify-start items-center relative bg-cover bg-no-repeat"
            style={{
              backgroundColor: "#100422",
            }}
          >
            <img
              src="/images/quiz.png"
              alt="quiz"
              className="h-[18vh] sm:h-[30vh] pt-4 sm:px-6 relative z-10"
            />
            <h1 className="text-center px-1 text-2xl font-[Montserrat] sm:text-3xl mt-[20px] sm:mt-8 text-white relative z-10">
              {quizData.question_set_name}
            </h1>
            <p className="text-center px-1 font-[Montserrat] mt-[10px] sm:mt-5 text-white relative z-10">
              Answer these simple questions correctly and earn coins
            </p>
            <div className="text-center  mt-[10px] sm:mt-5 text-white font-[Montserrat] relative z-10">
              <span className="text-[16px] sm:text-lg font-[Montserrat]">
                Difficulty Level :{" "}
              </span>
              <span>
                <button
                  aria-label="difficulty level"
                  className={`font-semibold text-[15px] font-[Montserrat] sm:text-lg py-1 px-2  rounded ml-2 relative z-10 ${
                    quizData.difficulty_level == "Easy"
                      ? "bg-[#D0F2E4] text-[#00a86b]"
                      : quizData.difficulty_level == "Medium"
                      ? "bg-[#fff2de] text-[#fa7f48]"
                      : quizData.difficulty_level == "Hard"
                      ? "bg-[#ffd4db] text-[#ff0000]"
                      : ""
                  }`}
                >
                  {quizData.difficulty_level}
                </button>
              </span>
            </div>
            <div className="flex justify-center items-center gap-2  my-4  relative z-10">
              <span>
                <AiFillQuestionCircle className="text-yellow400 h-7 w-6" />
              </span>
              <span className="text-white text-[20px] font-[Montserrat]">
                {quizData.total_questions} Questions
              </span>
            </div>
            <div className="flex flex-col gap-5   w-full ">
              <div className="w-[100%] flex justify-center text-[17px] items-center relative z-10">
                <button
                  aria-label="play again"
                  className="bg-cyan600 hover:bg-cyan700 text-white font-semibold hover:text-white py-2 sm:py-2 px-6 border-cyan-500 hover:border-transparent 
                  rounded-[50px] border-[3px]  flex items-center justify-center w-[70%] sm:w-[43%] font-[Montserrat] lg:w-[17%] "
                  onClick={openModalSingle}
                >
                  {quizData.submit_status > 0 ? (
                    <>
                      Play again
                      <span className="ml-2">
                        <MdRefresh className="h-7" />
                      </span>
                    </>
                  ) : (
                    "Play"
                  )}
                </button>
              </div>
              <div className="w-[100%] flex justify-center text-[17px] items-center relative z-10">
                <button
                  aria-label="play with friends"
                  className="bg-[#d15173] hover:[#ec4f79] text-white font-semibold hover:text-white py-2 px-4 border-[#ec4f79] hover:border-transparent rounded-[50px] 
                  border-[3px]  flex items-center justify-center w-[70%] sm:w-[43%] font-[Montserrat] lg:w-[17%] "
                  onClick={openModalMulti}
                >
                  Play with Friends
                  <span className="ml-2">
                    <BiUserPlus className="h-7" />
                  </span>
                </button>
              </div>
              {quizData.submit_status > 0 && (
                <div className="w-[100%] flex justify-center text-[17px] items-center relative z-10">
                  <button
                    aria-label="see result"
                    className=" text-white font-semibold hover:text-white py-2 px-4 border-cyan600 rounded-[50px] border-[3px]  flex items-center justify-center w-[70%] 
                    sm:w-[43%] lg:w-[17%] font-[Montserrat]"
                    onClick={() => handleResult(quiz_id)}
                  >
                    See Result
                    <span className="ml-2">
                      <BsArrowRightCircle className="h-7" />
                    </span>
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-center w-full items-center  my-[2rem] flex-col gap-3 text-[#e5e7eb] opacity-[.66]">
              <div className="border-2 border-dashed w-fit border-[#fef08a] rounded-[8px] p-3 mx-2 flex justify-center  items-center flex-col gap-3">
                <h2 className="text center cursor-pointer">Related Questions</h2>
                <div className="w-[90%] ml-5 sm:ml-0 flex justify-left  items-left flex-col select-none">
                  <ol type="number" className="list-decimal cursor-pointer">
                    {questionData.slice(0, 5).map((question, index) => (
                      <li  key={index}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              question.question_name.replace(
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
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <Footer show="hidden sm:block" />
          <Navigation />
        </>
      )}
    </>
  );
};

export default Description;
