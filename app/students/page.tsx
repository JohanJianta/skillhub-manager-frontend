"use client";

import { useState } from "react";
import Link from "next/link";
import Navigation from "@/app/components/Navigation";
import Modal from "@/app/components/Modal";
import StudentForm from "@/app/components/StudentForm";

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "555-0101" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "555-0102" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", phone: "555-0103" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", phone: "555-0104" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddStudent = (data: { name: string; email: string; phone: string }) => {
    const newStudent: Student = {
      id: Math.max(...students.map((s) => s.id), 0) + 1,
      ...data,
    };
    setStudents([...students, newStudent]);
    setIsModalOpen(false);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Students</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              + Add Student
            </button>
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Student">
            <StudentForm onSubmit={handleAddStudent} />
          </Modal>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`border-b hover:bg-gray-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <Link href={`/students/${student.id}`} className="font-medium text-blue-600 hover:underline">
                        {student.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {students.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 text-lg">No students yet. Add one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
