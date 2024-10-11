import { leaderboardRoomData } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const quiz_id = res.post.quiz_id;
  const page = res.post.page;
  const room_code = res.post.room_code;

  const leaderboardData = await leaderboardRoomData({
    quiz_id, page , room_code
  });

  return Response.json(
    // "Data populated"
    leaderboardData
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