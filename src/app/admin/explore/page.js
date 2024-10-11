import React from "react";
import Root from "./Root";
import { cookies } from "next/headers";
import { dashBoardQuizTest } from "@/app/api/service.js";

const page = async () => {
  const cookieStore = cookies();
  const userName = cookieStore.get("user")?.value;
  const dashboardData = await dashBoardQuizTest();
  return (
    <div>
      <Root userName={userName} dashboardData={dashboardData} />
    </div>
  );
};

export default page;
