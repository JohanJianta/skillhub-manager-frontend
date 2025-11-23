"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navigation from "@/app/components/Navigation";
import Modal from "@/app/components/Modal";
import EnrollmentForm from "@/app/components/EnrollmentForm";
import Link from "next/link";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id ?? 0);

  const sample = {
    id: 1,
    name: "Mark Porter",
    email: "markporter@student.com",
    phone: "62135792468",
    enrollments: [
      {
        id: 2,
        course: {
          id: 2,
          name: "Software Engineering",
          description: "Learn about Software Engineering...",
          schedule: "2025-12-01T04:30:00.000Z",
        },
        status: "active",
        created_at: "2025-11-22T10:01:16.000Z",
        updated_at: "2025-11-22T10:01:16.000Z",
      },
    ],
  };

  const [student, setStudent] = useState(
    sample.id === id ? sample : { ...sample, id, name: `Student ${id}`, email: `student${id}@example.com`, phone: "" }
  );

  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

  const handleSave = () => {
    alert("Student profile updated.");
  };

  const handleDelete = () => {
    if (confirm("Delete this student? This cannot be undone.")) {
      router.push("/students");
    }
  };

  const removeEnrollment = (enrollId: number) => {
    setStudent({ ...student, enrollments: student.enrollments.filter((e) => e.id !== enrollId) });
  };

  const handleAddEnrollment = (courseIds: number[]) => {
    const newEnrollments = courseIds.map((courseId) => ({
      id: Math.max(...student.enrollments.map((e) => e.id), 0) + 1,
      course: {
        id: courseId,
        name: `Course ${courseId}`,
        description: "Sample course",
        schedule: new Date().toISOString(),
      },
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    setStudent({
      ...student,
      enrollments: [...student.enrollments, ...newEnrollments],
    });
    setIsEnrollmentModalOpen(false);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start gap-6">
            <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl text-gray-900 font-bold mb-4">{student.name}</h2>
              <p className="text-sm text-gray-900">Email: {student.email}</p>
              <p className="text-sm text-gray-900">Phone: {student.phone}</p>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg text-gray-900 font-semibold">Enrollments</h3>
                  <button
                    onClick={() => setIsEnrollmentModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    + Add Enrollment
                  </button>
                </div>
                {student.enrollments.length === 0 && <p className="text-gray-900">No enrollments</p>}
                <ul className="space-y-3">
                  {student.enrollments.map((en) => (
                    <li key={en.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <div>
                        <Link href={`/courses/${en.course.id}`} className="font-medium text-blue-600 hover:underline">
                          {en.course.name}
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
              <h3 className="text-lg text-gray-900 font-semibold mb-4">Profile</h3>
              <label className="block text-sm font-medium text-gray-900">Name</label>
              <input
                value={student.name}
                onChange={(e) => setStudent({ ...student, name: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-gray-900 border rounded"
              />
              <label className="block text-sm font-medium text-gray-900 mt-3">Email</label>
              <input
                value={student.email}
                onChange={(e) => setStudent({ ...student, email: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-gray-900 border rounded"
              />
              <label className="block text-sm font-medium text-gray-900 mt-3">Phone</label>
              <input
                value={student.phone}
                onChange={(e) => setStudent({ ...student, phone: e.target.value })}
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

        <Modal isOpen={isEnrollmentModalOpen} onClose={() => setIsEnrollmentModalOpen(false)} title="Add Enrollment">
          <EnrollmentForm studentId={student.id} onSubmit={handleAddEnrollment} />
        </Modal>
      </div>
    </>
  );
}
