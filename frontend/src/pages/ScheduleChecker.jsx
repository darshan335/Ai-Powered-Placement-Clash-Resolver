import { useEffect, useState } from "react";
import api from "../api/api";

function ScheduleChecker() {
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    companyId: "",
    jobRole: "",
    driveDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    packageLpa: "",
  });

  const [selectedStudents, setSelectedStudents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [recommending, setRecommending] = useState(false);

  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [companiesResponse, studentsResponse] = await Promise.all([
        api.get("/companies"),
        api.get("/students"),
      ]);

      setCompanies(companiesResponse.data);
      setStudents(studentsResponse.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load companies and students.");
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

    setResult(null);
    setRecommendation(null);
    setError("");
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents((previous) => {
      if (previous.includes(studentId)) {
        return previous.filter((id) => id !== studentId);
      }

      return [...previous, studentId];
    });

    setResult(null);
    setRecommendation(null);
    setError("");
  };

  const selectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((student) => student.id));
    }

    setResult(null);
    setRecommendation(null);
    setError("");
  };

  const validateForm = () => {
    if (!form.companyId) {
      setError("Please select a company.");
      return false;
    }

    if (!form.jobRole.trim()) {
      setError("Please enter the job role.");
      return false;
    }

    if (!form.driveDate) {
      setError("Please select the drive date.");
      return false;
    }

    if (!form.startTime || !form.endTime) {
      setError("Please select start and end time.");
      return false;
    }

    if (form.startTime >= form.endTime) {
      setError("End time must be later than start time.");
      return false;
    }

    if (selectedStudents.length === 0) {
      setError("Please select at least one eligible student.");
      return false;
    }

    return true;
  };

  const buildRequest = () => {
    return {
      companyId: Number(form.companyId),
      jobRole: form.jobRole,
      driveDate: form.driveDate,
      startTime: form.startTime,
      endTime: form.endTime,
      venue: form.venue,
      packageLpa: form.packageLpa ? Number(form.packageLpa) : null,
      eligibleStudentIds: selectedStudents,
    };
  };

  const checkSchedule = async () => {
    setError("");
    setResult(null);
    setRecommendation(null);

    if (!validateForm()) {
      return;
    }

    setChecking(true);

    try {
      const response = await api.post("/clashes/check", buildRequest());

      setResult(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to check the proposed schedule.");
      }
    } finally {
      setChecking(false);
    }
  };

  const recommendSlots = async () => {
    setError("");
    setRecommendation(null);

    if (!validateForm()) {
      return;
    }

    setRecommending(true);

    try {
      const response = await api.post("/clashes/recommend", buildRequest());

      setRecommendation(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to generate slot recommendations.");
      }
    } finally {
      setRecommending(false);
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -right-32 top-16 h-96 w-96 animate-pulse rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute -left-32 top-1/3 h-96 w-96 animate-pulse rounded-full bg-violet-400/10 blur-3xl [animation-delay:1s]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 animate-pulse rounded-full bg-cyan-400/10 blur-3xl [animation-delay:2s]" />
      </div>

      <div className="relative z-10">
        <div className="mb-7 rounded-3xl border border-white/80 bg-white/90 p-7 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-xl font-black text-white shadow-lg shadow-indigo-200">
                ✓
              </div>
              <div>
                <div className="mb-1 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-700">
                  Schedule Intelligence
                </div>
                <h1 className="bg-gradient-to-r from-slate-950 via-indigo-800 to-violet-700 bg-clip-text text-3xl font-black tracking-tight text-transparent">
                  Schedule Checker
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Validate placement schedules, detect clashes, and find better
                  slots.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-center shadow-sm">
                <p className="text-lg font-black text-slate-900">
                  {companies.length}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Companies
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-center shadow-sm">
                <p className="text-lg font-black text-slate-900">
                  {students.length}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Students
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 font-black text-red-600">
                !
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-red-800">
                  Something needs attention
                </p>
                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError("")}
                className="text-xl text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div className="animate-pulse rounded-3xl bg-white p-7 shadow-xl">
              <div className="mb-6 h-7 w-56 rounded bg-slate-200" />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i}>
                    <div className="mb-2 h-3 w-20 rounded bg-slate-100" />
                    <div className="h-11 rounded-xl bg-slate-100" />
                  </div>
                ))}
              </div>
              <div className="mt-6 h-48 rounded-2xl bg-slate-100" />
            </div>
            <div className="h-[420px] animate-pulse rounded-3xl bg-white" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
              <div className="border-b border-slate-100 bg-gradient-to-r from-white via-indigo-50/30 to-violet-50/40 px-6 py-5">
                <h2 className="text-base font-black text-slate-900">
                  Proposed Placement Drive
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Enter the schedule you want to validate.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                <FormField label="Company">
                  <select
                    name="companyId"
                    value={form.companyId}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-indigo-200 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  >
                    <option value="">Select company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Job Role">
                  <input
                    type="text"
                    name="jobRole"
                    value={form.jobRole}
                    onChange={handleChange}
                    placeholder="e.g. Java Developer"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-indigo-200 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </FormField>

                <FormField label="Drive Date">
                  <input
                    type="date"
                    name="driveDate"
                    value={form.driveDate}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-indigo-200 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </FormField>

                <FormField label="Venue">
                  <input
                    type="text"
                    name="venue"
                    value={form.venue}
                    onChange={handleChange}
                    placeholder="e.g. Seminar Hall"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-indigo-200 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </FormField>

                <FormField label="Start Time">
                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-indigo-200 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </FormField>

                <FormField label="End Time">
                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-indigo-200 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </FormField>

                <FormField label="Package (LPA)">
                  <input
                    type="number"
                    name="packageLpa"
                    value={form.packageLpa}
                    onChange={handleChange}
                    placeholder="e.g. 7"
                    min="0"
                    step="0.1"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-indigo-200 hover:bg-white focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </FormField>

                <div className="flex items-end">
                  <div className="w-full rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">
                      Schedule Preview
                    </p>
                    <p className="mt-1 text-sm font-black text-indigo-950">
                      {form.startTime && form.endTime
                        ? `${formatTime(form.startTime)} - ${formatTime(form.endTime)}`
                        : "Select drive time"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      Eligible Students
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Select students who can participate.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={selectAllStudents}
                    className="w-fit rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-700 hover:bg-indigo-100"
                  >
                    {selectedStudents.length === students.length
                      ? "Clear All"
                      : "Select All"}
                  </button>
                </div>

                <div className="mb-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Students selected</span>
                    <span className="rounded-full bg-indigo-600 px-3 py-1 text-white">
                      {selectedStudents.length} / {students.length}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all"
                      style={{
                        width: students.length
                          ? `${(selectedStudents.length / students.length) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto rounded-2xl border border-slate-100">
                  {students.length === 0 ? (
                    <p className="p-8 text-center text-sm text-slate-500">
                      No students available.
                    </p>
                  ) : (
                    students.map((student) => {
                      const selected = selectedStudents.includes(student.id);
                      return (
                        <label
                          key={student.id}
                          className={`flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0 ${selected ? "bg-indigo-50" : "bg-white hover:bg-slate-50"}`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleStudent(student.id)}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${selected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}
                          >
                            {student.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {student.name}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {student.branch} · CGPA {student.cgpa}
                            </p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 bg-slate-50/60 p-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={checkSchedule}
                    disabled={checking || recommending}
                    className="rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {checking ? "Checking..." : "✓ Check Schedule"}
                  </button>
                  <button
                    type="button"
                    onClick={recommendSlots}
                    disabled={checking || recommending}
                    className="rounded-2xl border border-indigo-200 bg-white px-5 py-3.5 text-sm font-black text-indigo-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-indigo-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {recommending ? "Finding slots..." : "✦ Recommend Slots"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
                <div className="border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50/40 px-6 py-5">
                  <h2 className="text-base font-black text-slate-900">
                    Schedule Result
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Real-time conflict detection.
                  </p>
                </div>
                <div className="p-6">
                  {!result ? (
                    <EmptyResult />
                  ) : (
                    <ScheduleResult result={result} />
                  )}
                </div>
              </div>

              {recommendation && (
                <RecommendationResult recommendation={recommendation} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================= */
/* EMPTY RESULT */
/* ================================================= */

function EmptyResult() {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-500">
        ✓
      </div>
      <h3 className="mt-4 text-sm font-black text-slate-800">
        No schedule checked yet
      </h3>
      <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">
        Enter the proposed drive details and check the schedule to detect
        placement conflicts.
      </p>
    </div>
  );
}

/* ================================================= */
/* FORM FIELD */
/* ================================================= */

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
        {label}
      </label>

      {children}
    </div>
  );
}

/* ================================================= */
/* SCHEDULE RESULT */
/* ================================================= */

function ScheduleResult({ result }) {
  const hasConflict = !result.canSchedule;

  const conflicts = Array.isArray(result.conflicts) ? result.conflicts : [];

  return (
    <div className="space-y-5">
      {/* Status */}
      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          hasConflict
            ? "border-red-100 bg-gradient-to-br from-red-50 to-rose-50"
            : "border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black shadow-sm ${
              hasConflict
                ? "bg-gradient-to-br from-red-500 to-rose-600 text-white"
                : "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
            }`}
          >
            {hasConflict ? "!" : "✓"}
          </div>

          <div>
            <p
              className={`font-semibold ${
                hasConflict ? "text-red-800" : "text-green-800"
              }`}
            >
              {hasConflict
                ? "Schedule Conflict Detected"
                : "No Conflict Detected"}
            </p>

            <p
              className={`mt-1 text-sm leading-5 ${
                hasConflict ? "text-red-600" : "text-green-600"
              }`}
            >
              {result.message}
            </p>
          </div>
        </div>
      </div>

      {/* Conflict count */}
      {hasConflict && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Conflicting Drives</p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {conflicts.length}
          </p>
        </div>
      )}

      {/* Conflict details */}
      {conflicts.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Conflict Details
          </p>

          <div className="mt-3 space-y-4">
            {conflicts.map((conflict, index) => (
              <ConflictCard
                key={`${conflict.drive1Id}-${conflict.drive2Id}-${index}`}
                conflict={conflict}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* No conflict */}
      {!hasConflict && (
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 shadow-sm">
          <p className="text-sm font-semibold text-green-800">
            This placement drive can be scheduled.
          </p>

          <p className="mt-1 text-xs leading-5 text-green-600">
            No conflicting placement drives were found for the selected
            students.
          </p>
        </div>
      )}
    </div>
  );
}

/* ================================================= */
/* CONFLICT CARD */
/* ================================================= */

function ConflictCard({ conflict, index }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-orange-50/60 p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-red-500">
            Conflict #{index + 1}
          </p>

          <p className="mt-1 text-lg font-semibold text-slate-900">
            {conflict.company1}

            <span className="mx-2 text-slate-400">vs</span>

            {conflict.company2}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            conflict.severity === "HIGH"
              ? "bg-red-200 text-red-800"
              : conflict.severity === "MEDIUM"
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-700"
          }`}
        >
          {conflict.severity}
        </span>
      </div>

      {/* Date */}
      <div className="mt-4 rounded-lg bg-white p-4">
        <p className="text-xs text-slate-400">Drive Date</p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
          {formatDate(conflict.date)}
        </p>
      </div>

      {/* Time */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm transition hover:shadow-md">
          <p className="text-xs font-medium text-slate-400">
            {conflict.drive1Id === -1 ? "Proposed Drive" : "Drive 1"}
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {formatTime(conflict.startTime1)}
            {" - "}
            {formatTime(conflict.endTime1)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm transition hover:shadow-md">
          <p className="text-xs font-medium text-slate-400">
            {conflict.drive2Id === -1 ? "Proposed Drive" : "Drive 2"}
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {formatTime(conflict.startTime2)}
            {" - "}
            {formatTime(conflict.endTime2)}
          </p>
        </div>
      </div>

      {/* Affected students */}
      <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-sm">
        <span className="text-sm text-slate-500">Affected students</span>

        <span className="text-lg font-bold text-slate-900">
          {conflict.affectedStudentCount}
        </span>
      </div>
    </div>
  );
}

/* ================================================= */
/* RECOMMENDATION RESULT */
/* ================================================= */

function RecommendationResult({ recommendation }) {
  const recommendations = Array.isArray(recommendation.recommendations)
    ? recommendation.recommendations
    : [];

  return (
    <div className="overflow-hidden rounded-[26px] border border-indigo-100 bg-white shadow-xl shadow-indigo-100/40">
      {/* Header */}
      <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg text-white shadow-md">
            ✦
          </div>

          <div>
            <h2 className="font-semibold text-indigo-950">Recommended Slots</h2>

            <p className="mt-1 text-xs text-indigo-600">
              AI-assisted scheduling recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="p-6">
        {recommendation.message && (
          <div className="mb-5 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-4">
            <p className="text-sm leading-6 text-indigo-900">
              {recommendation.message}
            </p>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-center">
            <p className="text-sm font-medium text-slate-700">
              No alternative slots found.
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Try changing the proposed date or time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((slot, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm transition hover:border-indigo-100 hover:shadow-md"
              >
                {/* Slot heading */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      Recommended Slot {index + 1}
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {formatDate(slot.date)}
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                    Available
                  </span>
                </div>

                {/* Time */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm transition hover:shadow-md">
                    <p className="text-xs text-slate-400">Start Time</p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatTime(slot.startTime)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm transition hover:shadow-md">
                    <p className="text-xs text-slate-400">End Time</p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {formatTime(slot.endTime)}
                    </p>
                  </div>
                </div>

                {/* Affected students */}
                <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-4 py-3">
                  <span className="text-sm text-slate-500">
                    Affected Students
                  </span>

                  <span className="text-lg font-bold text-green-700">
                    {slot.affectedStudentCount}
                  </span>
                </div>

                {/* Reason */}
                {slot.reason && (
                  <div className="mt-3 rounded-lg bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Why this slot?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {slot.reason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================= */
/* HELPERS */
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

export default ScheduleChecker;
