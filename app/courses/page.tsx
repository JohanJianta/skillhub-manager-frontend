"use client";

import { useState } from "react";
import Navigation from "@/app/components/Navigation";
import Modal from "@/app/components/Modal";
import CourseForm from "@/app/components/CourseForm";

interface Course {
  id: number;
  name: string;
  description: string;
  schedule: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      name: "Introduction to Computer Science",
      description: "Learn the basics of CS",
      schedule: "2025-01-10T10:00",
    },
    { id: 2, name: "Data Structures", description: "Advanced data structure concepts", schedule: "2025-01-12T14:00" },
    { id: 3, name: "Web Development", description: "Modern web development practices", schedule: "2025-01-15T09:00" },
    { id: 4, name: "Database Design", description: "Database design and optimization", schedule: "2025-01-17T13:00" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCourse = (data: { name: string; description: string; schedule: string }) => {
    const newCourse: Course = {
      id: Math.max(...courses.map((c) => c.id), 0) + 1,
      ...data,
    };
    setCourses([...courses, newCourse]);
    setIsModalOpen(false);
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
                {courses.map((course, index) => (
                  <tr
                    key={course.id}
                    className={`border-b hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{course.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(course.schedule).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">No courses yet. Add one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
