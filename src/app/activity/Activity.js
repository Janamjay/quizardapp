/* eslint-disable @next/next/no-img-element */
"use client";
import Navbar from "../components/navbar/Navbar";
import activity from "../utils/activity";
import Navigation from "../components/navigationBar/Navigation";
import FooterSmall from "../components/footer/FooterSmall";
import dynamic from "next/dynamic";
import "animate.css";
import { useRouter } from "next/navigation";
import { RecoilRoot } from "recoil";
import ProviderStore from "@/redux/ProviderStore";

const Activity = ({classListData}) => {
  const nav = useRouter();
  const handleRowClick = (path) => {
    nav.push(path);
  };
  return (
    <ProviderStore>
      <RecoilRoot>
        <div>
          <div className=" bg-cyan500 dark:bg-cyan700 max-h-[9.7vh] min-h-[9.7vh] font-Montserrat">
            <Navbar classListData={classListData}/>
          </div>
          <div className="bg-white dark:bg-lighterBlack">
            <div className="flex justify-center items-center flex-col w-full pt-[2rem]">
              <img
                src="/images/act.png"
                alt=""
                className="w-[35%] lg:w-[12%]"
              />
              <h1 className="text-3xl font-[Montserrat] sm:text-4xl dark:text-white">
                Quiz Activity
              </h1>
            </div>
            <div className="flex flex-col justify-center items-center mt-[2rem]">
              <div className="w-[100%] md:w-[57%] ">
                <table className="w-full border-separate border-spacing-y-3 bg-[#bae6fd] dark:bg-dimBlack pt-6 px-6 rounded-t-[30px]">
                  <thead className=" rounded-lg bg-white dark:bg-lighterBlack  text-black dark:text-white font-black text-lg py-5 cursor-pointer">
                    <tr>
                      <th className="py-3 underline text-center font-Montserrat  rounded-tl-lg rounded-bl-lg">
                        Coins
                      </th>
                      <th className="py-3 underline text-center font-[Montserrat]">Details</th>
                      <th className="py-3 underline font-[Montserrat] text-center rounded-tr-lg w-full rounded-br-lg">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((activity, ind) => (
                      <tr
                        key={ind}
                        className={` rounded-lg font-Montserrat bg-white dark:bg-lighterBlack cursor-pointer animate__animated animate__zoomIn hover:scale-105 transition duration-500`}
                        onClick={() => handleRowClick(activity.path)}
                      >
                        <td className="text-black  dark:text-white text-center text-lg py-5  w-[20%] rounded-tl-lg rounded-bl-lg">
                          <span className="text-green-500 font-[Montserrat] text-xl font-black">
                            +
                          </span>
                          {activity.coins}
                        </td>
                        <td className=" text-black font-[Montserrat] dark:text-white text-center text-lg px-1 leading-5 w-[60%] sm:w-[65%]">
                          {activity.detail}
                        </td>
                        <td className=" text-black font-[Montserrat] dark:text-white text-center text-lg px-1  rounded-tr-lg w-full rounded-br-lg leading-5">
                          {activity.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <FooterSmall bgColor="bg-[#2e302d]" textColor="text-black" />
          <Navigation/>
        </div>
      </RecoilRoot>
    </ProviderStore>
  );
};

export default dynamic(() => Promise.resolve(Activity), { ssr: false });
