import { quizDetailId } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const quiz_id = res.post.quiz_id;

  const quizDetailData = await quizDetailId({
    quiz_id
  });

  return Response.json(
    quizDetailData
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