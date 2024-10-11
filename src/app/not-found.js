import Link from "next/link";
import './not-found.css'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="p-6 max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-semibold text-gray-700">
            Oops! Page Not Found
          </h1>
          <p className="mt-2 text-gray-600">
            The page you are looking for could not be found. Please try again or
            go back to the
            <Link href="/" className="text-blue-500 hover:underline">
              &nbsp; homepage
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
