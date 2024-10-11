import React from "react";
import Setting from "./Setting";
import { cookies } from "next/headers";

const page = () => {
  const cookieStore = cookies();
  const userName = cookieStore.get("user")?.value;
  return (
    <div>
      <Setting userName={userName} />
    </div>
  );
};

export default page;
