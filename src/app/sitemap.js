import { siteMapQuizList } from "@/app/api/service.js";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const revalidate = 86400;
export default async function sitemap() {
  let currentPage = 1;
  const siteMapQuizListData = await siteMapQuizList(currentPage);
  const totalQuizzes = siteMapQuizListData.quizSitemapData.total;
  const ITEMS_PER_PAGE = siteMapQuizListData.quizSitemapData.per_page;
  const totalPage = Math.ceil(totalQuizzes / ITEMS_PER_PAGE);

  const sitemaps = [];
  sitemaps.push({
    url: BASE_URL,
    lastModified: new Date(),
    priority: 1,
  });
  sitemaps.push({
    url: BASE_URL + "about",
    lastModified: new Date(),
    priority: 0.8,
  });
  sitemaps.push({
    url: BASE_URL + "login",
    lastModified: new Date(),
    priority: 0.8,
  });
  sitemaps.push({
    url: BASE_URL + "register",
    lastModified: new Date(),
    priority: 0.8,
  });
  sitemaps.push({
    url: BASE_URL + "contact",
    lastModified: new Date(),
    priority: 0.8,
  });
  sitemaps.push({
    url: BASE_URL + "start",
    lastModified: new Date(),
    priority: 0.8,
  });
  for (currentPage = 1; currentPage <= totalPage; currentPage++) {
    const quizListPaginatedData = await siteMapQuizList(currentPage);
    const sitemapData = quizListPaginatedData.quizSitemapData.data.map(
      (quizData, index) => ({
        url: `${BASE_URL}quiz/${quizData.quizze_id}/${quizData.quiz_title_slug}`,
        // lastModified: quizData.updated_at,
        lastModified: new Date(),
        id: `${index + 1}`,
        priority: 0.8,
      })
    );
    sitemaps.push(sitemapData);
  }
  return sitemaps.flat();
}
