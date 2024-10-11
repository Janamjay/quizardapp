import React, { useState } from "react";
import Swal from "sweetalert2";
import { getCookie } from "cookies-next";
import { userProfile } from "@/app/api/service";
import {
  Input,
  Button,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";
import Navigation from "../components/navigationBar/Navigation";

const FormContact = ({ userProfileData }) => {
  const user = getCookie("user");
  const apiEmail = userProfileData?.user_details?.email;
  const [name, setName] = useState(user || "");
  const [email, setEmail] = useState(apiEmail || "");
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = useState("");

  const handleContact = async (e) => {
    e.preventDefault();
    if (!name || !email || !selectedOption || !message) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: "Please fill out all fields.",
      });
      return;
    }
    if (!isValidEmail(email)) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: "Please enter a valid email address.",
      });
      return;
    }
    try {
      const data = {
        name: name,
        email: email,
        subject: selectedOption,
        message: message,
      };

      const response = await fetch("/api/user_enquiry_form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      const res = await response.json();
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        title: res.message,
      });

      setSelectedOption("");
      setMessage("");
    } catch (error) {}
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  return (
    <>
      <form onSubmit={handleContact}>
        <div className="flex flex-col font-[Montserrat] gap-5">
          <Input
            color="teal"
            label="Name"
            type="text"
            name="name"
            id="name"
            autoComplete="off"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Input
            color="teal"
            label="Email"
            type="email"
            name="email"
            id="email"
            autoComplete="off"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Select
            color="teal"
            label="Select Topic"
            value={selectedOption}
            onChange={(value) => {
              setSelectedOption(value);
            }}
          >
            <Option value="Suggestion font-[Montserrat]">Suggestion</Option>
            <Option value="Technical Query font-[Montserrat]">
              Technical Query
            </Option>
            <Option value="Report Bug font-[Montserrat]">Report Bug</Option>
          </Select>

          <Textarea
            color="teal"
            label="Message"
            type="textarea"
            name="message"
            id="message"
            autoComplete="off"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
        </div>
        <button
          aria-label="send message"
          type="submit"
          className="text-white bg-gradient-to-r from-teal400 via-teal500 to-teal600 hover:bg-gradient-to-br 
            shadow-lg shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-bold rounded-lg text-sm px-5 py-2.5 text-center w-full sm:w-[50%]  my-5 font-[Montserrat]"
        >
          Send Message
        </button>
      </form>
      <Navigation />
    </>
  );
};

export default FormContact;
