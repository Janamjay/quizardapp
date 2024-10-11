import { chapterDetails } from "@/app/api/service";
export async function POST(request) {
  const res = await request.json();
  const subjectId = res.myVariable.subjectId;
  const chapterId = res.myVariable.chapterId;
  const type = res.myVariable.type;
  const detailPageNumber = res.myVariable.detailPageNumber;


  const chapterData = await chapterDetails({
    subjectId,
    chapterId,
    type,
    detailPageNumber,
  });

  return Response.json(chapterData
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
