/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
"use client";
import { useEffect, useState } from "react";

const ProgressLine = ({
  backgroundColor = "rgb(76, 175, 80)",
  visualParts = [
    {
      percentage: "0%",
      color: "white",
    },
  ],
}) => {
  const [widths, setWidths] = useState(
    visualParts.map(() => {
      return 0;
    })
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      setWidths(
        visualParts.map((item) => {
          return item.percentage;
        })
      );
    });
  }, [visualParts]);

  return (
    <div className="fixed font-Montserrat top-[64px] left-0 right-0 z-[100]">
      <div
        className="flex h-[6px] mb-[20px]"
        style={{
          backgroundColor,
        }}
      >
        {visualParts.map((item, index) => {
          return (
            <div
              key={index}
              style={{
                width: widths[index],
                backgroundColor: item.color,
              }}
              className="progressVisualPart"
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProgressLine;
