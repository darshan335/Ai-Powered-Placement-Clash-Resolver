import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function EditStudent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    branch: "",
    cgpa: "",
    graduationYear: "",
    backlogs: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadStudent();
  }, [id]);

  const loadStudent = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/students/${id}`);

      const student = response.data;

      setForm({
        name: student.name || "",
        email: student.email || "",
        branch: student.branch || "",
        cgpa: student.cgpa ?? "",
        graduationYear: student.graduationYear ?? "",
        backlogs: student.backlogs ?? 0,
      });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Unable to load student.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

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

      await api.put(`/students/${id}`, student);

      setSuccess("Student updated successfully.");

      setTimeout(() => {
        navigate("/students");
      }, 800);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to update student.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

          <p className="text-sm text-slate-500">
            Loading student...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/students")}
          className="mb-4 text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          ← Back to Students
        </button>

        <div className="mb-2">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            Student Management
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Edit Student
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update student information and placement details.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-700">
            {success}
          </p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white"
      >
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-900">
            Student Information
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Update the student's academic and contact details.
          </p>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Student Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Rahul"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. rahul@gmail.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Branch
            </label>

            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Select branch</option>
              <option value="CSE">CSE</option>
              <option value="ISE">ISE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
              <option value="CIVIL">CIVIL</option>
              <option value="AIML">AIML</option>
              <option value="DS">DS</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* CGPA */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              CGPA
            </label>

            <input
              type="number"
              name="cgpa"
              value={form.cgpa}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.1"
              placeholder="e.g. 8.5"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Graduation Year
            </label>

            <input
              type="number"
              name="graduationYear"
              value={form.graduationYear}
              onChange={handleChange}
              min="2000"
              max="2100"
              placeholder="e.g. 2026"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Backlogs */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Backlogs
            </label>

            <input
              type="number"
              name="backlogs"
              value={form.backlogs}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder="e.g. 0"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/students")}
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditStudent;