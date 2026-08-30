import { useEffect, useState } from "react";
import api from "../api/api";

const EMPTY_FORM = {
  name: "",
  email: "",
  branch: "",
  cgpa: "",
  graduationYear: "",
  backlogs: "0",
};

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  // ADD / EDIT mode
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    loadStudents();
  }, []);

  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/students");

      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      setStudents(data);
    } catch (error) {
      console.error(error);

      setStudents([]);
      setError("Unable to load students.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const editStudent = async (id) => {
    try {
      setError("");
      setSuccess("");

      const response = await api.get(`/students/${id}`);

      const student = response.data;

      setEditingId(id);

      setForm({
        name: student.name || "",
        email: student.email || "",
        branch: student.branch || "",
        cgpa: student.cgpa ?? "",
        graduationYear: student.graduationYear ?? "",
        backlogs: student.backlogs ?? 0,
      });

      setShowForm(true);

      // Scroll to form
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to load student details.");
      }
    }
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  // =====================================================
  // ADD / UPDATE STUDENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (!form.name.trim()) {
      setError("Please enter the student name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter the student email.");
      return;
    }

    if (!form.branch.trim()) {
      setError("Please enter the branch.");
      return;
    }

    if (form.cgpa === "") {
      setError("Please enter the CGPA.");
      return;
    }

    if (Number(form.cgpa) < 0 || Number(form.cgpa) > 10) {
      setError("CGPA must be between 0 and 10.");
      return;
    }

    if (form.graduationYear === "") {
      setError("Please enter the graduation year.");
      return;
    }

    if (form.backlogs === "") {
      setError("Please enter the number of backlogs.");
      return;
    }

    if (Number(form.backlogs) < 0) {
      setError("Backlogs cannot be negative.");
      return;
    }

    setSaving(true);

    try {
      const student = {
        name: form.name.trim(),
        email: form.email.trim(),
        branch: form.branch.trim(),
        cgpa: Number(form.cgpa),
        graduationYear: Number(form.graduationYear),
        backlogs: Number(form.backlogs),
      };

      // =================================================
      // EDIT
      // =================================================

      if (editingId !== null) {
        const response = await api.put(`/students/${editingId}`, student);

        setStudents((previous) =>
          previous.map((existingStudent) =>
            existingStudent.id === editingId ? response.data : existingStudent,
          ),
        );

        setSuccess("Student updated successfully.");
      }

      // =================================================
      // ADD
      // =================================================
      else {
        const response = await api.post("/students", student);

        setStudents((previous) => [...previous, response.data]);

        setSuccess("Student added successfully.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (editingId !== null) {
        setError("Unable to update student.");
      } else {
        setError("Unable to add student. Please check the backend.");
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const deleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/students/${id}`);

      setStudents((previous) =>
        previous.filter((student) => student.id !== id),
      );

      setSuccess("Student deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to delete student.");
      }
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase().trim();

    return (
      student.name?.toLowerCase().includes(searchText) ||
      student.email?.toLowerCase().includes(searchText) ||
      student.branch?.toLowerCase().includes(searchText)
    );
  });

  // =====================================================
  // PAGE
  // =====================================================

  const totalStudents = students.length;
  const eligibleStudents = students.filter(
    (student) => Number(student.backlogs || 0) === 0,
  ).length;
  const studentsWithBacklogs = totalStudents - eligibleStudents;

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Premium background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-20 h-80 w-80 animate-pulse rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 animate-pulse rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 animate-pulse rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* ================================================= */}
        {/* PREMIUM HEADER */}
        {/* ================================================= */}

        <div className="mb-7 overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-6 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-2xl font-black text-white shadow-lg shadow-indigo-200">
                ♙
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-white" />
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-indigo-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Student Management
                </div>

                <h1 className="bg-gradient-to-r from-slate-950 via-indigo-800 to-violet-700 bg-clip-text text-3xl font-black tracking-tight text-transparent">
                  Students
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage student profiles, academic details, and placement
                  eligibility.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 text-center shadow-sm">
                <p className="text-xl font-black text-slate-900">
                  {totalStudents}
                </p>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Total
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-center shadow-sm">
                <p className="text-xl font-black text-emerald-700">
                  {eligibleStudents}
                </p>
                <p className="text-[9px] font-black uppercase tracking-wider text-emerald-500">
                  Eligible
                </p>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-orange-50/80 px-4 py-3 text-center shadow-sm">
                <p className="text-xl font-black text-orange-700">
                  {studentsWithBacklogs}
                </p>
                <p className="text-[9px] font-black uppercase tracking-wider text-orange-500">
                  Review
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* ALERTS */}
        {/* ================================================= */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 font-black text-red-600">
                !
              </div>
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 font-black text-emerald-600">
                ✓
              </div>
              <p className="text-sm font-semibold text-emerald-700">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* TOOLBAR */}
        {/* ================================================= */}

        <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/80 bg-white/80 p-4 shadow-lg shadow-slate-200/40 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search name, email, or branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <button
            type="button"
            onClick={showForm ? closeForm : openAddForm}
            className={`rounded-2xl px-5 py-3 text-sm font-black shadow-lg transition duration-300 hover:-translate-y-0.5 ${
              showForm
                ? "border border-slate-200 bg-white text-slate-700 shadow-slate-100 hover:bg-slate-50"
                : "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-indigo-200"
            }`}
          >
            {showForm ? "Cancel Form" : "+ Add Student"}
          </button>
        </div>

        {/* ================================================= */}
        {/* ADD / EDIT FORM */}
        {/* ================================================= */}

        {showForm && (
          <div className="mb-6 overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-xl shadow-indigo-100/30 backdrop-blur-xl">
            <div className="border-b border-slate-100 bg-gradient-to-r from-white via-indigo-50/40 to-violet-50/40 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
                  {editingId !== null ? "✎" : "+"}
                </div>
                <div>
                  <h2 className="font-black text-slate-900">
                    {editingId !== null ? "Edit Student" : "Add New Student"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {editingId !== null
                      ? "Update the student's placement information."
                      : "Enter the student's placement information."}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                {[
                  ["name", "Student Name", "text", "e.g. Darshan Kumar"],
                  ["email", "Email", "email", "e.g. darshan@gmail.com"],
                  ["cgpa", "CGPA", "number", "e.g. 8.5"],
                  ["graduationYear", "Graduation Year", "number", "e.g. 2026"],
                  ["backlogs", "Backlogs", "number", "e.g. 0"],
                ].map(([name, label, type, placeholder]) => (
                  <div key={name}>
                    <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                      {label}
                    </label>

                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      min={
                        name === "cgpa"
                          ? "0"
                          : name === "graduationYear"
                            ? "2000"
                            : name === "backlogs"
                              ? "0"
                              : undefined
                      }
                      max={
                        name === "cgpa"
                          ? "10"
                          : name === "graduationYear"
                            ? "2100"
                            : undefined
                      }
                      step={name === "cgpa" ? "0.01" : undefined}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                    Branch
                  </label>

                  <select
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="">Select branch</option>
                    <option value="CSE">Computer Science & Engineering</option>
                    <option value="ISE">
                      Information Science & Engineering
                    </option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="EEE">Electrical & Electronics</option>
                    <option value="ME">Mechanical Engineering</option>
                    <option value="CIVIL">Civil Engineering</option>
                    <option value="AIML">Artificial Intelligence & ML</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? editingId !== null
                      ? "Saving..."
                      : "Adding..."
                    : editingId !== null
                      ? "Save Changes"
                      : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================================================= */}
        {/* STUDENT TABLE */}
        {/* ================================================= */}

        {loading ? (
          <div className="rounded-3xl border border-white/80 bg-white/90 p-12 text-center shadow-xl backdrop-blur-xl">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />
            <p className="text-sm font-semibold text-slate-500">
              Loading students...
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
            <div className="flex flex-col gap-2 border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50/30 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-black text-slate-900">
                    Registered Students
                  </h2>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
                    {students.length}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {filteredStudents.length} student(s) found
                </p>
              </div>

              {search && (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-500">
                  Searching: "{search}"
                </span>
              )}
            </div>

            {filteredStudents.length === 0 ? (
              <div className="p-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-2xl text-indigo-600">
                  ♙
                </div>
                <h3 className="mt-5 font-black text-slate-900">
                  No students found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add a student or change your search.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px]">
                  <thead className="bg-slate-50/80">
                    <tr className="border-b border-slate-200">
                      {[
                        "Student",
                        "Branch",
                        "CGPA",
                        "Graduation",
                        "Backlogs",
                        "Status",
                        "Action",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-500"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => {
                      const backlogs = Number(student.backlogs || 0);
                      const cgpa = Number(student.cgpa || 0);
                      const cgpaPercent = Math.min(100, Math.max(0, cgpa * 10));

                      return (
                        <tr
                          key={student.id}
                          className="group transition duration-200 hover:bg-indigo-50/40"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-black text-indigo-700 shadow-sm transition group-hover:scale-105">
                                {student.name?.charAt(0).toUpperCase() || "S"}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-black text-slate-900">
                                  {student.name}
                                </p>
                                <p className="max-w-[250px] truncate text-xs text-slate-500">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-700">
                              {student.branch}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="w-24">
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-sm font-black text-slate-900">
                                  {student.cgpa}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400">
                                  / 10
                                </span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                  style={{ width: `${cgpaPercent}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                            {student.graduationYear}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full border px-3 py-1.5 text-xs font-black ${
                                backlogs === 0
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-red-200 bg-red-50 text-red-700"
                              }`}
                            >
                              {backlogs}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${
                                backlogs === 0
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-orange-200 bg-orange-50 text-orange-700"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  backlogs === 0
                                    ? "bg-emerald-500"
                                    : "bg-orange-500"
                                }`}
                              />
                              {backlogs === 0
                                ? "Eligible"
                                : "Check Eligibility"}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => editStudent(student.id)}
                                className="rounded-xl border border-indigo-200 bg-white px-3.5 py-2 text-xs font-black text-indigo-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-md"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteStudent(student.id)}
                                className="rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-black text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Students;
