import { roomQuizStart } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const quiz_id = res.quiz_id;
  const game_room_code = res.game_room_code;
  const is_enable_timer = res.is_enable_timer;
  const is_random_question = res.is_random_question;
  const is_random_option = res.is_random_option;
  const game_type = res.game_type;

  const roomQuizStartData = await roomQuizStart(quiz_id , game_room_code , is_enable_timer , is_random_question , is_random_option , game_type);

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