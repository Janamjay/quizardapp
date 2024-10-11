"use server";
import axios from "axios";
import { setCookie, getCookie, hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import { testAction } from "./testAction";

const API_BASE_URL = process.env.QUIZARD_APP_API;
const API_USER = process.env.QUIZARD_APP_USER;
const API_CLASS = process.env.QUIZARD_APP_CLASS_LIST;
const UPDATE_PROFILE = process.env.QUIZARD_APP_UPDATE_USER;
const UPDATE_CLASS = process.env.QUIZARD_APP_UPDATE_CLASS_LIST;
const ADD_USER = process.env.QUIZARD_APP_REGISTER;
const VERIFY_OTP = process.env.QUIZARD_APP_OTP;
const USER_ENQUIRY = process.env.QUIZARD_APP_CONTACT;
const API_LOGIN_URL = process.env.QUIZARD_APP_LOGIN_API;
const BASE_API_URL = process.env.QUIZARD_APP_BASE_API_URL;
const GOOGLE_LOGIN_CALLBACK =
  process.env.QUIZARD_APP_AUTH_GOOGLE_LOGIN_CALLBACK;
const FORGET_PASSWORD = process.env.QUIZARD_APP_FORGET_PASSWORD;
const VERIFY_FORGET_OTP = process.env.QUIZARD_APP_VERIFY_FORGET_OTP;
const UPDATE_PASSWORD = process.env.QUIZARD_APP_UPDATE_PASSWORD;
const USER_LOGOUT = process.env.QUIZARD_APP_LOGOUT_API;

async function dashBoardQuizTest() {
  try {
    const urlWithParams = new URL(API_BASE_URL + "dashboard-Quiz-list");
    // console.log(class_id);
    const cookieStore = cookies();
    const user_id = cookieStore.get("user_id")?.value;
    const token = cookieStore.get("token")?.value;
    const class_id = cookieStore.has("class_user_id")
      ? cookieStore.get("class_user_id").value
      : 10;
    urlWithParams.searchParams.append("token", token);
    urlWithParams.searchParams.append("user_id", user_id);
    urlWithParams.searchParams.append("class_id", class_id);
    const response = await fetch(urlWithParams, {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return data;
      } else {
      }
    } else {
    }
  } catch (error) {
    // console.log(error);
  }
}

async function quizDetails({ subjectId, page }) {
  const urlWithParams = new URL(API_BASE_URL + "quiz-details-by-subject");
  // console.log(class_id);
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("token")?.value;
  const class_id = cookieStore.has("class_user_id")
    ? cookieStore.get("class_user_id").value
    : 10;
  urlWithParams.searchParams.append("token", token);
  urlWithParams.searchParams.append("user_id", user_id);
  urlWithParams.searchParams.append("class_id", class_id);
  urlWithParams.searchParams.append("subject_id", subjectId);
  urlWithParams.searchParams.append("page", page);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      // console.log(data.Subject_by_quiz)
      return data;
    } else {
    }
  } else {
  }
}
async function chapterList({ subjectId }) {
  const urlWithParams = new URL(API_BASE_URL + "quiz-chapter-list");
  // console.log(class_id);
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("token")?.value;
  const class_id = cookieStore.has("class_user_id")
    ? cookieStore.get("class_user_id").value
    : 10;
  urlWithParams.searchParams.append("token", token);
  urlWithParams.searchParams.append("user_id", user_id);
  urlWithParams.searchParams.append("class_id", class_id);
  urlWithParams.searchParams.append("subject_id", subjectId);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
    }
  } else {
  }
}
async function chapterDetails({
  subjectId,
  chapterId,
  type,
  detailPageNumber,
}) {
  const urlWithParams = new URL(API_BASE_URL + "quiz-details-by-subject");
  // console.log(class_id);
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("token")?.value;
  const class_id = cookieStore.has("class_user_id")
    ? cookieStore.get("class_user_id").value
    : 10;
  urlWithParams.searchParams.append("token", token);
  urlWithParams.searchParams.append("user_id", user_id);
  urlWithParams.searchParams.append("class_id", class_id);
  urlWithParams.searchParams.append("subject_id", subjectId);
  urlWithParams.searchParams.append("chapter_id", chapterId);
  urlWithParams.searchParams.append("page", type == 0 ? 1 : detailPageNumber);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
    }
  } else {
  }
}
async function quizDetailId({ quiz_id }) {
  const urlWithParams1 = new URL(API_BASE_URL + "quiz-details-by-id");
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("token")?.value;
  const class_id = cookieStore.has("class_user_id")
    ? cookieStore.get("class_user_id").value
    : 10;
  urlWithParams1.searchParams.append("token", token);
  urlWithParams1.searchParams.append("user_id", user_id);
  urlWithParams1.searchParams.append("class_id", class_id);
  urlWithParams1.searchParams.append("quiz_id", quiz_id);
  const response = await fetch(urlWithParams1, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
    }
  } else {
  }
}
async function quizPlay({ quiz_id }) {
  const urlWithParams1 = new URL(API_BASE_URL + "quiz-start");
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("token")?.value;
  const class_id = cookieStore.has("class_user_id")
    ? cookieStore.get("class_user_id").value
    : 10;
  urlWithParams1.searchParams.append("token", token);
  urlWithParams1.searchParams.append("user_id", user_id);
  urlWithParams1.searchParams.append("class_id", class_id);
  urlWithParams1.searchParams.append("quiz_id", quiz_id);
  const response = await fetch(urlWithParams1, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
    }
  } else {
  }
}
async function userScore({ quiz_id }) {
  const urlWithParams1 = new URL(API_BASE_URL + "User-Score");
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("token")?.value;
  const class_id = cookieStore.has("class_user_id")
    ? cookieStore.get("class_user_id").value
    : 10;
  urlWithParams1.searchParams.append("token", token);
  urlWithParams1.searchParams.append("user_id", user_id);
  urlWithParams1.searchParams.append("class_id", class_id);
  urlWithParams1.searchParams.append("quiz_id", quiz_id);
  const response = await fetch(urlWithParams1, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
    }
  } else {
  }
}
async function leaderboardData({ quiz_id, page }) {
  const urlWithParams = new URL(API_BASE_URL + "quiz-leaderboard");
  // console.log(class_id);
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("token")?.value;
  const class_id = cookieStore.has("class_user_id")
    ? cookieStore.get("class_user_id").value
    : 10;
  urlWithParams.searchParams.append("token", token);
  urlWithParams.searchParams.append("user_id", user_id);
  urlWithParams.searchParams.append("class_id", class_id);
  urlWithParams.searchParams.append("quiz_id", quiz_id);
  urlWithParams.searchParams.append("page", page);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
    }
  } else {
  }
}
async function quizSolution({ quiz_id }) {
  const urlWithParams = new URL(API_BASE_URL + "User-Quiz-solution");
  // console.log(class_id);
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("token")?.value;
  const class_id = cookieStore.has("class_user_id")
    ? cookieStore.get("class_user_id").value
    : 10;
  urlWithParams.searchParams.append("token", token);
  urlWithParams.searchParams.append("user_id", user_id);
  urlWithParams.searchParams.append("class_id", class_id);
  urlWithParams.searchParams.append("quiz_id", quiz_id);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
    }
  } else {
  }
}

