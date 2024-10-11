import { useReportWebVitals } from "next/web-vitals";
function MyApp({ Component, pageProps }) {
  useReportWebVitals((metric) => {
    // console.log(metric);
  });
  return <Component {...pageProps} />;
}

export default MyApp;
