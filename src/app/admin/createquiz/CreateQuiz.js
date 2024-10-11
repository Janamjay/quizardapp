/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /Extra attributes/.test(args[0]) ||
    /Each child in a list/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};
const originalConsoleErrorQuill = console.error;

console.error = (...args) => {
  if (/document/.test(args[0])) {
    return;
  }
  originalConsoleError(...args);
};
const customTheme = {
  textColor: "black",
  mainColor: "#00B87B",
  backgroundColor: "#d6d3d1",
};
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CgProfile } from "react-icons/cg";
import { IoMdClose, IoIosSettings, IoIosArrowBack } from "react-icons/io";
import { IoPlay } from "react-icons/io5";
import { FaBars, FaPlus } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import { FaArrowLeft, FaSave, FaRegLightbulb } from "react-icons/fa";
import { PiSigmaThin, PiGraduationCapDuotone } from "react-icons/pi";
import { MdDelete, MdCrop, MdBook } from "react-icons/md";
import { RiDeleteBin6Line, RiText } from "react-icons/ri";
import { BsStars } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
import { BiSolidRightArrow, BiSolidLeftArrow, BiUser } from "react-icons/bi";
import { CiImageOn, CiMenuKebab, CiSearch, CiCirclePlus } from "react-icons/ci";
import {
  Input,
  Button,
  Select,
  Option,
  Typography,
  Radio,
} from "@material-tailwind/react";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import DOMPurify from "dompurify";
import katex from "katex";
import "katex/dist/katex.min.css";
import Detail from "@/app/components/modal/Detail";
import Quizlibrary from "@/app/components/modal/Quizlibrary";
import ImageUpload from "@/app/components/modal/ImageUpload";
import Keyboard from "@/app/components/modal/Keyboard";
import quizData from "@/app/utils/quizData";
import dummyQuestions from "@/app/utils/dummyquestions";
import MathInput from "react-math-keyboard";
if (typeof window !== "undefined") {
  window.katex = katex;
}
import ReactQuill, { Quill } from "react-quill";
import Delta from "quill-delta";
const Parchment = Quill.import("parchment");
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import { Tooltip } from "react-tooltip";
import { FileUploader } from "react-drag-drop-files";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import "./createquiz.css";
import { LeafPoll } from "react-leaf-polls";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";

const modules = {
  toolbar: [
    [
      { color: [] },
      "bold",
      "italic",
      "underline",
      "strike",
      "code-block",
      { script: "sub" },
      { script: "super" },
    ],
  ],
};
const fileTypes = ["JPEG", "JPG", "PNG"];

