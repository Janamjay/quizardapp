import { verifyOtp } from "@/app/api/service";
import { setCookie } from "cookies-next";
import { cookies } from "next/headers";
export async function POST(request) {
  const res = await request.json();
  // console.log(res)
  const mobile = res.data.mobile;
  const refferal_code = res.data.refferal_code;
  const otp = res.data.otp;
  const email = res.data.email;
  const user_Id = res.data.user_id;

  const data ={
    mobile:mobile,
    refferal_code:refferal_code,
    otp:otp,
    email:email,
    user_id:user_Id,
  }
  const verifyUserData = await verifyOtp({data});
  const userToken = verifyUserData.user.token;
  const socketTokenId = verifyUserData.user.tokenId;
  const user = verifyUserData.user.user_name;
  const user_id = verifyUserData.user.user_id;
  const refferal = verifyUserData.user.reffral_code;
  const class_id = verifyUserData.user.class_id;
  const userClassName = verifyUserData.user.class_name;
  const user_coin = verifyUserData.user.user_coin;
  const coinScore =
    user_coin > 1000 ? (user_coin / 1000).toFixed(1) + "k" : user_coin;

  // setCookie("token", userToken);
  // setCookie("isUserLoggedIn", true);
  // setCookie("tokenid", socketTokenId);
  // setCookie("user", user);
  // setCookie("user_id", userId);
  // setCookie("refferal", refferal);
  // setCookie("class_user_id", class_id);

  cookies().set("token", userToken, { httpOnly: true, secure: true });
  cookies().set("isUserLoggedIn", true);
  cookies().set("tokenid", socketTokenId, { httpOnly: true, secure: true });
  cookies().set("user", user);
  cookies().set("user_id", user_id);
  cookies().set("refferal", refferal);
  cookies().set("class_user_id", class_id);
  // cookies().set("class_name", userClassName);
  cookies().set("class_name", userClassName.replace("Class", "Grade"));
  return Response.json(
    // verifyUserData
    "Successfully registered"
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
