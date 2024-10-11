import { updateLoggedUserPassword } from "@/app/api/service";

export async function POST(request) {
  const res = await request.json();
  const mobileNumber = res.updatePasswordData.mobile;
  const old_password = res.updatePasswordData.old_password;
  const password = res.updatePasswordData.password;
  const confirm_password = res.updatePasswordData.confirm_password;

  const mobile = parseInt(mobileNumber, 10);
  const data = {
    mobile,
    old_password,
    password,
    confirm_password,
  };
  const passwordUpdateData = await updateLoggedUserPassword({ data });

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
