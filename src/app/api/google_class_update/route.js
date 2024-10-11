import { userUpdateClassLogin } from "@/app/api/service";
import { cookies } from "next/headers";
export async function POST(request) {
  const res = await request.json();
  const classId = res.post.classId;
  const userClassData = await userUpdateClassLogin(
    classId,
  );
  cookies().set("class_user_id", classId);
  return Response.json(
    "class updated"
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
