"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navigation from "@/app/components/Navigation";
import Modal from "@/app/components/Modal";
import EnrollmentForm from "@/app/components/EnrollmentForm";
import Link from "next/link";
import { fetchJson } from "@/lib/api";
import toast from "react-hot-toast";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id ?? 0);

  interface Enrollment {
    id: number;
    course: { id: number; name: string };
    status: string;
    updated_at: string;
  }

  interface Student {
    id: number;
    name: string;
    email: string;
    phone: string;
    enrollments: Enrollment[];
  }

  const [student, setStudent] = useState<Student | null>(null);

  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

  // fetch student details from API; redirect to not-found if the item doesn't exist
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJson(`/students/${id}`);
        setStudent({ ...(data as any), enrollments: (data as any)?.enrollments ?? [] });
      } catch (err) {
        const e = err as { status?: number };
        if (e?.status === 404) {
          router.replace("/not-found");
          return;
        }
        console.error(err);
      }
    };
    if (id) load();
  }, [id, router]);

  const handleSave = async () => {
    if (!student) return;
    try {
      const updated = await fetchJson(`/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: student.name, email: student.email, phone: student.phone }),
      });
      setStudent(
        (prev) =>
          ({
            ...(prev ?? {}),
            ...(updated as any),
            enrollments: (updated as any)?.enrollments ?? prev?.enrollments ?? [],
          } as any)
      );
      toast.success("Student updated");
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Could not update student");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this student? This cannot be undone.")) return;
    try {
      await fetchJson(`/students/${id}`, { method: "DELETE" });
      router.push("/students");
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Could not delete student");
    }
  };

  const removeEnrollment = async (enrollId: number) => {
    try {
      await fetchJson(`/enrollments/${enrollId}`, { method: "DELETE" });
      // refetch student
      try {
        const updated = await fetchJson(`/students/${id}`);
        setStudent({ ...(updated as any), enrollments: (updated as any)?.enrollments ?? [] } as any);
      } catch (err: unknown) {
        console.error(err);
        toast.error((err as Error).message || "Could not refresh student after removing enrollment");
        throw err;
      }
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Could not remove enrollment");
    }
  };

  const handleAddEnrollment = async (courseIds: number[]) => {
    try {
      await fetchJson(`/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: id, course_ids: courseIds }),
      });
      // refetch student
      try {
        const updated = await fetchJson(`/students/${id}`);
        setStudent({ ...(updated as any), enrollments: (updated as any)?.enrollments ?? [] } as any);
      } catch (err: unknown) {
        console.error(err);
        toast.error((err as Error).message || "Could not refresh student after enrollment");
        throw err;
      }
      setIsEnrollmentModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Could not add enrollment");
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start gap-6">
            <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-6">
              {!student ? (
                <div className="py-12 text-center">Loading student...</div>
              ) : (
                <>
                  <h2 className="text-2xl text-gray-900 font-bold mb-4">{student.name}</h2>
                  <p className="text-sm text-gray-900">Email: {student.email}</p>
                  <p className="text-sm text-gray-900">Phone: {student.phone}</p>
                </>
              )}

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
                {!student ? null : (
                  <>
                    {student.enrollments.length === 0 && <p className="text-gray-900">No enrollments</p>}
                    <ul className="space-y-3">
                      {student.enrollments.map((en: Enrollment) => (
                        <li key={en.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                          <div>
                            <Link
                              href={`/courses/${en.course.id}`}
                              className="font-medium text-blue-600 hover:underline"
                            >
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
                  </>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-6">
              {!student ? (
                <div className="py-8">&nbsp;</div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>

        <Modal isOpen={isEnrollmentModalOpen} onClose={() => setIsEnrollmentModalOpen(false)} title="Add Enrollment">
          <EnrollmentForm studentId={student?.id ?? id} onSubmit={handleAddEnrollment} />
        </Modal>
      </div>
    </>
  );
}
