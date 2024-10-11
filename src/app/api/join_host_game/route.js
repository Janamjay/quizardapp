import { joinHost } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const quiz_id = res.quiz_id;
  const user_name = res.user_name;
  const is_enable_timer = res.is_enable_timer;
  const is_random_question = res.is_random_question;
  const is_random_option = res.is_random_option;

  const joinHostData = await joinHost(
    quiz_id,
    user_name,
    is_enable_timer,
    is_random_question,
    is_random_option
  );

  return Response.json(
    joinHostData
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
