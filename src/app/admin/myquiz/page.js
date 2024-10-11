import React from "react";
import MyQuiz from "./MyQuiz";
import { cookies } from "next/headers";

const page = () => {
  const cookieStore = cookies();
  const userName = cookieStore.get("user")?.value;
  return (
    <div>
      <MyQuiz userName={userName}/>
    </div>
  );
};

export default page;