async function userProfile() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  // console.log(token)
  const urlWithParams1 = new URL(API_USER);
  urlWithParams1.searchParams.append("token", token);
  const response = await fetch(urlWithParams1, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
    }
  } else {
  }
}
const updateUser = async (updatedUserData) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const formData = new FormData();
  formData.append("name", updatedUserData.name);
  formData.append("gender", updatedUserData.gender);
  formData.append("email", updatedUserData.email);
  formData.append("mobile", updatedUserData.mobile);
  formData.append("dob", updatedUserData.dob);
  formData.append("country_code", updatedUserData.country_code);
  formData.append("country_name", updatedUserData.country_name);
  formData.append("profile_img", updatedUserData.profile_image);

  try {
    const response = await fetch(UPDATE_PROFILE, {
      method: "POST",
      headers: {
        ...headers,
      },
      body: formData,
    });

    if (!response.ok) {
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // console.error("Error updating user:", error);
  }
};

async function userClass() {
  const res = await fetch(API_CLASS);
  if (!res.ok) {
    // throw new Error('Failed to fetch data')
  }

  return res.json();
}
const userUpdateClass = async (loggedUser, classId) => {
  const url = UPDATE_CLASS;
  const requestData = {
    class_id: classId,
  };

  const headers = new Headers({
    Authorization: `Bearer ${loggedUser}`,
    "Content-Type": "application/json",
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestData),
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
    }
  } catch (error) {
    throw error;
  }
};

