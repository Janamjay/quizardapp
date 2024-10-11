import { leaderboardData } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const quiz_id = res.myVariable.quiz_id;
  const page = res.myVariable.page;

  const leaderboardDataPaginate = await leaderboardData({
    quiz_id, page
  });

  return Response.json(
    // "Data populated"
    leaderboardDataPaginate
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