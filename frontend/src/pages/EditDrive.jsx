import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function EditDrive() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);

  const [form, setForm] = useState({
    companyId: "",
    jobRole: "",
    driveDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    packageLpa: "",
    minimumCgpa: "",
    maximumBacklogs: "",
    status: "SCHEDULED",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [driveResponse, companiesResponse] = await Promise.all([
        api.get(`/drives/${id}`),
        api.get("/companies"),
      ]);

      const drive = driveResponse.data;

      setCompanies(companiesResponse.data);

      setForm({
        companyId: drive.company?.id ? String(drive.company.id) : "",

        jobRole: drive.jobRole || "",

        driveDate: drive.driveDate || "",

        startTime: drive.startTime || "",

        endTime: drive.endTime || "",

        venue: drive.venue || "",

        packageLpa:
          drive.packageLpa !== null && drive.packageLpa !== undefined
            ? String(drive.packageLpa)
            : "",

        minimumCgpa:
          drive.minimumCgpa !== null && drive.minimumCgpa !== undefined
            ? String(drive.minimumCgpa)
            : "",

        maximumBacklogs:
          drive.maximumBacklogs !== null && drive.maximumBacklogs !== undefined
            ? String(drive.maximumBacklogs)
            : "",

        status: drive.status || "SCHEDULED",
      });
    } catch (error) {
      console.error(error);

      setError("Unable to load placement drive.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    if (!form.companyId) {
      return "Please select a company.";
    }

    if (!form.jobRole.trim()) {
      return "Please enter the job role.";
    }

    if (!form.driveDate) {
      return "Please select the drive date.";
    }

    if (!form.startTime || !form.endTime) {
      return "Please select start and end time.";
    }

    if (form.startTime >= form.endTime) {
      return "End time must be later than start time.";
    }

    if (form.packageLpa) {
      const value = Number(form.packageLpa);

      if (value < 0) {
        return "Package cannot be negative.";
      }
    }

    if (form.minimumCgpa) {
      const value = Number(form.minimumCgpa);

      if (value < 0 || value > 10) {
        return "Minimum CGPA must be between 0 and 10.";
      }
    }

    if (form.maximumBacklogs) {
      const value = Number(form.maximumBacklogs);

      if (value < 0 || !Number.isInteger(value)) {
        return "Maximum backlogs must be a whole number.";
      }
    }

    return "";
  };

  // =====================================================
  // UPDATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      return;
    }

    setSaving(true);

    try {
      const updatedDrive = {
        company: {
          id: Number(form.companyId),
        },

        jobRole: form.jobRole.trim(),

        driveDate: form.driveDate,

        startTime: form.startTime,

        endTime: form.endTime,

        venue: form.venue.trim(),

        packageLpa: form.packageLpa ? Number(form.packageLpa) : null,

        minimumCgpa: form.minimumCgpa ? Number(form.minimumCgpa) : null,

        maximumBacklogs: form.maximumBacklogs
          ? Number(form.maximumBacklogs)
          : null,

        status: form.status,
      };

      await api.put(`/drives/${id}`, updatedDrive);

      setSuccess("Placement drive updated successfully.");

      setTimeout(() => {
        navigate("/drives");
      }, 800);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to update placement drive.");
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">Loading placement drive...</p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="mx-auto max-w-5xl">
      {/* HEADER */}

      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/drives")}
          className="mb-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Placement Drives
        </button>

        <h1 className="text-2xl font-bold text-slate-900">
          Edit Placement Drive
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update the placement drive details and eligibility criteria.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-700">{success}</p>
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white"
      >
        {/* DRIVE INFORMATION */}

        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-900">Drive Information</h2>

          <p className="mt-1 text-xs text-slate-500">
            Update the basic placement drive details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          {/* COMPANY */}

          <Field label="Company">
            <select
              name="companyId"
              value={form.companyId}
              onChange={handleChange}
              className="input-style"
            >
              <option value="">Select company</option>

              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </Field>

          {/* JOB ROLE */}

          <Field label="Job Role">
            <input
              type="text"
              name="jobRole"
              value={form.jobRole}
              onChange={handleChange}
              className="input-style"
            />
          </Field>

          {/* DATE */}

          <Field label="Drive Date">
            <input
              type="date"
              name="driveDate"
              value={form.driveDate}
              onChange={handleChange}
              className="input-style"
            />
          </Field>

          {/* VENUE */}

          <Field label="Venue">
            <input
              type="text"
              name="venue"
              value={form.venue}
              onChange={handleChange}
              className="input-style"
            />
          </Field>

          {/* START */}

          <Field label="Start Time">
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="input-style"
            />
          </Field>

          {/* END */}

          <Field label="End Time">
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="input-style"
            />
          </Field>

          {/* PACKAGE */}

          <Field label="Package (LPA)">
            <input
              type="number"
              name="packageLpa"
              value={form.packageLpa}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="input-style"
            />
          </Field>

          {/* STATUS */}

          <Field label="Status">
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input-style"
            >
              <option value="SCHEDULED">Scheduled</option>

              <option value="COMPLETED">Completed</option>

              <option value="CANCELLED">Cancelled</option>
            </select>
          </Field>
        </div>

        {/* ELIGIBILITY */}

        <div className="border-t border-slate-200 bg-slate-50 px-6 py-6">
          <h2 className="font-semibold text-slate-900">Eligibility Criteria</h2>

          <p className="mt-1 text-xs text-slate-500">
            Optional. Leave empty when the company has no restriction.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* CGPA */}

            <Field label="Minimum CGPA">
              <input
                type="number"
                name="minimumCgpa"
                value={form.minimumCgpa}
                onChange={handleChange}
                placeholder="e.g. 7.0"
                min="0"
                max="10"
                step="0.1"
                className="input-style bg-white"
              />
            </Field>

            {/* BACKLOG */}

            <Field label="Maximum Backlogs">
              <input
                type="number"
                name="maximumBacklogs"
                value={form.maximumBacklogs}
                onChange={handleChange}
                placeholder="e.g. 0"
                min="0"
                step="1"
                className="input-style bg-white"
              />
            </Field>
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/drives")}
            className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================================================= */
/* FIELD */
/* ================================================= */

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}

export default EditDrive;
