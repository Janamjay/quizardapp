import React from 'react'
import Reports from "./Reports"
import { cookies } from "next/headers";
const page = () => {
  const cookieStore = cookies();
  const userName = cookieStore.get("user")?.value;
  return (
    <div>
      <Reports userName={userName}/>
    </div>
  )
}

export default page