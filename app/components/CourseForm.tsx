"use client";

import { FormEvent, useState } from "react";

interface CourseFormProps {
  onSubmit: (data: { name: string; description: string; schedule: string; instructor_id?: number | null }) => void;
}

export default function CourseForm({ onSubmit }: CourseFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");
  const [instructorId, setInstructorId] = useState<number | "">("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: { name: string; description: string; schedule: string; instructor_id?: number | null } = {
      name,
      description,
      schedule,
    };
    if (instructorId !== "") payload.instructor_id = Number(instructorId);
    onSubmit(payload);
    setName("");
    setDescription("");
    setSchedule("");
    setInstructorId("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300  text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter course name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter course description"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900">Schedule</label>
        <input
          type="datetime-local"
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900">Instructor ID</label>
        <input
          type="number"
          value={instructorId}
          onChange={(e) => setInstructorId(Number(e.target.value))}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Instructor ID"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition"
      >
        Add Course
      </button>
    </form>
  );
}