// const userUpdateClassLogin = async (classId) => {
//   const cookieStore = cookies();
//   const token = cookieStore.get("token")?.value;
//   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   const requestData = {
//     class_id: classId,
//   };
//   try {
//     const response = await axios.post(UPDATE_CLASS, requestData);

//     return response;
//   } catch (error) {}
// };

const userUpdateClassLogin = async (classId) => {
  const url = UPDATE_CLASS;
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const requestData = {
    class_id: classId,
  };

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestData),
  };

  try {
    const response = await fetch(url, requestOptions);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
    }
  } catch (error) {
    throw error;
  }
};
const addUser = async (formData) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const requestFormData = new FormData();
  requestFormData.append("name", formData.name);
  requestFormData.append("email", formData.email);
  requestFormData.append("mobile", formData.mobile);
  requestFormData.append("password", formData.password);
  requestFormData.append("confirm_password", formData.confirm_password);
  requestFormData.append("country_code", formData.country_code);
  requestFormData.append("country_name", formData.country_name);
  requestFormData.append("refferal_code", formData.refferal_code);
  requestFormData.append("sub_course_id", formData.sub_course_id);

  try {
    const response = await fetch(ADD_USER, {
      method: "POST",
      headers: {
        ...headers,
      },
      body: requestFormData,
    });

    if (!response.ok) {
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // console.error("Error updating user:", error);
  }
};
const userLogin = async (post) => {
  const requestFormData = new FormData();
  requestFormData.append("userId", post.userId);
  requestFormData.append("password", post.password);

  try {
    const response = await fetch(API_LOGIN_URL, {
      method: "POST",
      body: requestFormData,
    });

    if (!response.ok) {
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // console.error("Error updating user:", error);
  }
};
const googleAuth = async (googleAuthUrl) => {
  try {
    const urlWithParams = new URL(
      BASE_API_URL + GOOGLE_LOGIN_CALLBACK + "?" + googleAuthUrl
    );
    const response = await fetch(urlWithParams, {
      method: "get",
    });

    if (response.ok) {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const res = await response.json();
        return res;
      } else {
      }
    } else {
    }
  } catch (error) {}
};
const userLogout = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(USER_LOGOUT, {
      method: "POST",
      headers: {
        ...headers,
      },
    });

    if (!response.ok) {
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    // console.error("Error updating user:", error);
  }
};
// const verifyOtp = async (data) => {
//   try {
//     const requestFormData = new FormData();
//     requestFormData.append("mobile", data.mobile);
//     requestFormData.append("refferal_code", data.refferal_code);
//     requestFormData.append("otp", data.otp);
//     requestFormData.append("user_id", data.user_id);
//     requestFormData.append("email", data.email);

//     const response = await axios.post(VERIFY_OTP, requestFormData);
//     return response;
//   } catch (error) {}
// };

const verifyOtp = async ({data}) => {
  const requestFormData = new FormData();
  requestFormData.append("mobile", data.mobile);
  requestFormData.append("refferal_code", data.refferal_code);
  requestFormData.append("otp", data.otp);
  requestFormData.append("user_id", data.user_id);
  requestFormData.append("email", data.email);

  try {
    const response = await fetch(VERIFY_OTP, {
      method: "POST",
      body: requestFormData,
    });

    if (!response.ok) {
    }
    const responseData = await response.json();
    console.log(responseData)
    return responseData;
  } catch (error) {}
};
const userEnquiry = async (data) => {
  try {
    const requestFormData = new FormData();
    requestFormData.append("name", data.name);
    requestFormData.append("email", data.email);
    requestFormData.append("subject", data.subject);
    requestFormData.append("message", data.message);

    const response = await fetch(USER_ENQUIRY, {
      method: "POST",
      body: requestFormData,
    });

    const userEnquiryResponse = await response.json();

    return userEnquiryResponse;
  } catch (error) {}
};

