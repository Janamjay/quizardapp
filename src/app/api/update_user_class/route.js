import { userUpdateClass } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const loggedUser = res.post.loggedUser;
  const classId = res.post.classId;
  const userClassData = await userUpdateClass({
    loggedUser,
    classId,
  });

  return Response.json(
    // "SuccessFully Login"
    userClassData
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
