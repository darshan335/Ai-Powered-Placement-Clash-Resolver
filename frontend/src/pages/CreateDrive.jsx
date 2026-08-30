import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function CreateDrive() {
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
  });

  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================================================= */
  /* LOAD COMPANIES */
  /* ================================================= */

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await api.get("/companies");

      setCompanies(response.data);
    } catch (error) {
      console.error(error);

      setError("Unable to load companies.");
    } finally {
      setLoadingCompanies(false);
    }
  };

  /* ================================================= */
  /* FORM CHANGE */
  /* ================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* ================================================= */
  /* VALIDATION */
  /* ================================================= */

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

    if (!form.startTime) {
      return "Please select the start time.";
    }

    if (!form.endTime) {
      return "Please select the end time.";
    }

    if (form.startTime >= form.endTime) {
      return "End time must be later than start time.";
    }

    if (form.packageLpa) {
      const packageValue = Number(form.packageLpa);

      if (packageValue < 0) {
        return "Package cannot be negative.";
      }
    }

    /* ================================================ */
    /* OPTIONAL CGPA CRITERIA */
    /* ================================================ */

    if (form.minimumCgpa) {
      const cgpa = Number(form.minimumCgpa);

      if (cgpa < 0 || cgpa > 10) {
        return "Minimum CGPA must be between 0 and 10.";
      }
    }

    /* ================================================ */
    /* OPTIONAL BACKLOG CRITERIA */
    /* ================================================ */

    if (form.maximumBacklogs) {
      const backlogs = Number(form.maximumBacklogs);

      if (backlogs < 0 || !Number.isInteger(backlogs)) {
        return "Maximum backlogs must be a non-negative whole number.";
      }
    }

    return "";
  };

  /* ================================================= */
  /* SUBMIT */
  /* ================================================= */

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
      const drive = {
        company: {
          id: Number(form.companyId),
        },

        jobRole: form.jobRole.trim(),

        driveDate: form.driveDate,

        startTime: form.startTime,

        endTime: form.endTime,

        venue: form.venue.trim(),

        packageLpa: form.packageLpa ? Number(form.packageLpa) : null,

        /*
         * Optional eligibility criteria.
         *
         * null means the company has not specified
         * that particular eligibility requirement.
         */

        minimumCgpa: form.minimumCgpa ? Number(form.minimumCgpa) : null,

        maximumBacklogs: form.maximumBacklogs
          ? Number(form.maximumBacklogs)
          : null,

        status: "SCHEDULED",
      };

      console.log("Creating drive:", drive);

      await api.post("/drives", drive);

      setSuccess("Placement drive created successfully.");

      setTimeout(() => {
        navigate("/drives");
      }, 1000);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to create placement drive.");
      }
    } finally {
      setSaving(false);
    }
  };

  /* ================================================= */
  /* RENDER */
  /* ================================================= */

  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 animate-pulse rounded-full bg-indigo-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 animate-pulse rounded-full bg-violet-400/10 blur-3xl [animation-delay:1s]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 animate-pulse rounded-full bg-cyan-400/10 blur-3xl [animation-delay:2s]" />
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-8 rounded-3xl border border-white/80 bg-white/75 p-6 shadow-xl shadow-indigo-100/30 backdrop-blur-xl sm:p-7">
        <button
          type="button"
          onClick={() => navigate("/drives")}
          className="mb-4 text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          ← Back to Placement Drives
        </button>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2">
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                New Placement Drive
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create Placement Drive
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Schedule a new company placement drive.
            </p>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold text-red-700">
              !
            </div>

            <div>
              <p className="text-sm font-semibold text-red-800">
                Unable to create drive
              </p>

              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* SUCCESS */}
      {/* ================================================= */}

      {success && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
              ✓
            </div>

            <div>
              <p className="text-sm font-semibold text-green-800">
                Drive Created
              </p>

              <p className="mt-1 text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* FORM */}
      {/* ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-3xl border border-white/90 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-xl"
      >
        {/* ================================================= */}
        {/* SECTION HEADER */}
        {/* ================================================= */}

        <div className="border-b border-slate-100 bg-gradient-to-r from-white via-indigo-50/30 to-violet-50/30 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              ▣
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Drive Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Enter the details of the placement drive.
              </p>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* FORM FIELDS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          {/* Company */}
          <FormField label="Company" required>
            <select
              name="companyId"
              value={form.companyId}
              onChange={handleChange}
              disabled={loadingCompanies}
              className="input-style rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition hover:border-indigo-200 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">
                {loadingCompanies
                  ? "Loading companies..."
                  : companies.length === 0
                    ? "No companies available"
                    : "Select company"}
              </option>

              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </FormField>

          {/* Job Role */}
          <FormField label="Job Role" required>
            <input
              type="text"
              name="jobRole"
              value={form.jobRole}
              onChange={handleChange}
              placeholder="e.g. Java Developer"
              className="input-style rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition hover:border-indigo-200 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </FormField>

          {/* Date */}
          <FormField label="Drive Date" required>
            <input
              type="date"
              name="driveDate"
              value={form.driveDate}
              onChange={handleChange}
              className="input-style rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition hover:border-indigo-200 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </FormField>

          {/* Venue */}
          <FormField label="Venue">
            <input
              type="text"
              name="venue"
              value={form.venue}
              onChange={handleChange}
              placeholder="e.g. Seminar Hall"
              className="input-style rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition hover:border-indigo-200 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </FormField>

          {/* Start Time */}
          <FormField label="Start Time" required>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="input-style rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition hover:border-indigo-200 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </FormField>

          {/* End Time */}
          <FormField label="End Time" required>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="input-style rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition hover:border-indigo-200 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </FormField>

          {/* Package */}
          <FormField label="Package (LPA)">
            <div className="relative">
              <input
                type="number"
                name="packageLpa"
                value={form.packageLpa}
                onChange={handleChange}
                placeholder="e.g. 6"
                min="0"
                step="0.1"
                className="input-style pr-14"
              />

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                LPA
              </span>
            </div>
          </FormField>

          {/* Status */}
          <FormField label="Status">
            <div className="flex h-[50px] items-center rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 shadow-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />

              <span className="text-sm font-medium text-slate-700">
                Scheduled
              </span>
            </div>
          </FormField>
        </div>

        {/* ================================================= */}
        {/* ELIGIBILITY SECTION */}
        {/* ================================================= */}

        <div className="border-t border-slate-100 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 px-6 py-6">
          <div className="mb-5">
            <h2 className="font-semibold text-slate-900">
              Eligibility Criteria
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              These criteria are optional. Leave a field empty if the company
              has no requirement for it.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Minimum CGPA */}
            <FormField label="Minimum CGPA">
              <input
                type="number"
                name="minimumCgpa"
                value={form.minimumCgpa}
                onChange={handleChange}
                placeholder="e.g. 7.0"
                min="0"
                max="10"
                step="0.1"
                className="input-style rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Leave empty if there is no CGPA requirement.
              </p>
            </FormField>

            {/* Maximum Backlogs */}
            <FormField label="Maximum Backlogs">
              <input
                type="number"
                name="maximumBacklogs"
                value={form.maximumBacklogs}
                onChange={handleChange}
                placeholder="e.g. 0"
                min="0"
                step="1"
                className="input-style rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition hover:border-indigo-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Leave empty if there is no backlog requirement.
              </p>
            </FormField>
          </div>

          {/* Information */}
          <div className="mt-5 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-indigo-600">ℹ</div>

              <div>
                <p className="text-sm font-semibold text-indigo-900">
                  How eligibility works
                </p>

                <p className="mt-1 text-xs leading-5 text-indigo-700">
                  If no eligibility criteria are specified, all registered
                  students are considered eligible for this drive.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* SCHEDULE PREVIEW */}
        {/* ================================================= */}

        {(form.driveDate ||
          form.startTime ||
          form.endTime ||
          form.companyId) && (
          <div className="mx-6 my-6 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-violet-50/80 to-fuchsia-50/50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Schedule Preview
            </p>

            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <PreviewItem
                label="Company"
                value={
                  companies.find(
                    (company) => String(company.id) === String(form.companyId),
                  )?.name || "-"
                }
              />

              <PreviewItem
                label="Date"
                value={form.driveDate ? formatDate(form.driveDate) : "-"}
              />

              <PreviewItem
                label="Time"
                value={
                  form.startTime && form.endTime
                    ? `${formatTime(form.startTime)} - ${formatTime(
                        form.endTime,
                      )}`
                    : "-"
                }
              />
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-white/80 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/drives")}
            disabled={saving}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-md disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || loadingCompanies}
            className="rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-7 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Creating Drive..." : "Create Drive"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================================================= */
/* FORM FIELD */
/* ================================================= */

function FormField({ label, required = false, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
}

/* ================================================= */
/* PREVIEW ITEM */
/* ================================================= */

function PreviewItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-indigo-500">{label}</p>

      <p className="mt-1 text-sm font-semibold text-indigo-950">{value}</p>
    </div>
  );
}

/* ================================================= */
/* DATE FORMAT */
/* ================================================= */

function formatDate(date) {
  if (!date) {
    return "-";
  }

  const parts = date.split("-");

  if (parts.length !== 3) {
    return date;
  }

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

/* ================================================= */
/* TIME FORMAT */
/* ================================================= */

function formatTime(time) {
  if (!time) {
    return "-";
  }

  const parts = time.split(":");

  const hour = Number(parts[0]);
  const minute = parts[1] || "00";

  const suffix = hour >= 12 ? "PM" : "AM";

  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minute} ${suffix}`;
}

export default CreateDrive;
