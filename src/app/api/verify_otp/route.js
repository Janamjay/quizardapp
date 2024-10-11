import { verifyForgetOtp } from "@/app/api/service";

export async function POST(request) {
  const res = await request.json();
  const userOtp = res.otpData.otp;
  const mobileNumber = res.otpData.mobile;

  const otp = parseInt(userOtp, 10);
  const mobile = parseInt(mobileNumber, 10);
  const data = {
    otp,
    mobile,
  };
  const verifyOtpData = await verifyForgetOtp({data});

  return Response.json("OTP verified successfully");
  // , {
  //   status: 200,
  //   headers: {
  //     'Access-Control-Allow-Origin': 'https://quizard.app/',
  //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  //     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  //   },
  // }
}
