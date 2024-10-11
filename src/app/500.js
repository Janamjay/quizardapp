import Link from "next/link";
import "./not-found.css";

const ServerError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="p-6 max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-semibold text-gray-700">
            Oops! Server Error
          </h1>
          <p className="mt-2 text-gray-600">
            Sorry, something went wrong on the server side.
            <Link href="/" className="text-blue-500 hover:underline">
              Go to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
