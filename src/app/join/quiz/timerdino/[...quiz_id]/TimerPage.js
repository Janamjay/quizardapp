/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";
import { useEffect, useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { Howl } from "howler";
import { audioStateAtom } from "@/atom/audioState";
import back from "/public/images/timerpage.png";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { selectQuizSound } from "@/redux/audioSlice";
import { quizPlay } from "@/app/api/service";
import { useDispatch } from "react-redux";
import { setQuizData } from "@/redux/timerSlice";

const TimerPage = () => {
  const params = useParams();
  const quiz_id = params.quiz_id[0];
  const dispatch = useDispatch();
  const quizSound = useSelector(selectQuizSound);
  const nav = useRouter();
  const [ready, setReady] = useState(true);
  const [seconds, setSeconds] = useState(3);
  const audioState = useRecoilValue(audioStateAtom);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await quizPlay({ quiz_id });
        dispatch(setQuizData(response.data.start_quiz));
      } catch (error) {}
    };

    fetchData();
  }, [dispatch]);
  const timerAudio = useRef(
    new Howl({
      src: [quizSound.length >= 5 && quizSound[4].soundFile],
      volume: audioState.soundOn ? 1.0 : 0,
      loop: false,
    })
  );
  const GoAudio = useRef(
    new Howl({
      src: [quizSound.length >= 5 && quizSound[5].soundFile],
      volume: audioState.soundOn ? 1.0 : 0,
      loop: false,
    })
  );

  useEffect(() => {
    if (ready) {
      setTimeout(() => {
        setReady(false);
        timerAudio.current.play();
      }, 1000);
    } else if (seconds === 0) {
      GoAudio.current.play();
      const timeout = setTimeout(() => {
        nav.push(`/join/gamedino/${quiz_id}`);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    } else if (seconds > 0) {
      timerAudio.current.play();

      const timeout = setTimeout(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => {
        clearTimeout(timeout);
        timerAudio.current.pause();
        GoAudio.current.pause();
      };
    } else {
      timerAudio.current.pause();
    }
  }, [ready, seconds, audioState.soundOn]);

  return (
    <>
      <div
        className="flex justify-center font-Montserrat select-none items-center flex-col h-screen bg-cover bg-no-repeat"
        style={{
          backgroundColor: "#1B363E",
        }}
      >
        {ready ? (
          <div className="animate__animated animate__zoomIn z-10">
            <h1 className="text-7xl sm:text-[5rem] font-bold text-[#4ade80] font-[Montserrat]">
              Ready
            </h1>
          </div>
        ) : (
          <>
            {seconds > 0 && (
              <div className="z-10">
                <h1 className="text-4xl sm:text-6xl py-8 font-bold font-[Montserrat] text-white">
                  Quiz Starts in
                </h1>
                <h1 className="text-4xl sm:text-6xl text-center font-bold font-[Montserrat] text-[#4ade80]">
                  {seconds}
                </h1>
              </div>
            )}
            {seconds === 0 && (
              <div className="animate__animated animate__zoomIn z-10">
                <h1 className="text-7xl sm:text-[7rem] text-[#4ade80] font-bold font-[Montserrat]">
                  Go!
                </h1>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TimerPage;
