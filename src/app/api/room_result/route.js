import { userRoomScore } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const quiz_id = res.post.quiz_id;
  const room_code = res.post.room_code;

  const userScoreData = await userRoomScore(quiz_id, room_code);

  // console.log(userScoreData)
  return Response.json(
    userScoreData
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
