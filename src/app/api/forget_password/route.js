import { forgetPassword } from "@/app/api/service";

export async function POST(request) {
  const res = await request.json();
  const mobileNumber = res.dataForget.mobile;
  const countryCodeNumber = res.dataForget.country_code;

  const mobile = parseInt(mobileNumber, 10);
  const country_code = parseInt(countryCodeNumber, 10);
  const data = {
    mobile,
    country_code,
  };
  const forgetPasswordData = await forgetPassword({data});

  return Response.json("OTP sent successfully");
  // , {
  //   status: 200,
  //   headers: {
  //     'Access-Control-Allow-Origin': 'https://quizard.app/',
  //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  //     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  //   },
  // }
}
