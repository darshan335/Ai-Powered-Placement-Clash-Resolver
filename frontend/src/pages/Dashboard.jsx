import { useEffect, useMemo, useState } from "react";
import api from "../api/api";

function Dashboard() {
  const [drives, setDrives] = useState([]);
  const [students, setStudents] = useState([]);
  const [conflicts, setConflicts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [drivesResponse, studentsResponse, conflictsResponse] =
        await Promise.all([
          api.get("/drives"),
          api.get("/students"),
          api.get("/clashes"),
        ]);

      setDrives(getArray(drivesResponse.data));
      setStudents(getArray(studentsResponse.data));
      setConflicts(getArray(conflictsResponse.data));
    } catch (error) {
      console.error("Dashboard API error:", error);

      setDrives([]);
      setStudents([]);
      setConflicts([]);

      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ARRAY HELPER
  // =====================================================

  function getArray(data) {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.content)) {
      return data.content;
    }

    return [];
  }

  // =====================================================
  // CONFLICT COUNTS
  // =====================================================

  const criticalCount = conflicts.filter(
    (conflict) => conflict?.severity?.toUpperCase() === "CRITICAL",
  ).length;

  const highCount = conflicts.filter(
    (conflict) => conflict?.severity?.toUpperCase() === "HIGH",
  ).length;

  const mediumCount = conflicts.filter(
    (conflict) => conflict?.severity?.toUpperCase() === "MEDIUM",
  ).length;

  const lowCount = conflicts.filter(
    (conflict) => conflict?.severity?.toUpperCase() === "LOW",
  ).length;

  // =====================================================
  // AFFECTED STUDENTS
  // =====================================================

  const affectedStudents = conflicts.reduce(
    (total, conflict) => total + Number(conflict?.affectedStudentCount || 0),
    0,
  );

  // =====================================================
  // DRIVE COUNTS
  // =====================================================

  const scheduledCount = drives.filter(
    (drive) => (drive?.status || "SCHEDULED").toUpperCase() === "SCHEDULED",
  ).length;

  const completedCount = drives.filter(
    (drive) => (drive?.status || "").toUpperCase() === "COMPLETED",
  ).length;

  const cancelledCount = drives.filter(
    (drive) => (drive?.status || "").toUpperCase() === "CANCELLED",
  ).length;

  // =====================================================
  // UPCOMING DRIVES
  // =====================================================

  const upcomingDrives = useMemo(() => {
    const now = new Date();

    return [...drives]
      .filter((drive) => {
        if (!drive?.driveDate || !drive?.startTime) {
          return false;
        }

        const driveDateTime = new Date(`${drive.driveDate}T${drive.startTime}`);

        const status = drive.status?.toUpperCase() || "SCHEDULED";

        return (
          !Number.isNaN(driveDateTime.getTime()) &&
          driveDateTime >= now &&
          status !== "CANCELLED" &&
          status !== "COMPLETED"
        );
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.driveDate}T${a.startTime}`);

        const dateB = new Date(`${b.driveDate}T${b.startTime}`);

        return dateA - dateB;
      })
      .slice(0, 5);
  }, [drives]);

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="relative min-h-full">
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-40 h-96 w-96 animate-pulse rounded-full bg-indigo-400/10 blur-[100px]" />

        <div className="absolute right-[-180px] top-20 h-[450px] w-[450px] animate-pulse rounded-full bg-violet-400/10 blur-[110px] [animation-delay:1s]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[400px] w-[400px] animate-pulse rounded-full bg-cyan-300/10 blur-[100px] [animation-delay:2s]" />
      </div>

      {/* =================================================
          HERO HEADER
      ================================================= */}

      <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          {/* Status pills */}

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 shadow-sm backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,.8)]" />
              Placement Management
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-3.5 py-1.5 text-[10px] font-semibold text-emerald-700">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              System Active
            </span>
          </div>

          <h1 className="bg-gradient-to-r from-slate-950 via-indigo-800 to-violet-700 bg-clip-text text-4xl font-black tracking-[-0.035em] text-transparent sm:text-5xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Monitor placement activities, conflicts, and upcoming drives from
            one intelligent workspace.
          </p>
        </div>

        {/* ACTIONS */}

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/schedule-checker"
            className="
              group
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white/90
              px-5
              py-3.5
              text-sm
              font-bold
              text-slate-700
              shadow-sm
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-indigo-200
              hover:text-indigo-700
              hover:shadow-xl
            "
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs transition group-hover:bg-indigo-50">
              ✓
            </span>
            Check Schedule
          </a>

          <a
            href="/drives/create"
            className="
              group
              relative
              inline-flex
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-xl
              bg-gradient-to-r
              from-indigo-600
              via-violet-600
              to-fuchsia-600
              px-5
              py-3.5
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-indigo-200
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-2xl
            "
          >
            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />

            <span className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
              +
            </span>

            <span className="relative">Create Drive</span>
          </a>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/90 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 font-bold text-red-600">
              !
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-red-800">Dashboard Error</p>

              <p className="mt-1 text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={loadDashboardData}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && <DashboardSkeleton />}

      {/* =================================================
          MAIN DASHBOARD
      ================================================= */}

      {!loading && (
        <>
          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <PremiumStatCard
              title="Total Drives"
              value={drives.length}
              subtitle={`${scheduledCount} scheduled`}
              icon="▣"
              variant="indigo"
            />

            <PremiumStatCard
              title="Upcoming Drives"
              value={upcomingDrives.length}
              subtitle={
                upcomingDrives.length > 0
                  ? "Next scheduled drives"
                  : "No upcoming drives"
              }
              icon="◷"
              variant="cyan"
            />

            <PremiumStatCard
              title="Active Conflicts"
              value={conflicts.length}
              subtitle={
                conflicts.length === 0
                  ? "No conflicts detected"
                  : `${affectedStudents} students affected`
              }
              icon="⚠"
              variant={conflicts.length > 0 ? "rose" : "emerald"}
              alert={conflicts.length > 0}
            />

            <PremiumStatCard
              title="Registered Students"
              value={students.length}
              subtitle="Total registered"
              icon="♙"
              variant="violet"
            />
          </div>

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
            {/* =================================================
                UPCOMING DRIVES
            ================================================= */}

            <section className="premium-card overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/30">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg text-white shadow-lg shadow-indigo-200">
                    ◷
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">
                        Upcoming Placement Drives
                      </h2>

                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600">
                        {upcomingDrives.length}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Your next scheduled placement activities
                    </p>
                  </div>
                </div>

                <a
                  href="/drives"
                  className="text-xs font-bold text-indigo-600 transition hover:translate-x-1 hover:text-indigo-700"
                >
                  View all →
                </a>
              </div>

              {upcomingDrives.length === 0 ? (
                <EmptyDrives />
              ) : (
                <div className="divide-y divide-slate-100">
                  {upcomingDrives.map((drive, index) => (
                    <PremiumDriveRow
                      key={drive.id}
                      drive={drive}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* =================================================
                CONFLICT OVERVIEW
            ================================================= */}

            <section className="premium-card overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/30">
              <div className="border-b border-slate-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        text-lg
                        shadow-lg
                        ${
                          conflicts.length > 0
                            ? "bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-rose-200"
                            : "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-200"
                        }
                      `}
                    >
                      {conflicts.length > 0 ? "!" : "✓"}
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Conflict Overview
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Current scheduling status
                      </p>
                    </div>
                  </div>

                  {conflicts.length > 0 && (
                    <span className="animate-pulse rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-red-600">
                      Attention
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 p-6">
                <PremiumConflictItem
                  label="Critical"
                  description="Immediate attention"
                  count={criticalCount}
                  icon="!"
                  type="critical"
                />

                <PremiumConflictItem
                  label="High"
                  description="Requires attention"
                  count={highCount}
                  icon="!"
                  type="high"
                />

                <PremiumConflictItem
                  label="Medium"
                  description="Monitor"
                  count={mediumCount}
                  icon="•"
                  type="medium"
                />

                <PremiumConflictItem
                  label="Low"
                  description="Low priority"
                  count={lowCount}
                  icon="•"
                  type="low"
                />

                {conflicts.length === 0 && (
                  <div className="mt-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
                        ✓
                      </div>

                      <div>
                        <p className="text-sm font-bold text-emerald-800">
                          All clear
                        </p>

                        <p className="mt-0.5 text-xs text-emerald-600">
                          No scheduling conflicts detected.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <a
                  href="/conflicts"
                  className="
                    group
                    mt-2
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-slate-950
                    py-3.5
                    text-xs
                    font-bold
                    text-white
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-indigo-700
                    hover:shadow-lg
                  "
                >
                  View All Conflicts
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </section>
          </div>

          {/* =================================================
              DRIVE STATUS
          ================================================= */}

          <section className="premium-card mt-6 rounded-[24px] border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">
                    Drive Status
                  </h2>

                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Current placement drive distribution
                </p>
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Live Overview
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <PremiumStatusCard
                label="Scheduled"
                count={scheduledCount}
                icon="◷"
                variant="emerald"
              />

              <PremiumStatusCard
                label="Completed"
                count={completedCount}
                icon="✓"
                variant="indigo"
              />

              <PremiumStatusCard
                label="Cancelled"
                count={cancelledCount}
                icon="×"
                variant="rose"
              />
            </div>
          </section>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <PremiumQuickAction
              href="/drives/create"
              icon="+"
              title="Create Placement Drive"
              description="Schedule a new company drive"
              variant="indigo"
            />

            <PremiumQuickAction
              href="/schedule-checker"
              icon="✓"
              title="Check Schedule"
              description="Detect scheduling conflicts"
              variant="cyan"
            />

            <PremiumQuickAction
              href="/companies"
              icon="◇"
              title="Manage Companies"
              description="Add and manage companies"
              variant="violet"
            />
          </section>

          {/* =================================================
              AI BANNER
          ================================================= */}

          <section className="relative mt-6 overflow-hidden rounded-[26px] bg-[#090b18] p-7 shadow-2xl sm:p-8">
            {/* Glow */}

            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-violet-600/20 blur-[100px]" />

            <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-indigo-600/20 blur-[100px]" />

            <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-lg text-white shadow-lg shadow-indigo-950">
                    ✦
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-white">
                        AI-Powered Scheduling
                      </h2>

                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[8px] font-bold text-emerald-300">
                        ACTIVE
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Smart conflict resolution
                    </p>
                  </div>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
                  Analyze placement conflicts, identify affected students, and
                  get intelligent alternative schedule recommendations.
                </p>
              </div>

              <a
                href="/ai-analysis"
                className="
                  group
                  inline-flex
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-gradient-to-r
                  from-indigo-500
                  to-violet-600
                  px-6
                  py-3.5
                  text-xs
                  font-bold
                  text-white
                  shadow-lg
                  shadow-indigo-950
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-xl
                "
              >
                Open AI Analysis
                <span className="transition group-hover:translate-x-1">→</span>
              </a>
            </div>
          </section>
        </>
      )}

      {/* =================================================
          ANIMATIONS
      ================================================= */}
    </div>
  );
}

// =====================================================
// PREMIUM STAT CARD
// =====================================================

function PremiumStatCard({
  title,
  value,
  subtitle,
  icon,
  variant,
  alert = false,
}) {
  const variants = {
    indigo: {
      icon: "from-indigo-500 to-violet-600",
      soft: "from-indigo-50 to-violet-50",
      text: "text-indigo-600",
      glow: "shadow-indigo-200",
    },

    cyan: {
      icon: "from-cyan-500 to-blue-600",
      soft: "from-cyan-50 to-blue-50",
      text: "text-cyan-600",
      glow: "shadow-cyan-200",
    },

    violet: {
      icon: "from-violet-500 to-fuchsia-600",
      soft: "from-violet-50 to-fuchsia-50",
      text: "text-violet-600",
      glow: "shadow-violet-200",
    },

    emerald: {
      icon: "from-emerald-400 to-teal-500",
      soft: "from-emerald-50 to-teal-50",
      text: "text-emerald-600",
      glow: "shadow-emerald-200",
    },

    rose: {
      icon: "from-rose-500 to-orange-500",
      soft: "from-rose-50 to-orange-50",
      text: "text-rose-600",
      glow: "shadow-rose-200",
    },
  };

  const style = variants[variant] || variants.indigo;

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-slate-200/80
        bg-white/90
        p-5
        shadow-sm
        backdrop-blur-xl
        transition-all
        duration-500
        hover:-translate-y-2
        hover:shadow-2xl
      "
    >
      {/* Decorative glow */}

      <div
        className={`
          absolute
          -right-10
          -top-10
          h-28
          w-28
          rounded-full
          bg-gradient-to-br
          ${style.soft}
          opacity-70
          blur-2xl
          transition
          duration-500
          group-hover:scale-150
        `}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">{title}</p>

          <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
            {value}
          </p>

          <p
            className={`
              mt-2
              text-[11px]
              font-semibold
              ${alert ? "text-rose-500" : style.text}
            `}
          >
            {subtitle}
          </p>
        </div>

        <div
          className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            ${style.icon}
            text-lg
            font-bold
            text-white
            shadow-lg
            ${style.glow}
            transition-all
            duration-500
            group-hover:scale-110
            group-hover:rotate-3
          `}
        >
          {icon}
        </div>
      </div>

      {/* Bottom accent */}

      <div className="mt-5 h-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`
            h-full
            w-1/3
            rounded-full
            bg-gradient-to-r
            ${style.icon}
            transition-all
            duration-700
            group-hover:w-full
          `}
        />
      </div>
    </div>
  );
}

// =====================================================
// PREMIUM DRIVE ROW
// =====================================================

function PremiumDriveRow({ drive, index }) {
  const company = drive.company?.name || "Unknown Company";

  const status = drive.status?.toUpperCase() || "SCHEDULED";

  return (
    <div
      className="
        group
        relative
        flex
        flex-col
        gap-5
        px-6
        py-5
        transition-all
        duration-300
        hover:bg-gradient-to-r
        hover:from-indigo-50/40
        hover:to-transparent
        lg:flex-row
        lg:items-center
      "
      style={{
        animationDelay: `${index * 70}ms`,
      }}
    >
      {/* Timeline */}

      <div className="hidden w-5 shrink-0 lg:block">
        <div className="relative flex justify-center">
          <div className="h-3 w-3 rounded-full bg-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,.10)] transition group-hover:scale-125" />
        </div>
      </div>

      {/* Company */}

      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-black text-indigo-700 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
          {company.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-900">{company}</p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {drive.jobRole || "Placement Drive"}
          </p>
        </div>
      </div>

      {/* DATE */}

      <div className="lg:min-w-[150px]">
        <div className="flex items-center gap-2 text-xs text-slate-400 lg:justify-end">
          <span>◷</span>

          <span className="font-semibold text-slate-700">
            {formatDate(drive.driveDate)}
          </span>
        </div>

        <p className="mt-1 text-xs text-slate-500 lg:text-right">
          {formatTime(`${drive.startTime} - ${drive.endTime}`)}
        </p>
      </div>

      {/* VENUE */}

      <div className="hidden min-w-[120px] lg:block lg:text-right">
        {drive.venue && (
          <p className="truncate text-xs font-semibold text-slate-600">
            {drive.venue}
          </p>
        )}

        {drive.packageLpa && (
          <p className="mt-1 text-[10px] text-slate-400">
            {drive.packageLpa} LPA
          </p>
        )}
      </div>

      {/* STATUS */}

      <span
        className={`
          w-fit
          rounded-full
          px-3
          py-1.5
          text-[9px]
          font-black
          tracking-wide
          ${
            status === "SCHEDULED"
              ? "bg-emerald-50 text-emerald-600"
              : status === "COMPLETED"
                ? "bg-indigo-50 text-indigo-600"
                : status === "CANCELLED"
                  ? "bg-rose-50 text-rose-600"
                  : "bg-slate-100 text-slate-600"
          }
        `}
      >
        {status}
      </span>
    </div>
  );
}

// =====================================================
// CONFLICT ITEM
// =====================================================

function PremiumConflictItem({ label, description, count, icon, type }) {
  const styles = {
    critical: {
      box: "border-rose-100 bg-gradient-to-r from-rose-50 to-orange-50/40",
      icon: "bg-rose-100 text-rose-600",
      text: "text-rose-700",
    },

    high: {
      box: "border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50/40",
      icon: "bg-orange-100 text-orange-600",
      text: "text-orange-700",
    },

    medium: {
      box: "border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50/40",
      icon: "bg-amber-100 text-amber-600",
      text: "text-amber-700",
    },

    low: {
      box: "border-slate-100 bg-slate-50",
      icon: "bg-slate-100 text-slate-500",
      text: "text-slate-600",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`
        group
        flex
        items-center
        justify-between
        rounded-2xl
        border
        p-4
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-sm
        ${style.box}
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            text-xs
            font-black
            transition
            group-hover:scale-110
            ${style.icon}
          `}
        >
          {icon}
        </div>

        <div>
          <p className={`text-xs font-bold ${style.text}`}>{label}</p>

          <p className="mt-0.5 text-[10px] text-slate-400">{description}</p>
        </div>
      </div>

      <span
        className={`
          text-2xl
          font-black
          ${style.text}
        `}
      >
        {count}
      </span>
    </div>
  );
}

// =====================================================
// STATUS CARD
// =====================================================

function PremiumStatusCard({ label, count, icon, variant }) {
  const variants = {
    emerald: {
      bg: "from-emerald-50 to-teal-50",
      icon: "from-emerald-400 to-teal-500",
      text: "text-emerald-700",
    },

    indigo: {
      bg: "from-indigo-50 to-violet-50",
      icon: "from-indigo-500 to-violet-600",
      text: "text-indigo-700",
    },

    rose: {
      bg: "from-rose-50 to-orange-50",
      icon: "from-rose-500 to-orange-500",
      text: "text-rose-700",
    },
  };

  const style = variants[variant] || variants.indigo;

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        bg-gradient-to-br
        ${style.bg}
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs font-bold ${style.text}`}>{label}</p>

          <p className={`mt-2 text-3xl font-black ${style.text}`}>{count}</p>
        </div>

        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-gradient-to-br
            ${style.icon}
            text-sm
            font-bold
            text-white
            shadow-lg
            transition
            group-hover:scale-110
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// QUICK ACTION
// =====================================================

function PremiumQuickAction({ href, icon, title, description, variant }) {
  const variants = {
    indigo: "from-indigo-500 to-violet-600",
    cyan: "from-cyan-500 to-blue-600",
    violet: "from-violet-500 to-fuchsia-600",
  };

  return (
    <a
      href={href}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200/80
        bg-white/90
        p-5
        shadow-sm
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:border-indigo-200
        hover:shadow-xl
      "
    >
      <div
        className={`
          absolute
          -right-12
          -top-12
          h-32
          w-32
          rounded-full
          bg-gradient-to-br
          ${variants[variant]}
          opacity-[0.06]
          blur-2xl
          transition
          duration-500
          group-hover:scale-150
        `}
      />

      <div className="relative flex items-center gap-4">
        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-gradient-to-br
            ${variants[variant]}
            text-lg
            font-bold
            text-white
            shadow-lg
            transition
            duration-300
            group-hover:scale-110
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900">{title}</p>

          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <span className="ml-auto text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-indigo-500">
          →
        </span>
      </div>
    </a>
  );
}

// =====================================================
// EMPTY DRIVES
// =====================================================

function EmptyDrives() {
  return (
    <div className="p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-xl text-indigo-500 shadow-sm">
        ▣
      </div>

      <p className="mt-5 text-sm font-bold text-slate-800">
        No upcoming drives
      </p>

      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-500">
        Create a placement drive to see your upcoming schedules here.
      </p>

      <a
        href="/drives/create"
        className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 transition hover:gap-2 hover:text-indigo-700"
      >
        Create Drive →
      </a>
    </div>
  );
}

// =====================================================
// LOADING SKELETON
// =====================================================

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-[24px] border border-slate-200 bg-white p-6"
          >
            <div className="flex justify-between">
              <div className="space-y-3">
                <div className="h-3 w-24 rounded bg-slate-200" />

                <div className="h-9 w-16 rounded bg-slate-200" />

                <div className="h-3 w-28 rounded bg-slate-100" />
              </div>

              <div className="h-12 w-12 rounded-2xl bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="h-[380px] animate-pulse rounded-[24px] bg-white" />

        <div className="h-[380px] animate-pulse rounded-[24px] bg-white" />
      </div>
    </div>
  );
}

// =====================================================
// DATE
// =====================================================

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

// =====================================================
// TIME RANGE
// =====================================================

function formatTime(timeRange) {
  if (!timeRange) {
    return "-";
  }

  const times = timeRange.split(" - ");

  if (times.length !== 2) {
    return formatSingleTime(timeRange);
  }

  return `${formatSingleTime(times[0])} - ${formatSingleTime(times[1])}`;
}

// =====================================================
// SINGLE TIME
// =====================================================

function formatSingleTime(time) {
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

export default Dashboard;
