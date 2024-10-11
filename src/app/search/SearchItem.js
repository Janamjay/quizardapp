"use client";
import { useState } from "react";
import Navbar from "../components/navbar/Navbar";
import { useRouter } from "next/navigation";
import { RecoilRoot } from "recoil";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import ProviderStore from "@/redux/ProviderStore";

const posts = [
  {
    id: 1,
    title: "Trending 1 ",
    images:
      "/images/ScienceQuiz.png",
  },
  {
    id: 2,
    title: "Trending 2",
    images:
      "/images/ScienceQuiz.png",
  },
  {
    id: 3,
    title: "Trending 3",
    images:
      "/images/ScienceQuiz.png",
  },
  {
    id: 4,
    title: "Trending 4",
    images:
      "/images/ScienceQuiz.png",
  },
  {
    id: 5,
    title: "Trending 5",
    images:
      "/images/ScienceQuiz.png",
  },
  {
    id: 6,
    title: "Trending 6",
    images:
      "/images/ScienceQuiz.png",
  },
  {
    id: 7,
    title: "Trending 7",
    images:
      "/images/ScienceQuiz.png",
  },
  {
    id: 8,
    title: "Trending 8",
    images:
      "/images/ScienceQuiz.png",
  },
  {
    id: 9,
    title: "Trending 9",
    images:
      "/images/ScienceQuiz.png",
  },
  {
    id: 10,
    title: "Trending 10",
    images:
      "/images/ScienceQuiz.png",
  },
  {
    id: 11,
    title: "Trending 11",
    images:
      "/images/ScienceQuiz.png",
  },
  {
    id: 12,
    title: "Trending 12",
    images:
      "/images/ScienceQuiz.png",
  },
  {
    id: 13,
    title: "Trending 13",
    images:
      "/images/ScienceQuiz.png",
  },
];
const SearchItem = ({ classListData }) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const [searchedQuery, setSearchedQuery] = useState(searchQuery || "");
  const nav = useRouter();

  const filteredPosts = posts.filter(
    (post) =>
      searchQuery &&
      post.title.toLowerCase().includes(searchedQuery.toLowerCase())
  );
  const handledescription = () => {
    nav.push("/description");
  };
  return (
    <ProviderStore>
      <RecoilRoot>
        <div>
          <Navbar
            startColor="text-cyan500"
            startbg="white"
            borderBottom={true}
            searchQuery={searchedQuery}
            setSearchQuery={setSearchedQuery}
            classListData={classListData}
          />
          <div className="w-full min-h-screen pt-[72px] bg-white dark:bg-grey800">
            <h1 className="pt-[2rem] xxl:pt-[3rem] mb-4 text-xl pl-[23px] md:text-3xl md:pl-[43px] xxl:pl-[88px] font-semibold text-transparent bg-clip-text bg-black dark:bg-white">
              Searched Item
            </h1>
            <div className="flex justify-center items-center pr-2 md:px-4 pb-[4rem]">
              <div className="flex flex-wrap justify-center gap-5 ">
                {searchQuery ? (
                  filteredPosts.length > 0 ? (
                    filteredPosts.map((item, key) => (
                      <div
                        key={key}
                        className="flex-shrink-0 cursor-pointer"
                        onClick={handledescription}
                      >
                        <div className="bg-white rounded-lg shadow-md relative ">
                          <div className="overflow-hidden rounded-t-lg">
                            <Image
                              width={400}
                              height={600}
                              className="w-full h-24 sm:h-32 md:h-36 lg:h-40 xl:h-44 object-cover hover:scale-105 transition duration-500"
                              src={item.images}
                              alt="trending"
                            />
                          </div>
                          <div className="absolute bottom-[24%] sm:bottom-[16%] left-0 right-0 flex justify-between p-2 text-white">
                            <button
                              aria-label="total question"
                              className="flex items-center text-[8px] sm:text-[14px] bg-black p-[4px] rounded-[3px] xs:rounded-md"
                            >
                              <span>15 Qs</span>
                            </button>
                            <button
                              aria-label="total play"
                              className="flex items-center text-[8px] sm:text-[14px] bg-black p-[4px] rounded-[3px]  xs:rounded-md"
                            >
                              <span>1.2k plays</span>
                            </button>
                          </div>
                          <div className="max-w-[282px] px-3 py-1 truncate">
                            <h4 className="truncate text-lg font-semibold text-center text-black">
                              {item.title}
                            </h4>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-black dark:text-white">
                      No results found for {searchQuery}
                    </p>
                  )
                ) : (
                  <div>
                    <p className="text-black dark:text-white">
                      Search any Quiz topic
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </RecoilRoot>
    </ProviderStore>
  );
};

export default SearchItem;
