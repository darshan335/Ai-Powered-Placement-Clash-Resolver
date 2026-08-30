import { useEffect, useMemo, useState } from "react";
import api from "../api/api";

function Conflicts() {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadConflicts();
  }, []);

  const loadConflicts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/clashes");

      const data = Array.isArray(response.data) ? response.data : [];

      setConflicts(data);
    } catch (error) {
      console.error("Conflict API error:", error);
      setError("Unable to load scheduling conflicts.");
    } finally {
      setLoading(false);
    }
  };

  const filteredConflicts = useMemo(() => {
    return conflicts.filter((conflict) => {
      const matchesSeverity =
        severityFilter === "ALL" || conflict.severity === severityFilter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        !searchText ||
        conflict.company1?.toLowerCase().includes(searchText) ||
        conflict.company2?.toLowerCase().includes(searchText) ||
        conflict.severity?.toLowerCase().includes(searchText);

      return matchesSeverity && matchesSearch;
    });
  }, [conflicts, severityFilter, search]);

  const criticalCount = conflicts.filter(
    (c) => c.severity === "CRITICAL",
  ).length;

  const highCount = conflicts.filter((c) => c.severity === "HIGH").length;

  const mediumCount = conflicts.filter((c) => c.severity === "MEDIUM").length;

  const lowCount = conflicts.filter((c) => c.severity === "LOW").length;

  const totalAffectedStudents = conflicts.reduce(
    (total, conflict) => total + Number(conflict.affectedStudentCount || 0),
    0,
  );

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* ================================================= */}
      {/* ANIMATED BACKGROUND */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl animate-pulse" />

        <div className="absolute -left-40 top-1/3 h-96 w-96 animate-pulse rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 animate-pulse rounded-full bg-cyan-400/10 blur-3xl [animation-delay:1.5s]" />
      </div>

      <div className="relative z-10">
        {/* ================================================= */}
        {/* PREMIUM HEADER */}
        {/* ================================================= */}

        <div className="mb-8 overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-7 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-lg opacity-30" />

                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-2xl text-white shadow-lg shadow-indigo-300/40">
                  ⚡
                </div>
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-600">
                    {conflicts.length} Active
                  </span>

                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                    Live Monitoring
                  </span>
                </div>

                <h1 className="bg-gradient-to-r from-slate-950 via-indigo-800 to-violet-700 bg-clip-text text-3xl font-black tracking-tight text-transparent">
                  Scheduling Conflicts
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Detect placement drive clashes, identify affected students,
                  and resolve scheduling conflicts efficiently.
                </p>
              </div>
            </div>

            <a
              href="/schedule-checker"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-indigo-300/40 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-400/40"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>＋</span>
                Check New Schedule
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>

              <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
            </a>
          </div>
        </div>

        {/* ================================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================================= */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <PremiumStatCard
            title="Critical"
            count={criticalCount}
            icon="!"
            gradient="from-red-500 to-rose-600"
            glow="shadow-red-200"
          />

          <PremiumStatCard
            title="High"
            count={highCount}
            icon="↑"
            gradient="from-orange-500 to-amber-600"
            glow="shadow-orange-200"
          />

          <PremiumStatCard
            title="Medium"
            count={mediumCount}
            icon="!"
            gradient="from-yellow-400 to-orange-500"
            glow="shadow-yellow-200"
          />

          <PremiumStatCard
            title="Low"
            count={lowCount}
            icon="•"
            gradient="from-slate-500 to-slate-700"
            glow="shadow-slate-200"
          />

          <PremiumStatCard
            title="Affected Students"
            count={totalAffectedStudents}
            icon="♙"
            gradient="from-indigo-500 to-violet-600"
            glow="shadow-indigo-200"
          />
        </div>

        {/* ================================================= */}
        {/* MAIN CONTAINER */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
          {/* ================================================= */}
          {/* TOOLBAR */}
          {/* ================================================= */}

          <div className="border-b border-slate-100 p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
                    ⚠
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Detected Conflicts
                    </h2>

                    <p className="text-xs text-slate-500">
                      Review clashes and their impact on students.
                    </p>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                    {filteredConflicts.length}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* SEARCH */}

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    ⌕
                  </span>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search company..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:w-56"
                  />
                </div>

                {/* FILTER */}

                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="ALL">All severities</option>

                  <option value="CRITICAL">Critical</option>

                  <option value="HIGH">High</option>

                  <option value="MEDIUM">Medium</option>

                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* LOADING */}
          {/* ================================================= */}

          {loading && (
            <div className="p-16 text-center">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-indigo-100" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                </div>
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-700">
                Loading conflicts...
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Checking placement schedules
              </p>
            </div>
          )}

          {/* ================================================= */}
          {/* ERROR */}
          {/* ================================================= */}

          {error && (
            <div className="m-6 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 font-bold text-red-600">
                  !
                </div>

                <div>
                  <p className="font-bold text-red-800">
                    Unable to load conflicts
                  </p>

                  <p className="mt-1 text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* EMPTY */}
          {/* ================================================= */}

          {!loading && !error && filteredConflicts.length === 0 && (
            <div className="p-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-green-100 text-3xl text-green-600 shadow-inner">
                ✓
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                No conflicts found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Great! There are no scheduling conflicts matching your current
                filter.
              </p>
            </div>
          )}

          {/* ================================================= */}
          {/* CONFLICT LIST */}
          {/* ================================================= */}

          {!loading && !error && filteredConflicts.length > 0 && (
            <div className="space-y-5 p-5 md:p-6">
              {filteredConflicts.map((conflict, index) => (
                <ConflictCard
                  key={`${conflict.drive1Id}-${conflict.drive2Id}-${index}`}
                  conflict={conflict}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* PREMIUM STAT CARD */
/* ================================================= */

function PremiumStatCard({ title, count, icon, gradient, glow }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-lg ${glow} transition duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-xl transition duration-500 group-hover:scale-150`}
      />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900">{count}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-lg font-black text-white shadow-lg transition duration-300 group-hover:rotate-6 group-hover:scale-110`}
        >
          {icon}
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${gradient} opacity-70`}
      />
    </div>
  );
}

/* ================================================= */
/* CONFLICT CARD */
/* ================================================= */

function ConflictCard({ conflict, index }) {
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentError, setStudentError] = useState("");

  const severityConfig = {
    CRITICAL: {
      badge: "border-red-200 bg-red-50 text-red-700",
      icon: "from-red-500 to-rose-600",
      line: "bg-gradient-to-r from-red-500 to-rose-500",
    },

    HIGH: {
      badge: "border-orange-200 bg-orange-50 text-orange-700",
      icon: "from-orange-500 to-amber-600",
      line: "bg-gradient-to-r from-orange-500 to-amber-500",
    },

    MEDIUM: {
      badge: "border-yellow-200 bg-yellow-50 text-yellow-700",
      icon: "from-yellow-400 to-orange-500",
      line: "bg-gradient-to-r from-yellow-400 to-orange-500",
    },

    LOW: {
      badge: "border-slate-200 bg-slate-100 text-slate-700",
      icon: "from-slate-500 to-slate-700",
      line: "bg-gradient-to-r from-slate-400 to-slate-600",
    },
  };

  const config = severityConfig[conflict.severity] || severityConfig.LOW;

  const loadAffectedStudents = async () => {
    if (showStudents) {
      setShowStudents(false);
      return;
    }

    if (conflict.drive1Id === -1 || conflict.drive2Id === -1) {
      setStudentError(
        "Affected students are available after the drive is created.",
      );

      setShowStudents(true);
      return;
    }

    try {
      setLoadingStudents(true);
      setStudentError("");

      const response = await api.get(
        `/clashes/drive/${conflict.drive1Id}/affected-students/${conflict.drive2Id}`,
      );

      const data = Array.isArray(response.data) ? response.data : [];

      setStudents(data);
      setShowStudents(true);
    } catch (error) {
      console.error("Affected students error:", error);

      setStudentError("Unable to load affected students.");

      setShowStudents(true);
    } finally {
      setLoadingStudents(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50">
      {/* TOP GLOW */}

      <div className={`absolute left-0 right-0 top-0 h-1 ${config.line}`} />

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${config.icon} text-lg font-black text-white shadow-lg transition duration-300 group-hover:scale-110`}
          >
            ⚠
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-base font-black text-slate-900">
                {conflict.company1}
              </h3>

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-400">
                VS
              </span>

              <h3 className="text-base font-black text-slate-900">
                {conflict.company2}
              </h3>

              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${config.badge}`}
              >
                {conflict.severity}
              </span>
            </div>

            <p className="mt-2 text-xs font-medium text-slate-400">
              Conflict #{index + 1}
            </p>
          </div>
        </div>

        {/* AFFECTED STUDENTS */}

        <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md">
            ♙
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Affected Students
            </p>

            <p className="text-xl font-black text-indigo-950">
              {conflict.affectedStudentCount || 0}
            </p>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* DATE */}
      {/* ================================================= */}

      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-sm">
          📅
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Drive Date
          </p>

          <p className="text-sm font-bold text-slate-800">
            {formatDate(conflict.date)}
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* DRIVE COMPARISON */}
      {/* ================================================= */}

      <div className="relative mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <DriveConflictCard
          title={conflict.drive1Id === -1 ? "Proposed Drive" : "Drive 1"}
          company={conflict.company1}
          startTime={conflict.startTime1}
          endTime={conflict.endTime1}
          gradient="from-indigo-500 to-violet-600"
        />

        <DriveConflictCard
          title={conflict.drive2Id === -1 ? "Proposed Drive" : "Drive 2"}
          company={conflict.company2}
          startTime={conflict.startTime2}
          endTime={conflict.endTime2}
          gradient="from-violet-500 to-purple-600"
        />
      </div>

      {/* ================================================= */}
      {/* BUTTON */}
      {/* ================================================= */}

      <div className="mt-5">
        <button
          type="button"
          onClick={loadAffectedStudents}
          className="group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <span className="relative z-10 flex items-center gap-2">
            {loadingStudents ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Loading...
              </>
            ) : showStudents ? (
              <>
                Hide Students
                <span>↑</span>
              </>
            ) : (
              <>
                View Affected Students
                <span className="transition-transform group-hover/btn:translate-x-1">
                  →
                </span>
              </>
            )}
          </span>

          <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover/btn:translate-x-full" />
        </button>
      </div>

      {/* ================================================= */}
      {/* STUDENTS */}
      {/* ================================================= */}

      {showStudents && (
        <div className="mt-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-violet-50/80 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h4 className="font-black text-indigo-950">Affected Students</h4>

              <p className="mt-1 text-xs text-indigo-500">
                Students eligible for both placement drives.
              </p>
            </div>

            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-indigo-700 shadow-sm">
              {students.length}
            </span>
          </div>

          {studentError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">{studentError}</p>
            </div>
          ) : students.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-xl text-green-600">
                ✓
              </div>

              <p className="mt-3 text-sm font-bold text-slate-700">
                No affected students found.
              </p>

              <p className="mt-1 text-xs text-slate-500">
                No student is eligible for both drives.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {students.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ================================================= */
/* STUDENT CARD */
/* ================================================= */

function StudentCard({ student }) {
  const initial = student.name?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className="group/student rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-black text-white shadow-md transition duration-300 group-hover/student:scale-110">
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-slate-900">
            {student.name}
          </p>

          <p className="truncate text-xs text-slate-500">{student.email}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <InfoItem label="Branch" value={student.branch || "-"} />

        <InfoItem
          label="CGPA"
          value={
            student.cgpa !== null && student.cgpa !== undefined
              ? student.cgpa
              : "-"
          }
        />

        <InfoItem
          label="Backlogs"
          value={
            student.backlogs !== null && student.backlogs !== undefined
              ? student.backlogs
              : "-"
          }
        />
      </div>
    </div>
  );
}

/* ================================================= */
/* INFO ITEM */
/* ================================================= */

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-2.5 text-center transition hover:bg-indigo-50">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-black text-slate-700">{value}</p>
    </div>
  );
}

/* ================================================= */
/* DRIVE CARD */
/* ================================================= */

function DriveConflictCard({ title, company, startTime, endTime, gradient }) {
  return (
    <div className="group/drive relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 transition duration-300 hover:border-indigo-200 hover:shadow-md">
      <div
        className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${gradient}`}
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-1 text-sm font-black text-slate-900">{company}</p>
        </div>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md transition duration-300 group-hover/drive:rotate-6`}
        >
          ◷
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

        <div className="h-px flex-1 bg-gradient-to-r from-red-200 via-indigo-200 to-violet-200" />

        <div className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-black text-slate-800">
            {formatTime(startTime)}
            {" - "}
            {formatTime(endTime)}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* DATE */
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
/* TIME */
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

export default Conflicts;