async function progressSave(
  quiz_id,
  question_id,
  ans,
  quuestionType,
  quizSpentTime
) {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;
  const tokenId = cookieStore.get("token")?.value;
  const classId = cookieStore.get("class_user_id").value;
  const urlWithParams = new URL(API_BASE_URL + "quiz-progress-save");
  urlWithParams.searchParams.append("token", tokenId);
  urlWithParams.searchParams.append("user_id", userId);
  urlWithParams.searchParams.append("class_id", classId);
  urlWithParams.searchParams.append("quiz_id", quiz_id);
  urlWithParams.searchParams.append("quesID", question_id);
  urlWithParams.searchParams.append("ans", ans);
  urlWithParams.searchParams.append("question_type", quuestionType);
  urlWithParams.searchParams.append("time", quizSpentTime);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenId}`,
    },
  });
}
async function progressEnd(quiz_id, quiz_length) {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;
  const tokenId = cookieStore.get("token")?.value;
  const classId = cookieStore.get("class_user_id").value;
  const urlWithParams = new URL(API_BASE_URL + "quiz-end");
  urlWithParams.searchParams.append("token", tokenId);
  urlWithParams.searchParams.append("user_id", userId);
  urlWithParams.searchParams.append("class_id", classId);
  urlWithParams.searchParams.append("quiz_id", quiz_id);
  urlWithParams.searchParams.append("allQuestions", quiz_length);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenId}`,
    },
  });
}
async function googleAuthRedirect() {
  const urlWithParams1 = new URL(BASE_API_URL + "auth/google");
  const response = await fetch(urlWithParams1, {
    method: "get",
  });
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
    }
  } else {
  }
}

