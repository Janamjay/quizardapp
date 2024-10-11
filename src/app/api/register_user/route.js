import { addUser } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const name = res.formData.name;
  const email = res.formData.email;
  const mobile = res.formData.phone;
  const password = res.formData.password;
  const confirm_password = res.formData.confirmPassword;
  const country_code = res.formData.countryCode;
  const country_name = res.formData.country;
  const refferal_code = res.formData.refferal;
  const sub_course_id = res.formData.selectedSubCourse;

  const updatedUserData = await addUser({
    name,
    email,
    mobile,
    password,
    confirm_password,
    country_code,
    country_name,
    refferal_code,
    sub_course_id,
  });

  return Response.json(
    // "OTP successfully sent"
    {
      user_id: updatedUserData.user_id,
      otp_status: updatedUserData.otp_status,
      message: updatedUserData.message,
    }
    // updatedUserData
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
