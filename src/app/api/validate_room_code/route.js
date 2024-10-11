import { validateRoomCode } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const code = res;

  const validateRoomData = await validateRoomCode(code);
  return Response.json(
    validateRoomData
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
