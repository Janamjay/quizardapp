import { updateUser } from "@/app/api/service";
export async function POST(request) {
  const res = await request.formData();
  const name = res.get("name");
  const gender = res.get("gender");
  const email = res.get("email");
  const mobile = res.get("mobile");
  const dob = res.get("dob");
  const profile_image = res.get("profile_image");
  const country_code = res.get("country_code");
  const country_name = res.get("country_name");
  // console.log(await request.formData())
  // console.log(res.get('profile_image'));
  const updatedUserProfileData = await updateUser({
    name,
    gender,
    email,
    mobile,
    dob,
    profile_image,
    country_code,
    country_name,
  });

  return Response.json(
    "Profile updated Successfully"
    // updatedUserProfileData
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
