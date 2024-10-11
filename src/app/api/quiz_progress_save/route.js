import { progressSave } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const quiz_id = res.quiz_id;
  const question_id = res.question_id;
  const ans = res.ans;
  const quuestionType = res.quuestionType;
  const quizSpentTime = res.quizSpentTime;

  const quizProgressSaveData = await progressSave(
    quiz_id,
    question_id,
    ans,
    quuestionType,
    quizSpentTime
  );

  return Response.json(
    "Answer Submitted SuccessFully"
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
