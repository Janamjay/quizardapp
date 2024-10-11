import { updatePassword } from "@/app/api/service";

export async function POST(request) {
  const res = await request.json();
  const password = res.updatePassword.password;
  const confirm_password = res.updatePassword.confirm_password;
  const mobileNumber = res.updatePassword.mobile;

  const mobile = parseInt(mobileNumber, 10);
  const data = {
    password,
    confirm_password,
    mobile,
  };
  const passwordUpdateData = await updatePassword({ data });

  return Response.json({ passwordUpdateData });
  // , {
  //   status: 200,
  //   headers: {
  //     'Access-Control-Allow-Origin': 'https://quizard.app/',
  //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  //     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  //   },
  // }
}
