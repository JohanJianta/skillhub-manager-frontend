"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import Navigation from "@/app/components/Navigation";
import toast from "react-hot-toast";
import Modal from "@/app/components/Modal";
import CourseForm from "@/app/components/CourseForm";
import { fetchJson } from "@/lib/api";

interface Course {
  id: number;
  name: string;
  description: string;
  schedule: string;
}

export default function CoursesPage() {
  const { data: courses } = useSWR<Course[]>("/courses", fetchJson);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCourse = async (data: {
    name: string;
    description: string;
    schedule: string;
    instructor_id?: number | null;
  }) => {
    try {
      await fetchJson("/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          instructor_id: data.instructor_id ?? null,
          schedule: data.schedule,
        }),
      });
      mutate("/courses");
      setIsModalOpen(false);
      toast.success("Course created");
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Could not create course");
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Courses</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              + Add Course
            </button>
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Course">
            <CourseForm onSubmit={handleAddCourse} />
          </Modal>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {(courses ?? []).map((course: Course, index: number) => (
                  <tr
                    key={course.id}
                    className={`border-b hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      <Link href={`/courses/${course.id}`} className="font-medium text-blue-600 hover:underline">
                        {course.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(course.schedule).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(courses ?? []).length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">No courses yet. Add one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
