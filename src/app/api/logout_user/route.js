import { userLogout } from "@/app/api/service";
import { cookies } from "next/headers";
export async function POST(request) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (token) {
    const loggedOutUserData = await userLogout();
    if (loggedOutUserData.success !== undefined && loggedOutUserData.success ) {
      cookies().delete("token");
      cookies().delete("tokenid");
      cookies().delete("user_id");
      cookies().delete("refferal");
      cookies().delete("score");
      cookies().delete("user");
      cookies().delete("quizName");
      cookies().delete("isUserLoggedIn");
    }
  }

  return Response.json(
    { success: true, message: "Logged out successfully!" }
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
