import Link from "next/link";
import "./not-found.css";
export default function Error({ statusCode, err }) {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
        <div className="p-6 max-w-md w-full space-y-8">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-semibold text-gray-700">
              Oops! something went wrong .
            </h1>
            <p className="mt-2 text-gray-600">
              <Link href="/" className="text-blue-500 hover:underline">
                Go to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return {
    statusCode,
    err,
  };
};
