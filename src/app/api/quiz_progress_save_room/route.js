import { progressSaveRoom } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const quiz_id = res.quiz_id;
  const quesID = res.quesID;
  const ans = res.ans;
  const question_type = res.question_type;
  const time = res.time;
  const room_code = res.room_code;
  const allQuestions = res.allQuestions;

  const quizProgressSaveData = await progressSaveRoom(
    quiz_id,
    quesID,
    ans,
    question_type,
    time,
    room_code,
    allQuestions
  );

  return Response.json(
    {success : true}
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
