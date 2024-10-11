import { userLogin } from "@/app/api/service";
import { cookies } from "next/headers";
export async function POST(request) {
  const res = await request.json();
  const userId = res.post.userId;
  const password = res.post.password;

  const loggedUserData = await userLogin({
    userId,
    password,
  });

  if (loggedUserData.success) {
    const userToken = loggedUserData.user.token;
    const socketTokenId = loggedUserData.user.tokenId;
    const user = loggedUserData.user.user_name;
    const email = loggedUserData.user.email;
    const user_id = loggedUserData.user.user_id;
    const refferal = loggedUserData.user.reffral_code;
    const class_id = loggedUserData.class_id;
    const user_coin = loggedUserData.user_coin;
    const userClassName = loggedUserData.class_name;
    const coinScore =
      user_coin > 1000 ? (user_coin / 1000).toFixed(1) + "k" : user_coin;

    cookies().set("token", userToken, { httpOnly: true, secure: true });
    cookies().set("isUserLoggedIn", true);
    cookies().set("tokenid", socketTokenId, { httpOnly: true, secure: true });
    cookies().set("user", user);
    cookies().set("user_id", user_id);
    cookies().set("refferal", refferal);
    cookies().set("class_user_id", class_id);
    cookies().set("score", coinScore);
    cookies().set("class_name", userClassName);
    // cookies().set("class_name", userClassName.replace("Class", "Grade"));

    return Response.json(
      {
        success: true,
        user: loggedUserData.user.user_name,
        message: loggedUserData.message,
      }
      //   , {
      //   status: 200,
      //   headers: {
      //     'Access-Control-Allow-Origin': 'https://quizard.app/',
      //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      //     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      //   },
      // }
    );
  } else {
    return Response.json(
      {
        success: false,
        message: loggedUserData.message,
      }
      //   , {
      //   status: 200,
      //   headers: {
      //     'Access-Control-Allow-Origin': 'https://quizard.app/',
      //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      //     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      //   },
      // }
    );
  }
}
