import { userEnquiry } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const name = res.data.name;
  const email = res.data.email;
  const selectedOption = res.data.selectedOption;
  const message = res.data.message;

  const enquiryData = await userEnquiry({
    name,
    email,
    selectedOption,
    message,
  });

  return Response.json(
    enquiryData
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
