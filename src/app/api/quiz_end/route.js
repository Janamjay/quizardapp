import { progressEnd } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const quiz_id = res.quiz_id;
  const quiz_length = res.quiz_length;

  const quizProgressSaveData = await progressEnd(
    quiz_id,
    quiz_length,
  );

  return Response.json(
    "Quiz Submitted SuccessFully"
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