const validateRefferal = async (referral_code) => {
  const requestFormData = new FormData();
  requestFormData.append("referral_code", referral_code);

  try {
    const response = await fetch(BASE_API_URL + "validate-referral", {
      method: "POST",
      body: requestFormData,
    });

    if (!response.ok) {
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {}
};

async function validateRoomCode(code) {
  // console.log(code);
  const cookieStore = cookies();
  const tokenId = cookieStore.get("token")?.value;
  const userId = cookieStore.get("user_id")?.value;
  const urlWithParams = new URL(API_BASE_URL + "validate_room_code");
  urlWithParams.searchParams.append("token", tokenId);
  urlWithParams.searchParams.append("user_id", userId);
  urlWithParams.searchParams.append("game_room_code", code);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenId}`,
    },
  });
  const responseData = await response.json();
  return responseData;
}
async function joinHost(
  quiz_id,
  user_name,
  is_enable_timer,
  is_random_question,
  is_random_option
) {
  // console.log(code)
  const cookieStore = cookies();
  const tokenId = cookieStore.get("token")?.value;
  const userId = cookieStore.get("user_id")?.value;
  const classId = cookieStore.get("class_user_id").value;
  const urlWithParams = new URL(API_BASE_URL + "join_host");
  urlWithParams.searchParams.append("token", tokenId);
  urlWithParams.searchParams.append("user_id", userId);
  urlWithParams.searchParams.append("class_id", classId);
  urlWithParams.searchParams.append("quiz_id", quiz_id);
  urlWithParams.searchParams.append("user_name", user_name);
  urlWithParams.searchParams.append("is_enable_timer", is_enable_timer);
  urlWithParams.searchParams.append("is_random_question", is_random_question);
  urlWithParams.searchParams.append("is_random_option", is_random_option);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenId}`,
    },
  });
  const responseData = await response.json();
  return responseData;
}
async function playerInGame(quiz_id, game_room_code) {
  // console.log(code)
  const cookieStore = cookies();
  const tokenId = cookieStore.get("token")?.value;
  const userId = cookieStore.get("user_id")?.value;
  const classId = cookieStore.get("class_user_id").value;
  const urlWithParams = new URL(API_BASE_URL + "PlayerInQuiz");
  urlWithParams.searchParams.append("token", tokenId);
  urlWithParams.searchParams.append("user_id", userId);
  urlWithParams.searchParams.append("class_id", classId);
  urlWithParams.searchParams.append("quiz_id", quiz_id);
  urlWithParams.searchParams.append("game_room_code", game_room_code);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenId}`,
    },
  });
  // const responseData = await response.json();
  // return responseData;
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
    }
  } else {
  }
}
async function roomQuizStart(
  quiz_id,
  game_room_code,
  is_enable_timer,
  is_random_question,
  is_random_option,
  game_type
) {
  // console.log(code)
  const cookieStore = cookies();
  const tokenId = cookieStore.get("token")?.value;
  const userId = cookieStore.get("user_id")?.value;
  const classId = cookieStore.get("class_user_id").value;
  const urlWithParams = new URL(API_BASE_URL + "quiz-start");
  urlWithParams.searchParams.append("token", tokenId);
  urlWithParams.searchParams.append("user_id", userId);
  urlWithParams.searchParams.append("class_id", classId);
  urlWithParams.searchParams.append("quiz_id", quiz_id);
  urlWithParams.searchParams.append("game_room_code", game_room_code);
  urlWithParams.searchParams.append("is_enable_timer", is_enable_timer);
  urlWithParams.searchParams.append("is_random_question", is_random_question);
  urlWithParams.searchParams.append("is_random_option", is_random_option);
  urlWithParams.searchParams.append("game_type", game_type);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenId}`,
    },
  });
  const responseData = await response.json();
  return responseData;
}
async function joinTeamRoom(quiz_id, game_pin_id, gameroom_code, user_name) {
  // console.log(code)
  const cookieStore = cookies();
  const tokenId = cookieStore.get("token")?.value;
  const userId = cookieStore.get("user_id")?.value;
  const classId = cookieStore.get("class_user_id").value;
  const urlWithParams = new URL(API_BASE_URL + "Join_Team");
  urlWithParams.searchParams.append("token", tokenId);
  urlWithParams.searchParams.append("user_id", userId);
  urlWithParams.searchParams.append("class_id", classId);
  urlWithParams.searchParams.append("quiz_id", quiz_id);
  urlWithParams.searchParams.append("game_pin_id", game_pin_id);
  urlWithParams.searchParams.append("gameroom_code", gameroom_code);
  urlWithParams.searchParams.append("user_name", user_name);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenId}`,
    },
  });
  const responseData = await response.json();
  // console.log(responseData)
  return responseData;
}
async function progressSaveRoom(
  quiz_id,
  quesID,
  ans,
  question_type,
  time,
  room_code,
  allQuestions
) {
  const cookieStore = cookies();
  const userId = cookieStore.get("user_id")?.value;
  const tokenId = cookieStore.get("token")?.value;
  const classId = cookieStore.get("class_user_id").value;
  const urlWithParams = new URL(API_BASE_URL + "quiz-progress-save");
  urlWithParams.searchParams.append("token", tokenId);
  urlWithParams.searchParams.append("user_id", userId);
  urlWithParams.searchParams.append("class_id", classId);
  urlWithParams.searchParams.append("quiz_id", quiz_id);
  urlWithParams.searchParams.append("quesID", quesID);
  urlWithParams.searchParams.append("ans", ans);
  urlWithParams.searchParams.append("question_type", question_type);
  urlWithParams.searchParams.append("time", time);
  urlWithParams.searchParams.append("room_code", room_code);
  urlWithParams.searchParams.append("allQuestions", allQuestions);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenId}`,
    },
  });
}
async function userRoomScore(quiz_id, room_code) {
  const urlWithParams1 = new URL(API_BASE_URL + "User-Score");
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("token")?.value;
  const class_id = cookieStore.has("class_user_id")
    ? cookieStore.get("class_user_id").value
    : 10;
  urlWithParams1.searchParams.append("token", token);
  urlWithParams1.searchParams.append("user_id", user_id);
  urlWithParams1.searchParams.append("class_id", class_id);
  urlWithParams1.searchParams.append("quiz_id", quiz_id);
  urlWithParams1.searchParams.append("room_code", room_code);
  const response = await fetch(urlWithParams1, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
    }
  } else {
  }
}
async function leaderboardRoomData({ quiz_id, page, room_code }) {
  const urlWithParams = new URL(API_BASE_URL + "quiz-leaderboard");
  // console.log(class_id);
  const cookieStore = cookies();
  const user_id = cookieStore.get("user_id")?.value;
  const token = cookieStore.get("token")?.value;
  const class_id = cookieStore.has("class_user_id")
    ? cookieStore.get("class_user_id").value
    : 10;
  urlWithParams.searchParams.append("token", token);
  urlWithParams.searchParams.append("user_id", user_id);
  urlWithParams.searchParams.append("class_id", class_id);
  urlWithParams.searchParams.append("quiz_id", quiz_id);
  urlWithParams.searchParams.append("page", page);
  urlWithParams.searchParams.append("room_code", room_code);
  const response = await fetch(urlWithParams, {
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
    }
  } else {
  }
}

