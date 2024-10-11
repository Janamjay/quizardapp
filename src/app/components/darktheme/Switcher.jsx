"use client";
import { useState } from "react";
import DarkModeToggle from "react-dark-mode-toggle";
import useDarkSide from "./useDarkSide";

export default function Switcher(color) {
  const [colorTheme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );

  const toggleDarkMode = (checked) => {
    setTheme(colorTheme);
    setDarkSide(checked);
  };

  const error = console.error;
  console.error = (...args) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };
  return (
    <div className="flex justify-center items-center">
      <DarkModeToggle onChange={toggleDarkMode} checked={darkSide} size={40} />
    </div>
  );
}
