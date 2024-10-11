import { validateRefferal } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const referral_code = res.referralCode.refferral_code;

  const verifyUserData = await validateRefferal({
    referral_code
  });

  return Response.json(
    verifyUserData
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