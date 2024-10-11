import React from "react";
import Root from "./Root";
import { cookies } from "next/headers";

const page = async () => {
  const cookieStore = cookies();
  const userName = cookieStore.get("user")?.value;
  return (
    <div>
      <Root userName={userName} />
    </div>
  );
};

export default page;