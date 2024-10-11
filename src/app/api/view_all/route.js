import { quizDetails } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const subjectId = res.myVariable.subjectId;
  const page = res.myVariable.page;

  const quizDataPaginate = await quizDetails({
    subjectId,
    page,
  });

  return Response.json(
    quizDataPaginate
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
