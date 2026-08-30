import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Drives() {
  const navigate = useNavigate();

  const [drives, setDrives] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // =====================================================
  // LOAD DRIVES
  // =====================================================

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/drives");

      const data = Array.isArray(response.data) ? response.data : [];

      setDrives(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load placement drives.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE DRIVE
  // =====================================================

  const requestDeleteDrive = (drive) => {
    setDeleteTarget(drive);
    setError("");
  };

  const closeDeleteModal = () => {
    if (!deletingId) {
      setDeleteTarget(null);
    }
  };

  const confirmDeleteDrive = async () => {
    if (!deleteTarget) {
      return;
    }

    const id = deleteTarget.id;

    setDeletingId(id);
    setError("");

    try {
      await api.delete(`/drives/${id}`);
      setDrives((previous) => previous.filter((drive) => drive.id !== id));
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      setError("Unable to delete placement drive.");
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // EDIT DRIVE
  // =====================================================

  const editDrive = (id) => {
    navigate(`/drives/edit/${id}`);
  };

  // =====================================================
  // FILTER DRIVES
  // =====================================================

  const filteredDrives = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return drives.filter((drive) => {
      const company = drive.company?.name?.toLowerCase() || "";

      const role = drive.jobRole?.toLowerCase() || "";

      const venue = drive.venue?.toLowerCase() || "";

      const status = drive.status?.toUpperCase() || "SCHEDULED";

      const matchesSearch =
        !searchText ||
        company.includes(searchText) ||
        role.includes(searchText) ||
        venue.includes(searchText);

      const matchesStatus = statusFilter === "ALL" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [drives, search, statusFilter]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const scheduledCount = drives.filter(
    (drive) => (drive.status || "SCHEDULED").toUpperCase() === "SCHEDULED",
  ).length;

  const completedCount = drives.filter(
    (drive) => (drive.status || "").toUpperCase() === "COMPLETED",
  ).length;

  const packages = drives
    .map((drive) => Number(drive.packageLpa || 0))
    .filter((value) => value > 0);

  const averagePackage =
    packages.length > 0
      ? (
          packages.reduce((sum, value) => sum + value, 0) / packages.length
        ).toFixed(1)
      : "0.0";

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="drives-orb drives-orb-one" />
        <div className="drives-orb drives-orb-two" />
        <div className="drives-orb drives-orb-three" />
      </div>

      {/* HEADER */}

      <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-7 shadow-xl shadow-indigo-100/40 backdrop-blur-xl md:flex md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 shadow-sm">
              Placement Management
            </span>
          </div>

          <h1 className="bg-gradient-to-r from-slate-950 via-indigo-800 to-violet-700 bg-clip-text text-3xl font-black tracking-tight text-transparent">
            Placement Drives
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            View and manage scheduled placement drives.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/drives/create")}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          + Create Drive
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-800">
            Placement Drive Error
          </p>

          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* STATISTICS */}

      {!loading && !error && (
        <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Drives"
            value={drives.length}
            subtitle="All placement drives"
            icon="▣"
          />

          <StatCard
            title="Scheduled"
            value={scheduledCount}
            subtitle="Upcoming drives"
            icon="◷"
            green
          />

          <StatCard
            title="Completed"
            value={completedCount}
            subtitle="Completed drives"
            icon="✓"
          />

          <StatCard
            title="Average Package"
            value={`${averagePackage} LPA`}
            subtitle="Across available packages"
            icon="₹"
          />
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
          </div>

          <p className="mt-4 text-sm font-medium text-slate-700">
            Loading placement drives...
          </p>
        </div>
      )}

      {/* MAIN */}

      {!loading && !error && (
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/85 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
          {/* LIST HEADER */}

          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900">
                  All Placement Drives
                </h2>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-600">
                  {filteredDrives.length}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {filteredDrives.length === drives.length
                  ? `${drives.length} drive(s) found`
                  : `Showing ${filteredDrives.length} of ${drives.length} drives`}
              </p>
            </div>

            {/* SEARCH */}

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search drives..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 sm:w-64"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              >
                <option value="ALL">All statuses</option>

                <option value="SCHEDULED">Scheduled</option>

                <option value="COMPLETED">Completed</option>

                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* EMPTY */}

          {filteredDrives.length === 0 ? (
            <div className="p-14 text-center">
              <h3 className="text-base font-black text-slate-900">
                No placement drives found
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                {search || statusFilter !== "ALL"
                  ? "Try changing your search or status filter."
                  : "Create your first placement drive to get started."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredDrives.map((drive) => (
                <DriveRow
                  key={drive.id}
                  drive={drive}
                  deleting={deletingId === drive.id}
                  onDelete={requestDeleteDrive}
                  onEdit={editDrive}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-drive-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDeleteModal();
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/80 bg-white/95 shadow-[0_30px_100px_rgba(15,23,42,0.28)] backdrop-blur-2xl">
            <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-red-50 via-rose-50 to-white px-6 py-6">
              <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-red-200/30 blur-3xl" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-xl font-black text-white shadow-lg shadow-red-200">
                  !
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-500">
                    Destructive Action
                  </p>
                  <h2
                    id="delete-drive-title"
                    className="mt-1 text-xl font-black tracking-tight text-slate-900"
                  >
                    Delete placement drive?
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    This action will permanently remove the selected drive.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-black text-white shadow-md">
                    {(deleteTarget.company?.name || "P")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-900">
                      {deleteTarget.company?.name || "Placement Drive"}
                    </p>
                    <p className="truncate text-xs font-semibold text-slate-500">
                      {deleteTarget.jobRole || "Role not specified"}
                    </p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-500">
                    ID #{deleteTarget.id}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                This drive will be removed from the placement management system.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={Boolean(deletingId)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Drive
              </button>
              <button
                type="button"
                onClick={confirmDeleteDrive}
                disabled={Boolean(deletingId)}
                className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId ? "Deleting..." : "Delete Drive"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================= */
/* STAT CARD */
/* ================================================= */

function StatCard({ title, value, subtitle, icon, green = false }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>

          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black text-white shadow-lg transition duration-300 group-hover:scale-110 group-hover:rotate-3 ${
            green
              ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200"
              : "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-indigo-200"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ================================================= */
/* DRIVE ROW */
/* ================================================= */

function DriveRow({ drive, deleting, onDelete, onEdit }) {
  const [showEligibility, setShowEligibility] = useState(false);

  const [eligibleStudents, setEligibleStudents] = useState([]);

  const [notEligibleStudents, setNotEligibleStudents] = useState([]);

  const [eligibilityLoading, setEligibilityLoading] = useState(false);

  const [eligibilityError, setEligibilityError] = useState("");

  const companyName = drive.company?.name || "Unknown Company";

  const status = drive.status?.toUpperCase() || "SCHEDULED";

  const statusStyles = {
    SCHEDULED: "bg-green-50 text-green-700",

    COMPLETED: "bg-indigo-50 text-indigo-700",

    CANCELLED: "bg-red-50 text-red-700",
  };

  const statusClass = statusStyles[status] || "bg-slate-100 text-slate-700";

  const hasCgpa = drive.minimumCgpa !== null && drive.minimumCgpa !== undefined;

  const hasBacklogs =
    drive.maximumBacklogs !== null && drive.maximumBacklogs !== undefined;

  // =====================================================
  // LOAD ELIGIBILITY
  // =====================================================

  const loadEligibility = async () => {
    if (showEligibility) {
      setShowEligibility(false);
      return;
    }

    try {
      setEligibilityLoading(true);
      setEligibilityError("");

      const [eligibleResponse, notEligibleResponse] = await Promise.all([
        api.get(`/clashes/drive/${drive.id}/eligible-students`),

        api.get(`/clashes/drive/${drive.id}/not-eligible-students`),
      ]);

      setEligibleStudents(
        Array.isArray(eligibleResponse.data) ? eligibleResponse.data : [],
      );

      setNotEligibleStudents(
        Array.isArray(notEligibleResponse.data) ? notEligibleResponse.data : [],
      );

      setShowEligibility(true);
    } catch (error) {
      console.error("Eligibility error:", error);

      setEligibilityError("Unable to load student eligibility.");

      setShowEligibility(true);
    } finally {
      setEligibilityLoading(false);
    }
  };

  return (
    <div className="group relative overflow-hidden p-6 transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-50/40 hover:to-transparent">
      {/* DRIVE CONTENT */}

      <div className="flex flex-col gap-6">
        {/* TOP */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* COMPANY */}

          <div className="flex min-w-[240px] items-center gap-4">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-black text-white shadow-lg shadow-indigo-200 transition duration-300 group-hover:scale-110 group-hover:rotate-3">
              {companyName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">
                {companyName}
              </p>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {drive.jobRole || "Role not specified"}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Drive ID #{drive.id}
              </p>
            </div>
          </div>

          {/* STATUS */}

          <span
            className={`w-fit shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-black tracking-wide ${statusClass}`}
          >
            {status}
          </span>
        </div>

        {/* DETAILS */}

        <div className="grid grid-cols-1 gap-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* SCHEDULE */}

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Schedule
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {formatDate(drive.driveDate)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {formatTime(drive.startTime)}
              {" - "}
              {formatTime(drive.endTime)}
            </p>
          </div>

          {/* VENUE */}

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Venue
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              {drive.venue || "Not specified"}
            </p>
          </div>

          {/* PACKAGE */}

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Package
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-800">
              {drive.packageLpa ? `${drive.packageLpa} LPA` : "N/A"}
            </p>
          </div>

          {/* ELIGIBILITY */}

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Eligibility
            </p>

            <div className="mt-2 flex flex-col items-start gap-1">
              {hasCgpa ? (
                <span className="whitespace-nowrap rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  CGPA ≥ {drive.minimumCgpa}
                </span>
              ) : (
                <span className="text-xs text-slate-400">No CGPA limit</span>
              )}

              {hasBacklogs ? (
                <span className="whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  Backlogs ≤ {drive.maximumBacklogs}
                </span>
              ) : (
                <span className="text-xs text-slate-400">No backlog limit</span>
              )}
            </div>
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
          {/* VIEW ELIGIBILITY */}

          <button
            type="button"
            onClick={loadEligibility}
            disabled={eligibilityLoading}
            className="rounded-xl border border-emerald-200 bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {eligibilityLoading
              ? "Loading..."
              : showEligibility
                ? "Hide Eligibility"
                : "View Eligibility"}
          </button>

          {/* EDIT */}

          <button
            type="button"
            onClick={() => onEdit(drive.id)}
            className="rounded-xl border border-indigo-200 bg-white px-5 py-2.5 text-sm font-bold text-indigo-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-md"
          >
            Edit
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={() => onDelete(drive.id)}
            disabled={deleting}
            className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* ELIGIBILITY DETAILS */}

        {showEligibility && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
            {/* HEADER */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Student Eligibility
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Students who can and cannot attend this drive.
                </p>
              </div>

              <div className="flex gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Eligible: {eligibleStudents.length}
                </span>

                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                  Not Eligible: {notEligibleStudents.length}
                </span>
              </div>
            </div>

            {/* ERROR */}

            {eligibilityError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{eligibilityError}</p>
              </div>
            )}

            {/* STUDENTS */}

            {!eligibilityError && (
              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* ELIGIBLE */}

                <StudentSection
                  title="Eligible Students"
                  students={eligibleStudents}
                  type="eligible"
                />

                {/* NOT ELIGIBLE */}

                <StudentSection
                  title="Not Eligible Students"
                  students={notEligibleStudents}
                  type="notEligible"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================= */
/* STUDENT SECTION */
/* ================================================= */

function StudentSection({ title, students, type }) {
  const isEligible = type === "eligible";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div
        className={`border-b px-4 py-3 ${
          isEligible
            ? "border-green-100 bg-green-50"
            : "border-red-100 bg-red-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <h4
            className={`text-sm font-semibold ${
              isEligible ? "text-green-800" : "text-red-800"
            }`}
          >
            {isEligible ? "✓" : "✕"} {title}
          </h4>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              isEligible
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {students.length}
          </span>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm font-medium text-slate-600">
            {isEligible ? "No eligible students." : "Everyone is eligible."}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {students.map((student) => (
            <StudentRow key={student.id} student={student} type={type} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================= */
/* STUDENT ROW */
/* ================================================= */

function StudentRow({ student, type }) {
  const isEligible = type === "eligible";

  const initial = student.name?.charAt(0)?.toUpperCase() || "S";

  return (
    <div className="p-4 transition hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
            isEligible
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {student.name}
          </p>

          <p className="truncate text-xs text-slate-500">{student.email}</p>
        </div>

        <span
          className={`text-lg ${
            isEligible ? "text-green-600" : "text-red-600"
          }`}
        >
          {isEligible ? "✓" : "✕"}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <SmallInfo label="Branch" value={student.branch || "-"} />

        <SmallInfo
          label="CGPA"
          value={
            student.cgpa !== null && student.cgpa !== undefined
              ? student.cgpa
              : "-"
          }
        />

        <SmallInfo
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
/* SMALL INFO */
/* ================================================= */

function SmallInfo({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2 text-center">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-bold text-slate-700">{value}</p>
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

export default Drives;
