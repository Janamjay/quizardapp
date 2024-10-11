"use client";
import { useState, useEffect } from "react";
import { RxCopy } from "react-icons/rx";
import { BsShare } from "react-icons/bs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ShareModal from "../components/modal/ShareModal";
import Term from "../components/modal/Term";
import Navbar from "../components/navbar/Navbar";
import coin from "../../../public/images/coin.png";
import team from "../../../public/images/team.png";
import refer2 from "../../../public/images/refer2.png";
import refer3 from "../../../public/images/refer3.png";
import one from "../../../public/images/1.png";
import two from "../../../public/images/2.png";
import three from "../../../public/images/3.png";
import piggy from "../../../public/images/piggy.gif";
import { IoArrowRedo } from "react-icons/io5";
import Navigation from "../components/navigationBar/Navigation";
import Image from "next/image";
import { RecoilRoot } from "recoil";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import ProviderStore from "@/redux/ProviderStore";

const Refer = ({ classListData}) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@dotlottie/player-component");
    }
  }, []);

  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalTermOpen, setIsModalTermOpen] = useState(false);
  const [random, setRandom] = useState("");

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModalShare = () => {
    setIsModalOpen(true);
  };
  const closeModalTerm = () => {
    setIsModalTermOpen(false);
  };
  const openModalTerm = () => {
    setIsModalTermOpen(true);
  };

  useEffect(() => {
    setRandom(getCookie("refferal"));
  }, []);
  return (
    <ProviderStore>
      <RecoilRoot>
        <div>
          <div className="bg-cyan500 dark:bg-cyan700 max-h-[9.7vh] min-h-[9.7vh]">
            <Navbar classListData={classListData} />
          </div>
          <div className="flex justify-center pt-1 md:p-0 md:py-[2rem] bg-white dark:bg-lighterBlack">
            <div className="w-[98%]  md:w-[40%]  rounded-xl">
              <div className="pb-[10rem] sm:pb-[7rem]">
                <h1 className="text-xl text-center md:text-4xl font-[Montserrat] font-bold text-black dark:text-white relative z-10">
                  Refer & Earn
                </h1>
                <div className="flex justify-center w-full">
                  {typeof window !== "undefined" && (
                    <dotlottie-player
                      src="/animations/7o2DFiDcgL.json"
                      background="transparent"
                      speed="1"
                      style={{ width: "200px", height: "200px" }}
                      direction="1"
                      mode="normal"
                      loop
                      autoplay
                    ></dotlottie-player>
                  )}
                </div>
                <h1 className="text-lg text-center font-[Montserrat] md:text-md  text-black dark:text-white">
                  Refer a friend
                </h1>
                <h1 className="text-[16px] font-[Montserrat] pt-2 font-bold text-center md:text-[16px]  text-black dark:text-white">
                  Refferal Code
                </h1>
                <div className="flex justify-center items-center pt-1  text-black dark:text-white">
                  <div
                    className="w-[56%] sm:w-[28%] md:w-[34%] lg:w-[33%] flex items-center py-[0.3rem] px-[10px] border-dashed border-2 
              border-black dark:border-white rounded-lg relative "
                  >
                    <span className="flex-grow text-center font-[Montserrat] text-xl font-black">
                      {random}
                    </span>
                    <CopyToClipboard text={random} onCopy={onCopyText}>
                      <button
                        aria-label="copy icon"
                        className="absolute right-[4px] top-1/2 transform -translate-y-1/2"
                      >
                        <RxCopy />
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>
                <h1
                  className={`copy-feedback text-black font-[Montserrat] dark:text-white text-center ${
                    isCopied ? "active" : ""
                  }`}
                >
                  Copied!
                </h1>
                <div>
                  <div className="flex justify-center items-center">
                    <button
                      aria-label="refferal point"
                      className="refferal rounded-[5px] flex justify-center items-center gap-1 p-2 font-bold text-lg font-[Montserrat]"
                    >
                      1 Refferal = 100
                      <span>
                        <Image src={coin} width={20} height={20} alt="" />
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex w-full gap-2 justify-center items-center">
                  <div className="flex justify-center items-center mt-5">
                    <button
                      aria-label="you earn"
                      className="refferal min-w-[50%]  rounded-[5px] flex justify-center flex-col items-center gap-1 py-2 px-[25px] font-bold text-lg font-[Montserrat]"
                    >
                      You Earn
                      <span className="flex justify-center items-center font-[Montserrat]">
                        <span>100</span>
                        <Image src={coin} width={20} height={20} alt="" />
                      </span>
                    </button>
                  </div>
                  <div className="flex justify-center items-center min-w-[20%] mt-5">
                    <button
                      aria-label="friend earn"
                      className="refferal rounded-[5px] flex justify-center flex-col items-center gap-1 p-2 font-bold text-lg font-[Montserrat]"
                    >
                      Friends Earn
                      <span className="flex justify-center font-[Montserrat] items-center ">
                        <span>100</span>
                        <Image src={coin} width={20} height={20} alt="" />
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex mt-[2rem] justify-center items-start gap-2 w-full text-black dark:text-white">
                  <div className="flex justify-center items-center flex-col w-[25%] relative">
                    <Image
                      src={team}
                      alt=""
                      className="w-[70%] sm:w-[50%] rounded-full p-[9px] border-[3px] border-red-500"
                    />
                    <Image
                      src={one}
                      alt=""
                      className="absolute top-[-5px] left-2 sm:left-[45px] lg:left-5 xl:left-9"
                      width={30}
                    />
                    <h1 className="mt-2 text-center font-[Montserrat]">
                      Invite your friends to sign up
                    </h1>
                  </div>
                  <div className="flex justify-center items-center flex-col w-[25%] relative">
                    <Image
                      src={refer2}
                      alt=""
                      width={50}
                      className="w-[70%] sm:w-[50%] rounded-full  border-[3px] border-red-500"
                    />
                    <Image
                      src={two}
                      alt=""
                      width={36}
                      className="absolute top-[-5px] left-2 sm:left-[45px] lg:left-5 xl:left-9"
                    />
                    <h1 className="mt-2 text-center font-[Montserrat]">
                      Your friends sign up
                    </h1>
                  </div>
                  <div className="flex justify-center items-center flex-col w-[25%] relative">
                    <Image
                      src={refer3}
                      width={50}
                      alt=""
                      className="w-[70%] sm:w-[50%] rounded-full p-[9px] border-[3px] border-red-500"
                    />
                    <Image
                      src={three}
                      alt=""
                      className="absolute top-[-5px] left-2 sm:left-[45px] lg:left-5 xl:left-9"
                      width={36}
                    />
                    <h1 className="mt-2 text-center font-[Montserrat]">
                      You and your friend get rewarded
                    </h1>
                  </div>
                </div>
                <div className="my-5">
                  <h1 className="text-center font-black font-[Montserrat] text-black dark:text-white">
                    How does it work ?
                  </h1>
                </div>
                <div className="pt-5 px-2 text-black dark:text-white">
                  <div className="flex justify-start items-center gap-5 mb-10">
                    <IoArrowRedo className="text-[30px] xl:text-[22px]" />
                    <p className="leading-5 font-[Montserrat]">
                      Invite your friends to join our app and get
                      <span className="font-black"> 100 coins </span> for each
                      friend that joins using your referral code.
                    </p>
                  </div>
                  <div className="flex justify-start items-center gap-5 mb-10">
                    <IoArrowRedo className="text-[18px]" />
                    <p className="leading-5 font-[Montserrat]">
                      Your friend will also get
                      <span className="font-black"> 100 coins</span> after
                      joining successfully.
                    </p>
                  </div>
                  <div className="flex justify-start items-center gap-5 mb-10">
                    <IoArrowRedo className="text-[15px] xl:text-[18px]" />
                    <p className="leading-5 font-[Montserrat]">
                      Coins can be used for buying subscriptions.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end px-2 text-black dark:text-white">
                  <h1
                    className="cursor-pointer font-[Montserrat]"
                    onClick={openModalTerm}
                  >
                    Terms & Conditions<sup>*</sup>
                  </h1>
                </div>
              </div>
              <div className="fixed bottom-[7%] sm:bottom-0 w-full left-0 right-0 bg-[#F7F7F7] dark:bg-lightBlack">
                <div className="flex justify-center items-center w-full   py-4 pb-0  ">
                  <button
                    aria-label="refer now"
                    className="flex justify-center mb-[16px] items-center w-[60%] sm:w-[30%] flex-row gap-3 font-[Montserrat] text-white
                 share_btn text-sm p-3  text-center rounded-[5px]"
                    onClick={openModalShare}
                  >
                    <span>
                      <BsShare />
                    </span>
                    <span>Refer Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ShareModal isOpen={isModalOpen} onClose={closeModal} />
          <Term isOpen={isModalTermOpen} onClose={closeModalTerm} />
          <Navigation />
        </div>
      </RecoilRoot>
    </ProviderStore>
  );
};
// export default Refer

export default dynamic(() => Promise.resolve(Refer), {
  ssr: false,
  noSsr: false,
});
