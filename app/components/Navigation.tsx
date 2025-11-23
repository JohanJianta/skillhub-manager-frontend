import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            SkillHub Manager
          </Link>
          <div className="flex gap-6">
            <Link href="/students" className="hover:text-slate-300 transition font-medium">
              Students
            </Link>
            <Link href="/courses" className="hover:text-slate-300 transition font-medium">
              Courses
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
