"use client"

import { Oval } from "react-loader-spinner";

const OvalLoader = () => {
  return (
    <div>
      <Oval
        height={40}
        width={40}
        color="#fff"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#242624"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};

export default OvalLoader;
