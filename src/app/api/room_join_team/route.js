import { joinTeamRoom } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const quiz_id = res.quiz_id;
  const game_pin_id = res.game_pin_id;
  const gameroom_code = res.gameroom_code;
  const user_name = res.user_name;

  const roomQuizStartData = await joinTeamRoom(
    quiz_id,
    game_pin_id,
    gameroom_code,
    user_name
  );

//   console.log(roomQuizStartData)
  return Response.json(
    roomQuizStartData
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
