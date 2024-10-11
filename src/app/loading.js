"use client";
import { Dna } from "react-loader-spinner";

export default function DNALoader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Dna
        visible={true}
        height="100"
        width="100"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </div>
  );
}