const CreateQuiz = ({ userName }) => {
  const nav = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [language, setLanguage] = useState("");
  const [quizVisibility, setQuizVisibility] = useState("");
  const [user, setUser] = useState("");
  const [selectedOption, setSelectedOption] = useState("Single Select");
  const [selectedDuration, setSelectedDuration] = useState("60 sec");
  const [selectedPoints, setSelectedPoints] = useState("4 Points");
  const [selectedLevel, setSelectedLevel] = useState("Easy");
  const [hasSelectedOption, setHasSelectedOption] = useState(false);
  const [hasSelectedDuration, setHasSelectedDuration] = useState(false);
  const [hasSelectedPoints, setHasSelectedPoints] = useState(false);
  const [hasSelectedLevel, setHasSelectedLevel] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    id: uuidv4(),
  });
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [quizLibraryModal, setQuizLibraryModal] = useState(false);
  const [explanationData, setExplanationData] = useState(true);
  const [openKeyboard, setOpenKeyboard] = useState(false);
  const [mathInputValue, setMathInputValue] = useState("");
  const [katexValue, setKatexValue] = useState(() => {
    return questions.map((q) => q.question || "");
  });
  const [currentEditorIndex, setCurrentEditorIndex] = useState("");
  const [cursorPositionIndex, setCursorPositionIndex] = useState("");
  const [isAnyRadioChecked, setIsAnyRadioChecked] = useState(false);
  const [showSelectItems, setShowSelectedItems] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState("");
  const [previewGuessWord, setPreviewGuessWord] = useState("");
  const [imageData, setImageData] = useState("image");
  const firstMathfieldRef = useRef();
  const quillRefs = useRef([]);
  const cropperRef = useRef(null);
  const currentEditorIndexRef = useRef(currentEditorIndex);
  const [latexCode, setLatexCode] = useState("");
  const [imageUpload, setImageUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [triggerCrop, setTriggerCrop] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [apiCurrentQuestion, setApiCurrentQuestion] = useState(0);
  const [chosenLetters, setChosenLetters] = useState([]);

  const [searchQuiz, setSearchQuiz] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleSearchQuizItems = ({ target }) => {
    setSearchQuiz(target.value);
  };
  let displayIndex = 0;

  const FormulaBlot = Quill.import("formats/formula");
  class CustomFormulaBlot extends FormulaBlot {
    static create(value) {
      const node = super.create(value);
      if (!node.hasAttribute("data-click-listener")) {
        node.setAttribute("data-click-listener", true);
        node.setAttribute("data-index", currentEditorIndexRef.current);
        node.classList.add("custom-formula-blot");
        node.style.padding = "10px";
        node.style.margin = "2px";
        node.addEventListener("click", function (e) {
          let blot = Quill.find(node);
          const latexCode = blot?.domNode?.getAttribute("data-value");
          const currentEditorIndex = blot?.domNode?.getAttribute("data-index");
          if (latexCode) {
            setOpenKeyboard(true);
            setMathInputValue(latexCode);
            setLatexCode(latexCode);
            setCurrentEditorIndex(currentEditorIndex);
          }
        });

        const wrapper = document.createElement("span");
        wrapper.setAttribute("data-latex", value.formula || "");
        wrapper.style.position = "relative";
        while (node.firstChild) {
          wrapper.appendChild(node.firstChild);
        }

        const deleteIcon = document.createElement("span");
        deleteIcon.innerHTML = "&#10006;";
        deleteIcon.style.position = "absolute";
        deleteIcon.style.top = "-20px";
        deleteIcon.style.right = "-17px";
        deleteIcon.style.cursor = "pointer";
        deleteIcon.style.fontSize = "17px";
        deleteIcon.style.padding = "2px";
        deleteIcon.style.visibility = "hidden";
        wrapper.addEventListener("mouseenter", () => {
          deleteIcon.style.visibility = "visible";
        });
        wrapper.addEventListener("mouseleave", () => {
          deleteIcon.style.visibility = "hidden";
        });

        deleteIcon.addEventListener("click", () => {
          const quill = Quill.find(node);
          const parentNode = node.parentNode;
          parentNode.removeChild(node);
        });
        wrapper.appendChild(deleteIcon);
        node.appendChild(wrapper);
      }
      return node;
    }
  }

  Quill.register("formats/formula", CustomFormulaBlot, true);

  useEffect(() => {
    if (!hasSelectedOption && questions[selectedQuestionIndex]) {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[selectedQuestionIndex].selectedType = selectedOption;
        setSelectedQuestionType(
          updatedQuestions[selectedQuestionIndex].selectedType
        );
        return updatedQuestions;
      });
    }

    if (!hasSelectedPoints && questions[selectedQuestionIndex]) {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[selectedQuestionIndex].selectPoint = selectedPoints;
        return updatedQuestions;
      });
    }

    if (!hasSelectedDuration && questions[selectedQuestionIndex]) {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[selectedQuestionIndex].duration = selectedDuration;
        return updatedQuestions;
      });
    }
    if (!hasSelectedLevel && questions[selectedQuestionIndex]) {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[selectedQuestionIndex].level = selectedLevel;
        return updatedQuestions;
      });
    }
  }, [
    selectedOption,
    selectedPoints,
    selectedDuration,
    selectedLevel,
    hasSelectedOption,
    hasSelectedPoints,
    hasSelectedDuration,
    hasSelectedLevel,
    selectedQuestionIndex,
  ]);

  useEffect(() => {
    if (openKeyboard) {
      firstMathfieldRef.current.focus();
    }
    const user_Name = userName;
    setUser(user_Name);
  }, [openKeyboard, user]);

  useEffect(() => {
    handleAddQuestion({
      preventDefault: () => {},
    });
  }, []);
  useEffect(() => {
    if (selectedQuestionType === "True/False") {
      if (selectedQuestionType === "True/False") {
        const updatedQuestions = [...questions];
        updatedQuestions[selectedQuestionIndex].options = [
          "True",
          "False",
          "",
          "",
        ];
        setQuestions(updatedQuestions);
        setKatexValue([]);
      }
    }
  }, [selectedQuestionType]);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleAddQuestion = (e) => {
    e.preventDefault();
    const isPollQuestion = selectedQuestionType === "poll";
    const isFillQuestion = selectedQuestionType === "Fill in the blanks";
    const isGuessQuestion = selectedQuestionType === "Guess Word";
    const isTrueFalseQuestion = selectedQuestionType === "True/False";
    const isSingleTypeQuestion = selectedQuestionType === "Single Select";
    const isMultiTypeQuestion = selectedQuestionType === "Multi Select";
    if (isMultiTypeQuestion && isSingleTypeQuestion) {
      if (
        questions.some(
          (q) =>
            q.question === "" ||
            q.options.some((opt) => opt === "") ||
            (isSingleTypeQuestion &&
              isMultiTypeQuestion &&
              q.correctOptionIndex === undefined)
        )
      ) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "error",
          title: "Please fill in all fields before adding the next question",
        });
        return;
      }
    } else if (isPollQuestion) {
      if (
        questions.some(
          (q) => q.question === "" || q.options.some((opt) => opt === "")
        )
      ) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "error",
          title: "Please fill in all fields before adding the next question",
        });
        return;
      }
    } else if (isTrueFalseQuestion) {
      if (
        questions.some(
          (q) => q.question === "" || q.correctOptionIndex === undefined
        )
      ) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "error",
          title: "Please fill in all fields before adding the next question",
        });
        return;
      }
    } else if (isGuessQuestion) {
      if (
        questions.some((q) => {
          const isOptionEmpty = q.options.some((opt, index) =>
            index === 0 ? opt === "" : false
          );
          q.question === "" || isOptionEmpty;
        })
      ) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
        });
        Toast.fire({
          icon: "error",
          title: "Please fill in all fields before adding the next question",
        });
        return;
      }
    }
    setDetailModal(false);
    // const updatedCurrentQuestion = {
    //   ...currentQuestion,
    //    questionId,
    // };
    // setQuestions([...questions,updatedCurrentQuestion]);
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({
      id: uuidv4(),
      question: "",
      options: ["", "", "", ""],
    });
    setSelectedQuestionIndex(questions.length);
    setKatexValue([]);
  };
  const handleQuestionClick = (index) => {
    setSelectedQuestionIndex(index);
  };

  const handleDeleteQuestion = (index, event) => {
    event.stopPropagation();
    if (questions.length > 1 || questions.length === 1) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
      let nextIndex = null;
      if (index < updatedQuestions.length) {
        nextIndex = index;
      } else if (index > 0) {
        nextIndex = index - 1;
      }
      setSelectedQuestionIndex(nextIndex);
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        icon: "error",
        title: "Cannot delete the last two questions.",
      });
    }
  };

  const handleOptionChange = (optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[updatedQuestions.length - 1].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };
  const maxCharactersGuessWord = 40;
  const maxCharactersInputWord = 100;
  const handleOptionChangeGuessWord = (optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[updatedQuestions.length - 1].options[optionIndex] = value;
    setQuestions(updatedQuestions);
    setPreviewGuessWord(updatedQuestions[optionIndex].options[optionIndex]);
    setCharacterCount(value.length);
  };
  const shouldApplyPadding = file !== null;

  const handleCreateQuiz = () => {
    if (!name || !subject || !grade) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: "Please fill the Quiz Details ",
      });
      return;
    }
    if (
      !name ||
      !subject ||
      !grade ||
      !language ||
      !quizVisibility ||
      questions.some(
        (q) =>
          q.question === "" ||
          q.options.some((opt) => opt === "") ||
          q.correctOptionIndex === undefined
      )
    ) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "error",
        title: "Please fill in all fields before creating the quiz!",
      });
      return;
    }
    const adjustedQuestions = questions.map((q) => ({
      ...q,
      correctOptionIndex: q.correctOptionIndex,
    }));

    const quizData = {
      name,
      subject,
      grade,
      questions: adjustedQuestions,
    };
    setName("");
    setGrade("");
    setSubject("");
    setLanguage("");
    setQuizVisibility("");
    setUser("");
    setQuestions([]);
    setImageUrl(null);
    setFile(null);

    console.log(quizData);
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: "success",
      title: "Quiz Created Successfully!!",
    });
    return;
  };
  const durationOptions = [5, 10, 15, 30, 45, 60, 120, 180];
  const durationOptionsInMinutes = durationOptions.map((seconds) => ({
    value: `${seconds + " sec"}`,
  }));
  const points = [];
  const numberOfPoints = 20;
  let pointText;

  for (let i = 1; i <= numberOfPoints; i++) {
    if (i === 1) {
      pointText = `${i} Point`;
    } else {
      pointText = `${i} Points`;
    }
    points.push(pointText);
  }

  const handleDetailModal = () => {
    setDetailModal(true);
  };
  const handleQuizLibraryModal = () => {
    setQuizLibraryModal(true);
  };
  const closeModal = () => {
    setDetailModal(false);
    setMathInputValue("");
  };
  const closeQuizLibraryModal = () => {
    setQuizLibraryModal(false);
  };

  const handleUploadImageModal = (index) => {
    setCurrentEditorIndex(index);
    setImageUpload(true);
  };
  const handleUploadBannerImageModal = () => {
    setImageUpload(true);
  };
  const handleReplaceImageModal = (index) => {
    setCurrentEditorIndex(index);
    setImageUpload(true);
    setTriggerCrop(true);
  };
  const handleReplaceBannerImageModal = () => {
    setImageUpload(true);
    setTriggerCrop(true);
  };
  const handleRemoveImage = (index) => {
    setFile(null);
    setImageUrl(null);
    setQuestions((prevQuestions) => {
      const lastQuestionIndex = prevQuestions.length - 1;
      const updatedQuestions = [...prevQuestions];
      const lastQuestion = updatedQuestions[lastQuestionIndex];

      const updatedOptions = lastQuestion.options.map((option, index) => {
        if (option === imageUrl) {
          return "";
        }
        return option;
      });
      const updatedQuestion = { ...lastQuestion, options: updatedOptions };
      updatedQuestions[lastQuestionIndex] = updatedQuestion;
      return updatedQuestions;
    });
  };
  const closeImageModal = () => {
    setImageUpload(false);
  };
  const handleInsertImage = () => {
    setImageUpload(false);
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        const croppedImageSrc = canvas.toDataURL();
        setImageUrl(croppedImageSrc);
        if (imageUrl) {
          const updatedQuestions = [...questions];
          updatedQuestions[updatedQuestions.length - 1].options[
            currentEditorIndex + "-" + imageData
          ] = imageUrl;
          setQuestions(updatedQuestions);
        }
      }
    }
    setTriggerCrop(false);
  };
  const handleChange = (files) => {
    const selectedFile = files;
    setFile(selectedFile);
    const fileBlob = new Blob([selectedFile]);
    const objectURL = URL.createObjectURL(fileBlob);
    setImageUrl(objectURL);
  };
  const handleDelete = () => {
    setFile(null);
    setImageUrl(null);
    setQuestions((prevQuestions) => {
      const lastQuestionIndex = prevQuestions.length - 1;
      const updatedQuestions = [...prevQuestions];
      const lastQuestion = updatedQuestions[lastQuestionIndex];

      const updatedOptions = lastQuestion.options.map((option, index) => {
        if (option === imageUrl) {
          return "";
        }
        return option;
      });
      const updatedQuestion = { ...lastQuestion, options: updatedOptions };
      updatedQuestions[lastQuestionIndex] = updatedQuestion;
      return updatedQuestions;
    });
  };

  const handleSaveData = () => {
    setDetailModal(false);
  };
  const handleAddExplanation = () => {
    setExplanationData(false);
  };
  const handleSaveExplanation = () => {
    setExplanationData(true);
  };
  const handleDeleteExplanation = (index) => {
    setExplanationData(true);
    setFile(null);
    setImageUrl(null);
    const updatedQuestions = [...questions];
    updatedQuestions[index].explanation = "";
    setQuestions(updatedQuestions);
  };

  const handleAddOption = () => {
    setQuestions((prevQuestions) => {
      const lastQuestionIndex = prevQuestions.length - 1;
      const updatedQuestions = [...prevQuestions];
      const lastQuestion = updatedQuestions[lastQuestionIndex];

      if (lastQuestion.options.length < 5) {
        const updatedOptions = [...lastQuestion.options, ""];
        const updatedQuestion = { ...lastQuestion, options: updatedOptions };
        updatedQuestions[lastQuestionIndex] = updatedQuestion;
      }

      return updatedQuestions;
    });
  };
  const handleDeleteOption = (questionIndex, optionIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      const updatedOptions = [...updatedQuestions[questionIndex].options];
      updatedOptions.splice(optionIndex, 1);
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        options: updatedOptions,
      };

      return updatedQuestions;
    });
  };
  const handleOpenKeyboard = (index) => {
    setOpenKeyboard(true);
    setCurrentEditorIndex(index);
    setLatexCode("");
  };
  const handleCloseKeyboard = () => {
    setOpenKeyboard(false);
  };

  const updatedlatexCode = (mathInputValue, editorIndex) => {
    const quill = quillRefs.current[editorIndex].getEditor();
    const selection = quill.getSelection();
    const manuallyGetCursorPosition = quill.selection.savedRange;
    const cursorPosition = selection
      ? selection.index
      : manuallyGetCursorPosition
      ? manuallyGetCursorPosition.index
      : 0;

    const formulaCode = new Delta()
      .retain(cursorPosition)
      .delete(mathInputValue.length)
      .insert({ formula: mathInputValue });

    quill.updateContents(formulaCode, "user");
    quill.setSelection(cursorPosition + mathInputValue.length);
  };

  const handleSaveMathKeyboard = () => {
    if (mathInputValue != "") {
      setOpenKeyboard(false);
      firstMathfieldRef.current.latex("");
      const currentMathValue = mathInputValue;
      const formulaCode = new Delta().insert({ formula: currentMathValue });
      const quill = quillRefs.current[currentEditorIndex].getEditor();
      const selection = quill.getSelection();
      const manuallyGetCursorPosition = quill.selection.savedRange;
      const cursorPosition = selection
        ? selection.index
        : manuallyGetCursorPosition
        ? manuallyGetCursorPosition.index
        : 0;
      updatedlatexCode(mathInputValue, currentEditorIndex);
      quill.setSelection(cursorPosition + 1);
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        setMathInputValue("");
        return updatedQuestions;
      });
    } else {
      setOpenKeyboard(false);
    }
  };
  const setQuillRef = (ref, index) => {
    quillRefs.current[index] = ref;
  };

  useEffect(() => {
    if (firstMathfieldRef.current) {
      firstMathfieldRef.current.latex(latexCode);
    }
  }, [latexCode]);

  useEffect(() => {
    currentEditorIndexRef.current = currentEditorIndex;
  }, [currentEditorIndex]);

  const colors = ["#216eab", "#009ca5", "#f4ab3e", "#de566c", "#a1418f"];

  const handleShowSelectedItems = () => {
    setShowSelectedItems(!showSelectItems);
  };
  const handleShowPreview = () => {
    setShowPreview(true);
  };
  const handleHidePreview = () => {
    setShowPreview(false);
  };
  const handleNextQuestion = () => {
    setApiCurrentQuestion(apiCurrentQuestion + 1);
  };
  const handlePreviousQuestion = () => {
    setApiCurrentQuestion(apiCurrentQuestion - 1);
  };

  const handleQuizSelected = (quizId) => {
    const selectedQuizData = quizData.find((quiz) => quiz.id === quizId);
    setSelectedQuiz(selectedQuizData);
  };

  const handleDrop = (droppedItem) => {
    if (!droppedItem.destination) return;
    var updatedList = [...questions];
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    setQuestions(updatedList);
  };
  const [tags, setTags] = useState([]);
  const handleChangeTags = (tags) => {
    setTags(tags);
  };
  return (
    <div className="w-full h-screen">
      {showPreview == false ? (
        <div className="">
          <Keyboard isOpen={openKeyboard} onClose={handleCloseKeyboard}>
            <>
              <div className="flex gap-3 items-center mt-[10px]">
                <div className="w-[40px] h-[40px] bg-cyan-500 flex justify-start items-center rounded-full">
                  <span className="w-[40px]">
                    <PiSigmaThin
                      style={{
                        width: "40px",
                        fontSize: "27px",
                        color: "yellow",
                        fontSize: "1000",
                      }}
                    />
                  </span>
                </div>
                <div className="flex items-center justify-center flex-col">
                  <h1 className="text-left w-full text-xl text-[#212529]  font-semibold">
                    Math Equation
                  </h1>
                  <p className="text-left w-full  text-sm text-[#212529] ">
                    Use the buttons below or type in the equations using LaTeX
                  </p>
                </div>
              </div>
              <p className="w-[57%] text-[14px] text-left mt-[16px]">Preview</p>
              <div className="w-full flex justify-center">
                <div className="w-[100%] flex border-2 border-cyan-500 focus:border-cyan-500 rounded-[8px] justify-center">
                  <MathInput
                    autoFocus
                    initialLatex={latexCode}
                    setMathfieldRef={(mathfield) =>
                      (firstMathfieldRef.current = mathfield)
                    }
                    setValue={(value) => {
                      setMathInputValue(value);
                    }}
                  />
                </div>
              </div>
              <div className="w-full flex gap-3 justify-end">
                <button
                  type="button"
                  className="text-cyan-500 bg-gray-200 select-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-3 mb-4 lg:mb-0"
                  onClick={handleCloseKeyboard}
                >
                  cancel
                </button>
                <button
                  type="button"
                  className="text-white select-none bg-gradient-to-r from-teal400 via-teal500 to-teal600 hover:bg-gradient-to-br shadow-lg 
                  shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-3 mb-4 lg:mb-0"
                  onClick={handleSaveMathKeyboard}
                >
                  Save
                </button>
              </div>
            </>
          </Keyboard>
          <Detail isOpen={detailModal} onClose={closeModal}>
            <div className="flex gap-3 items-center my-[10px]">
              <div className="w-[40px] h-[40px] bg-cyan-500 flex justify-start items-center rounded-full">
                <span className="w-[40px]">
                  <BsStars
                    style={{
                      width: "40px",
                      fontSize: "27px",
                      color: "yellow",
                    }}
                  />
                </span>
              </div>
              <div className="flex items-center justify-center flex-col">
                <h1 className="text-left w-full text-xl text-[#212529] font-semibold">
                  Quiz Setting
                </h1>
                <p className="text-left w-full  text-sm text-[#212529] ">
                  Review quiz settings and you&apos;re good to go
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col lg:flex-row mb-6 gap-2">
              <div className="flex flex-col lg:w-[50%] gap-2 lg:flex-col ">
                <div>
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
                    className="bg-white"
                  />
                  {name.length <= 4 ? (
                    <Typography
                      variant="small"
                      color="red"
                      className="flex items-center gap-1 text-[12px]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="-mt-px h-4 w-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Name should be at least 4 characters long.
                    </Typography>
                  ) : null}
                </div>
                <div className="selectSubject">
                  <Select
                    value={subject}
                    color="teal"
                    label="Subject"
                    onChange={(value) => {
                      setSubject(value);
                    }}
                    className="bg-transparent z-[900]"
                  >
                    <Option value="Mathematics">Mathematics</Option>
                    <Option value="Computer">Computer</Option>
                    <Option value="Science">Science</Option>
                    <Option value="Physics">Physics</Option>
                    <Option value="Biology">Biology</Option>
                    <Option value="Chemistry">Chemistry</Option>
                    <Option value="Social Science">Social Science</Option>
                    <Option value="Computer Applications">
                      Computer Applications
                    </Option>
                    <Option value="Physical Education">
                      Physical Education
                    </Option>
                    <Option value="Business Studies">Business Studies</Option>
                    <Option value="Economics">Economics</Option>
                    <Option value="Office Procedures & Practices">
                      Office Procedures & Practices
                    </Option>
                    <Option value="Automobile Engineering">
                      Automobile Engineering
                    </Option>
                    <Option value="Retail Operations">Retail Operations</Option>
                    <Option value="Library System And Library Information Science">
                      Library System And Library Information Science
                    </Option>
                    <Option value="Travel Agency And Tour Operations">
                      Travel Agency And Tour Operations
                    </Option>
                    <Option value="Agriculture">Agriculture</Option>
                    <Option value="Business Operation & Administration">
                      Business Operation & Administration
                    </Option>
                    <Option value="Electrical and Electronics Technology">
                      Electrical and Electronics Technology
                    </Option>
                    <Option value="Design">Design</Option>
                    <Option value="Web Applications">Web Applications</Option>
                    <Option value="Mechanical Engineering">
                      Mechanical Engineering
                    </Option>
                    <Option value="Taxation">Taxation</Option>
                    <Option value="Geospatial Technology">
                      Geospatial Technology
                    </Option>
                    <Option value="Artificial Intelligence">
                      Artificial Intelligence
                    </Option>
                    <Option value="Childhood Care and Education">
                      Childhood Care and Education
                    </Option>
                    <Option value="Mass Media Studies">
                      Mass Media Studies
                    </Option>
                    <Option value="Cost Accounting">Cost Accounting</Option>
                    <Option value="Marketing & Sales">Marketing & Sales</Option>
                    <Option value="Health Care Services">
                      Health Care Services
                    </Option>
                    <Option value="Electrical Machines">
                      Electrical Machines
                    </Option>
                    <Option value="Communication Devices">
                      Communication Devices
                    </Option>
                    <Option value="Database Management Applications">
                      Database Management Applications
                    </Option>
                    <Option value="Security">Security</Option>
                    <Option value="Food Production">Food Production</Option>
                    <Option value="Information Technology">
                      Information Technology
                    </Option>
                    <Option value="Beauty And Wellness">
                      Beauty And Wellness
                    </Option>
                    <Option value="Yoga">Yoga</Option>
                    <Option value="Multi Skill Foundation">
                      Multi Skill Foundation
                    </Option>
                    <Option value="Medical Diagnostics">
                      Medical Diagnostics
                    </Option>
                    <Option value="Data Science<">Data Science</Option>
                    <Option value="Shorthand English">Shorthand English</Option>
                    <Option value="Food Nutrition And Dietetics">
                      Food Nutrition And Dietetics
                    </Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </div>
                <div className="selectSubject">
                  <Select
                    value={grade}
                    color="teal"
                    label="Grade"
                    onChange={(value) => {
                      setGrade(value);
                    }}
                    className="bg-transparent"
                  >
                    <Option value="Grade 7">Grade 7</Option>
                    <Option value="Grade 8">Grade 8</Option>
                    <Option value="Grade 8">Grade 8</Option>
                    <Option value="Grade 9">Grade 9</Option>
                    <Option value="Grade 10">Grade 10</Option>
                    <Option value="Grade 11">Grade 11</Option>
                    <Option value="Grade 12">Grade 12</Option>
                  </Select>
                </div>
                <div className="selectSubject">
                  <Select
                    value={language}
                    color="teal"
                    label="Language"
                    onChange={(value) => {
                      setLanguage(value);
                    }}
                    className="bg-transparent"
                  >
                    <Option value="English">English</Option>
                    <Option value="Hindi">Hindi</Option>
                  </Select>
                </div>
                <div className="selectSubject">
                  <Select
                    value={quizVisibility}
                    color="teal"
                    label="Visibility"
                    onChange={(value) => {
                      setQuizVisibility(value);
                    }}
                    className="bg-transparent"
                  >
                    <Option value="Publicly visible">Publicly visible</Option>
                    <Option value="Restricted">Restricted</Option>
                  </Select>
                </div>
              </div>
              <div className=" lg:w-[50%] border-dotted border-2  border-black  rounded-lg">
                {file !== null ? (
                  <div className="flex justify-center items-center relative flex-col  w-full group">
                    <Zoom>
                      <img
                        src={imageUrl}
                        alt="image"
                        width="200px"
                        className=" w-full h-[31vh] rounded-lg lg:hover:brightness-50"
                      />
                    </Zoom>
                    <div className="flex gap-2 absolute top-[8px] right-[5px] w-full justify-end opacity-100 lg:opacity-0  lg:group-hover:opacity-100 transition-opacity">
                      <span
                        className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                        onClick={() => handleReplaceBannerImageModal()}
                      >
                        <MdCrop />
                      </span>
                      <span
                        className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                        onClick={handleDelete}
                      >
                        <RiDeleteBin6Line />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col py-4 lg:py-0 justify-center lg:h-[29vh] text-[16px] items-center">
                    <div
                      className="bg-[#09090980] hover:bg-[#09090999] text-white p-2 cursor-pointer rounded-lg"
                      onClick={() => handleUploadBannerImageModal()}
                    >
                      <FaPlus />
                    </div>
                    <p className>Add cover image</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end items-center ">
              <button
                aria-label="add question"
                type="submit"
                onClick={handleSaveData}
                className="text-white select-none bg-gradient-to-r from-teal400 via-teal500 to-teal600 hover:bg-gradient-to-br shadow-lg 
                  shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-[4px] text-sm px-4 py-1 text-center"
              >
                Save
              </button>
            </div>
          </Detail>
          <Quizlibrary
            isOpen={quizLibraryModal}
            onClose={closeQuizLibraryModal}
          >
            <div className="border-b-2 border-[#E5E5E5] p-2 pb-5">
              <div className="relative flex w-full max-w-[24rem] mb-2 mt-2">
                <Input
                  type="text"
                  size="md"
                  label="search quiz"
                  value={searchQuiz}
                  color={searchQuiz ? "purple" : "gray"}
                  onChange={handleSearchQuizItems}
                  className="pr-20"
                  containerProps={{
                    className: "min-w-0",
                  }}
                />
                <Button
                  size="sm"
                  color={searchQuiz ? "white" : "blue-gray"}
                  disabled={!searchQuiz}
                  className={`!absolute right-1 top-[5px] px-2 py-[7px] rounded ${
                    searchQuiz
                      ? "text-[#8854c0] bg-[#eee6f5]"
                      : "text-[#000000] bg-[#b4b4b4]"
                  }`}
                >
                  search
                </Button>
              </div>
              <div className=" flex items-center gap-2">
                <p className="text-[14px]">Filter by:</p>
                <div className="">
                  <div className="flex items-center flex-row justify-between gap-2 text-sm text-[#212529] box-border">
                    <div className="flex w-full sm:w-auto filterDataSelect  gap-2 items-center z-[1010] sm:z-[1000]">
                      <Select
                        value={grade == "" ? "Grade 7" : grade}
                        color="teal"
                        label="Grade"
                        onChange={(value) => {
                          setGrade(value);
                        }}
                        className="bg-transparent"
                      >
                        <Option value="Grade 7">Grade 7</Option>
                        <Option value="Grade 8">Grade 8</Option>
                        <Option value="Grade 8">Grade 8</Option>
                        <Option value="Grade 9">Grade 9</Option>
                        <Option value="Grade 10">Grade 10</Option>
                        <Option value="Grade 11">Grade 11</Option>
                        <Option value="Grade 12">Grade 12</Option>
                      </Select>
                    </div>
                    <div className="flex w-full sm:w-auto filterDataSelect  gap-2 items-center z-[1010] sm:z-[1000]">
                      <Select
                        value={subject == "" ? "Mathematics" : subject}
                        color="teal"
                        label="Subject"
                        onChange={(value) => {
                          setSubject(value);
                        }}
                        className="bg-transparent"
                      >
                        <Option value="Mathematics">Mathematics</Option>
                        <Option value="Computer">Computer</Option>
                        <Option value="Science">Science</Option>
                        <Option value="Physics">Physics</Option>
                        <Option value="Biology">Biology</Option>
                        <Option value="Chemistry">Chemistry</Option>
                        <Option value="Social Science">Social Science</Option>
                        <Option value="Computer Applications">
                          Computer Applications
                        </Option>
                        <Option value="Physical Education">
                          Physical Education
                        </Option>
                        <Option value="Business Studies">
                          Business Studies
                        </Option>
                        <Option value="Economics">Economics</Option>
                        <Option value="Office Procedures & Practices">
                          Office Procedures & Practices
                        </Option>
                        <Option value="Automobile Engineering">
                          Automobile Engineering
                        </Option>
                        <Option value="Retail Operations">
                          Retail Operations
                        </Option>
                        <Option value="Library System And Library Information Science">
                          Library System And Library Information Science
                        </Option>
                        <Option value="Travel Agency And Tour Operations">
                          Travel Agency And Tour Operations
                        </Option>
                        <Option value="Agriculture">Agriculture</Option>
                        <Option value="Business Operation & Administration">
                          Business Operation & Administration
                        </Option>
                        <Option value="Electrical and Electronics Technology">
                          Electrical and Electronics Technology
                        </Option>
                        <Option value="Design">Design</Option>
                        <Option value="Web Applications">
                          Web Applications
                        </Option>
                        <Option value="Mechanical Engineering">
                          Mechanical Engineering
                        </Option>
                        <Option value="Taxation">Taxation</Option>
                        <Option value="Geospatial Technology">
                          Geospatial Technology
                        </Option>
                        <Option value="Artificial Intelligence">
                          Artificial Intelligence
                        </Option>
                        <Option value="Childhood Care and Education">
                          Childhood Care and Education
                        </Option>
                        <Option value="Mass Media Studies">
                          Mass Media Studies
                        </Option>
                        <Option value="Cost Accounting">Cost Accounting</Option>
                        <Option value="Marketing & Sales">
                          Marketing & Sales
                        </Option>
                        <Option value="Health Care Services">
                          Health Care Services
                        </Option>
                        <Option value="Electrical Machines">
                          Electrical Machines
                        </Option>
                        <Option value="Communication Devices">
                          Communication Devices
                        </Option>
                        <Option value="Database Management Applications">
                          Database Management Applications
                        </Option>
                        <Option value="Security">Security</Option>
                        <Option value="Food Production">Food Production</Option>
                        <Option value="Information Technology">
                          Information Technology
                        </Option>
                        <Option value="Beauty And Wellness">
                          Beauty And Wellness
                        </Option>
                        <Option value="Yoga">Yoga</Option>
                        <Option value="Multi Skill Foundation">
                          Multi Skill Foundation
                        </Option>
                        <Option value="Medical Diagnostics">
                          Medical Diagnostics
                        </Option>
                        <Option value="Data Science<">Data Science</Option>
                        <Option value="Shorthand English">
                          Shorthand English
                        </Option>
                        <Option value="Food Nutrition And Dietetics">
                          Food Nutrition And Dietetics
                        </Option>
                        <Option value="Other">Other</Option>
                      </Select>
                    </div>
                    <div className="flex w-full sm:w-auto filterDataSelect  gap-2 items-center z-[1010] sm:z-[1000]">
                      <Select
                        value={totalQuestions == "" ? "1-10" : totalQuestions}
                        color="teal"
                        label="Total Questions"
                        onChange={(value) => {
                          setTotalQuestions(value);
                        }}
                        className="bg-transparent"
                      >
                        <Option value="1-10">1-10</Option>
                        <Option value="11-20">11-20</Option>
                        <Option value="21-30">21-30</Option>
                        <Option value="31-50">31-50</Option>
                        <Option value="51-100">51-100</Option>
                        <Option value="100+">100+</Option>
                      </Select>
                    </div>
                    <div className="flex w-full sm:w-auto filterDataSelect  gap-2 items-center z-[1010] sm:z-[1000]">
                      <Select
                        value={language == "" ? "English" : language}
                        color="teal"
                        label="Language"
                        onChange={(value) => {
                          setLanguage(value);
                        }}
                        className="bg-transparent"
                      >
                        <Option value="English">English</Option>
                        <Option value="Hindi">Hindi</Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full h-screen">
              <div className="w-[35%] border-r-2 border-[#E5E5E5]">
                <div className="p-2">
                  <p className="text-[14px] text-[#6d6d6d]">
                    {searchQuiz ? (
                      <>
                        showing results for
                        <span className="font-semibold pl-1">{`"${searchQuiz}"`}</span>
                      </>
                    ) : (
                      <>No search query entered</>
                    )}
                  </p>
                </div>
                <div className="p-2">
                  <div className="border-[1px] p-2 rounded-md border-[#E5E5E5] fixed w-[30%] mb-1">
                    <p className="py-2 text-sm text-[#6d6d6d]">
                      Show content from:
                    </p>
                    <div className="flex flex-col font-[14px]">
                      <Radio name="type" color="green" label="community" />
                      <Radio name="type" color="green" label="My library" />
                    </div>
                  </div>
                </div>
                <div className="p-2 mt-[135px] pb-[6rem] max-h-[500px] overflow-scroll">
                  {quizData.map((quizData) => (
                    <div
                      key={quizData.id}
                      className="mb-2 cursor-pointer active:bg-[#f2f2f2]"
                      onClick={() => {
                        handleQuizSelected(quizData.id);
                      }}
                    >
                      <div className="border-[1px] p-2 rounded-md border-[#E5E5E5] ">
                        <div className="flex items-center gap-3">
                          <div className=" w-[70px] h-[70px] bg-[#f2f2f2] hover:shadow-[0px_0px_0px_2px_#8854c0] rounded-[2px] relative">
                            <div className="flex justify-center items-center w-full h-full quizListData">
                              <Zoom>
                                <img
                                  src={quizData.image}
                                  alt="image"
                                  className="max-h-[70px] rounded-[2px] "
                                />
                              </Zoom>
                            </div>
                            <div className="bg-[#09090980] absolute bottom-[2px] right-[3px] rounded-[2px] px-[4px]">
                              <p className="text-[10px] text-white">
                                {quizData.total_questions}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-xs w-44">
                              {quizData.chapter_name}
                            </p>
                            <p className="flex items-center text-[#424242]">
                              <span className="flex items-center justify-center mr-1 w-4 h-4">
                                <PiGraduationCapDuotone
                                  style={{ fontSize: "9px" }}
                                />
                              </span>
                              <span className="text-[10px]">
                                {quizData.class}
                              </span>
                            </p>
                            <p className="flex items-center text-[#424242]">
                              <span className="flex items-center justify-center mr-1 w-4 h-4">
                                <MdBook style={{ fontSize: "9px" }} />
                              </span>
                              <span className="text-[10px]">
                                {quizData.subject}
                              </span>
                            </p>
                            <p className="flex items-center text-[#424242]">
                              <span className="flex items-center justify-center mr-1 w-4 h-4">
                                <BiUser style={{ fontSize: "9px" }} />
                              </span>
                              <span className="text-[10px]">
                                {quizData.author}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-[75%] p-4 bg-[#f2f2f2] ">
                {selectedQuiz ? (
                  <div>
                    <div className="flex w-full items-center justify-between bg-white mb-4 py-1 px-2 rounded-[4px]">
                      <div className=" flex items-center gap-2 ">
                        <img
                          src={selectedQuiz.image}
                          alt="Quiz Preview"
                          className="h-[30px] rounded-sm"
                        />
                        <div>
                          <p className="text-[12px]">
                            {selectedQuiz.chapter_name}
                          </p>
                          <p className="text-[10px]">
                            {selectedQuiz.questions}
                          </p>
                        </div>
                      </div>
                      <div>
                        <button
                          aria-label=""
                          type="button"
                          className="text-black select-none text-[12px] bg-[#0909090D] hover:text-[#fff] hover:bg-[#A076CC] font-medium rounded-[4px] px-4 py-[6px] 
                          text-center cursor-pointer"
                        >
                          <p className="flex gap-1 items-center">
                            <span className="text-[12px] cursor-pointer">
                              <CiCirclePlus />
                            </span>
                            <span>Add all {selectedQuiz.questions}</span>
                          </p>
                        </button>
                      </div>
                    </div>
                    <div className="max-h-[520px] overflow-scroll">
                      {dummyQuestions.map((questionsData) => {
                        return (
                          <div key={questionsData.id}>
                            <div className="w-full bg-white mb-2 p-4 rounded-[4px] cursor-pointer">
                              <div className="flex w-full items-center mb-3 justify-between">
                                <div className="flex gap-1 px-[2px] py-[6px] text-[12px] items-center">
                                  <TiTick />
                                  <p>{questionsData.qType}</p>
                                </div>
                                <button
                                  aria-label=""
                                  type="button"
                                  className="text-black select-none text-[12px] bg-[#0909090D] hover:text-[#fff] hover:bg-[#A076CC] font-medium rounded-[4px] px-3 
                                      py-[4px] 
                                      text-center cursor-pointer"
                                >
                                  <p className="flex gap-1 items-center">
                                    <span className="text-[12px] cursor-pointer">
                                      <CiCirclePlus />
                                    </span>
                                    <span>Add question</span>
                                  </p>
                                </button>
                              </div>
                              <div className="flex gap-3 flex-col justify-start items-start">
                                <div>
                                  <p className="text-[14px] font-light">
                                    {questionsData.question.text}
                                  </p>
                                </div>
                                <div className="w-full">
                                  <p className="text-[12px] font-light text-[#6D6D6D] mb-1">
                                    Answer choices
                                  </p>
                                  <div className="grid grid-cols-2 gap-y-2 gap-x-1 w-full">
                                    {questionsData.options.map(
                                      (option, index) => (
                                        <div
                                          key={index}
                                          className="flex gap-0.5 items-start w-full text-[#222222] text-[14px]"
                                        >
                                          <div className="flex items-center gap-1">
                                            {Array.isArray(
                                              questionsData.correctAnswers
                                            ) ? (
                                              questionsData.correctAnswers.includes(
                                                index
                                              ) ? (
                                                <p>
                                                  <TiTick
                                                    style={{ color: "green" }}
                                                  />
                                                </p>
                                              ) : (
                                                <p>
                                                  <AiOutlineClose
                                                    style={{ color: "red" }}
                                                  />
                                                </p>
                                              )
                                            ) : index ===
                                              parseInt(
                                                questionsData.correctAnswers
                                              ) ? (
                                              <p>
                                                <TiTick
                                                  style={{ color: "green" }}
                                                />
                                              </p>
                                            ) : (
                                              <p>
                                                <AiOutlineClose
                                                  style={{ color: "red" }}
                                                />
                                              </p>
                                            )}
                                            <p>{option.text}</p>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="ml-auto mr-auto text-3xl font-semibold text-center mt-[72px] max-w-[322px] text-[#B6B6B6]">
                    Select a quiz to see its preview here.
                  </p>
                )}
              </div>
            </div>
          </Quizlibrary>
          <ImageUpload isOpen={imageUpload} onClose={closeImageModal}>
            <div className="flex gap-3 items-center my-[10px]">
              <div className="w-[40px] h-[40px] bg-cyan-500 flex justify-start items-center rounded-full">
                <span className="w-[40px]">
                  <CiImageOn
                    style={{
                      width: "40px",
                      fontSize: "27px",
                      color: "yellow",
                    }}
                  />
                </span>
              </div>
              <div className="flex items-center justify-center flex-col">
                <h1 className="text-left w-full text-xl text-[#212529] font-semibold">
                  Add image
                </h1>
                <p className="text-left w-full  text-sm text-[#212529] ">
                  Use ctrl + V to paste image from your clipboard
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-5 lg:flex-col ">
              <div className="mb-4">
                {file ? (
                  <div className="relative  flex justify-center items-center flex-col py-[16px] ">
                    <Cropper
                      ref={cropperRef}
                      alt="image"
                      className="w-[330px] sm:w-[500px] h-[200px] rounded-lg"
                      key={triggerCrop ? "cropTriggered" : "cropNotTriggered"}
                      src={imageUrl}
                    />
                    {file !== null ? (
                      <span
                        className="absolute top-[-5px] cursor-pointer right-0"
                        onClick={handleDelete}
                      >
                        <RiDeleteBin6Line />
                      </span>
                    ) : (
                      <span className="mt-2">
                        <FileUploader
                          multiple={false}
                          handleChange={handleChange}
                          name="file"
                          types={fileTypes}
                          maxSize={3}
                          id="fileInput"
                        />
                      </span>
                    )}
                  </div>
                ) : (
                  <FileUploader
                    multiple={false}
                    handleChange={handleChange}
                    name="file"
                    types={fileTypes}
                    maxSize={3}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <button
                aria-label="add question"
                type="submit"
                onClick={handleInsertImage}
                className="text-white select-none bg-gradient-to-r from-teal400 via-teal500 to-teal600 hover:bg-gradient-to-br shadow-lg 
                  shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-5 w-full"
              >
                insert
              </button>
            </div>
          </ImageUpload>
          <div className="w-full z-[1020] fixed top-0">
            <div className="flex gap-3 p-2 bg-[#fff] border-[1px] border-b-gray-400 items-center">
              {/* <div className="block lg:hidden cursor-pointer text-[#6D6D6D]">
              {isMenuOpen ? (
                <IoMdClose onClick={handleToggleMenu} />
              ) : (
                <FaBars onClick={handleToggleMenu} />
              )}
              </div> */}
              <div className="w-full lg:px-[2px] flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <Link href="/admin/draft">
                    <div className="text-[20px] hidden lg:block cursor-pointer bg-[#FFFFFF] hover:bg-[#F9F9F9] p-[2px] border-[1px] border-[#E5E5E5] rounded-[4px]">
                      <IoIosArrowBack />
                    </div>
                  </Link>
                  <h1 className="text-lg sm:text-xl font-bold cursor-pointer font-Lollipop  mt-[2px] text-[#6D6D6D]">
                    <Link href="">Quizard</Link>
                  </h1>
                </div>
                <div className="w-full flex justify-end gap-[10px] items-center">
                  <button
                    aria-label="Enter code"
                    className={`hidden lg:flex justify-center items-center gap-2 text-[#222222] text-[14px] rounded-[4px] bg-[#1818180d] font-semibold select-none px-2 py-1 sm:px-[24px] sm:py-[8px] text-center hover:text-[#6a6262]`}
                  >
                    <IoPlay />
                    <p onClick={handleShowPreview}>Preview</p>
                  </button>
                  <div className="">
                    {questions.length >= 0 && (
                      <button
                        aria-label="create quiz"
                        type="button"
                        onClick={handleCreateQuiz}
                        className={`flex justify-center items-center gap-2 text-white text-[14px] rounded-[4px] bg-[#8854c0] select-none px-2 py-1 sm:px-[24px] sm:py-[8px] text-center hover:brightness-125`}
                      >
                        <FaSave />
                        Publish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full  mt-[2rem] sm:mt-[2.4rem]">
            <div
              className={`min-h-screen z-[100] border-r-2 border-r-gray-400  ${
                isMenuOpen
                  ? "w-[50%] "
                  : "hidden lg:block lg:w-[20%]  xl:w-[20%]  "
              }`}
            >
              <ul className="flex flex-col items-start ">
                <li key="question" className="mt-8 text-cyan500 ">
                  <div className="flex items-start">
                    {questions.length > 0 ? (
                      <span className="ml-[9px]">
                        {questions.length}
                        {questions.length == 1 ? "Question" : "Questions"}
                      </span>
                    ) : (
                      <span className="ml-4 text-sm sm:text-base">
                        No questions.
                      </span>
                    )}
                  </div>
                </li>
                <DragDropContext onDragEnd={handleDrop}>
                  <Droppable droppableId="list-container">
                    {(provided) => (
                      <li
                        key="questions"
                        className="mb-3"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {questions.map((q, index) => (
                          <Draggable
                            key={q.id}
                            draggableId={q.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="flex items-start px-2 justify-between cursor-pointer group gap-[4px] "
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                              >
                                <div className=" font-bold flex justify-between items-center h-[90px] flex-col">
                                  <span>{`${index + 1}`} </span>
                                  <span
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(event) =>
                                      handleDeleteQuestion(index, event)
                                    }
                                  >
                                    <RiDeleteBin6Line />
                                  </span>
                                </div>
                                <div
                                  className={`border-[1px] no-scrollbar imageSize border-blue-100 rounded-lg overflow-y-auto mb-3 relative w-[80px] h-[60px] sm:w-[150px] xl:w-[190px] sm:h-[100px] ${
                                    index === selectedQuestionIndex
                                      ? "shadow-[0px_0px_0px_3px_#FF0000]"
                                      : ""
                                  }`}
                                  onClick={() => handleQuestionClick(index)}
                                >
                                  {file !== null ? (
                                    <>
                                      <img
                                        src={imageUrl}
                                        alt=""
                                        className="w-full h-full object-cover brightness-50"
                                      />
                                      <div className="absolute top-0 left-0 right-0  bottom-0 flex items-center justify-center overflow-y-hidden ">
                                        <div className="line-clamp-3 text-white pt-2 px-2 my-3">
                                          <div
                                            dangerouslySetInnerHTML={{
                                              __html: DOMPurify.sanitize(
                                                q.question.replace(
                                                  /\\\((.*?)\\\)/g,
                                                  (match, mathExpression) => {
                                                    try {
                                                      return katex.renderToString(
                                                        mathExpression,
                                                        {
                                                          throwOnError: false,
                                                        }
                                                      );
                                                    } catch (error) {
                                                      return match;
                                                    }
                                                  }
                                                )
                                              ),
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="line-clamp-3 pt-2 px-2 my-3">
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: DOMPurify.sanitize(
                                            q.question.replace(
                                              /\\\((.*?)\\\)/g,
                                              (match, mathExpression) => {
                                                try {
                                                  return katex.renderToString(
                                                    mathExpression,
                                                    {
                                                      throwOnError: false,
                                                    }
                                                  );
                                                } catch (error) {
                                                  return match;
                                                }
                                              }
                                            )
                                          ),
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </li>
                    )}
                  </Droppable>
                </DragDropContext>
                <li
                  key="addQuestions"
                  className={`mb-[6rem] ${
                    questions.length == 0 ? "" : "-mt-3"
                  }`}
                >
                  <div
                    className={`flex items-start  ${
                      questions.length >= 10 ? "ml-[1.8rem]" : "ml-[1.7rem]"
                    }`}
                  >
                    <div
                      className="border-2 border-gray-400 rounded-lg p-3 overflow-y-auto  mb-3 w-[80px] h-[60px] sm:w-[150px] xl:w-[190px] sm:h-[100px] cursor-pointer"
                      onClick={handleAddQuestion}
                    >
                      <span className="flex justify-center items-center h-full text-[50px] text-cyan500 cursor-pointer">
                        +
                      </span>
                    </div>
                  </div>
                </li>
                <li key="search library">
                  <div className="flex justify-center items-center flex-col gap-2 w-[100px]  sm:w-[150px] xl:w-[230px] p-2 fixed bottom-0 bg-[#ffffff]">
                    <button
                      className="flex items-center justify-center w-full gap-2 bg-[#ffffff] border-[1px] border-[#E5E5E5] p-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-base text-[#222222] 
                    hover:bg-[#ffffff] rounded-[4px] "
                      onClick={handleQuizLibraryModal}
                    >
                      <CiSearch />
                      search library
                    </button>
                    {questions.map((q, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-center w-full gap-2 bg-[#8e51bb] p-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-base text-white 
                    hover:bg-[#a574c8] rounded-[4px] ${
                      index === selectedQuestionIndex
                        ? "hidden lg:flex"
                        : "hidden"
                    }`}
                      >
                        {questions.length >= 1 && (
                          <button
                            className="flex items-center justify-center w-full gap-2"
                            aria-label="add question"
                            type="submit"
                            onClick={handleAddQuestion}
                          >
                            <FaSave style={{ marginTop: "-2px" }} />
                            Add Question
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </li>
              </ul>
              <div></div>
            </div>
            <div className="w-full lg:w-[80%]  xl:w-[80%]  ">
              <form className="xl:fixed w-full lg:w-[80%] xl:w-[80%] ">
                <div
                  className={`flex items-center justify-between ${
                    openKeyboard ? "" : "mt-[1rem]"
                  }  w-full text-lg sm:text-2xl text-[#212529] p-2 box-border font-semibold`}
                >
                  <div className="flex gap-2 items-center group cursor-pointer">
                    <h1 className="text-[16px]">
                      {name ? name : "Untitled Quiz"}
                    </h1>
                    <div
                      className="text-[16px] cursor-pointer bg-[#FFFFFF] hover:bg-[#F9F9F9] p-[2px] border-[1px] border-[#E5E5E5] rounded-[4px] opacity-100 lg:opacity-0  lg:group-hover:opacity-100 transition-opacity"
                      onClick={handleDetailModal}
                    >
                      <IoIosSettings />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TagsInput
                      value={tags}
                      onChange={handleChangeTags}
                      maxTags={5}
                    />
                    <div className="flex gap-3 items-center ">
                      <button
                        aria-label="add explanation"
                        type="button"
                        className="text-black select-none bg-[#f2f2f2]  hover:text-[#fdff49] hover:bg-[#00b5d2] font-medium rounded-lg text-sm p-1 text-center 
                        cursor-pointer"
                      >
                        <p
                          className="hidden lg:flex gap-1 items-center "
                          onClick={handleAddExplanation}
                        >
                          <span className="text-[14px] cursor-pointer">
                            <FaRegLightbulb />
                          </span>
                          <span>Add explanation</span>
                        </p>
                        <p
                          className="flex lg:hidden gap-1 items-center p-1 "
                          onClick={handleAddExplanation}
                        >
                          <span className="text-[14px] cursor-pointer ">
                            <FaRegLightbulb />
                          </span>
                        </p>
                      </button>
                    </div>
                    <div
                      className="lg:hidden bg-[#f2f2f2] p-2 cursor-pointer rounded-lg"
                      onClick={handleShowSelectedItems}
                    >
                      <span className="text-[14px] cursor-pointer">
                        <CiMenuKebab />
                      </span>
                    </div>
                  </div>
                </div>
                {showSelectItems && (
                  <div className="lg:hidden  fixed top-[94px] right-[8px] z-[10000] w-[200px]">
                    {questions.map((q, index) => (
                      <div
                        className={`flex items-center flex-col   justify-between text-sm text-[#212529] box-border ${
                          index === selectedQuestionIndex ? "block" : "hidden"
                        }`}
                        key={index}
                      >
                        <div className="flex w-full selectQuestionType items-center z-[1010] sm:z-[1000]">
                          <Select
                            value={selectedOption}
                            onChange={(value) => {
                              setHasSelectedOption(true);
                              const updatedQuestions = [...questions];
                              updatedQuestions[index].selectedType = value;
                              setQuestions(updatedQuestions);
                              setSelectedQuestionType(
                                updatedQuestions[index].selectedType
                              );
                            }}
                            className="bg-transparent"
                          >
                            <Option value="Single Select">Single Select</Option>
                            <Option value="Multi Select">Multi Select</Option>
                            <Option value="Fill in the blanks">
                              Fill in the blanks
                            </Option>
                            <Option value="Poll">Poll</Option>
                            <Option value="True/False">True/False</Option>
                            <Option value="Guess Word">Guess Word</Option>
                          </Select>
                        </div>
                        <div className="flex flex-row items-center justify-center  w-full ">
                          <div className=" flex flex-col  items-center z-[1000] selectPoint w-full ">
                            <Select
                              className="bg-transparent "
                              value={selectedPoints}
                              onChange={(value) => {
                                setHasSelectedPoints(true);
                                const updatedQuestions = [...questions];
                                updatedQuestions[index].selectPoint = value;
                                setQuestions(updatedQuestions);
                              }}
                            >
                              {points.map((option) => (
                                <Option
                                  key={option}
                                  value={option}
                                  className="font-[Montserrat] "
                                >
                                  {option}
                                </Option>
                              ))}
                            </Select>
                            <Select
                              className="bg-transparent z-[-5]"
                              value={selectedDuration}
                              onChange={(value) => {
                                setHasSelectedDuration(true);
                                const updatedQuestions = [...questions];
                                updatedQuestions[index].duration = value;
                                setQuestions(updatedQuestions);
                              }}
                            >
                              {durationOptionsInMinutes.map((option) => (
                                <Option
                                  key={option.value}
                                  value={option.value}
                                  className="font-[Montserrat]"
                                >
                                  {option.value}
                                </Option>
                              ))}
                            </Select>
                            <Select
                              value={selectedLevel}
                              onChange={(value) => {
                                setHasSelectedLevel(true);
                                const updatedQuestions = [...questions];
                                updatedQuestions[index].level = value;
                                setQuestions(updatedQuestions);
                                setSelectedLevel(updatedQuestions[index].level);
                              }}
                              className="bg-transparent"
                            >
                              <Option value="Easy">Easy</Option>
                              <Option value="Medium">Medium</Option>
                              <Option value="Hard">Hard</Option>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="hidden lg:block lg:mb-5">
                  {questions.map((q, index) => (
                    <div
                      className={`flex items-center flex-col sm:flex-row px-3  justify-between gap-2  text-sm text-[#212529] box-border ${
                        index === selectedQuestionIndex ? "block" : "hidden"
                      }`}
                      key={index}
                    >
                      <div className="flex w-full sm:w-auto selectQuestionType  gap-2 items-center z-[1010] sm:z-[1000]">
                        <Select
                          value={selectedOption}
                          onChange={(value) => {
                            setHasSelectedOption(true);
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].selectedType = value;
                            setQuestions(updatedQuestions);
                            setSelectedQuestionType(
                              updatedQuestions[index].selectedType
                            );
                          }}
                          className="bg-transparent"
                        >
                          <Option value="Single Select">Single Select</Option>
                          <Option value="Multi Select">Multi Select</Option>
                          <Option value="Fill in the blanks">
                            Fill in the blanks
                          </Option>
                          <Option value="Poll">Poll</Option>
                          <Option value="True/False">True/False</Option>
                          <Option value="Guess Word">Guess Word</Option>
                        </Select>
                      </div>
                      <div className="flex flex-row gap-3 items-center justify-center  w-full sm:w-auto ">
                        <div className=" flex gap-3 flex-col sm:flex-row items-center z-[1000] selectPoint w-full sm:w-auto ">
                          <Select
                            className="bg-transparent "
                            value={selectedPoints}
                            onChange={(value) => {
                              setHasSelectedPoints(true);
                              const updatedQuestions = [...questions];
                              updatedQuestions[index].selectPoint = value;
                              setQuestions(updatedQuestions);
                            }}
                          >
                            {points.map((option) => (
                              <Option
                                key={option}
                                value={option}
                                className="font-[Montserrat] "
                              >
                                {option}
                              </Option>
                            ))}
                          </Select>
                          <Select
                            className="bg-transparent z-[-5]"
                            value={selectedDuration}
                            onChange={(value) => {
                              setHasSelectedDuration(true);
                              const updatedQuestions = [...questions];
                              updatedQuestions[index].duration = value;
                              setQuestions(updatedQuestions);
                            }}
                          >
                            {durationOptionsInMinutes.map((option) => (
                              <Option
                                key={option.value}
                                value={option.value}
                                className="font-[Montserrat]"
                              >
                                {option.value}
                              </Option>
                            ))}
                          </Select>
                          <Select
                            value={selectedLevel}
                            onChange={(value) => {
                              setHasSelectedLevel(true);
                              const updatedQuestions = [...questions];
                              updatedQuestions[index].level = value;
                              setQuestions(updatedQuestions);
                              setSelectedLevel(updatedQuestions[index].level);
                            }}
                            className="bg-transparent"
                          >
                            <Option value="Easy">Easy</Option>
                            <Option value="Medium">Medium</Option>
                            <Option value="Hard">Hard</Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  {selectedQuestionType &&
                    selectedQuestionType == "Single Select" && (
                      <>
                        {explanationData ? (
                          <div className="w-full lg:flex justify-center items-center">
                            <div className="w-full lg:w-[70%] sm:px-2">
                              {questions.map((q, index) => (
                                <>
                                  <div
                                    key={index}
                                    className={`${
                                      index === selectedQuestionIndex
                                        ? "block"
                                        : "hidden"
                                    } flex mb-[4.8rem]  lg:mb-0 flex-col gap-[5px] w-full bg-[#4e1a3e]  sm:rounded-lg`}
                                  >
                                    <div className="relative w-full">
                                      <div
                                        className={`absolute   ${
                                          file !== null
                                            ? "left-[245px] lg:left-[567px] top-[240px] lg:top-[33px]  "
                                            : "left-[245px] top-[33px]"
                                        }  z-[800] text-[#fff] hover:text-[#fff]  cursor-pointer`}
                                      >
                                        <div className="flex gap-2 ">
                                          <div
                                            onClick={() =>
                                              handleOpenKeyboard("Q" + index)
                                            }
                                          >
                                            <PiSigmaThin />
                                          </div>
                                          {file == null ? (
                                            <div
                                              onClick={() =>
                                                handleUploadImageModal(
                                                  "Q" + index
                                                )
                                              }
                                            >
                                              <CiImageOn />
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                      {typeof window !== "undefined" && (
                                        <div
                                          className={`${
                                            file !== null
                                              ? "flex items-center w-full flex-col lg:flex-row"
                                              : ""
                                          }`}
                                        >
                                          {file &&
                                            currentEditorIndex ===
                                              "Q" + index && (
                                              <div className="absolute z-[900] top-[19px] lg:left-[11px] group w-[95%] sm:w-[98%] lg:w-[34%] group lg:flex justify-center  lg:h-[30.5vh] items-center">
                                                <div className="w-full lg:h-full lg:bg-[#232121eb] rounded-[8px] lg:flex justify-center items-center">
                                                  <Zoom>
                                                    <img
                                                      src={imageUrl}
                                                      alt="image"
                                                      width="340px"
                                                      className="h-[198px] w-full rounded-[8px] lg:rounded-[0px] flex justify-center items-center hover:brightness-50"
                                                    />
                                                  </Zoom>
                                                </div>
                                                <div className="flex gap-2 w-full rounded-t-[8px]  absolute top-[4px] right-[6px] justify-end opacity-100  lg:opacity-0 group-hover:opacity-100 lg:transition-opacity">
                                                  <span
                                                    className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                    onClick={() =>
                                                      handleReplaceImageModal(
                                                        "Q" + index
                                                      )
                                                    }
                                                  >
                                                    <MdCrop
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                    />
                                                  </span>
                                                  <span
                                                    className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                    onClick={handleDelete}
                                                  >
                                                    <RiDeleteBin6Line />
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          <div
                                            onDrop={(e) => e.preventDefault()}
                                            className={`questionDiv  ${
                                              file !== null
                                                ? "lg:ml-[35%] w-full lg:w-[65%] mt-[206px] lg:mt-0"
                                                : ""
                                            }`}
                                          >
                                            <ReactQuill
                                              modules={modules}
                                              ref={(ref) =>
                                                setQuillRef(ref, "Q" + index)
                                              }
                                              value={
                                                q.question ||
                                                katexValue.join(" ") ||
                                                ""
                                              }
                                              placeholder={`Type question here`}
                                              style={{
                                                background: "#4e1a3e",
                                                color: "white",
                                                borderRadius: "8px",
                                                border: "1px solid white",
                                              }}
                                              onChange={(value) => {
                                                const updatedQuestions = [
                                                  ...questions,
                                                ];
                                                updatedQuestions[
                                                  index
                                                ].question = value;
                                                setQuestions(updatedQuestions);
                                              }}
                                              className={`bg-white m-2 mt-5 rounded-lg relative no-scrollbar h-[30vh]`}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex  flex-col justify-center mx-2 mb-4 lg:flex-row gap-2">
                                      {q.options.map((option, optionIndex) => (
                                        <div
                                          key={optionIndex}
                                          className="relative w-full "
                                        >
                                          <div
                                            className={`flex gap-2 items-center z-[800] text-white absolute top-[13px] left-[235px] hover:text-[#fff]
                                            ${(() => {
                                              if (q.options.length === 5) {
                                                return " lg:top-[54px] lg:left-[15px]";
                                              } else if (
                                                q.options.length === 4
                                              ) {
                                                return " lg:top-[36px] lg:left-[96px]";
                                              } else if (
                                                q.options.length === 3
                                              ) {
                                                return " lg:top-[36px] lg:left-[41px]";
                                              } else if (q.options.length > 2) {
                                                return "lg:top-[36px] lg:left-[96px]";
                                              }
                                            })()}`}
                                          >
                                            <div className="cursor-pointer">
                                              {file == null ? (
                                                <div
                                                  onClick={() =>
                                                    handleOpenKeyboard(
                                                      "O" + optionIndex
                                                    )
                                                  }
                                                >
                                                  <PiSigmaThin />
                                                </div>
                                              ) : null}
                                            </div>
                                            <div className="cursor-pointer">
                                              {file == null ? (
                                                <div
                                                  onClick={() =>
                                                    handleUploadImageModal(
                                                      "O" + optionIndex
                                                    )
                                                  }
                                                >
                                                  <CiImageOn />
                                                </div>
                                              ) : null}
                                            </div>
                                          </div>
                                          {typeof window !== "undefined" && (
                                            <>
                                              {file &&
                                                currentEditorIndex ===
                                                  "O" + optionIndex && (
                                                  <div
                                                    className={`absolute flex justify-center items-center flex-col  z-[900] group ${
                                                      file == null
                                                        ? "top-[88px]"
                                                        : "top-[35px]"
                                                    }  w-[97%] ml-[6px] lg:ml-[4px]`}
                                                  >
                                                    <Zoom>
                                                      <img
                                                        src={imageUrl}
                                                        alt="image"
                                                        width="100px"
                                                        className="w-full h-[145px] rounded-t-lg hover:brightness-50"
                                                      />
                                                    </Zoom>
                                                    <div className="flex gap-2 absolute top-[5px] right-[5px] w-full justify-end opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                      <span
                                                        className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                        onClick={() =>
                                                          handleReplaceImageModal(
                                                            "O" + index
                                                          )
                                                        }
                                                      >
                                                        <MdCrop />
                                                      </span>
                                                      <span
                                                        className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                        onClick={handleDelete}
                                                      >
                                                        <RiDeleteBin6Line />
                                                      </span>
                                                    </div>
                                                  </div>
                                                )}
                                              <div
                                                onDrop={(e) =>
                                                  e.preventDefault()
                                                }
                                                className={`optionDiv`}
                                              >
                                                <ReactQuill
                                                  key={optionIndex}
                                                  modules={modules}
                                                  ref={(ref) =>
                                                    setQuillRef(
                                                      ref,
                                                      "O" + optionIndex
                                                    )
                                                  }
                                                  value={option}
                                                  onChange={(value) => {
                                                    handleOptionChange(
                                                      optionIndex,
                                                      value
                                                    );
                                                  }}
                                                  onKeyDown={(event) => {
                                                    if (file !== null) {
                                                      const characterText =
                                                        option;
                                                      const maxCharacters = 60;
                                                      if (
                                                        characterText.length >
                                                          maxCharacters &&
                                                        event.key !==
                                                          "Backspace"
                                                      ) {
                                                        event.preventDefault();
                                                        const Toast =
                                                          Swal.mixin({
                                                            toast: true,
                                                            position: "top-end",
                                                            showConfirmButton: false,
                                                            timer: 1000,
                                                            timerProgressBar: true,
                                                          });
                                                        Toast.fire({
                                                          icon: "info",
                                                          title: `Text limit reached`,
                                                        });
                                                      }
                                                    }
                                                  }}
                                                  style={{
                                                    background:
                                                      colors[
                                                        optionIndex %
                                                          colors.length
                                                      ],
                                                    color: "white",
                                                    borderRadius: "8px",
                                                  }}
                                                  placeholder="Type answer option here"
                                                  className={`mb-2 border-0  ${
                                                    file == null
                                                      ? "min-h-[23vh] lg:h-[38vh]"
                                                      : "h-[44vh] lg:h-[34vh]"
                                                  } lg:mb-0 text-white rounded-lg no-scrollbar ${
                                                    shouldApplyPadding
                                                      ? "apply-padding"
                                                      : ""
                                                  } ${
                                                    shouldApplyPadding
                                                      ? "hide-toolbar"
                                                      : ""
                                                  } `}
                                                />
                                              </div>
                                            </>
                                          )}
                                          <div
                                            className={`absolute flex justify-between w-full ${
                                              q.options.length > 2
                                                ? "px-3"
                                                : "pr-3"
                                            } items-center h-[10px] ${
                                              file == null
                                                ? "top-[38px]"
                                                : "top-[8px]"
                                            }  cursor-pointer`}
                                          >
                                            <div className="flex items-center gap-1">
                                              <div
                                                className={` ${
                                                  file !== null &&
                                                  q.options.length > 2
                                                    ? "mt-[6px] p-1 rounded-[3px] bg-[#fff3]  hover:bg-[#ffffff54]"
                                                    : " lg:mt-[2px] lg:ml-[3px] relative top-[-22px] lg:top-[1px] left-[273px] lg:left-0"
                                                }`}
                                              >
                                                {q.options.length > 2 && (
                                                  <span
                                                    onClick={() =>
                                                      handleDeleteOption(
                                                        index,
                                                        optionIndex
                                                      )
                                                    }
                                                  >
                                                    <MdDelete
                                                      style={{
                                                        color: "white",
                                                      }}
                                                    />
                                                  </span>
                                                )}
                                              </div>
                                              <div
                                                className={`${
                                                  file !== null &&
                                                  q.options.length > 2
                                                    ? "mt-[6px] p-1 rounded-[3px] bg-[#fff3] hover:bg-[#ffffff54]"
                                                    : "ml-[0px] bg-[#fff3] hover:bg-[#ffffff54] mt-[6px] p-1 rounded-[3px]"
                                                } ${
                                                  file !== null ? "" : "hidden"
                                                }`}
                                              >
                                                <span
                                                  onClick={() =>
                                                    handleRemoveImage(
                                                      "O" + optionIndex
                                                    )
                                                  }
                                                >
                                                  {file == null ? (
                                                    <CiImageOn
                                                      style={{
                                                        color: "white",
                                                      }}
                                                    />
                                                  ) : (
                                                    <RiText
                                                      style={{
                                                        color: "white",
                                                      }}
                                                    />
                                                  )}
                                                </span>
                                              </div>
                                            </div>
                                            <div
                                              className={`inputRadioOptions ${
                                                isAnyRadioChecked
                                                  ? ""
                                                  : "zoom-animation "
                                              } ${
                                                file == null
                                                  ? "mt-[-36px] absolute right-[5px]"
                                                  : "mt-[12px]"
                                              }`}
                                            >
                                              {(!option ||
                                                option.trim() == "") &&
                                              file == null ? (
                                                <div>
                                                  <input
                                                    data-tooltip-id={`tooltip-${index}-${optionIndex}`}
                                                    className="w-[20px] h-[20px] cursor-pointer"
                                                    type="radio"
                                                    id={`correctOptionRadio-${index}-${optionIndex}`}
                                                    name={`correctOptionRadio-${index}`}
                                                    checked={
                                                      q.correctOptionIndex ===
                                                      optionIndex
                                                    }
                                                  />
                                                  <Tooltip
                                                    id={`tooltip-${index}-${optionIndex}`}
                                                    place="top"
                                                    type="info"
                                                    effect="solid"
                                                    style={{
                                                      backgroundColor: "red",
                                                      color: "white",
                                                    }}
                                                  >
                                                    Please fill in the options
                                                    first!
                                                  </Tooltip>
                                                </div>
                                              ) : (
                                                <div>
                                                  <input
                                                    className="w-[20px] h-[20px] cursor-pointer"
                                                    type="radio"
                                                    id={`correctOptionRadio-${index}-${optionIndex}`}
                                                    name={`correctOptionRadio-${index}`}
                                                    checked={
                                                      q.correctOptionIndex ===
                                                      optionIndex
                                                    }
                                                    onChange={() => {
                                                      const updatedQuestions = [
                                                        ...questions,
                                                      ];
                                                      updatedQuestions[
                                                        index
                                                      ].correctOptionIndex =
                                                        optionIndex;
                                                      setQuestions(
                                                        updatedQuestions
                                                      );
                                                      setIsAnyRadioChecked(
                                                        true
                                                      );
                                                    }}
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                      {q.options.length < 5 && (
                                        <span className="flex justify-center items-center lg:h-full px-3  text-white ">
                                          <span
                                            className="lg:absolute mt-[-15px] lg:mt-0 lg:top-[72%] cursor-pointer"
                                            onClick={handleAddOption}
                                          >
                                            <span className="hidden lg:block text-[50px]">
                                              {" "}
                                              +
                                            </span>
                                            <span className="flex items-center gap-1 lg:hidden text-[20px] my-3">
                                              <FaPlus />
                                              Add more options
                                            </span>
                                          </span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                            <div className="w-full bg-[#ffffff] fixed bottom-0 z-[1000]  px-[5px] py-[10px]">
                              <div className="flex justify-between gap-3 items-center w-full">
                                <DragDropContext onDragEnd={handleDrop}>
                                  <Droppable
                                    droppableId="list-container"
                                    direction="horizontal"
                                  >
                                    {(provided) => (
                                      <div
                                        className="flex lg:hidden items-center gap-2 min-w-[85%] h-[65px] overflow-x-auto"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                      >
                                        {questions.map((q, index) => (
                                          <Draggable
                                            key={q.id}
                                            draggableId={q.id}
                                            index={index}
                                          >
                                            {(provided) => (
                                              <div
                                                className="flex justify-between "
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                              >
                                                <span>{`${index + 1}`} </span>
                                                <div
                                                  className={`border-[1px] flex items-center mx-1 gap-2 imageSize border-blue-100 rounded-lg relative w-[80px] h-[60px] ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "shadow-[0px_0px_0px_3px_#FF0000]"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    handleQuestionClick(index)
                                                  }
                                                >
                                                  {file !== null ? (
                                                    <>
                                                      <img
                                                        src={imageUrl}
                                                        alt=""
                                                        className="w-full h-full object-cover brightness-50"
                                                      />
                                                      <div className="absolute top-0 left-0 right-0  bottom-0 flex items-center justify-center overflow-y-hidden ">
                                                        <div className="line-clamp-3 text-white pt-2 px-2 my-3">
                                                          <div
                                                            dangerouslySetInnerHTML={{
                                                              __html:
                                                                DOMPurify.sanitize(
                                                                  q.question.replace(
                                                                    /\\\((.*?)\\\)/g,
                                                                    (
                                                                      match,
                                                                      mathExpression
                                                                    ) => {
                                                                      try {
                                                                        return katex.renderToString(
                                                                          mathExpression,
                                                                          {
                                                                            throwOnError: false,
                                                                          }
                                                                        );
                                                                      } catch (error) {
                                                                        return match;
                                                                      }
                                                                    }
                                                                  )
                                                                ),
                                                            }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <div className="line-clamp-3 pt-2 px-2 my-3">
                                                      <div
                                                        dangerouslySetInnerHTML={{
                                                          __html:
                                                            DOMPurify.sanitize(
                                                              q.question.replace(
                                                                /\\\((.*?)\\\)/g,
                                                                (
                                                                  match,
                                                                  mathExpression
                                                                ) => {
                                                                  try {
                                                                    return katex.renderToString(
                                                                      mathExpression,
                                                                      {
                                                                        throwOnError: false,
                                                                      }
                                                                    );
                                                                  } catch (error) {
                                                                    return match;
                                                                  }
                                                                }
                                                              )
                                                            ),
                                                        }}
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                </DragDropContext>
                                <div className="w-[10%]">
                                  {questions.map((q, index) => (
                                    <div key={index}>
                                      {questions.length >= 1 && (
                                        <button
                                          aria-label="add question"
                                          type="submit"
                                          onClick={handleAddQuestion}
                                          className={` flex items-center z-[1000] justify-center gap-2 h-[2.2rem] px-4 py-1.5 text-5xl  bg-[#8e51bb] text-white
                                                    hover:bg-[#a574c8] rounded-[4px] w-[10%] ${
                                                      index ===
                                                      selectedQuestionIndex
                                                        ? "lg:hidden"
                                                        : "hidden"
                                                    }`}
                                        >
                                          +
                                          {/* <FaSave style={{ marginTop: "-2px" }} />
                                                    Add Question */}
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className=" ">
                              {questions.map((q, index) => (
                                <>
                                  <div
                                    key={index}
                                    className={`${
                                      index === selectedQuestionIndex
                                        ? "block"
                                        : "hidden"
                                    } flex mt-5 flex-col gap-[5px] w-full rounded-lg`}
                                  >
                                    <div className="w-full">
                                      <div className="">
                                        {typeof window !== "undefined" && (
                                          <div className=" w-full lg:w-[99%] lg:mx-2 bg-[#090909] lg:rounded-lg">
                                            <div className="flex justify-between items-center p-3 pb-0 w-full">
                                              <div className="flex items-center gap-1">
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={
                                                    handleSaveExplanation
                                                  }
                                                  className={`text-white select-none bg-[#3a3a3a] font-medium rounded-[4px] flex items-center gap-2  px-4 py-1 text-sm  text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-2  lg:hidden">
                                                    <FaArrowLeft />
                                                    Back
                                                  </div>
                                                  <div className="hidden lg:flex items-center gap-2 ">
                                                    <FaArrowLeft />
                                                    Back to the question
                                                  </div>
                                                </button>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={
                                                    handleSaveExplanation
                                                  }
                                                  className={`text-white select-none bg-[#00b4d0] font-medium rounded-[4px] flex items-center gap-2 px-4 py-1 text-sm  text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-2  lg:hidden">
                                                    <FaSave />
                                                    Save
                                                  </div>
                                                  <div className="hidden lg:flex items-center gap-2 ">
                                                    <FaSave />
                                                    Save answer explanation
                                                  </div>
                                                </button>
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={() =>
                                                    handleDeleteExplanation(
                                                      index
                                                    )
                                                  }
                                                  className={`text-white select-none bg-[#EC0B43] font-medium flex items-center gap-2  rounded-[4px] text-sm px-4 py-1 text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <RiDeleteBin6Line />
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                            <div className="flex flex-col lg:flex-row w-full bg-[#090909] p-3 rounded-lg gap-3">
                                              <div className="lg:w-[50%] text-white rounded-lg h-[40vh] lg:h-[60vh] border-dotted border-2 border-white">
                                                {file !== null ? (
                                                  currentEditorIndex ===
                                                    "S" + index && (
                                                    <div className="flex justify-center items-center relative flex-col w-full h-[40vh] lg:h-[60vh] z-[900] group">
                                                      <Zoom>
                                                        <img
                                                          src={imageUrl}
                                                          alt="image"
                                                          width="300px"
                                                          className="h-[140px] lg:h-[285px] w-full lg:hover:brightness-50"
                                                        />
                                                      </Zoom>
                                                      <div className="flex gap-2 absolute top-[8px] right-[5px] w-full justify-end opacity-100 lg:opacity-0  lg:group-hover:opacity-100 transition-opacity">
                                                        <span
                                                          className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                          onClick={() =>
                                                            handleReplaceImageModal(
                                                              "S" + index
                                                            )
                                                          }
                                                        >
                                                          <MdCrop />
                                                        </span>
                                                        <span
                                                          className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                          onClick={handleDelete}
                                                        >
                                                          <RiDeleteBin6Line />
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )
                                                ) : (
                                                  <div className="flex flex-col gap-2 justify-center text-[20px] items-center h-[40vh] lg:h-[60vh]">
                                                    <p className>Add Media</p>
                                                    <div
                                                      className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                      onClick={() =>
                                                        handleUploadImageModal(
                                                          "S" + index
                                                        )
                                                      }
                                                    >
                                                      <CiImageOn />
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <div
                                                onDrop={(e) =>
                                                  e.preventDefault()
                                                }
                                                className={`bg-white rounded-lg relative explanationDiv no-scrollbar w-full`}
                                              >
                                                <ReactQuill
                                                  modules={modules}
                                                  ref={(ref) =>
                                                    setQuillRef(
                                                      ref,
                                                      "S" + index
                                                    )
                                                  }
                                                  color="teal"
                                                  placeholder="Type a fun fact or explanation for the correct answer..."
                                                  type="text"
                                                  name="explanation"
                                                  id="explanation"
                                                  autoComplete="off"
                                                  value={q.explanation}
                                                  onChange={(value) => {
                                                    const updatedQuestions = [
                                                      ...questions,
                                                    ];
                                                    updatedQuestions[
                                                      index
                                                    ].explanation = value;
                                                    setQuestions(
                                                      updatedQuestions
                                                    );
                                                  }}
                                                  className="bg-[#090909] text-white rounded-lg h-[60vh] border-dotted border-2 border-white"
                                                />
                                                <div className="absolute top-[14px] left-[235px] text-[#fff] hover:text-[#fff]  cursor-pointer">
                                                  <div className="flex">
                                                    <div
                                                      onClick={() =>
                                                        handleOpenKeyboard(
                                                          "S" + index
                                                        )
                                                      }
                                                    >
                                                      <PiSigmaThin />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  {selectedQuestionType &&
                    selectedQuestionType == "Multi Select" && (
                      <>
                        {explanationData ? (
                          <div className="w-full lg:flex justify-center items-center">
                            <div className="w-full lg:w-[70%] sm:px-2">
                              {questions.map((q, index) => (
                                <>
                                  <div
                                    key={index}
                                    className={`${
                                      index === selectedQuestionIndex
                                        ? "block"
                                        : "hidden"
                                    } flex mb-[4.8rem]  lg:mb-0 flex-col gap-[5px] w-full bg-[#4e1a3e]  sm:rounded-lg`}
                                  >
                                    <div className="relative w-full">
                                      <div
                                        className={`absolute   ${
                                          file !== null
                                            ? "left-[245px] lg:left-[567px] top-[240px] lg:top-[33px]  "
                                            : "left-[245px] top-[33px]"
                                        }  z-[800] text-[#fff] hover:text-[#fff]  cursor-pointer`}
                                      >
                                        <div className="flex gap-2 ">
                                          <div
                                            onClick={() =>
                                              handleOpenKeyboard("Q" + index)
                                            }
                                          >
                                            <PiSigmaThin />
                                          </div>
                                          {file == null ? (
                                            <div
                                              onClick={() =>
                                                handleUploadImageModal(
                                                  "Q" + index
                                                )
                                              }
                                            >
                                              <CiImageOn />
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                      {typeof window !== "undefined" && (
                                        <div
                                          className={`${
                                            file !== null
                                              ? "flex items-center w-full flex-col lg:flex-row"
                                              : ""
                                          }`}
                                        >
                                          {file &&
                                            currentEditorIndex ===
                                              "Q" + index && (
                                              <div className="absolute z-[900] top-[19px] lg:left-[11px] group w-[95%] sm:w-[98%] lg:w-[34%] group lg:flex justify-center  lg:h-[30.5vh] items-center">
                                                <div className="w-full lg:h-full lg:bg-[#232121eb] rounded-[8px] lg:flex justify-center items-center">
                                                  <Zoom>
                                                    <img
                                                      src={imageUrl}
                                                      alt="image"
                                                      width="340px"
                                                      className="h-[198px] w-full rounded-[8px] lg:rounded-[0px] flex justify-center items-center hover:brightness-50"
                                                    />
                                                  </Zoom>
                                                </div>
                                                <div className="flex gap-2 w-full rounded-t-[8px]  absolute top-[4px] right-[6px] justify-end opacity-100  lg:opacity-0 group-hover:opacity-100 lg:transition-opacity">
                                                  <span
                                                    className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                    onClick={() =>
                                                      handleReplaceImageModal(
                                                        "Q" + index
                                                      )
                                                    }
                                                  >
                                                    <MdCrop
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                    />
                                                  </span>
                                                  <span
                                                    className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                    onClick={handleDelete}
                                                  >
                                                    <RiDeleteBin6Line />
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          <div
                                            onDrop={(e) => e.preventDefault()}
                                            className={`questionDiv  ${
                                              file !== null
                                                ? "lg:ml-[35%] w-full lg:w-[65%] mt-[206px] lg:mt-0"
                                                : ""
                                            }`}
                                          >
                                            <ReactQuill
                                              modules={modules}
                                              ref={(ref) =>
                                                setQuillRef(ref, "Q" + index)
                                              }
                                              value={
                                                q.question ||
                                                katexValue.join(" ") ||
                                                ""
                                              }
                                              placeholder={`Type question here`}
                                              style={{
                                                background: "#4e1a3e",
                                                color: "white",
                                                borderRadius: "8px",
                                                border: "1px solid white",
                                              }}
                                              onChange={(value) => {
                                                const updatedQuestions = [
                                                  ...questions,
                                                ];
                                                updatedQuestions[
                                                  index
                                                ].question = value;
                                                setQuestions(updatedQuestions);
                                              }}
                                              className={`bg-white m-2 mt-5 rounded-lg relative no-scrollbar h-[30vh]`}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex  flex-col justify-center mx-2 mb-4 lg:flex-row gap-2">
                                      {q.options.map((option, optionIndex) => (
                                        <div
                                          key={optionIndex}
                                          className="relative w-full"
                                        >
                                          <div
                                            className={`flex gap-2 items-center z-[800] text-white absolute top-[13px] left-[235px] 
                                    ${(() => {
                                      if (q.options.length === 5) {
                                        return " lg:top-[54px] lg:left-[15px]";
                                      } else if (q.options.length === 4) {
                                        return " lg:top-[36px] lg:left-[96px]";
                                      } else if (q.options.length === 3) {
                                        return " lg:top-[36px] lg:left-[41px]";
                                      } else if (q.options.length > 2) {
                                        return "lg:top-[36px] lg:left-[96px]";
                                      }
                                    })()}
                                    hover:text-[#fff]`}
                                          >
                                            <div className="cursor-pointer">
                                              {file == null ? (
                                                <div
                                                  onClick={() =>
                                                    handleOpenKeyboard(
                                                      "O" + optionIndex
                                                    )
                                                  }
                                                >
                                                  <PiSigmaThin />
                                                </div>
                                              ) : null}
                                            </div>
                                            <div className="cursor-pointer">
                                              {file == null ? (
                                                <div
                                                  onClick={() =>
                                                    handleUploadImageModal(
                                                      "O" + optionIndex
                                                    )
                                                  }
                                                >
                                                  <CiImageOn />
                                                </div>
                                              ) : null}
                                            </div>
                                          </div>
                                          {typeof window !== "undefined" && (
                                            <>
                                              {file &&
                                                currentEditorIndex ===
                                                  "O" + optionIndex && (
                                                  <div
                                                    className={`absolute flex justify-center items-center flex-col  z-[900] group ${
                                                      file == null
                                                        ? "top-[88px]"
                                                        : "top-[35px]"
                                                    }  w-[97%] ml-[6px] lg:ml-[4px]`}
                                                  >
                                                    <Zoom>
                                                      <img
                                                        src={imageUrl}
                                                        alt="image"
                                                        width="100px"
                                                        className="w-full h-[145px] rounded-t-lg hover:brightness-50"
                                                      />
                                                    </Zoom>
                                                    <div className="flex gap-2 absolute top-[5px] right-[5px] w-full justify-end opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                      <span
                                                        className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                        onClick={() =>
                                                          handleReplaceImageModal(
                                                            "O" + index
                                                          )
                                                        }
                                                      >
                                                        <MdCrop />
                                                      </span>
                                                      <span
                                                        className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                        onClick={handleDelete}
                                                      >
                                                        <RiDeleteBin6Line />
                                                      </span>
                                                    </div>
                                                  </div>
                                                )}
                                              <div
                                                onDrop={(e) =>
                                                  e.preventDefault()
                                                }
                                                className={`optionDiv`}
                                              >
                                                <ReactQuill
                                                  key={optionIndex}
                                                  modules={modules}
                                                  ref={(ref) =>
                                                    setQuillRef(
                                                      ref,
                                                      "O" + optionIndex
                                                    )
                                                  }
                                                  value={option}
                                                  onChange={(value) => {
                                                    handleOptionChange(
                                                      optionIndex,
                                                      value
                                                    );
                                                  }}
                                                  onKeyDown={(event) => {
                                                    if (file !== null) {
                                                      const characterText =
                                                        option;
                                                      const maxCharacters = 60;
                                                      if (
                                                        characterText.length >
                                                          maxCharacters &&
                                                        event.key !==
                                                          "Backspace"
                                                      ) {
                                                        event.preventDefault();
                                                        const Toast =
                                                          Swal.mixin({
                                                            toast: true,
                                                            position: "top-end",
                                                            showConfirmButton: false,
                                                            timer: 1000,
                                                            timerProgressBar: true,
                                                          });
                                                        Toast.fire({
                                                          icon: "info",
                                                          title: `Text limit reached`,
                                                        });
                                                      }
                                                    }
                                                  }}
                                                  style={{
                                                    background:
                                                      colors[
                                                        optionIndex %
                                                          colors.length
                                                      ],
                                                    color: "white",
                                                    borderRadius: "8px",
                                                  }}
                                                  placeholder="Type answer option here"
                                                  className={`mb-2 border-0  ${
                                                    file == null
                                                      ? "min-h-[23vh] lg:h-[38vh]"
                                                      : "h-[44vh] lg:h-[34vh]"
                                                  } lg:mb-0 text-white rounded-lg no-scrollbar ${
                                                    shouldApplyPadding
                                                      ? "apply-padding"
                                                      : ""
                                                  } ${
                                                    shouldApplyPadding
                                                      ? "hide-toolbar"
                                                      : ""
                                                  } `}
                                                />
                                                <Tooltip
                                                  id={`tooltipforLimit-${index}-${optionIndex}`}
                                                  place="bottom"
                                                  type="info"
                                                  effect="solid"
                                                  style={{
                                                    backgroundColor: "red",
                                                    color: "white",
                                                  }}
                                                >
                                                  Maximum 40 characters
                                                </Tooltip>
                                              </div>
                                            </>
                                          )}
                                          <div
                                            className={`absolute flex justify-between w-full ${
                                              q.options.length > 2
                                                ? "px-3"
                                                : "pr-3"
                                            } items-center h-[10px] ${
                                              file == null
                                                ? "top-[38px]"
                                                : "top-[8px]"
                                            }  cursor-pointer`}
                                          >
                                            <div className="flex items-center gap-1">
                                              <div
                                                className={` ${
                                                  file !== null &&
                                                  q.options.length > 2
                                                    ? "mt-[6px] p-1 rounded-[3px] bg-[#fff3]  hover:bg-[#ffffff54]"
                                                    : " lg:mt-[2px] lg:ml-[3px] relative top-[-22px] lg:top-[1px] left-[273px] lg:left-0"
                                                }`}
                                              >
                                                {q.options.length > 2 && (
                                                  <span
                                                    onClick={() =>
                                                      handleDeleteOption(
                                                        index,
                                                        optionIndex
                                                      )
                                                    }
                                                  >
                                                    <MdDelete
                                                      style={{
                                                        color: "white",
                                                      }}
                                                    />
                                                  </span>
                                                )}
                                              </div>
                                              <div
                                                className={`${
                                                  file !== null &&
                                                  q.options.length > 2
                                                    ? "mt-[6px] p-1 rounded-[3px] bg-[#fff3] hover:bg-[#ffffff54]"
                                                    : "ml-[0px] bg-[#fff3] hover:bg-[#ffffff54] mt-[6px] p-1 rounded-[3px]"
                                                } ${
                                                  file !== null ? "" : "hidden"
                                                }`}
                                              >
                                                <span
                                                  onClick={() =>
                                                    handleRemoveImage(
                                                      "O" + optionIndex
                                                    )
                                                  }
                                                >
                                                  {file == null ? (
                                                    <CiImageOn
                                                      style={{
                                                        color: "white",
                                                      }}
                                                    />
                                                  ) : (
                                                    <RiText
                                                      style={{
                                                        color: "white",
                                                      }}
                                                    />
                                                  )}
                                                </span>
                                              </div>
                                            </div>
                                            <div
                                              className={`inputRadioOptions ${
                                                isAnyRadioChecked
                                                  ? ""
                                                  : "zoom-animation"
                                              } ${
                                                file == null
                                                  ? "mt-[-36px] absolute right-[5px]"
                                                  : "mt-[12px]"
                                              }`}
                                            >
                                              {(!option ||
                                                option.trim() == "") &&
                                              file == null ? (
                                                <div>
                                                  <input
                                                    data-tooltip-id={`tooltip-${index}-${optionIndex}`}
                                                    className="w-[20px] h-[20px] cursor-pointer"
                                                    type="checkbox"
                                                    id={`correctOptionRadio-${index}-${optionIndex}`}
                                                    name={`correctOptionRadio-${index}`}
                                                    checked={
                                                      q.correctOptionIndex ===
                                                      optionIndex
                                                    }
                                                  />
                                                  <Tooltip
                                                    id={`tooltip-${index}-${optionIndex}`}
                                                    place="top"
                                                    type="info"
                                                    effect="solid"
                                                    style={{
                                                      backgroundColor: "red",
                                                      color: "white",
                                                    }}
                                                  >
                                                    Please fill in the options
                                                    first!
                                                  </Tooltip>
                                                </div>
                                              ) : (
                                                <input
                                                  className="w-[20px] h-[20px] cursor-pointer"
                                                  type="checkbox"
                                                  id={`correctOptionRadio-${index}-${optionIndex}`}
                                                  name={`correctOptionRadio-${index}`}
                                                  onChange={() => {
                                                    const updatedQuestions = [
                                                      ...questions,
                                                    ];
                                                    const currentIndices =
                                                      updatedQuestions[index]
                                                        .correctOptionIndex ||
                                                      [];
                                                    if (
                                                      currentIndices.includes(
                                                        optionIndex
                                                      )
                                                    ) {
                                                      updatedQuestions[
                                                        index
                                                      ].correctOptionIndex =
                                                        currentIndices.filter(
                                                          (i) =>
                                                            i !== optionIndex
                                                        );
                                                    } else {
                                                      updatedQuestions[
                                                        index
                                                      ].correctOptionIndex = [
                                                        ...currentIndices,
                                                        optionIndex,
                                                      ];
                                                    }
                                                    setQuestions(
                                                      updatedQuestions
                                                    );
                                                  }}
                                                />
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                      {q.options.length < 5 && (
                                        <span className="flex justify-center items-center lg:h-full px-3  text-white ">
                                          <span
                                            className="lg:absolute mt-[-15px] lg:mt-0 lg:top-[72%] cursor-pointer"
                                            onClick={handleAddOption}
                                          >
                                            <span className="hidden lg:block text-[50px]">
                                              +
                                            </span>
                                            <span className="flex items-center gap-1 lg:hidden text-[20px] my-3">
                                              <FaPlus />
                                              Add more options
                                            </span>
                                          </span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                            <div className="w-full bg-[#ffffff] fixed bottom-0 z-[1000]  px-[5px] py-[10px]">
                              <div className="flex justify-between gap-3 items-center w-full">
                                <DragDropContext onDragEnd={handleDrop}>
                                  <Droppable
                                    droppableId="list-container"
                                    direction="horizontal"
                                  >
                                    {(provided) => (
                                      <div
                                        className="flex lg:hidden items-center gap-2 min-w-[85%] h-[65px] overflow-x-auto"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                      >
                                        {questions.map((q, index) => (
                                          <Draggable
                                            key={q.id}
                                            draggableId={q.id}
                                            index={index}
                                          >
                                            {(provided) => (
                                              <div
                                                className="flex justify-between "
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                              >
                                                <span>{`${index + 1}`} </span>
                                                <div
                                                  className={`border-[1px] flex items-center mx-1 gap-2 imageSize border-blue-100 rounded-lg relative w-[80px] h-[60px] ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "shadow-[0px_0px_0px_3px_#FF0000]"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    handleQuestionClick(index)
                                                  }
                                                >
                                                  {file !== null ? (
                                                    <>
                                                      <img
                                                        src={imageUrl}
                                                        alt=""
                                                        className="w-full h-full object-cover brightness-50"
                                                      />
                                                      <div className="absolute top-0 left-0 right-0  bottom-0 flex items-center justify-center overflow-y-hidden ">
                                                        <div className="line-clamp-3 text-white pt-2 px-2 my-3">
                                                          <div
                                                            dangerouslySetInnerHTML={{
                                                              __html:
                                                                DOMPurify.sanitize(
                                                                  q.question.replace(
                                                                    /\\\((.*?)\\\)/g,
                                                                    (
                                                                      match,
                                                                      mathExpression
                                                                    ) => {
                                                                      try {
                                                                        return katex.renderToString(
                                                                          mathExpression,
                                                                          {
                                                                            throwOnError: false,
                                                                          }
                                                                        );
                                                                      } catch (error) {
                                                                        return match;
                                                                      }
                                                                    }
                                                                  )
                                                                ),
                                                            }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <div className="line-clamp-3 pt-2 px-2 my-3">
                                                      <div
                                                        dangerouslySetInnerHTML={{
                                                          __html:
                                                            DOMPurify.sanitize(
                                                              q.question.replace(
                                                                /\\\((.*?)\\\)/g,
                                                                (
                                                                  match,
                                                                  mathExpression
                                                                ) => {
                                                                  try {
                                                                    return katex.renderToString(
                                                                      mathExpression,
                                                                      {
                                                                        throwOnError: false,
                                                                      }
                                                                    );
                                                                  } catch (error) {
                                                                    return match;
                                                                  }
                                                                }
                                                              )
                                                            ),
                                                        }}
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                </DragDropContext>
                                <div className="w-[10%]">
                                  {questions.map((q, index) => (
                                    <div key={index}>
                                      {questions.length >= 1 && (
                                        <button
                                          aria-label="add question"
                                          type="submit"
                                          onClick={handleAddQuestion}
                                          className={` flex items-center z-[1000] justify-center gap-2 h-[2.2rem] px-4 py-1.5 text-5xl  bg-[#8e51bb] text-white
                                                    hover:bg-[#a574c8] rounded-[4px] w-[10%] ${
                                                      index ===
                                                      selectedQuestionIndex
                                                        ? "lg:hidden"
                                                        : "hidden"
                                                    }`}
                                        >
                                          +
                                          {/* <FaSave style={{ marginTop: "-2px" }} />
                                                    Add Question */}
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className=" ">
                              {questions.map((q, index) => (
                                <>
                                  <div
                                    key={index}
                                    className={`${
                                      index === selectedQuestionIndex
                                        ? "block"
                                        : "hidden"
                                    } flex mt-5 flex-col gap-[5px] w-full rounded-lg`}
                                  >
                                    <div className="w-full">
                                      <div className="">
                                        {typeof window !== "undefined" && (
                                          <div className=" w-full lg:w-[99%] lg:mx-2 bg-[#090909] lg:rounded-lg">
                                            <div className="flex justify-between items-center p-3 pb-0 w-full">
                                              <div className="flex items-center gap-1">
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={
                                                    handleSaveExplanation
                                                  }
                                                  className={`text-white select-none bg-[#3a3a3a] font-medium rounded-[4px] flex items-center gap-2  px-4 py-1 text-sm  text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-2  lg:hidden">
                                                    <FaArrowLeft />
                                                    Back
                                                  </div>
                                                  <div className="hidden lg:flex items-center gap-2 ">
                                                    <FaArrowLeft />
                                                    Back to the question
                                                  </div>
                                                </button>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={
                                                    handleSaveExplanation
                                                  }
                                                  className={`text-white select-none bg-[#00b4d0] font-medium rounded-[4px] flex items-center gap-2 px-4 py-1 text-sm  text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-2  lg:hidden">
                                                    <FaSave />
                                                    Save
                                                  </div>
                                                  <div className="hidden lg:flex items-center gap-2 ">
                                                    <FaSave />
                                                    Save answer explanation
                                                  </div>
                                                </button>
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={() =>
                                                    handleDeleteExplanation(
                                                      index
                                                    )
                                                  }
                                                  className={`text-white select-none bg-[#EC0B43] font-medium flex items-center gap-2  rounded-[4px] text-sm px-4 py-1 text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <RiDeleteBin6Line />
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                            <div className="flex flex-col lg:flex-row w-full bg-[#090909] p-3 rounded-lg gap-3">
                                              <div className="lg:w-[50%] text-white rounded-lg h-[40vh] lg:h-[60vh] border-dotted border-2 border-white">
                                                {file !== null ? (
                                                  currentEditorIndex ===
                                                    "S" + index && (
                                                    <div className="flex justify-center items-center relative flex-col w-full h-[40vh] lg:h-[60vh] z-[900] group">
                                                      <Zoom>
                                                        <img
                                                          src={imageUrl}
                                                          alt="image"
                                                          width="300px"
                                                          className="h-[140px] lg:h-[285px] w-full lg:hover:brightness-50"
                                                        />
                                                      </Zoom>
                                                      <div className="flex gap-2 absolute top-[8px] right-[5px] w-full justify-end opacity-100 lg:opacity-0  lg:group-hover:opacity-100 transition-opacity">
                                                        <span
                                                          className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                          onClick={() =>
                                                            handleReplaceImageModal(
                                                              "S" + index
                                                            )
                                                          }
                                                        >
                                                          <MdCrop />
                                                        </span>
                                                        <span
                                                          className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                          onClick={handleDelete}
                                                        >
                                                          <RiDeleteBin6Line />
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )
                                                ) : (
                                                  <div className="flex flex-col gap-2 justify-center text-[20px] items-center h-[40vh] lg:h-[60vh]">
                                                    <p className>Add Media</p>
                                                    <div
                                                      className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                      onClick={() =>
                                                        handleUploadImageModal(
                                                          "S" + index
                                                        )
                                                      }
                                                    >
                                                      <CiImageOn />
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <div
                                                onDrop={(e) =>
                                                  e.preventDefault()
                                                }
                                                className={`bg-white rounded-lg relative explanationDiv no-scrollbar w-full`}
                                              >
                                                <ReactQuill
                                                  modules={modules}
                                                  ref={(ref) =>
                                                    setQuillRef(
                                                      ref,
                                                      "S" + index
                                                    )
                                                  }
                                                  color="teal"
                                                  placeholder="Type a fun fact or explanation for the correct answer..."
                                                  type="text"
                                                  name="explanation"
                                                  id="explanation"
                                                  autoComplete="off"
                                                  value={q.explanation}
                                                  onChange={(value) => {
                                                    const updatedQuestions = [
                                                      ...questions,
                                                    ];
                                                    updatedQuestions[
                                                      index
                                                    ].explanation = value;
                                                    setQuestions(
                                                      updatedQuestions
                                                    );
                                                  }}
                                                  className="bg-[#090909] text-white rounded-lg h-[60vh] border-dotted border-2 border-white"
                                                />
                                                <div className="absolute top-[14px] left-[235px] text-[#fff] hover:text-[#fff]  cursor-pointer">
                                                  <div className="flex">
                                                    <div
                                                      onClick={() =>
                                                        handleOpenKeyboard(
                                                          "S" + index
                                                        )
                                                      }
                                                    >
                                                      <PiSigmaThin />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  {selectedQuestionType && selectedQuestionType == "Poll" && (
                    <>
                      {explanationData ? (
                        <div className="w-full lg:flex justify-center items-center">
                          <div className="w-full lg:w-[70%] sm:px-2">
                            {questions.map((q, index) => (
                              <>
                                <div
                                  key={index}
                                  className={`${
                                    index === selectedQuestionIndex
                                      ? "block"
                                      : "hidden"
                                  } flex mb-[4.8rem]  lg:mb-0 flex-col gap-[5px] w-full bg-[#4e1a3e]  sm:rounded-lg`}
                                >
                                  <div className="relative w-full">
                                    <div
                                      className={`absolute   ${
                                        file !== null
                                          ? "left-[245px] lg:left-[567px] top-[240px] lg:top-[33px]  "
                                          : "left-[245px] top-[33px]"
                                      }  z-[800] text-[#fff] hover:text-[#fff]  cursor-pointer`}
                                    >
                                      <div className="flex gap-2 ">
                                        <div
                                          onClick={() =>
                                            handleOpenKeyboard("Q" + index)
                                          }
                                        >
                                          <PiSigmaThin />
                                        </div>
                                        {file == null ? (
                                          <div
                                            onClick={() =>
                                              handleUploadImageModal(
                                                "Q" + index
                                              )
                                            }
                                          >
                                            <CiImageOn />
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                    {typeof window !== "undefined" && (
                                      <div
                                        className={`${
                                          file !== null
                                            ? "flex items-center w-full flex-col lg:flex-row"
                                            : ""
                                        }`}
                                      >
                                        {file &&
                                          currentEditorIndex ===
                                            "Q" + index && (
                                            <div className="absolute z-[900] top-[19px] lg:left-[11px] group w-[95%] sm:w-[98%] lg:w-[34%] group lg:flex justify-center  lg:h-[30.5vh] items-center">
                                              <div className="w-full lg:h-full lg:bg-[#232121eb] rounded-[8px] lg:flex justify-center items-center">
                                                <Zoom>
                                                  <img
                                                    src={imageUrl}
                                                    alt="image"
                                                    width="340px"
                                                    className="h-[198px] w-full rounded-[8px] lg:rounded-[0px] flex justify-center items-center hover:brightness-50"
                                                  />
                                                </Zoom>
                                              </div>
                                              <div className="flex gap-2 w-full rounded-t-[8px]  absolute top-[4px] right-[6px] justify-end opacity-100  lg:opacity-0 group-hover:opacity-100 lg:transition-opacity">
                                                <span
                                                  className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                  onClick={() =>
                                                    handleReplaceImageModal(
                                                      "Q" + index
                                                    )
                                                  }
                                                >
                                                  <MdCrop
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  />
                                                </span>
                                                <span
                                                  className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                  onClick={handleDelete}
                                                >
                                                  <RiDeleteBin6Line />
                                                </span>
                                              </div>
                                            </div>
                                          )}
                                        <div
                                          onDrop={(e) => e.preventDefault()}
                                          className={`questionDiv  ${
                                            file !== null
                                              ? "lg:ml-[35%] w-full lg:w-[65%] mt-[206px] lg:mt-0"
                                              : ""
                                          }`}
                                        >
                                          <ReactQuill
                                            modules={modules}
                                            ref={(ref) =>
                                              setQuillRef(ref, "Q" + index)
                                            }
                                            value={
                                              q.question ||
                                              katexValue.join(" ") ||
                                              ""
                                            }
                                            placeholder={`Type question here`}
                                            style={{
                                              background: "#4e1a3e",
                                              color: "white",
                                              borderRadius: "8px",
                                              border: "1px solid white",
                                            }}
                                            onChange={(value) => {
                                              const updatedQuestions = [
                                                ...questions,
                                              ];
                                              updatedQuestions[index].question =
                                                value;
                                              setQuestions(updatedQuestions);
                                            }}
                                            className={`bg-white m-2 mt-5 rounded-lg relative no-scrollbar h-[30vh]`}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex  flex-col justify-center mx-2 mb-4 lg:flex-row gap-2">
                                    {q.options.map((option, optionIndex) => (
                                      <div
                                        key={optionIndex}
                                        className="relative w-full "
                                      >
                                        <div
                                          className={`flex gap-2 items-center z-[800] text-white absolute top-[14px] left-[10px] 
                                    hover:text-[#fff]`}
                                        >
                                          <div className="cursor-pointer">
                                            {file == null ? (
                                              <div
                                                onClick={() =>
                                                  handleUploadImageModal(
                                                    "O" + optionIndex
                                                  )
                                                }
                                              >
                                                <CiImageOn />
                                              </div>
                                            ) : null}
                                          </div>
                                        </div>
                                        {typeof window !== "undefined" && (
                                          <>
                                            {file &&
                                              currentEditorIndex ===
                                                "O" + optionIndex && (
                                                <div
                                                  className={`absolute flex justify-center items-center flex-col  z-[900] group ${
                                                    file == null
                                                      ? "top-[88px]"
                                                      : "top-[35px]"
                                                  }  w-[97%] ml-[6px] lg:ml-[4px]`}
                                                >
                                                  <Zoom>
                                                    <img
                                                      src={imageUrl}
                                                      alt="image"
                                                      width="100px"
                                                      className="w-full h-[145px] rounded-t-lg hover:brightness-50"
                                                    />
                                                  </Zoom>
                                                  <div className="flex gap-2 absolute top-[5px] right-[5px] w-full justify-end opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span
                                                      className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                      onClick={() =>
                                                        handleReplaceImageModal(
                                                          "O" + index
                                                        )
                                                      }
                                                    >
                                                      <MdCrop />
                                                    </span>
                                                    <span
                                                      className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                      onClick={handleDelete}
                                                    >
                                                      <RiDeleteBin6Line />
                                                    </span>
                                                  </div>
                                                </div>
                                              )}
                                            <div
                                              onDrop={(e) => e.preventDefault()}
                                              className={`optionDiv ${
                                                file !== null
                                                  ? "pollOptionDivSmall lg:pollOptionDiv"
                                                  : "pollOptionDiv"
                                              } `}
                                            >
                                              <ReactQuill
                                                key={optionIndex}
                                                modules={{
                                                  toolbar: false,
                                                }}
                                                ref={(ref) =>
                                                  setQuillRef(
                                                    ref,
                                                    "O" + optionIndex
                                                  )
                                                }
                                                value={option}
                                                onChange={(value) => {
                                                  handleOptionChange(
                                                    optionIndex,
                                                    value
                                                  );
                                                }}
                                                onKeyDown={(event) => {
                                                  if (file !== null) {
                                                    const characterText =
                                                      option;
                                                    const maxCharacters = 60;
                                                    if (
                                                      characterText.length >
                                                        maxCharacters &&
                                                      event.key !== "Backspace"
                                                    ) {
                                                      event.preventDefault();
                                                      const Toast = Swal.mixin({
                                                        toast: true,
                                                        position: "top-end",
                                                        showConfirmButton: false,
                                                        timer: 1000,
                                                        timerProgressBar: true,
                                                      });
                                                      Toast.fire({
                                                        icon: "info",
                                                        title: `Text limit reached`,
                                                      });
                                                    }
                                                  }
                                                }}
                                                style={{
                                                  background:
                                                    colors[
                                                      optionIndex %
                                                        colors.length
                                                    ],
                                                  color: "white",
                                                  borderRadius: "8px",
                                                }}
                                                placeholder="Type poll option here"
                                                className={`mb-2  border-0  ${
                                                  file == null
                                                    ? "min-h-[23vh] mt-[27px] lg:mt-0 lg:h-[38.2vh]"
                                                    : "h-[44vh] lg:mt-0 lg:h-[38.2vh]"
                                                } lg:mb-0 text-white rounded-lg no-scrollbar ${
                                                  shouldApplyPadding
                                                    ? "apply-paddingPoll"
                                                    : ""
                                                } ${
                                                  shouldApplyPadding
                                                    ? "hide-toolbar"
                                                    : ""
                                                } `}
                                              />
                                            </div>
                                          </>
                                        )}
                                        <div
                                          className={`absolute flex justify-between w-full ${
                                            q.options.length > 2
                                              ? "px-3"
                                              : "pr-3"
                                          } items-center h-[10px] ${
                                            file == null
                                              ? "top-[38px]"
                                              : "top-[8px]"
                                          }  cursor-pointer`}
                                        >
                                          <div className="flex items-center gap-1">
                                            <div
                                              className={` ${
                                                file !== null &&
                                                q.options.length > 2
                                                  ? "mt-[6px] p-1 rounded-[3px] bg-[#fff3]  hover:bg-[#ffffff54]"
                                                  : " relative top-[-21px] left-[25px]"
                                              }`}
                                            >
                                              {q.options.length > 2 && (
                                                <span
                                                  onClick={() =>
                                                    handleDeleteOption(
                                                      index,
                                                      optionIndex
                                                    )
                                                  }
                                                >
                                                  <MdDelete
                                                    style={{
                                                      color: "white",
                                                    }}
                                                  />
                                                </span>
                                              )}
                                            </div>
                                            <div
                                              className={`${
                                                file !== null &&
                                                q.options.length > 2
                                                  ? "mt-[6px] p-1 rounded-[3px] bg-[#fff3] hover:bg-[#ffffff54]"
                                                  : "ml-[0px] bg-[#fff3] hover:bg-[#ffffff54] mt-[6px] p-1 rounded-[3px]"
                                              } ${
                                                file !== null ? "" : "hidden"
                                              }`}
                                            >
                                              <span
                                                onClick={() =>
                                                  handleRemoveImage(
                                                    "O" + optionIndex
                                                  )
                                                }
                                              >
                                                {file == null ? (
                                                  <CiImageOn
                                                    style={{
                                                      color: "white",
                                                    }}
                                                  />
                                                ) : (
                                                  <RiText
                                                    style={{
                                                      color: "white",
                                                    }}
                                                  />
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    {q.options.length < 5 && (
                                      <span className="flex justify-center items-center lg:h-full px-3  text-white ">
                                        <span
                                          className="lg:absolute mt-[-15px] lg:mt-0 lg:top-[72%] cursor-pointer"
                                          onClick={handleAddOption}
                                        >
                                          <span className="hidden lg:block text-[50px]">
                                            {" "}
                                            +
                                          </span>
                                          <span className="flex items-center gap-1 lg:hidden text-[20px] my-3">
                                            <FaPlus />
                                            Add more options
                                          </span>
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </>
                            ))}
                          </div>
                          <div className="w-full bg-[#ffffff] fixed bottom-0 z-[1000]  px-[5px] py-[10px]">
                            <div className="flex justify-between gap-3 items-center w-full">
                              <DragDropContext onDragEnd={handleDrop}>
                                <Droppable
                                  droppableId="list-container"
                                  direction="horizontal"
                                >
                                  {(provided) => (
                                    <div
                                      className="flex lg:hidden items-center gap-2 min-w-[85%] h-[65px] overflow-x-auto"
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                    >
                                      {questions.map((q, index) => (
                                        <Draggable
                                          key={q.id}
                                          draggableId={q.id}
                                          index={index}
                                        >
                                          {(provided) => (
                                            <div
                                              className="flex justify-between "
                                              ref={provided.innerRef}
                                              {...provided.dragHandleProps}
                                              {...provided.draggableProps}
                                            >
                                              <span>{`${index + 1}`} </span>
                                              <div
                                                className={`border-[1px] flex items-center mx-1 gap-2 imageSize border-blue-100 rounded-lg relative w-[80px] h-[60px] ${
                                                  index ===
                                                  selectedQuestionIndex
                                                    ? "shadow-[0px_0px_0px_3px_#FF0000]"
                                                    : ""
                                                }`}
                                                onClick={() =>
                                                  handleQuestionClick(index)
                                                }
                                              >
                                                {file !== null ? (
                                                  <>
                                                    <img
                                                      src={imageUrl}
                                                      alt=""
                                                      className="w-full h-full object-cover brightness-50"
                                                    />
                                                    <div className="absolute top-0 left-0 right-0  bottom-0 flex items-center justify-center overflow-y-hidden ">
                                                      <div className="line-clamp-3 text-white pt-2 px-2 my-3">
                                                        <div
                                                          dangerouslySetInnerHTML={{
                                                            __html:
                                                              DOMPurify.sanitize(
                                                                q.question.replace(
                                                                  /\\\((.*?)\\\)/g,
                                                                  (
                                                                    match,
                                                                    mathExpression
                                                                  ) => {
                                                                    try {
                                                                      return katex.renderToString(
                                                                        mathExpression,
                                                                        {
                                                                          throwOnError: false,
                                                                        }
                                                                      );
                                                                    } catch (error) {
                                                                      return match;
                                                                    }
                                                                  }
                                                                )
                                                              ),
                                                          }}
                                                        />
                                                      </div>
                                                    </div>
                                                  </>
                                                ) : (
                                                  <div className="line-clamp-3 pt-2 px-2 my-3">
                                                    <div
                                                      dangerouslySetInnerHTML={{
                                                        __html:
                                                          DOMPurify.sanitize(
                                                            q.question.replace(
                                                              /\\\((.*?)\\\)/g,
                                                              (
                                                                match,
                                                                mathExpression
                                                              ) => {
                                                                try {
                                                                  return katex.renderToString(
                                                                    mathExpression,
                                                                    {
                                                                      throwOnError: false,
                                                                    }
                                                                  );
                                                                } catch (error) {
                                                                  return match;
                                                                }
                                                              }
                                                            )
                                                          ),
                                                      }}
                                                    />
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </DragDropContext>
                              <div className="w-[10%]">
                                {questions.map((q, index) => (
                                  <div key={index}>
                                    {questions.length >= 1 && (
                                      <button
                                        aria-label="add question"
                                        type="submit"
                                        onClick={handleAddQuestion}
                                        className={` flex items-center z-[1000] justify-center gap-2 h-[2.2rem] px-4 py-1.5 text-5xl  bg-[#8e51bb] text-white
                                                    hover:bg-[#a574c8] rounded-[4px] w-[10%] ${
                                                      index ===
                                                      selectedQuestionIndex
                                                        ? "lg:hidden"
                                                        : "hidden"
                                                    }`}
                                      >
                                        +
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className=" ">
                            {questions.map((q, index) => (
                              <>
                                <div
                                  key={index}
                                  className={`${
                                    index === selectedQuestionIndex
                                      ? "block"
                                      : "hidden"
                                  } flex mt-5 flex-col gap-[5px] w-full rounded-lg`}
                                >
                                  <div className="w-full">
                                    <div className="">
                                      {typeof window !== "undefined" && (
                                        <div className=" w-full lg:w-[99%] lg:mx-2 bg-[#090909] lg:rounded-lg">
                                          <div className="flex justify-between items-center p-3 pb-0 w-full">
                                            <div className="flex items-center gap-1">
                                              <button
                                                aria-label="add explanation"
                                                type="button"
                                                onClick={handleSaveExplanation}
                                                className={`text-white select-none bg-[#3a3a3a] font-medium rounded-[4px] flex items-center gap-2  px-4 py-1 text-sm  text-center ${
                                                  index ===
                                                  selectedQuestionIndex
                                                    ? "block"
                                                    : "hidden"
                                                }`}
                                              >
                                                <div className="flex items-center gap-2  lg:hidden">
                                                  <FaArrowLeft />
                                                  Back
                                                </div>
                                                <div className="hidden lg:flex items-center gap-2 ">
                                                  <FaArrowLeft />
                                                  Back to the question
                                                </div>
                                              </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <button
                                                aria-label="add explanation"
                                                type="button"
                                                onClick={handleSaveExplanation}
                                                className={`text-white select-none bg-[#00b4d0] font-medium rounded-[4px] flex items-center gap-2 px-4 py-1 text-sm  text-center ${
                                                  index ===
                                                  selectedQuestionIndex
                                                    ? "block"
                                                    : "hidden"
                                                }`}
                                              >
                                                <div className="flex items-center gap-2  lg:hidden">
                                                  <FaSave />
                                                  Save
                                                </div>
                                                <div className="hidden lg:flex items-center gap-2 ">
                                                  <FaSave />
                                                  Save answer explanation
                                                </div>
                                              </button>
                                              <button
                                                aria-label="add explanation"
                                                type="button"
                                                onClick={() =>
                                                  handleDeleteExplanation(index)
                                                }
                                                className={`text-white select-none bg-[#EC0B43] font-medium flex items-center gap-2  rounded-[4px] text-sm px-4 py-1 text-center ${
                                                  index ===
                                                  selectedQuestionIndex
                                                    ? "block"
                                                    : "hidden"
                                                }`}
                                              >
                                                <RiDeleteBin6Line />
                                                Delete
                                              </button>
                                            </div>
                                          </div>
                                          <div className="flex flex-col lg:flex-row w-full bg-[#090909] p-3 rounded-lg gap-3">
                                            <div className="lg:w-[50%] text-white rounded-lg h-[40vh] lg:h-[60vh] border-dotted border-2 border-white">
                                              {file !== null ? (
                                                currentEditorIndex ===
                                                  "S" + index && (
                                                  <div className="flex justify-center items-center relative flex-col w-full h-[40vh] lg:h-[60vh] z-[900] group">
                                                    <Zoom>
                                                      <img
                                                        src={imageUrl}
                                                        alt="image"
                                                        width="300px"
                                                        className="h-[140px] lg:h-[285px] w-full lg:hover:brightness-50"
                                                      />
                                                    </Zoom>
                                                    <div className="flex gap-2 absolute top-[8px] right-[5px] w-full justify-end opacity-100 lg:opacity-0  lg:group-hover:opacity-100 transition-opacity">
                                                      <span
                                                        className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                        onClick={() =>
                                                          handleReplaceImageModal(
                                                            "S" + index
                                                          )
                                                        }
                                                      >
                                                        <MdCrop />
                                                      </span>
                                                      <span
                                                        className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                        onClick={handleDelete}
                                                      >
                                                        <RiDeleteBin6Line />
                                                      </span>
                                                    </div>
                                                  </div>
                                                )
                                              ) : (
                                                <div className="flex flex-col gap-2 justify-center text-[20px] items-center h-[40vh] lg:h-[60vh]">
                                                  <p className>Add Media</p>
                                                  <div
                                                    className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                    onClick={() =>
                                                      handleUploadImageModal(
                                                        "S" + index
                                                      )
                                                    }
                                                  >
                                                    <CiImageOn />
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                            <div
                                              onDrop={(e) => e.preventDefault()}
                                              className={`bg-white rounded-lg relative explanationDiv no-scrollbar w-full`}
                                            >
                                              <ReactQuill
                                                modules={modules}
                                                ref={(ref) =>
                                                  setQuillRef(ref, "S" + index)
                                                }
                                                color="teal"
                                                placeholder="Type a fun fact or explanation for the correct answer..."
                                                type="text"
                                                name="explanation"
                                                id="explanation"
                                                autoComplete="off"
                                                value={q.explanation}
                                                onChange={(value) => {
                                                  const updatedQuestions = [
                                                    ...questions,
                                                  ];
                                                  updatedQuestions[
                                                    index
                                                  ].explanation = value;
                                                  setQuestions(
                                                    updatedQuestions
                                                  );
                                                }}
                                                className="bg-[#090909] text-white rounded-lg h-[60vh] border-dotted border-2 border-white"
                                              />
                                              <div className="absolute top-[14px] left-[235px] text-[#fff] hover:text-[#fff]  cursor-pointer">
                                                <div className="flex">
                                                  <div
                                                    onClick={() =>
                                                      handleOpenKeyboard(
                                                        "S" + index
                                                      )
                                                    }
                                                  >
                                                    <PiSigmaThin />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {selectedQuestionType &&
                    selectedQuestionType == "True/False" && (
                      <>
                        {explanationData ? (
                          <div className="w-full lg:flex justify-center items-center">
                            <div className="w-full lg:w-[70%] sm:px-2">
                              {questions.map((q, index) => (
                                <>
                                  <div
                                    key={index}
                                    className={`${
                                      index === selectedQuestionIndex
                                        ? "block"
                                        : "hidden"
                                    } flex mb-[4.8rem]  lg:mb-0 flex-col gap-[5px] w-full   bg-[#4e1a3e]  sm:rounded-lg`}
                                  >
                                    <div className="relative w-full">
                                      <div
                                        className={`absolute   ${
                                          file !== null
                                            ? "left-[245px] lg:left-[567px] top-[240px] lg:top-[33px]  "
                                            : "left-[245px] top-[33px]"
                                        }  z-[800] text-[#fff] hover:text-[#fff]  cursor-pointer`}
                                      >
                                        <div className="flex gap-2 ">
                                          <div
                                            onClick={() =>
                                              handleOpenKeyboard("Q" + index)
                                            }
                                          >
                                            <PiSigmaThin />
                                          </div>
                                          {file == null ? (
                                            <div
                                              onClick={() =>
                                                handleUploadImageModal(
                                                  "Q" + index
                                                )
                                              }
                                            >
                                              <CiImageOn />
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                      {typeof window !== "undefined" && (
                                        <div
                                          className={`${
                                            file !== null
                                              ? "flex items-center w-full flex-col lg:flex-row"
                                              : ""
                                          }`}
                                        >
                                          {file &&
                                            currentEditorIndex ===
                                              "Q" + index && (
                                              <div className="absolute z-[900] top-[19px] lg:left-[11px] group w-[95%] sm:w-[98%] lg:w-[34%] group lg:flex justify-center  lg:h-[30.5vh] items-center">
                                                <div className="w-full lg:h-full lg:bg-[#232121eb] rounded-[8px] lg:flex justify-center items-center">
                                                  <Zoom>
                                                    <img
                                                      src={imageUrl}
                                                      alt="image"
                                                      width="340px"
                                                      className="h-[198px] w-full rounded-[8px] lg:rounded-[0px] flex justify-center items-center hover:brightness-50"
                                                    />
                                                  </Zoom>
                                                </div>
                                                <div className="flex gap-2 w-full rounded-t-[8px]  absolute top-[4px] right-[6px] justify-end opacity-100  lg:opacity-0 group-hover:opacity-100 lg:transition-opacity">
                                                  <span
                                                    className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                    onClick={() =>
                                                      handleReplaceImageModal(
                                                        "Q" + index
                                                      )
                                                    }
                                                  >
                                                    <MdCrop
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                    />
                                                  </span>
                                                  <span
                                                    className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                    onClick={handleDelete}
                                                  >
                                                    <RiDeleteBin6Line />
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          <div
                                            onDrop={(e) => e.preventDefault()}
                                            className={`questionDiv  ${
                                              file !== null
                                                ? "lg:ml-[35%] w-full lg:w-[65%] mt-[206px] lg:mt-0"
                                                : ""
                                            }`}
                                          >
                                            <ReactQuill
                                              modules={modules}
                                              ref={(ref) =>
                                                setQuillRef(ref, "Q" + index)
                                              }
                                              value={
                                                q.question ||
                                                katexValue.join(" ") ||
                                                ""
                                              }
                                              placeholder={`Type question here`}
                                              style={{
                                                background: "#4e1a3e",
                                                color: "white",
                                                borderRadius: "8px",
                                                border: "1px solid white",
                                              }}
                                              onChange={(value) => {
                                                const updatedQuestions = [
                                                  ...questions,
                                                ];
                                                updatedQuestions[
                                                  index
                                                ].question = value;
                                                setQuestions(updatedQuestions);
                                              }}
                                              className={`bg-white m-2 mt-5 rounded-lg relative no-scrollbar h-[30vh]`}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex  flex-col justify-center mx-2 mb-4 lg:flex-row gap-2">
                                      {q.options
                                        .slice(0, 2)
                                        .map((option, optionIndex) => (
                                          <div
                                            key={optionIndex}
                                            className="relative w-full"
                                          >
                                            <div
                                              className={`flex gap-2 items-center z-[800] text-white absolute top-[13px] left-[235px] 
                                  ${(() => {
                                    if (q.options.length === 5) {
                                      return " lg:top-[54px] lg:left-[15px]";
                                    } else if (q.options.length === 4) {
                                      return " lg:top-[36px] lg:left-[96px]";
                                    } else if (q.options.length === 3) {
                                      return " lg:top-[36px] lg:left-[41px]";
                                    } else if (q.options.length > 2) {
                                      return "lg:top-[36px] lg:left-[96px]";
                                    }
                                  })()}
                                  hover:text-[#fff]`}
                                            ></div>
                                            {typeof window !== "undefined" && (
                                              <>
                                                {file &&
                                                  currentEditorIndex ===
                                                    "O" + optionIndex && (
                                                    <div
                                                      className={`absolute flex justify-center items-center flex-col  z-[900] group ${
                                                        file == null
                                                          ? "top-[88px]"
                                                          : "top-[35px]"
                                                      }  w-[97%] ml-[6px] lg:ml-[4px]`}
                                                    >
                                                      <Zoom>
                                                        <img
                                                          src={imageUrl}
                                                          alt="image"
                                                          width="100px"
                                                          className="w-full h-[145px] rounded-t-lg hover:brightness-50"
                                                        />
                                                      </Zoom>
                                                      <div className="flex gap-2 absolute top-[5px] right-[5px] w-full justify-end opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span
                                                          className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                          onClick={() =>
                                                            handleReplaceImageModal(
                                                              "O" + index
                                                            )
                                                          }
                                                        >
                                                          <MdCrop />
                                                        </span>
                                                        <span
                                                          className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                          onClick={handleDelete}
                                                        >
                                                          <RiDeleteBin6Line />
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )}
                                                <div
                                                  onDrop={(e) =>
                                                    e.preventDefault()
                                                  }
                                                  className={`TrueFalseOptionDiv`}
                                                >
                                                  <ReactQuill
                                                    key={optionIndex}
                                                    modules={{
                                                      toolbar: false,
                                                    }}
                                                    ref={(ref) =>
                                                      setQuillRef(
                                                        ref,
                                                        "O" + optionIndex
                                                      )
                                                    }
                                                    value={option}
                                                    onChange={(value) => {
                                                      handleOptionChange(
                                                        optionIndex,
                                                        value
                                                      );
                                                    }}
                                                    style={{
                                                      background:
                                                        colors[
                                                          optionIndex %
                                                            colors.length
                                                        ],
                                                      color: "white",
                                                      borderRadius: "8px",
                                                    }}
                                                    className={`mb-2 mt-[27px] lg:mt-0 border-0 min-h-[18vh] lg:h-[38vh] lg:mb-0 text-white rounded-lg no-scrollbar `}
                                                  />
                                                </div>
                                              </>
                                            )}
                                            <div
                                              className={`absolute flex justify-between w-full ${
                                                q.options.length > 2
                                                  ? "px-3"
                                                  : "pr-3"
                                              } items-center h-[10px] ${
                                                file == null
                                                  ? "top-[38px]"
                                                  : "top-[8px]"
                                              }  cursor-pointer`}
                                            >
                                              <div className="flex items-center gap-1"></div>
                                              <div
                                                className={`inputRadioOptions ${
                                                  isAnyRadioChecked
                                                    ? ""
                                                    : "zoom-animation"
                                                } ${
                                                  file == null
                                                    ? "mt-[-36px] absolute right-[5px]"
                                                    : "mt-[12px]"
                                                }`}
                                              >
                                                {q.correctOptionIndex ===
                                                null ? (
                                                  <input
                                                    className="w-[20px] h-[20px] cursor-pointer"
                                                    type="radio"
                                                    id={`correctOptionRadio-${index}-${optionIndex}`}
                                                    name={`correctOptionRadio-${index}`}
                                                    checked={
                                                      q.correctOptionIndex ===
                                                      optionIndex
                                                    }
                                                    onChange={() => {
                                                      const Toast = Swal.mixin({
                                                        toast: true,
                                                        position: "top-end",
                                                        showConfirmButton: false,
                                                        timer: 1000,
                                                        timerProgressBar: true,
                                                      });
                                                      Toast.fire({
                                                        icon: "info",
                                                        title: `Please fill in the options first!`,
                                                      });
                                                    }}
                                                  />
                                                ) : (
                                                  <input
                                                    className="w-[20px] h-[20px] cursor-pointer"
                                                    type="radio"
                                                    id={`correctOptionRadio-${index}-${optionIndex}`}
                                                    name={`correctOptionRadio-${index}`}
                                                    checked={
                                                      q.correctOptionIndex ===
                                                      optionIndex
                                                    }
                                                    onChange={() => {
                                                      const updatedQuestions = [
                                                        ...questions,
                                                      ];
                                                      updatedQuestions[
                                                        index
                                                      ].correctOptionIndex =
                                                        optionIndex;
                                                      setQuestions(
                                                        updatedQuestions
                                                      );
                                                      setIsAnyRadioChecked(
                                                        true
                                                      );
                                                    }}
                                                  />
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                            <div className="w-full bg-[#ffffff] fixed bottom-0 z-[1000]  px-[5px] py-[10px]">
                              <div className="flex justify-between gap-3 items-center w-full">
                                <DragDropContext onDragEnd={handleDrop}>
                                  <Droppable
                                    droppableId="list-container"
                                    direction="horizontal"
                                  >
                                    {(provided) => (
                                      <div
                                        className="flex lg:hidden items-center gap-2 min-w-[85%] h-[65px] overflow-x-auto"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                      >
                                        {questions.map((q, index) => (
                                          <Draggable
                                            key={q.id}
                                            draggableId={q.id}
                                            index={index}
                                          >
                                            {(provided) => (
                                              <div
                                                className="flex justify-between "
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                              >
                                                <span>{`${index + 1}`} </span>
                                                <div
                                                  className={`border-[1px] flex items-center mx-1 gap-2 imageSize border-blue-100 rounded-lg relative w-[80px] h-[60px] ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "shadow-[0px_0px_0px_3px_#FF0000]"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    handleQuestionClick(index)
                                                  }
                                                >
                                                  {file !== null ? (
                                                    <>
                                                      <img
                                                        src={imageUrl}
                                                        alt=""
                                                        className="w-full h-full object-cover brightness-50"
                                                      />
                                                      <div className="absolute top-0 left-0 right-0  bottom-0 flex items-center justify-center overflow-y-hidden ">
                                                        <div className="line-clamp-3 text-white pt-2 px-2 my-3">
                                                          <div
                                                            dangerouslySetInnerHTML={{
                                                              __html:
                                                                DOMPurify.sanitize(
                                                                  q.question.replace(
                                                                    /\\\((.*?)\\\)/g,
                                                                    (
                                                                      match,
                                                                      mathExpression
                                                                    ) => {
                                                                      try {
                                                                        return katex.renderToString(
                                                                          mathExpression,
                                                                          {
                                                                            throwOnError: false,
                                                                          }
                                                                        );
                                                                      } catch (error) {
                                                                        return match;
                                                                      }
                                                                    }
                                                                  )
                                                                ),
                                                            }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <div className="line-clamp-3 pt-2 px-2 my-3">
                                                      <div
                                                        dangerouslySetInnerHTML={{
                                                          __html:
                                                            DOMPurify.sanitize(
                                                              q.question.replace(
                                                                /\\\((.*?)\\\)/g,
                                                                (
                                                                  match,
                                                                  mathExpression
                                                                ) => {
                                                                  try {
                                                                    return katex.renderToString(
                                                                      mathExpression,
                                                                      {
                                                                        throwOnError: false,
                                                                      }
                                                                    );
                                                                  } catch (error) {
                                                                    return match;
                                                                  }
                                                                }
                                                              )
                                                            ),
                                                        }}
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                </DragDropContext>
                                <div className="w-[10%]">
                                  {questions.map((q, index) => (
                                    <div key={index}>
                                      {questions.length >= 1 && (
                                        <button
                                          aria-label="add question"
                                          type="submit"
                                          onClick={handleAddQuestion}
                                          className={` flex items-center z-[1000] justify-center gap-2 h-[2.2rem] px-4 py-1.5 text-5xl  bg-[#8e51bb] text-white
                                                    hover:bg-[#a574c8] rounded-[4px] w-[10%] ${
                                                      index ===
                                                      selectedQuestionIndex
                                                        ? "lg:hidden"
                                                        : "hidden"
                                                    }`}
                                        >
                                          +
                                          {/* <FaSave style={{ marginTop: "-2px" }} />
                                                    Add Question */}
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className=" ">
                              {questions.map((q, index) => (
                                <>
                                  <div
                                    key={index}
                                    className={`${
                                      index === selectedQuestionIndex
                                        ? "block"
                                        : "hidden"
                                    } flex mt-5 flex-col gap-[5px] w-full rounded-lg`}
                                  >
                                    <div className="w-full">
                                      <div className="">
                                        {typeof window !== "undefined" && (
                                          <div className=" w-full lg:w-[99%] lg:mx-2 bg-[#090909] lg:rounded-lg">
                                            <div className="flex justify-between items-center p-3 pb-0 w-full">
                                              <div className="flex items-center gap-1">
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={
                                                    handleSaveExplanation
                                                  }
                                                  className={`text-white select-none bg-[#3a3a3a] font-medium rounded-[4px] flex items-center gap-2  px-4 py-1 text-sm  text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-2  lg:hidden">
                                                    <FaArrowLeft />
                                                    Back
                                                  </div>
                                                  <div className="hidden lg:flex items-center gap-2 ">
                                                    <FaArrowLeft />
                                                    Back to the question
                                                  </div>
                                                </button>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={
                                                    handleSaveExplanation
                                                  }
                                                  className={`text-white select-none bg-[#00b4d0] font-medium rounded-[4px] flex items-center gap-2 px-4 py-1 text-sm  text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-2  lg:hidden">
                                                    <FaSave />
                                                    Save
                                                  </div>
                                                  <div className="hidden lg:flex items-center gap-2 ">
                                                    <FaSave />
                                                    Save answer explanation
                                                  </div>
                                                </button>
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={() =>
                                                    handleDeleteExplanation(
                                                      index
                                                    )
                                                  }
                                                  className={`text-white select-none bg-[#EC0B43] font-medium flex items-center gap-2  rounded-[4px] text-sm px-4 py-1 text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <RiDeleteBin6Line />
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                            <div className="flex flex-col lg:flex-row w-full bg-[#090909] p-3 rounded-lg gap-3">
                                              <div className="lg:w-[50%] text-white rounded-lg h-[40vh] lg:h-[60vh] border-dotted border-2 border-white">
                                                {file !== null ? (
                                                  currentEditorIndex ===
                                                    "S" + index && (
                                                    <div className="flex justify-center items-center relative flex-col w-full h-[40vh] lg:h-[60vh] z-[900] group">
                                                      <Zoom>
                                                        <img
                                                          src={imageUrl}
                                                          alt="image"
                                                          width="300px"
                                                          className="h-[140px] lg:h-[285px] w-full lg:hover:brightness-50"
                                                        />
                                                      </Zoom>
                                                      <div className="flex gap-2 absolute top-[8px] right-[5px] w-full justify-end opacity-100 lg:opacity-0  lg:group-hover:opacity-100 transition-opacity">
                                                        <span
                                                          className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                          onClick={() =>
                                                            handleReplaceImageModal(
                                                              "S" + index
                                                            )
                                                          }
                                                        >
                                                          <MdCrop />
                                                        </span>
                                                        <span
                                                          className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                          onClick={handleDelete}
                                                        >
                                                          <RiDeleteBin6Line />
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )
                                                ) : (
                                                  <div className="flex flex-col gap-2 justify-center text-[20px] items-center h-[40vh] lg:h-[60vh]">
                                                    <p className>Add Media</p>
                                                    <div
                                                      className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                      onClick={() =>
                                                        handleUploadImageModal(
                                                          "S" + index
                                                        )
                                                      }
                                                    >
                                                      <CiImageOn />
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <div
                                                onDrop={(e) =>
                                                  e.preventDefault()
                                                }
                                                className={`bg-white rounded-lg relative explanationDiv no-scrollbar w-full`}
                                              >
                                                <ReactQuill
                                                  modules={modules}
                                                  ref={(ref) =>
                                                    setQuillRef(
                                                      ref,
                                                      "S" + index
                                                    )
                                                  }
                                                  color="teal"
                                                  placeholder="Type a fun fact or explanation for the correct answer..."
                                                  type="text"
                                                  name="explanation"
                                                  id="explanation"
                                                  autoComplete="off"
                                                  value={q.explanation}
                                                  onChange={(value) => {
                                                    const updatedQuestions = [
                                                      ...questions,
                                                    ];
                                                    updatedQuestions[
                                                      index
                                                    ].explanation = value;
                                                    setQuestions(
                                                      updatedQuestions
                                                    );
                                                  }}
                                                  className="bg-[#090909] text-white rounded-lg h-[60vh] border-dotted border-2 border-white"
                                                />
                                                <div className="absolute top-[14px] left-[235px] text-[#fff] hover:text-[#fff]  cursor-pointer">
                                                  <div className="flex">
                                                    <div
                                                      onClick={() =>
                                                        handleOpenKeyboard(
                                                          "S" + index
                                                        )
                                                      }
                                                    >
                                                      <PiSigmaThin />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  {selectedQuestionType &&
                    selectedQuestionType == "Guess Word" && (
                      <>
                        {explanationData ? (
                          <div className="w-full lg:flex justify-center items-center overflow-x-hidden ">
                            <div className="w-full lg:w-[70%] sm:px-2">
                              {questions.map((q, index) => (
                                <>
                                  <div
                                    key={index}
                                    className={`${
                                      index === selectedQuestionIndex
                                        ? "block"
                                        : "hidden"
                                    } flex mb-[4.8rem]  lg:mb-0 flex-col guessScreen gap-[5px] w-full bg-[#4e1a3e]  sm:rounded-lg`}
                                  >
                                    <div className="relative w-full">
                                      <div
                                        className={`absolute   ${
                                          file !== null
                                            ? "left-[245px] lg:left-[567px] top-[240px] lg:top-[33px]  "
                                            : "left-[245px] top-[33px]"
                                        }  z-[800] text-[#fff] hover:text-[#fff]  cursor-pointer`}
                                      >
                                        <div className="flex gap-2 ">
                                          <div
                                            onClick={() =>
                                              handleOpenKeyboard("Q" + index)
                                            }
                                          >
                                            <PiSigmaThin />
                                          </div>
                                          {file == null ? (
                                            <div
                                              onClick={() =>
                                                handleUploadImageModal(
                                                  "Q" + index
                                                )
                                              }
                                            >
                                              <CiImageOn />
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                      {typeof window !== "undefined" && (
                                        <div
                                          className={`${
                                            file !== null
                                              ? "flex items-center w-full flex-col lg:flex-row"
                                              : ""
                                          }`}
                                        >
                                          {file &&
                                            currentEditorIndex ===
                                              "Q" + index && (
                                              <div className="absolute z-[900] top-[19px] lg:left-[11px] group w-[95%] sm:w-[98%] lg:w-[34%] group lg:flex justify-center  lg:h-[30.5vh] items-center">
                                                <div className="w-full lg:h-full lg:bg-[#232121eb] rounded-[8px] lg:flex justify-center items-center">
                                                  <Zoom>
                                                    <img
                                                      src={imageUrl}
                                                      alt="image"
                                                      width="340px"
                                                      className="h-[198px] w-full rounded-[8px] lg:rounded-[0px] flex justify-center items-center hover:brightness-50"
                                                    />
                                                  </Zoom>
                                                </div>
                                                <div className="flex gap-2 w-full rounded-t-[8px]  absolute top-[4px] right-[6px] justify-end opacity-100  lg:opacity-0 group-hover:opacity-100 lg:transition-opacity">
                                                  <span
                                                    className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                    onClick={() =>
                                                      handleReplaceImageModal(
                                                        "Q" + index
                                                      )
                                                    }
                                                  >
                                                    <MdCrop
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                    />
                                                  </span>
                                                  <span
                                                    className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                    onClick={handleDelete}
                                                  >
                                                    <RiDeleteBin6Line />
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          <div
                                            onDrop={(e) => e.preventDefault()}
                                            className={`questionDiv  ${
                                              file !== null
                                                ? "lg:ml-[35%] w-full lg:w-[65%] mt-[206px] lg:mt-0"
                                                : ""
                                            }`}
                                          >
                                            <ReactQuill
                                              modules={modules}
                                              ref={(ref) =>
                                                setQuillRef(ref, "Q" + index)
                                              }
                                              value={
                                                q.question ||
                                                katexValue.join(" ") ||
                                                ""
                                              }
                                              placeholder={`Type question here`}
                                              style={{
                                                background: "#4e1a3e",
                                                color: "white",
                                                borderRadius: "8px",
                                                border: "1px solid white",
                                              }}
                                              onChange={(value) => {
                                                const updatedQuestions = [
                                                  ...questions,
                                                ];
                                                updatedQuestions[
                                                  index
                                                ].question = value;
                                                setQuestions(updatedQuestions);
                                              }}
                                              className={`bg-white m-2 mt-5 rounded-lg relative no-scrollbar h-[30vh]`}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex  flex-col justify-center mx-2 mb-4 lg:flex-row gap-2">
                                      {q.options
                                        .slice(0, 1)
                                        .map((option, optionIndex) => (
                                          <div
                                            key={optionIndex}
                                            className="relative w-full "
                                          >
                                            <div
                                              className={`flex gap-2 items-center z-[800] text-white absolute top-[14px] left-[10px] 
                                        hover:text-[#fff]`}
                                            ></div>
                                            {typeof window !== "undefined" && (
                                              <>
                                                <div
                                                  className={`guessAnswerDiv w-full bg-[#07192780] h-[10vh] rounded-lg flex justify-center items-center`}
                                                >
                                                  <input
                                                    placeholder="Type answer here"
                                                    className="peer w-[80%] relative lg:w-[60%] border-b border-white bg-[#512f4a] rounded-t-md focus:rounded-md p-2 pr-[60px] 
                                                sm:pr-2 text-[18px] font-normal 
                                                text-white focus:outline-1  placeholder-shown:border-blue-gray-200 focus:border focus:border-white"
                                                    value={option.text}
                                                    ref={(ref) =>
                                                      setQuillRef(
                                                        ref,
                                                        "O" + optionIndex
                                                      )
                                                    }
                                                    onChange={(event) => {
                                                      handleOptionChangeGuessWord(
                                                        optionIndex,
                                                        event.target.value
                                                      );
                                                    }}
                                                    onKeyDown={(event) => {
                                                      const characterText =
                                                        event.target.value;
                                                      const maxCharacters = 39;
                                                      if (
                                                        characterText.length >
                                                          maxCharacters &&
                                                        event.key !==
                                                          "Backspace"
                                                      ) {
                                                        event.preventDefault();
                                                      }
                                                    }}
                                                  />
                                                  <div className="text-white absolute left-[75%]">
                                                    {characterCount}/
                                                    {maxCharactersGuessWord}
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                    <div className="flex  flex-col justify-center mx-2 mb-4 lg:flex-row gap-2">
                                      {q.options
                                        .slice(0, 1)
                                        .map((option, optionIndex) => (
                                          <div
                                            key={optionIndex}
                                            className="relative w-full "
                                          >
                                            <div
                                              className={`flex gap-2 items-center z-[800] text-white absolute top-[14px] left-[10px] 
                                    hover:text-[#fff]`}
                                            ></div>
                                            {typeof window !== "undefined" && (
                                              <>
                                                <div
                                                  onDrop={(e) =>
                                                    e.preventDefault()
                                                  }
                                                  className={`playerAnswerPreviewDiv relative bg-[#07192780] rounded-lg h-[48vh] lg:h-[24vh] w-full`}
                                                >
                                                  <h1 className="text-left pl-3 absolute top-[5px] w-full text-base lg:text-[18px] text-white">
                                                    Player`s Preview
                                                  </h1>
                                                  <p className="text-center absolute top-[40px]  lg:top-[35px] w-full text-xs lg:text-[16px] text-white">
                                                    Type your answer in the
                                                    boxes
                                                  </p>
                                                  {previewGuessWord === "" ? (
                                                    <div className="flex justify-center items-center rounded-lg  flex-wrap absolute top-[59px] h-[10vh] w-full  lg:top-[65px]">
                                                      {[...Array(7)].map(
                                                        (_, index) => (
                                                          <div
                                                            key={index}
                                                            className="bg-[#07192780] text-white w-8 h-8 flex justify-center gap-2  items-center  mx-1 rounded-lg"
                                                          />
                                                        )
                                                      )}
                                                    </div>
                                                  ) : (
                                                    <div className="flex justify-center items-center rounded-lg  flex-wrap absolute top-[59px] h-[10vh] w-full lg:top-[65px]">
                                                      {previewGuessWord
                                                        .split("")
                                                        .map(
                                                          (
                                                            character,
                                                            index
                                                          ) => (
                                                            <div
                                                              key={index}
                                                              className="bg-[#07192780] text-white w-8 h-8 flex justify-center gap-2  items-center my-1 mx-1 rounded-lg"
                                                            >
                                                              {character}
                                                            </div>
                                                          )
                                                        )}
                                                    </div>
                                                  )}
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                            <div className="w-full bg-[#ffffff] fixed bottom-0 z-[1000]  px-[5px] py-[10px]">
                              <div className="flex justify-between gap-3 items-center w-full">
                                <DragDropContext onDragEnd={handleDrop}>
                                  <Droppable
                                    droppableId="list-container"
                                    direction="horizontal"
                                  >
                                    {(provided) => (
                                      <div
                                        className="flex lg:hidden items-center gap-2 min-w-[85%] h-[65px] overflow-x-auto"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                      >
                                        {questions.map((q, index) => (
                                          <Draggable
                                            key={q.id}
                                            draggableId={q.id}
                                            index={index}
                                          >
                                            {(provided) => (
                                              <div
                                                className="flex justify-between "
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                              >
                                                <span>{`${index + 1}`} </span>
                                                <div
                                                  className={`border-[1px] flex items-center mx-1 gap-2 imageSize border-blue-100 rounded-lg relative w-[80px] h-[60px] ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "shadow-[0px_0px_0px_3px_#FF0000]"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    handleQuestionClick(index)
                                                  }
                                                >
                                                  {file !== null ? (
                                                    <>
                                                      <img
                                                        src={imageUrl}
                                                        alt=""
                                                        className="w-full h-full object-cover brightness-50"
                                                      />
                                                      <div className="absolute top-0 left-0 right-0  bottom-0 flex items-center justify-center overflow-y-hidden ">
                                                        <div className="line-clamp-3 text-white pt-2 px-2 my-3">
                                                          <div
                                                            dangerouslySetInnerHTML={{
                                                              __html:
                                                                DOMPurify.sanitize(
                                                                  q.question.replace(
                                                                    /\\\((.*?)\\\)/g,
                                                                    (
                                                                      match,
                                                                      mathExpression
                                                                    ) => {
                                                                      try {
                                                                        return katex.renderToString(
                                                                          mathExpression,
                                                                          {
                                                                            throwOnError: false,
                                                                          }
                                                                        );
                                                                      } catch (error) {
                                                                        return match;
                                                                      }
                                                                    }
                                                                  )
                                                                ),
                                                            }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <div className="line-clamp-3 pt-2 px-2 my-3">
                                                      <div
                                                        dangerouslySetInnerHTML={{
                                                          __html:
                                                            DOMPurify.sanitize(
                                                              q.question.replace(
                                                                /\\\((.*?)\\\)/g,
                                                                (
                                                                  match,
                                                                  mathExpression
                                                                ) => {
                                                                  try {
                                                                    return katex.renderToString(
                                                                      mathExpression,
                                                                      {
                                                                        throwOnError: false,
                                                                      }
                                                                    );
                                                                  } catch (error) {
                                                                    return match;
                                                                  }
                                                                }
                                                              )
                                                            ),
                                                        }}
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                </DragDropContext>
                                <div className="w-[10%]">
                                  {questions.map((q, index) => (
                                    <div key={index}>
                                      {questions.length >= 1 && (
                                        <button
                                          aria-label="add question"
                                          type="submit"
                                          onClick={handleAddQuestion}
                                          className={` flex items-center z-[1000] justify-center gap-2 h-[2.2rem] px-4 py-1.5 text-5xl  bg-[#8e51bb] text-white
                                                    hover:bg-[#a574c8] rounded-[4px] w-[10%] ${
                                                      index ===
                                                      selectedQuestionIndex
                                                        ? "lg:hidden"
                                                        : "hidden"
                                                    }`}
                                        >
                                          +
                                          {/* <FaSave style={{ marginTop: "-2px" }} />
                                                    Add Question */}
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className=" ">
                              {questions.map((q, index) => (
                                <>
                                  <div
                                    key={index}
                                    className={`${
                                      index === selectedQuestionIndex
                                        ? "block"
                                        : "hidden"
                                    } flex mt-5 flex-col gap-[5px] w-full rounded-lg`}
                                  >
                                    <div className="w-full">
                                      <div className="">
                                        {typeof window !== "undefined" && (
                                          <div className=" w-full lg:w-[99%] lg:mx-2 bg-[#090909] lg:rounded-lg">
                                            <div className="flex justify-between items-center p-3 pb-0 w-full">
                                              <div className="flex items-center gap-1">
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={
                                                    handleSaveExplanation
                                                  }
                                                  className={`text-white select-none bg-[#3a3a3a] font-medium rounded-[4px] flex items-center gap-2  px-4 py-1 text-sm  text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-2  lg:hidden">
                                                    <FaArrowLeft />
                                                    Back
                                                  </div>
                                                  <div className="hidden lg:flex items-center gap-2 ">
                                                    <FaArrowLeft />
                                                    Back to the question
                                                  </div>
                                                </button>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={
                                                    handleSaveExplanation
                                                  }
                                                  className={`text-white select-none bg-[#00b4d0] font-medium rounded-[4px] flex items-center gap-2 px-4 py-1 text-sm  text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-2  lg:hidden">
                                                    <FaSave />
                                                    Save
                                                  </div>
                                                  <div className="hidden lg:flex items-center gap-2 ">
                                                    <FaSave />
                                                    Save answer explanation
                                                  </div>
                                                </button>
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={() =>
                                                    handleDeleteExplanation(
                                                      index
                                                    )
                                                  }
                                                  className={`text-white select-none bg-[#EC0B43] font-medium flex items-center gap-2  rounded-[4px] text-sm px-4 py-1 text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <RiDeleteBin6Line />
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                            <div className="flex flex-col lg:flex-row w-full bg-[#090909] p-3 rounded-lg gap-3">
                                              <div className="lg:w-[50%] text-white rounded-lg h-[40vh] lg:h-[60vh] border-dotted border-2 border-white">
                                                {file !== null ? (
                                                  currentEditorIndex ===
                                                    "S" + index && (
                                                    <div className="flex justify-center items-center relative flex-col w-full h-[40vh] lg:h-[60vh] z-[900] group">
                                                      <Zoom>
                                                        <img
                                                          src={imageUrl}
                                                          alt="image"
                                                          width="300px"
                                                          className="h-[140px] lg:h-[285px] w-full lg:hover:brightness-50"
                                                        />
                                                      </Zoom>
                                                      <div className="flex gap-2 absolute top-[8px] right-[5px] w-full justify-end opacity-100 lg:opacity-0  lg:group-hover:opacity-100 transition-opacity">
                                                        <span
                                                          className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                          onClick={() =>
                                                            handleReplaceImageModal(
                                                              "S" + index
                                                            )
                                                          }
                                                        >
                                                          <MdCrop />
                                                        </span>
                                                        <span
                                                          className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                          onClick={handleDelete}
                                                        >
                                                          <RiDeleteBin6Line />
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )
                                                ) : (
                                                  <div className="flex flex-col gap-2 justify-center text-[20px] items-center h-[40vh] lg:h-[60vh]">
                                                    <p className>Add Media</p>
                                                    <div
                                                      className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                      onClick={() =>
                                                        handleUploadImageModal(
                                                          "S" + index
                                                        )
                                                      }
                                                    >
                                                      <CiImageOn />
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <div
                                                onDrop={(e) =>
                                                  e.preventDefault()
                                                }
                                                className={`bg-white rounded-lg relative explanationDiv no-scrollbar w-full`}
                                              >
                                                <ReactQuill
                                                  modules={modules}
                                                  ref={(ref) =>
                                                    setQuillRef(
                                                      ref,
                                                      "S" + index
                                                    )
                                                  }
                                                  color="teal"
                                                  placeholder="Type a fun fact or explanation for the correct answer..."
                                                  type="text"
                                                  name="explanation"
                                                  id="explanation"
                                                  autoComplete="off"
                                                  value={q.explanation}
                                                  onChange={(value) => {
                                                    const updatedQuestions = [
                                                      ...questions,
                                                    ];
                                                    updatedQuestions[
                                                      index
                                                    ].explanation = value;
                                                    setQuestions(
                                                      updatedQuestions
                                                    );
                                                  }}
                                                  className="bg-[#090909] text-white rounded-lg h-[60vh] border-dotted border-2 border-white"
                                                />
                                                <div className="absolute top-[14px] left-[235px] text-[#fff] hover:text-[#fff]  cursor-pointer">
                                                  <div className="flex">
                                                    <div
                                                      onClick={() =>
                                                        handleOpenKeyboard(
                                                          "S" + index
                                                        )
                                                      }
                                                    >
                                                      <PiSigmaThin />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  {selectedQuestionType &&
                    selectedQuestionType == "Fill in the blanks" && (
                      <>
                        {explanationData ? (
                          <div className="w-full lg:flex justify-center items-center">
                            <div className="w-full lg:w-[70%] sm:px-2">
                              {questions.map((q, index) => (
                                <>
                                  <div
                                    key={index}
                                    className={`${
                                      index === selectedQuestionIndex
                                        ? "block"
                                        : "hidden"
                                    } flex mb-[4.8rem]  lg:mb-0 flex-col gap-[5px] w-full bg-[#4e1a3e]  sm:rounded-lg`}
                                  >
                                    <div className="relative w-full">
                                      <div
                                        className={`absolute   ${
                                          file !== null
                                            ? "left-[245px] lg:left-[567px] top-[240px] lg:top-[33px]  "
                                            : "left-[245px] top-[33px]"
                                        }  z-[800] text-[#fff] hover:text-[#fff]  cursor-pointer`}
                                      >
                                        <div className="flex gap-2 ">
                                          <div
                                            onClick={() =>
                                              handleOpenKeyboard("Q" + index)
                                            }
                                          >
                                            <PiSigmaThin />
                                          </div>
                                          {file == null ? (
                                            <div
                                              onClick={() =>
                                                handleUploadImageModal(
                                                  "Q" + index
                                                )
                                              }
                                            >
                                              <CiImageOn />
                                            </div>
                                          ) : null}
                                        </div>
                                      </div>
                                      {typeof window !== "undefined" && (
                                        <div
                                          className={`${
                                            file !== null
                                              ? "flex items-center w-full flex-col lg:flex-row"
                                              : ""
                                          }`}
                                        >
                                          {file &&
                                            currentEditorIndex ===
                                              "Q" + index && (
                                              <div className="absolute z-[900] top-[19px] lg:left-[11px] group w-[95%] sm:w-[98%] lg:w-[34%] group lg:flex justify-center  lg:h-[30.5vh] items-center">
                                                <div className="w-full lg:h-full lg:bg-[#232121eb] rounded-[8px] lg:flex justify-center items-center">
                                                  <Zoom>
                                                    <img
                                                      src={imageUrl}
                                                      alt="image"
                                                      width="340px"
                                                      className="h-[198px] w-full rounded-[8px] lg:rounded-[0px] flex justify-center items-center hover:brightness-50"
                                                    />
                                                  </Zoom>
                                                </div>
                                                <div className="flex gap-2 w-full rounded-t-[8px]  absolute top-[4px] right-[6px] justify-end opacity-100  lg:opacity-0 group-hover:opacity-100 lg:transition-opacity">
                                                  <span
                                                    className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                    onClick={() =>
                                                      handleReplaceImageModal(
                                                        "Q" + index
                                                      )
                                                    }
                                                  >
                                                    <MdCrop
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                    />
                                                  </span>
                                                  <span
                                                    className="bg-[#232121eb] hover:bg-[#1b1a1aeb] text-white p-2 cursor-pointer rounded-lg"
                                                    onClick={handleDelete}
                                                  >
                                                    <RiDeleteBin6Line />
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          <div
                                            onDrop={(e) => e.preventDefault()}
                                            className={`questionDiv  ${
                                              file !== null
                                                ? "lg:ml-[35%] w-full lg:w-[65%] mt-[206px] lg:mt-0"
                                                : ""
                                            }`}
                                          >
                                            <ReactQuill
                                              modules={modules}
                                              ref={(ref) =>
                                                setQuillRef(ref, "Q" + index)
                                              }
                                              value={
                                                q.question ||
                                                katexValue.join(" ") ||
                                                ""
                                              }
                                              placeholder={`Type question here`}
                                              style={{
                                                background: "#4e1a3e",
                                                color: "white",
                                                borderRadius: "8px",
                                                border: "1px solid white",
                                              }}
                                              onChange={(value) => {
                                                const updatedQuestions = [
                                                  ...questions,
                                                ];
                                                updatedQuestions[
                                                  index
                                                ].question = value;
                                                setQuestions(updatedQuestions);
                                              }}
                                              className={`bg-white m-2 mt-5 rounded-lg relative no-scrollbar h-[30vh]`}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex  flex-col justify-center mx-2 mb-4 lg:flex-row gap-2">
                                      {q.options
                                        .slice(0, 1)
                                        .map((option, optionIndex) => (
                                          <div
                                            key={optionIndex}
                                            className="relative w-full "
                                          >
                                            <div
                                              className={`flex gap-2 items-center z-[800] text-white absolute top-[14px] left-[10px] 
                                              hover:text-[#fff]`}
                                            ></div>
                                            {typeof window !== "undefined" && (
                                              <>
                                                <div
                                                  className={`guessAnswerDiv w-full bg-[#07192780] h-[10vh] rounded-lg flex justify-center items-center`}
                                                >
                                                  <input
                                                    placeholder="Type answer here"
                                                    className="peer w-[80%] relative lg:w-[80%] border-b border-white bg-[#512f4a] rounded-t-md focus:rounded-md p-2 pr-[70px] 
                                                sm:pr-[90px] text-[18px] font-normal 
                                                text-white focus:outline-1  placeholder-shown:border-blue-gray-200 focus:border focus:border-white"
                                                    value={option.text}
                                                    ref={(ref) =>
                                                      setQuillRef(
                                                        ref,
                                                        "O" + optionIndex
                                                      )
                                                    }
                                                    onChange={(event) => {
                                                      handleOptionChangeGuessWord(
                                                        optionIndex,
                                                        event.target.value
                                                      );
                                                    }}
                                                    onKeyDown={(event) => {
                                                      const characterText =
                                                        event.target.value;
                                                      const maxCharacters = 99;
                                                      if (
                                                        characterText.length >
                                                          maxCharacters &&
                                                        event.key !==
                                                          "Backspace"
                                                      ) {
                                                        event.preventDefault();
                                                      }
                                                    }}
                                                  />
                                                  <div className="text-white absolute left-[72%] lg:left-[82%]">
                                                    {characterCount}/
                                                    {maxCharactersInputWord}
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                    <div className="flex  flex-col justify-center mx-2 mb-4 lg:flex-row gap-2">
                                      {q.options
                                        .slice(0, 1)
                                        .map((option, optionIndex) => (
                                          <div
                                            key={optionIndex}
                                            className="relative w-full "
                                          >
                                            <div
                                              className={`flex gap-2 items-center z-[800] text-white absolute top-[14px] left-[10px] 
                                        hover:text-[#fff]`}
                                            ></div>
                                            {typeof window !== "undefined" && (
                                              <>
                                                <div
                                                  onDrop={(e) =>
                                                    e.preventDefault()
                                                  }
                                                  className={`playerAnswerPreviewDiv relative bg-[#07192780] rounded-lg h-[24vh] w-full`}
                                                >
                                                  <h1 className="text-left pl-3 absolute top-[5px] w-full text-base lg:text-[18px] text-white">
                                                    Player`s Preview
                                                  </h1>
                                                  <div className="flex justify-center items-center rounded-lg h-[24vh]  absolute  w-full text-white">
                                                    Type your Answer...
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                            <div className="w-full bg-[#ffffff] fixed bottom-0 z-[1000]  px-[5px] py-[10px]">
                              <div className="flex justify-between gap-3 items-center w-full">
                                <DragDropContext onDragEnd={handleDrop}>
                                  <Droppable
                                    droppableId="list-container"
                                    direction="horizontal"
                                  >
                                    {(provided) => (
                                      <div
                                        className="flex lg:hidden items-center gap-2 min-w-[85%] h-[65px] overflow-x-auto"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                      >
                                        {questions.map((q, index) => (
                                          <Draggable
                                            key={q.id}
                                            draggableId={q.id}
                                            index={index}
                                          >
                                            {(provided) => (
                                              <div
                                                className="flex justify-between "
                                                ref={provided.innerRef}
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps}
                                              >
                                                <span>{`${index + 1}`} </span>
                                                <div
                                                  className={`border-[1px] flex items-center mx-1 gap-2 imageSize border-blue-100 rounded-lg relative w-[80px] h-[60px] ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "shadow-[0px_0px_0px_3px_#FF0000]"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    handleQuestionClick(index)
                                                  }
                                                >
                                                  {file !== null ? (
                                                    <>
                                                      <img
                                                        src={imageUrl}
                                                        alt=""
                                                        className="w-full h-full object-cover brightness-50"
                                                      />
                                                      <div className="absolute top-0 left-0 right-0  bottom-0 flex items-center justify-center overflow-y-hidden ">
                                                        <div className="line-clamp-3 text-white pt-2 px-2 my-3">
                                                          <div
                                                            dangerouslySetInnerHTML={{
                                                              __html:
                                                                DOMPurify.sanitize(
                                                                  q.question.replace(
                                                                    /\\\((.*?)\\\)/g,
                                                                    (
                                                                      match,
                                                                      mathExpression
                                                                    ) => {
                                                                      try {
                                                                        return katex.renderToString(
                                                                          mathExpression,
                                                                          {
                                                                            throwOnError: false,
                                                                          }
                                                                        );
                                                                      } catch (error) {
                                                                        return match;
                                                                      }
                                                                    }
                                                                  )
                                                                ),
                                                            }}
                                                          />
                                                        </div>
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <div className="line-clamp-3 pt-2 px-2 my-3">
                                                      <div
                                                        dangerouslySetInnerHTML={{
                                                          __html:
                                                            DOMPurify.sanitize(
                                                              q.question.replace(
                                                                /\\\((.*?)\\\)/g,
                                                                (
                                                                  match,
                                                                  mathExpression
                                                                ) => {
                                                                  try {
                                                                    return katex.renderToString(
                                                                      mathExpression,
                                                                      {
                                                                        throwOnError: false,
                                                                      }
                                                                    );
                                                                  } catch (error) {
                                                                    return match;
                                                                  }
                                                                }
                                                              )
                                                            ),
                                                        }}
                                                      />
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        ))}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                </DragDropContext>
                                <div className="w-[10%]">
                                  {questions.map((q, index) => (
                                    <div key={index}>
                                      {questions.length >= 1 && (
                                        <button
                                          aria-label="add question"
                                          type="submit"
                                          onClick={handleAddQuestion}
                                          className={` flex items-center z-[1000] justify-center gap-2 h-[2.2rem] px-4 py-1.5 text-5xl  bg-[#8e51bb] text-white
                                                    hover:bg-[#a574c8] rounded-[4px] w-[10%] ${
                                                      index ===
                                                      selectedQuestionIndex
                                                        ? "lg:hidden"
                                                        : "hidden"
                                                    }`}
                                        >
                                          +
                                          {/* <FaSave style={{ marginTop: "-2px" }} />
                                                    Add Question */}
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className=" ">
                              {questions.map((q, index) => (
                                <>
                                  <div
                                    key={index}
                                    className={`${
                                      index === selectedQuestionIndex
                                        ? "block"
                                        : "hidden"
                                    } flex mt-5 flex-col gap-[5px] w-full rounded-lg`}
                                  >
                                    <div className="w-full">
                                      <div className="">
                                        {typeof window !== "undefined" && (
                                          <div className=" w-full lg:w-[99%] lg:mx-2 bg-[#090909] lg:rounded-lg">
                                            <div className="flex justify-between items-center p-3 pb-0 w-full">
                                              <div className="flex items-center gap-1">
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={
                                                    handleSaveExplanation
                                                  }
                                                  className={`text-white select-none bg-[#3a3a3a] font-medium rounded-[4px] flex items-center gap-2  px-4 py-1 text-sm  text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-2  lg:hidden">
                                                    <FaArrowLeft />
                                                    Back
                                                  </div>
                                                  <div className="hidden lg:flex items-center gap-2 ">
                                                    <FaArrowLeft />
                                                    Back to the question
                                                  </div>
                                                </button>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={
                                                    handleSaveExplanation
                                                  }
                                                  className={`text-white select-none bg-[#00b4d0] font-medium rounded-[4px] flex items-center gap-2 px-4 py-1 text-sm  text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <div className="flex items-center gap-2  lg:hidden">
                                                    <FaSave />
                                                    Save
                                                  </div>
                                                  <div className="hidden lg:flex items-center gap-2 ">
                                                    <FaSave />
                                                    Save answer explanation
                                                  </div>
                                                </button>
                                                <button
                                                  aria-label="add explanation"
                                                  type="button"
                                                  onClick={() =>
                                                    handleDeleteExplanation(
                                                      index
                                                    )
                                                  }
                                                  className={`text-white select-none bg-[#EC0B43] font-medium flex items-center gap-2  rounded-[4px] text-sm px-4 py-1 text-center ${
                                                    index ===
                                                    selectedQuestionIndex
                                                      ? "block"
                                                      : "hidden"
                                                  }`}
                                                >
                                                  <RiDeleteBin6Line />
                                                  Delete
                                                </button>
                                              </div>
                                            </div>
                                            <div className="flex flex-col lg:flex-row w-full bg-[#090909] p-3 rounded-lg gap-3">
                                              <div className="lg:w-[50%] text-white rounded-lg h-[40vh] lg:h-[60vh] border-dotted border-2 border-white">
                                                {file !== null ? (
                                                  currentEditorIndex ===
                                                    "S" + index && (
                                                    <div className="flex justify-center items-center relative flex-col w-full h-[40vh] lg:h-[60vh] z-[900] group">
                                                      <Zoom>
                                                        <img
                                                          src={imageUrl}
                                                          alt="image"
                                                          width="300px"
                                                          className="h-[140px] lg:h-[285px] w-full lg:hover:brightness-50"
                                                        />
                                                      </Zoom>
                                                      <div className="flex gap-2 absolute top-[8px] right-[5px] w-full justify-end opacity-100 lg:opacity-0  lg:group-hover:opacity-100 transition-opacity">
                                                        <span
                                                          className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                          onClick={() =>
                                                            handleReplaceImageModal(
                                                              "S" + index
                                                            )
                                                          }
                                                        >
                                                          <MdCrop />
                                                        </span>
                                                        <span
                                                          className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                          onClick={handleDelete}
                                                        >
                                                          <RiDeleteBin6Line />
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )
                                                ) : (
                                                  <div className="flex flex-col gap-2 justify-center text-[20px] items-center h-[40vh] lg:h-[60vh]">
                                                    <p className>Add Media</p>
                                                    <div
                                                      className="bg-[#fff3] hover:bg-[#ffffff54] p-2 cursor-pointer rounded-lg"
                                                      onClick={() =>
                                                        handleUploadImageModal(
                                                          "S" + index
                                                        )
                                                      }
                                                    >
                                                      <CiImageOn />
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <div
                                                onDrop={(e) =>
                                                  e.preventDefault()
                                                }
                                                className={`bg-white rounded-lg relative explanationDiv no-scrollbar w-full`}
                                              >
                                                <ReactQuill
                                                  modules={modules}
                                                  ref={(ref) =>
                                                    setQuillRef(
                                                      ref,
                                                      "S" + index
                                                    )
                                                  }
                                                  color="teal"
                                                  placeholder="Type a fun fact or explanation for the correct answer..."
                                                  type="text"
                                                  name="explanation"
                                                  id="explanation"
                                                  autoComplete="off"
                                                  value={q.explanation}
                                                  onChange={(value) => {
                                                    const updatedQuestions = [
                                                      ...questions,
                                                    ];
                                                    updatedQuestions[
                                                      index
                                                    ].explanation = value;
                                                    setQuestions(
                                                      updatedQuestions
                                                    );
                                                  }}
                                                  className="bg-[#090909] text-white rounded-lg h-[60vh] border-dotted border-2 border-white"
                                                />
                                                <div className="absolute top-[14px] left-[235px] text-[#fff] hover:text-[#fff]  cursor-pointer">
                                                  <div className="flex">
                                                    <div
                                                      onClick={() =>
                                                        handleOpenKeyboard(
                                                          "S" + index
                                                        )
                                                      }
                                                    >
                                                      <PiSigmaThin />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="w-full z-[1020] p-2 fixed top-0 bg-black">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div className="cursor-default flex items-center justify-center w-12 h-9 bg-[#ffffff54] text-white hover:bg-[#ffffff54] rounded-lg">
                  <p>
                    {apiCurrentQuestion + 1}/{questions.length}
                  </p>
                </div>
                <div className=" cursor-default flex items-center justify-center py-1 px-[8px] bg-[#009ca5] text-white rounded-lg">
                  <p>{questions[apiCurrentQuestion]?.selectedType}</p>
                </div>
              </div>
              <div className=" cursor-default flex items-center justify-center py-1 px-[8px] bg-[#ffffff54] text-white hover:bg-[#ffffff54] rounded-lg">
                <p>Player &#39;s view</p>
              </div>
              <div
                className="cursor-pointer flex items-center justify-center w-9 h-9 bg-[#ffffff54] text-white hover:bg-[#ffffff54] 
                active:bg-[#ffffff1a] rounded-lg min-w-max"
                onClick={handleHidePreview}
              >
                <IoMdClose />
              </div>
            </div>
          </div>
          <div className="flex  flex-col items-end md:items-center lg:items-center relative min-h-screen z-10 bg-[#1b363e]">
            <div className="quiz-card mt-[5rem] bg-[#0f0f0f2b]  w-full">
              <div>
                <div className=" pb-2 mt-4 md:mt-4 text-left text-lg sm:mx-[3rem]  relative z-10 flex flex-col items-left text-white ">
                  <div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          questions[apiCurrentQuestion]?.question.replace(
                            /\\\((.*?)\\\)/g,
                            (match, mathExpression) => {
                              try {
                                return katex.renderToString(mathExpression, {
                                  throwOnError: false,
                                });
                              } catch (error) {
                                return match;
                              }
                            }
                          )
                        ),
                      }}
                    />
                  </div>
                </div>
                <div
                  className={`${
                    questions[apiCurrentQuestion]?.options.some(
                      (option) => option.image
                    )
                      ? ""
                      : "flex justify-center items-center "
                  }`}
                >
                  {questions.length &&
                    questions[apiCurrentQuestion]?.selectedType === "Poll" && (
                      <ol
                        className={`flex flex-wrap justify-center mt-4 mb-8  ${
                          questions[apiCurrentQuestion].options.some(
                            (option) => option.image
                          )
                            ? "flex-row gap-3 md:gap-0 md:justify-between"
                            : "flex-col w-[100%] md:w-[70%] items-center gap-3 justify-center"
                        }`}
                      >
                        {questions[apiCurrentQuestion].options.map(
                          (option, index) => (
                            <li
                              key={option.id}
                              className={`sm:hover:shadow-[0px_0px_0px_2px_#ffc500] bg-white text-black font-bold py-[15px] cursor-pointer h-fit  ${
                                option.image
                                  ? "w-[45%]  md:max-w-[11rem]"
                                  : "w-full "
                              } rounded-lg
                        `}
                              style={{
                                borderRadius: "12px",
                              }}
                            >
                              <div className=" rounded-lg ">
                                {option.image && (
                                  <img
                                    src={option.image}
                                    alt=""
                                    className="mb-2 mx-auto max-w-[100%] max-h-[12vh] md:max-h-[15vh] xl:max-h-[15vh] rounded-lg "
                                  />
                                )}
                              </div>
                              <div
                                className={`text-sm   ${
                                  option.image
                                    ? "text-center"
                                    : "flex justify-start h-fit items-center ml-[47px] sm:ml-[57px]  pr-[3px] sm:pr-[30px]"
                                }`}
                              >
                                <div className="flex justify-center items-center h-fit">
                                  <div className="relative ">
                                    <span
                                      className={`custom-list  ${
                                        option.image
                                          ? "custom-list"
                                          : "custom-list-image-not-available1"
                                      }`}
                                    ></span>
                                  </div>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(
                                        option.replace(
                                          /\\\((.*?)\\\)/g,
                                          (match, mathExpression) => {
                                            try {
                                              return katex.renderToString(
                                                mathExpression,
                                                {
                                                  throwOnError: false,
                                                }
                                              );
                                            } catch (error) {
                                              return match;
                                            }
                                          }
                                        )
                                      ),
                                    }}
                                  />
                                </div>
                              </div>
                            </li>
                          )
                        )}
                      </ol>
                    )}
                  {questions.length &&
                    questions[apiCurrentQuestion]?.selectedType ===
                      "Single Select" && (
                      <ol
                        className={`flex flex-wrap justify-center mt-4 mb-8  ${
                          questions[apiCurrentQuestion].options.some(
                            (option) => option.image
                          )
                            ? "flex-row gap-3 md:gap-0 md:justify-between"
                            : "flex-col w-[100%] md:w-[70%] items-center gap-3 justify-center"
                        }`}
                      >
                        {questions[apiCurrentQuestion].options.map(
                          (option, index) => (
                            <li
                              key={option.id}
                              className={`sm:hover:shadow-[0px_0px_0px_2px_#ffc500] bg-white text-black font-bold py-[15px] cursor-pointer h-fit  ${
                                option.image
                                  ? "w-[45%]  md:max-w-[11rem]"
                                  : "w-full "
                              } rounded-lg
                        `}
                              style={{
                                borderRadius: "12px",
                              }}
                            >
                              <div className=" rounded-lg ">
                                {option.image && (
                                  <img
                                    src={option.image}
                                    alt=""
                                    className="mb-2 mx-auto max-w-[100%] max-h-[12vh] md:max-h-[15vh] xl:max-h-[15vh] rounded-lg "
                                  />
                                )}
                              </div>
                              <div
                                className={`text-sm   ${
                                  option.image
                                    ? "text-center"
                                    : "flex justify-start h-fit items-center ml-[47px] sm:ml-[57px]  pr-[3px] sm:pr-[30px]"
                                }`}
                              >
                                <div className="flex justify-center items-center h-fit">
                                  <div className="relative ">
                                    <span
                                      className={`custom-list  ${
                                        option.image
                                          ? "custom-list"
                                          : "custom-list-image-not-available1"
                                      }`}
                                    ></span>
                                  </div>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(
                                        option.replace(
                                          /\\\((.*?)\\\)/g,
                                          (match, mathExpression) => {
                                            try {
                                              return katex.renderToString(
                                                mathExpression,
                                                {
                                                  throwOnError: false,
                                                }
                                              );
                                            } catch (error) {
                                              return match;
                                            }
                                          }
                                        )
                                      ),
                                    }}
                                  />
                                </div>
                              </div>
                            </li>
                          )
                        )}
                      </ol>
                    )}
                  {questions.length &&
                    questions[apiCurrentQuestion]?.selectedType ===
                      "True/False" && (
                      <ol
                        className={`flex flex-wrap justify-center mt-4 mb-8  ${
                          questions[apiCurrentQuestion].options.some(
                            (option) => option.image
                          )
                            ? "flex-row gap-3 md:gap-0 md:justify-between"
                            : "flex-col w-[100%] md:w-[70%] items-center gap-3 justify-center"
                        }`}
                      >
                        {questions[apiCurrentQuestion].options
                          .slice(0, 2)
                          .map((option, index) => (
                            <li
                              key={option.id}
                              className={`sm:hover:shadow-[0px_0px_0px_2px_#ffc500] bg-white text-black font-bold py-[15px] cursor-pointer h-fit  ${
                                option.image
                                  ? "w-[45%]  md:max-w-[11rem]"
                                  : "w-full "
                              } rounded-lg
                        `}
                              style={{
                                borderRadius: "12px",
                              }}
                            >
                              <div className=" rounded-lg ">
                                {option.image && (
                                  <img
                                    src={option.image}
                                    alt=""
                                    className="mb-2 mx-auto max-w-[100%] max-h-[12vh] md:max-h-[15vh] xl:max-h-[15vh] rounded-lg "
                                  />
                                )}
                              </div>
                              <div
                                className={`text-sm   ${
                                  option.image
                                    ? "text-center"
                                    : "flex justify-start h-fit items-center ml-[47px] sm:ml-[57px]  pr-[3px] sm:pr-[30px]"
                                }`}
                              >
                                <div className="flex justify-center items-center h-fit">
                                  <div className="relative ">
                                    <span
                                      className={`custom-list  ${
                                        option.image
                                          ? "custom-list"
                                          : "custom-list-image-not-available1"
                                      }`}
                                    ></span>
                                  </div>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(
                                        option.replace(
                                          /\\\((.*?)\\\)/g,
                                          (match, mathExpression) => {
                                            try {
                                              return katex.renderToString(
                                                mathExpression,
                                                {
                                                  throwOnError: false,
                                                }
                                              );
                                            } catch (error) {
                                              return match;
                                            }
                                          }
                                        )
                                      ),
                                    }}
                                  />
                                </div>
                              </div>
                            </li>
                          ))}
                      </ol>
                    )}
                  {questions.length &&
                    questions[apiCurrentQuestion]?.selectedType ===
                      "Multi Select" && (
                      <ol
                        className={`flex flex-wrap justify-center mt-4 mb-8 ${
                          questions[apiCurrentQuestion].options.some(
                            (option) => option.image
                          )
                            ? "flex-row gap-3 md:gap-0 md:justify-between"
                            : "flex-col w-[100%] md:w-[70%] items-center gap-3 justify-center"
                        }`}
                      >
                        {questions[apiCurrentQuestion].options.map(
                          (option, index) => (
                            <li
                              key={option.id}
                              className={`sm:hover:shadow-[0px_0px_0px_2px_#ffc500] bg-white text-black font-bold py-[15px] cursor-pointer h-fit  ${
                                option.image
                                  ? "w-[45%]  md:max-w-[11rem]"
                                  : "w-full "
                              } rounded-lg
                        `}
                              style={{
                                borderRadius: "12px",
                              }}
                            >
                              <div className=" rounded-lg ">
                                {option.image && (
                                  <img
                                    src={option.image}
                                    alt=""
                                    className="mb-2 mx-auto max-w-[100%] max-h-[12vh] md:max-h-[15vh] xl:max-h-[15vh] rounded-lg "
                                  />
                                )}
                              </div>
                              <div
                                className={`text-sm   ${
                                  option.image
                                    ? "text-center"
                                    : "flex justify-start h-fit items-center ml-[47px] sm:ml-[57px]  pr-[3px] sm:pr-[30px]"
                                }`}
                              >
                                <div className="flex justify-center items-center h-fit">
                                  <div className="relative ">
                                    <span
                                      className={`custom-list  ${
                                        option.image
                                          ? "custom-list"
                                          : "custom-list-image-not-available1"
                                      }`}
                                    ></span>
                                  </div>
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(
                                        option.replace(
                                          /\\\((.*?)\\\)/g,
                                          (match, mathExpression) => {
                                            try {
                                              return katex.renderToString(
                                                mathExpression,
                                                {
                                                  throwOnError: false,
                                                }
                                              );
                                            } catch (error) {
                                              return match;
                                            }
                                          }
                                        )
                                      ),
                                    }}
                                  />
                                </div>
                              </div>
                            </li>
                          )
                        )}
                      </ol>
                    )}
                  {questions.length &&
                    questions[apiCurrentQuestion]?.selectedType ===
                      "Guess Word" && (
                      <div className="flex justify-center flex-col">
                        <div
                          className={`word-container bg-[#8080802b] py-2 rounded-lg`}
                        >
                          {questions[apiCurrentQuestion].options[0]
                            .split("")
                            .map((letter, index) => {
                              if (letter === " ") {
                                return (
                                  <div
                                    key={index}
                                    className="letter invisible"
                                  ></div>
                                );
                              } else {
                                const chosenLetter =
                                  chosenLetters[displayIndex] || "";
                                displayIndex++;
                                return (
                                  <div
                                    key={index}
                                    className={`letter visible ${
                                      chosenLetter ? "visible" : ""
                                    }`}
                                  >
                                    {chosenLetter}
                                  </div>
                                );
                              }
                            })}
                        </div>
                      </div>
                    )}
                  {questions.length &&
                    questions[apiCurrentQuestion]?.selectedType ===
                      "Fill in the blanks" && (
                      <div className="flex justify-center w-[80%] flex-col">
                        <>
                          <div
                            className={`guessAnswerDiv  bg-[#07192780] h-[10vh] rounded-lg flex justify-center items-center`}
                          >
                            <input
                              placeholder="Type answer here"
                              className="w-[90%] border-b border-white bg-[#512f4a] rounded-t-md focus:rounded-md p-2 text-[18px] font-normal 
                              text-white focus:outline-1 placeholder-shown:border-blue-gray-200 focus:border focus:border-white"
                              readOnly
                            />
                          </div>
                        </>
                      </div>
                    )}
                </div>
              </div>
              <div className="flex justify-end items-center gap-1 pb-5">
                <button
                  className={`p-2 rounded-lg ${
                    apiCurrentQuestion === 0
                      ? "bg-[#112327] cursor-not-allowed"
                      : "bg-[#3a3a3a] hover:bg-[#464545] cursor-pointer"
                  } text-white `}
                  onClick={handlePreviousQuestion}
                  disabled={apiCurrentQuestion === 0}
                >
                  <BiSolidLeftArrow />
                </button>
                <button
                  className={`p-2 rounded-lg ${
                    apiCurrentQuestion === questions.length - 1
                      ? "bg-[#112327] cursor-not-allowed"
                      : "bg-[#3a3a3a] hover:bg-[#464545] cursor-pointer"
                  } text-white `}
                  onClick={handleNextQuestion}
                  disabled={apiCurrentQuestion === questions.length - 1}
                >
                  <BiSolidRightArrow />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
