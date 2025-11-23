"use client";

import { useState } from "react";

interface EnrollmentFormProps {
  studentId: number;
  onSubmit: (courseIds: number[]) => void;
}

export default function EnrollmentForm({ studentId, onSubmit }: EnrollmentFormProps) {
  const [courseIds, setCourseIds] = useState("");

  const handleSubmit = () => {
    const ids = courseIds
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id)
      .map((id) => Number(id));

    if (ids.length === 0) {
      alert("Please enter at least one course ID");
      return;
    }

    onSubmit(ids);
    setCourseIds("");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Student ID</label>
        <input
          type="text"
          value={studentId}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-gray-100 cursor-not-allowed"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Course IDs (comma-separated)</label>
        <input
          type="text"
          value={courseIds}
          onChange={(e) => setCourseIds(e.target.value)}
          placeholder="e.g., 1, 2, 3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
        />
        <p className="text-xs text-gray-500 mt-2">Enter one or more course IDs separated by commas</p>
      </div>
      <button onClick={handleSubmit} className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Enroll
      </button>
    </div>
  );
}
