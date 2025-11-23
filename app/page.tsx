"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navigation from "@/app/components/Navigation";
import { fetcher } from "@/lib/api";
import toast from "react-hot-toast";

export default function Home() {
  const [counts, setCounts] = useState<{ students?: number; courses?: number }>({});

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [students, courses] = await Promise.all([fetcher("/students"), fetcher("/courses")]);
        if (!mounted) return;
        setCounts({
          students: Array.isArray(students) ? students.length : students?.count ?? undefined,
          courses: Array.isArray(courses) ? courses.length : courses?.count ?? undefined,
        });
        toast.success("Stats updated");
      } catch (err) {
        console.error(err);
        toast.error("Could not load stats");
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to SkillHub Manager</h1>
            <p className="text-xl text-gray-600">Manage students and courses efficiently in one place</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Students Card */}
            <Link href="/students">
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Students</h2>
                <p className="text-gray-600 mb-6">View and manage all students.</p>
                <div className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                  Go to Students →
                </div>
                <div className="mt-4 text-sm text-gray-700">Total: {counts.students ?? "—"}</div>
              </div>
            </Link>

            {/* Courses Card */}
            <Link href="/courses">
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Courses</h2>
                <p className="text-gray-600 mb-6">View and manage courses.</p>
                <div className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition">
                  Go to Courses →
                </div>
                <div className="mt-4 text-sm text-gray-700">Total: {counts.courses ?? "—"}</div>
              </div>
            </Link>
          </div>

          <div className="mt-16 bg-white rounded-lg shadow p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <span className="text-2xl">👨‍🎓</span>
                </div>
                <div>
                  <p className="text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">{counts.students ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <p className="text-gray-600">Total Courses</p>
                  <p className="text-3xl font-bold text-gray-900">{counts.courses ?? "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