const forgetPassword = async ({ data }) => {
  const requestFormData = new FormData();
  requestFormData.append("mobile", data.mobile);
  requestFormData.append("country_code", data.country_code);

  try {
    const response = await fetch(FORGET_PASSWORD, {
      method: "POST",
      body: requestFormData,
    });

    if (!response.ok) {
    }
    const responseData = await response.json();
    // console.log(responseData)
    return responseData;
  } catch (error) {}
};
const verifyForgetOtp = async ({ data }) => {
  const requestFormData = new FormData();
  requestFormData.append("mobile", data.otp);
  requestFormData.append("country_code", data.mobile);

  try {
    const response = await fetch(VERIFY_FORGET_OTP, {
      method: "POST",
      body: requestFormData,
    });

    if (!response.ok) {
    }
    const responseData = await response.json();
    // console.log(responseData)
    return responseData;
  } catch (error) {}
};
const updatePassword = async ({ data }) => {
  const requestFormData = new FormData();
  requestFormData.append("password", data.password);
  requestFormData.append("confirm_password", data.confirm_password);
  requestFormData.append("mobile", data.mobile);

  try {
    const response = await fetch(UPDATE_PASSWORD, {
      method: "POST",
      body: requestFormData,
    });

    if (!response.ok) {
    }
    const responseData = await response.json();
    // console.log(responseData)
    return responseData;
  } catch (error) {}
};
const updateLoggedUserPassword = async ({ data }) => {
  const requestFormData = new FormData();
  requestFormData.append("mobile", data.mobile);
  requestFormData.append("old_password", data.old_password);
  requestFormData.append("password", data.password);
  requestFormData.append("confirm_password", data.confirm_password);

  try {
    const response = await fetch(UPDATE_PASSWORD, {
      method: "POST",
      body: requestFormData,
    });

    if (!response.ok) {
    }
    const responseData = await response.json();
    // console.log(responseData)
    return responseData;
  } catch (error) {}
};
async function siteMapQuizList(currentPage) {
  const res = await fetch(`${API_BASE_URL}sitemap-quiz-list?page=${currentPage}`);
  if (!res.ok) {
    // console.log(res);
  }
  return res.json();
}
export {
  quizDetails,
  chapterList,
  chapterDetails,
  quizDetailId,
  quizPlay,
  userScore,
  leaderboardData,
  quizSolution,
  userProfile,
  updateUser,
  userClass,
  userUpdateClass,
  addUser,
  userLogin,
  verifyOtp,
  userEnquiry,
  userUpdateClassLogin,
  dashBoardQuizTest,
  progressSave,
  progressEnd,
  googleAuth,
  googleAuthRedirect,
  validateRefferal,
  validateRoomCode,
  joinHost,
  playerInGame,
  roomQuizStart,
  joinTeamRoom,
  progressSaveRoom,
  userRoomScore,
  leaderboardRoomData,
  forgetPassword,
  verifyForgetOtp,
  updatePassword,
  updateLoggedUserPassword,
  userLogout,
  siteMapQuizList,
};
