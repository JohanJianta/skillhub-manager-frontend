import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-12 rounded shadow-md text-center max-w-lg">
        <h1 className="text-3xl text-gray-900 font-bold mb-4">Item Not Found</h1>
        <p className="text-gray-900 mb-6">The item you are looking for does not exist or has been removed.</p>
        <div className="flex justify-center gap-4">
          <Link href="/" className="bg-gray-200 text-gray-900 px-4 py-2 rounded hover:bg-gray-300">
            Home
          </Link>
          <Link href="/students" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Students
          </Link>
          <Link href="/courses" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
