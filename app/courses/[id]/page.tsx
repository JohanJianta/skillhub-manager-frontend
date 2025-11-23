"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navigation from "@/app/components/Navigation";
import Link from "next/link";
import { fetchJson } from "@/lib/api";
import toast from "react-hot-toast";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id ?? 0);

  interface CourseEnrollment {
    id: number;
    student: { id: number; name: string };
    status: string;
    updated_at: string;
  }

  interface Instructor {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  }

  interface Course {
    id: number;
    name: string;
    description: string;
    instructor?: Instructor | null;
    schedule?: string;
    enrollments: CourseEnrollment[];
  }

  const [course, setCourse] = useState<Course | null>(null);

  // fetch course details from API; redirect to not-found if the item doesn't exist
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchJson(`/courses/${id}`);
        setCourse({
          ...(data as any),
          enrollments: (data as any)?.enrollments ?? [],
          instructor: (data as any)?.instructor ?? null,
        });
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
    if (!course) return;
    try {
      const updated = await fetchJson(`/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: course.name,
          description: course.description,
          instructor_id: course.instructor?.id ?? null,
          schedule: course.schedule,
        }),
      });
      setCourse(
        (prev) =>
          ({
            ...(prev ?? {}),
            ...(updated as any),
            enrollments: (updated as any)?.enrollments ?? prev?.enrollments ?? [],
            instructor: (updated as any)?.instructor ?? prev?.instructor ?? null,
          } as any)
      );
      toast.success("Course updated");
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Could not update course");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    try {
      await fetchJson(`/courses/${id}`, { method: "DELETE" });
      router.push("/courses");
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Could not delete course");
    }
  };

  const removeEnrollment = async (enrollId: number) => {
    try {
      await fetchJson(`/enrollments/${enrollId}`, { method: "DELETE" });
      try {
        const updated = await fetchJson(`/courses/${id}`);
        setCourse({
          ...(updated as any),
          enrollments: (updated as any)?.enrollments ?? [],
          instructor: (updated as any)?.instructor ?? null,
        } as any);
      } catch (err) {
        console.error(err);
        toast.error((err as Error).message || "Could not refresh student after removing enrollment");
        throw err;
      }
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Could not remove enrollment");
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start gap-6">
            <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-6">
              {!course ? (
                <div className="py-12 text-center">Loading course...</div>
              ) : (
                <>
                  <h2 className="text-2xl text-gray-900 font-bold mb-2">{course.name}</h2>
                  <p className="text-sm text-gray-900 mb-4">{course.description}</p>
                  <p className="text-sm text-gray-900">
                    Schedule: {course.schedule ? new Date(course.schedule).toLocaleString() : ""}
                  </p>
                </>
              )}
              {!course ? null : (
                <div className="mt-4">
                  <h3 className="text-lg text-gray-900 font-semibold mb-2 ">Instructor</h3>
                  <p className="text-sm text-gray-900">Name: {course.instructor?.name}</p>
                  <p className="text-sm text-gray-900">Email: {course.instructor?.email}</p>
                  <p className="text-sm text-gray-900">Phone: {course.instructor?.phone}</p>
                </div>
              )}

              <div className="mt-6">
                <h3 className="text-lg text-gray-900 font-semibold mb-2">Enrollments</h3>
                {!course ? null : (
                  <>
                    {course.enrollments.length === 0 && <p className="text-gray-900">No enrollments</p>}
                    <ul className="space-y-3">
                      {course.enrollments.map((en: CourseEnrollment) => (
                        <li key={en.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                          <div>
                            <Link
                              href={`/students/${en.student.id}`}
                              className="font-medium text-blue-600 hover:underline"
                            >
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
                  </>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-6">
              {!course ? (
                <div className="py-8">&nbsp;</div>
              ) : (
                <>
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
                      setCourse({
                        ...course,
                        instructor: { ...(course.instructor ?? { id: 0, name: "" }), id: Number(e.target.value) },
                      })
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
