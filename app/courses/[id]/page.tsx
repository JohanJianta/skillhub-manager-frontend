"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navigation from "@/app/components/Navigation";
import Link from "next/link";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id ?? 0);

  const sample = {
    id: 2,
    name: "Software Engineering",
    description: "Learn about Software Engineering...",
    instructor: { id: 1, name: "Jack Krugger", email: "jackkrugger@instructor.com", phone: "62123456789" },
    schedule: "2025-12-01T04:30:00.000Z",
    enrollments: [
      {
        id: 2,
        student: { id: 1, name: "Mark Porter", email: "markporter@student.com", phone: "62135792468" },
        status: "active",
        created_at: "2025-11-22T10:01:16.000Z",
        updated_at: "2025-11-22T10:01:16.000Z",
      },
    ],
  };

  const [course, setCourse] = useState(
    sample.id === id
      ? sample
      : {
          ...sample,
          id,
          name: `Course ${id}`,
          description: "",
          instructor: { id: 0, name: "Jack", email: "email", phone: "12345" },
          schedule: new Date().toISOString(),
          enrollments: [],
        }
  );

  const handleSave = () => {
    alert("Course updated");
  };

  const handleDelete = () => {
    if (confirm("Delete this course? This cannot be undone.")) {
      router.push("/courses");
    }
  };

  const removeEnrollment = (enrollId: number) => {
    setCourse({ ...course, enrollments: course.enrollments.filter((e) => e.id !== enrollId) });
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start gap-6">
            <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl text-gray-900 font-bold mb-2">{course.name}</h2>
              <p className="text-sm text-gray-900 mb-4">{course.description}</p>
              <p className="text-sm text-gray-900">Schedule: {new Date(course.schedule).toLocaleString()}</p>
              <div className="mt-4">
                <h3 className="text-lg text-gray-900 font-semibold mb-2 ">Instructor</h3>
                <p className="text-sm text-gray-900">Name: {course.instructor?.name}</p>
                <p className="text-sm text-gray-900">Email: {course.instructor?.email}</p>
                <p className="text-sm text-gray-900">Phone: {course.instructor?.phone}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg text-gray-900 font-semibold mb-2">Enrollments</h3>
                {course.enrollments.length === 0 && <p className="text-gray-900">No enrollments</p>}
                <ul className="space-y-3">
                  {course.enrollments.map((en) => (
                    <li key={en.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <div>
                        <Link href={`/students/${en.student.id}`} className="font-medium text-blue-600 hover:underline">
                          {en.student.name}
                        </Link>
                        <div className="text-sm text-gray-900">
                          {en.status} • {new Date(en.updated_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => removeEnrollment(en.id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg text-gray-900 font-semibold mb-4">Edit Course</h3>
              <label className="block text-sm font-medium text-gray-900">Name</label>
              <input
                value={course.name}
                onChange={(e) => setCourse({ ...course, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-gray-900 border rounded"
              />
              <label className="block text-sm font-medium text-gray-900 mt-3">Description</label>
              <textarea
                value={course.description}
                onChange={(e) => setCourse({ ...course, description: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-gray-900 border rounded"
              />
              <label className="block text-sm font-medium text-gray-900 mt-3">Schedule</label>
              <input
                type="datetime-local"
                value={course.schedule ? new Date(course.schedule).toISOString().slice(0, 16) : ""}
                onChange={(e) => setCourse({ ...course, schedule: new Date(e.target.value).toISOString() })}
                className="mt-1 w-full px-3 py-2 text-gray-900 border rounded"
              />

              <label className="block text-sm font-medium text-gray-900 mt-3">Instructor ID</label>
              <input
                type="number"
                value={course.instructor?.id ?? 0}
                onChange={(e) =>
                  setCourse({ ...course, instructor: { ...course.instructor, id: Number(e.target.value) } })
                }
                className="mt-1 w-full px-3 py-2 text-gray-900 border rounded"
              />

              <div className="mt-6 flex gap-2">
                <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Save
                </button>
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
