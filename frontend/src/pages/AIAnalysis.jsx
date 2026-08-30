import { useEffect, useState } from "react";
import api from "../api/api";

function AIAnalysis() {
  const [conflicts, setConflicts] = useState([]);
  const [selectedConflict, setSelectedConflict] = useState(null);

  const [suggestedDate, setSuggestedDate] = useState("");
  const [suggestedStartTime, setSuggestedStartTime] = useState("");
  const [suggestedEndTime, setSuggestedEndTime] = useState("");

  const [loadingConflicts, setLoadingConflicts] = useState(true);
  const [findingSlot, setFindingSlot] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // =========================================================
  // LOAD CONFLICTS
  // =========================================================

  useEffect(() => {
    loadConflicts();
  }, []);

  const loadConflicts = async () => {
    try {
      const response = await api.get("/clashes");

      const conflictList = response.data || [];

      setConflicts(conflictList);

      if (conflictList.length > 0) {
        await selectConflict(conflictList[0]);
      }
    } catch (error) {
      console.error(error);
      setError("Unable to load conflicts.");
    } finally {
      setLoadingConflicts(false);
    }
  };

  // =========================================================
  // SELECT CONFLICT
  // =========================================================

  const selectConflict = async (conflict) => {
    setSelectedConflict(conflict);

    setSuggestedDate("");
    setSuggestedStartTime("");
    setSuggestedEndTime("");

    setResult(null);
    setError("");

    await findAlternativeSlot(conflict);
  };

  // =========================================================
  // FIND ALTERNATIVE SLOT
  // =========================================================

  const findAlternativeSlot = async (conflict) => {
    if (!conflict?.drive1Id || !conflict?.drive2Id) {
      setError("Unable to identify the conflicting drives.");
      return;
    }

    setFindingSlot(true);
    setError("");

    try {
      const response = await api.get(
        `/clashes/recommend/${conflict.drive1Id}/${conflict.drive2Id}`,
      );

      const data = response.data;

      if (!data || !data.recommendations || data.recommendations.length === 0) {
        setError(
          data?.message || "No alternative slots found in the next 7 days.",
        );

        return;
      }

      // Use the first available slot returned by backend
      const slot = data.recommendations[0];

      setSuggestedDate(slot.date || "");

      setSuggestedStartTime(
        slot.startTime ? slot.startTime.substring(0, 5) : "",
      );

      setSuggestedEndTime(slot.endTime ? slot.endTime.substring(0, 5) : "");
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to find an alternative slot.");
      }
    } finally {
      setFindingSlot(false);
    }
  };

  // =========================================================
  // BUILD CONFLICT DETAILS
  // =========================================================

  const buildConflictDetails = () => {
    if (!selectedConflict) {
      return "";
    }

    return `
Placement scheduling conflict:

Company 1: ${selectedConflict.company1}
Drive 1 ID: ${selectedConflict.drive1Id}
Time: ${selectedConflict.startTime1} - ${selectedConflict.endTime1}

Company 2: ${selectedConflict.company2}
Drive 2 ID: ${selectedConflict.drive2Id}
Time: ${selectedConflict.startTime2} - ${selectedConflict.endTime2}

Date: ${selectedConflict.date}

Affected students: ${selectedConflict.affectedStudentCount}

Severity: ${selectedConflict.severity}
    `.trim();
  };

  // =========================================================
  // ANALYZE WITH AI
  // =========================================================

  const analyzeConflict = async () => {
    if (!selectedConflict) {
      setError("Please select a conflict.");
      return;
    }

    if (!suggestedDate || !suggestedStartTime || !suggestedEndTime) {
      setError("Please wait for an alternative slot to be found.");
      return;
    }

    setAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const request = {
        conflictDetails: buildConflictDetails(),

        affectedStudentCount: selectedConflict.affectedStudentCount,

        suggestedDate: suggestedDate,

        suggestedStartTime: suggestedStartTime,

        suggestedEndTime: suggestedEndTime,
      };

      const response = await api.post("/ai/analyze", request);

      setResult(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "AI analysis failed. Make sure Ollama and Spring Boot are running.",
        );
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Premium animated background */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-3xl animate-pulse" />

      <div className="relative z-10">
        {/* =====================================================
            PREMIUM HEADER
        ===================================================== */}

        <div className="mb-7 overflow-hidden rounded-3xl border border-white/90 bg-white/90 p-7 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-2xl font-black text-white shadow-lg shadow-indigo-200">
                ✦
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-white" />
              </div>

              <div>
                <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  AI Placement Intelligence
                </div>
                <h1 className="bg-gradient-to-r from-slate-950 via-indigo-800 to-fuchsia-700 bg-clip-text text-3xl font-black tracking-tight text-transparent">
                  AI Analysis
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Intelligent conflict analysis and placement scheduling
                  recommendations.
                </p>
                <div className="mt-3 h-1 w-28 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Detected
                </p>
                <p className="mt-1 text-xl font-black text-slate-900">
                  {conflicts.length}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-wider text-emerald-500">
                  Engine
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-black text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Online
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
          ERROR
      ===================================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-5 shadow-sm">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* ===================================================
            LEFT SIDE
        =================================================== */}

          <div className="space-y-6 xl:col-span-2">
            {/* =================================================
              SELECT CONFLICT
          ================================================= */}

            <div className="overflow-hidden rounded-3xl border border-white/90 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl">
              <div className="border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50/40 px-6 py-5">
                <h2 className="font-semibold text-slate-900">
                  Select Conflict
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Choose a detected scheduling conflict to analyze.
                </p>
              </div>

              <div className="p-6">
                {loadingConflicts ? (
                  <p className="text-sm text-slate-500">Loading conflicts...</p>
                ) : conflicts.length === 0 ? (
                  <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-5 shadow-sm">
                    <p className="text-sm font-medium text-green-700">
                      No scheduling conflicts found.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conflicts.map((conflict, index) => {
                      const isSelected = selectedConflict === conflict;

                      return (
                        <button
                          key={`${conflict.drive1Id}-${conflict.drive2Id}-${index}`}
                          type="button"
                          onClick={() => selectConflict(conflict)}
                          className={`w-full rounded-2xl border p-5 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                            isSelected
                              ? "border-indigo-400 bg-gradient-to-r from-indigo-50 to-violet-50 shadow-md shadow-indigo-100"
                              : "border-slate-200 hover:border-indigo-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50/40"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {conflict.company1}

                                <span className="mx-2 text-slate-400">vs</span>

                                {conflict.company2}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {conflict.date} ·{" "}
                                {formatTime(conflict.startTime1)} -{" "}
                                {formatTime(conflict.endTime1)}
                              </p>
                            </div>

                            <SeverityBadge severity={conflict.severity} />
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                            <span>
                              👥 {conflict.affectedStudentCount} affected
                              students
                            </span>

                            <span>
                              Drive #{conflict.drive1Id} / #{conflict.drive2Id}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* =================================================
              ALTERNATIVE SCHEDULE
          ================================================= */}

            {selectedConflict && (
              <div className="overflow-hidden rounded-3xl border border-white/90 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-shadow duration-300 hover:shadow-2xl">
                <div className="border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50/40 px-6 py-5">
                  <h2 className="font-semibold text-slate-900">
                    Alternative Schedule
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    The system automatically finds an available slot for the
                    selected conflict.
                  </p>
                </div>

                {/* =============================================
                  READ-ONLY RECOMMENDED SLOT
              ============================================= */}

                <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">
                  {/* DATE */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Date
                    </label>

                    <div className="flex min-h-[52px] items-center rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
                      {suggestedDate
                        ? formatDate(suggestedDate)
                        : findingSlot
                          ? "Finding..."
                          : "-"}
                    </div>
                  </div>

                  {/* START TIME */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Start Time
                    </label>

                    <div className="flex min-h-[52px] items-center rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
                      {findingSlot
                        ? "Finding..."
                        : formatTime(suggestedStartTime)}
                    </div>
                  </div>

                  {/* END TIME */}

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      End Time
                    </label>

                    <div className="flex min-h-[52px] items-center rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
                      {findingSlot
                        ? "Finding..."
                        : formatTime(suggestedEndTime)}
                    </div>
                  </div>
                </div>

                {/* =============================================
                  AVAILABLE SLOT
              ============================================= */}

                {findingSlot && (
                  <div className="mx-6 mb-5 flex items-center gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50 p-4 shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                      <span className="animate-spin">⟳</span>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-indigo-800">
                        Finding available slot...
                      </p>

                      <p className="text-xs text-indigo-600">
                        Checking existing placement drives.
                      </p>
                    </div>
                  </div>
                )}

                {!findingSlot &&
                  suggestedDate &&
                  suggestedStartTime &&
                  suggestedEndTime && (
                    <div className="mx-6 mb-5 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4 shadow-sm">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                        ✓
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-green-800">
                          Available slot found
                        </p>

                        <p className="text-xs text-green-700">
                          {formatDate(suggestedDate)} ·{" "}
                          {formatTime(suggestedStartTime)} -{" "}
                          {formatTime(suggestedEndTime)}
                        </p>
                      </div>
                    </div>
                  )}

                {/* =============================================
                  ANALYZE BUTTON
              ============================================= */}

                <div className="border-t border-slate-200 px-6 py-5">
                  <button
                    type="button"
                    onClick={analyzeConflict}
                    disabled={
                      analyzing ||
                      findingSlot ||
                      !suggestedDate ||
                      !suggestedStartTime ||
                      !suggestedEndTime
                    }
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {analyzing ? (
                      <>
                        <span>⏳</span>
                        AI is analyzing...
                      </>
                    ) : findingSlot ? (
                      <>
                        <span className="animate-spin">⟳</span>
                        Finding alternative...
                      </>
                    ) : (
                      <>
                        <span>✦</span>
                        Analyze with AI
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================
            RIGHT SIDE
        =================================================== */}

          <div>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
              <div className="border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50/40 px-6 py-5">
                <h2 className="font-semibold text-slate-900">
                  AI Recommendation
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Analysis generated by your local AI model.
                </p>
              </div>

              <div className="p-6">
                {/* =============================================
                  EMPTY STATE
              ============================================= */}

                {!result && !analyzing && !findingSlot && (
                  <div className="py-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-2xl text-indigo-600 shadow-inner">
                      ✦
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900">
                      Ready for analysis
                    </h3>

                    <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500">
                      A conflict-free slot will be found automatically before AI
                      analysis.
                    </p>
                  </div>
                )}

                {/* =============================================
                  FINDING SLOT
              ============================================= */}

                {findingSlot && (
                  <div className="py-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-2xl text-indigo-600 shadow-inner">
                      <span className="animate-spin">⟳</span>
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900">
                      Finding best slot...
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Checking existing placement drives.
                    </p>
                  </div>
                )}

                {/* =============================================
                  AI ANALYZING
              ============================================= */}

                {analyzing && (
                  <div className="py-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl">
                      <span className="animate-spin">⟳</span>
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-900">
                      Analyzing conflict...
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Your local Ollama model is generating a recommendation.
                    </p>
                  </div>
                )}

                {/* =============================================
                  AI RESULT
              ============================================= */}

                {result && (
                  <div className="space-y-5">
                    {/* Recommendation */}

                    <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 p-5 shadow-md shadow-indigo-100/50">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-600">✦</span>

                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                          Recommendation
                        </p>
                      </div>

                      <p className="mt-3 text-sm font-semibold leading-6 text-indigo-950">
                        {result.recommendation}
                      </p>
                    </div>

                    {/* Reason */}

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Reason
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {result.reason}
                      </p>
                    </div>

                    {/* Affected Students */}

                    <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm transition hover:border-indigo-100 hover:shadow-md">
                      <p className="text-xs text-slate-500">
                        Affected Students
                      </p>

                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {result.affectedStudentCount}
                      </p>
                    </div>

                    {/* Suggested Slot */}

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Suggested Slot
                      </p>

                      <div className="mt-3 grid grid-cols-1 gap-3">
                        <InfoRow
                          label="Date"
                          value={formatDate(result.suggestedDate)}
                        />

                        <InfoRow
                          label="Start"
                          value={formatTime(result.suggestedStartTime)}
                        />

                        <InfoRow
                          label="End"
                          value={formatTime(result.suggestedEndTime)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// SEVERITY BADGE
// =========================================================

function SeverityBadge({ severity }) {
  const styles = {
    CRITICAL: "border border-red-200 bg-red-50 text-red-700",
    HIGH: "border border-orange-200 bg-orange-50 text-orange-700",
    MEDIUM: "border border-yellow-200 bg-yellow-50 text-yellow-700",
    LOW: "border border-slate-200 bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[severity] || styles.LOW
      }`}
    >
      {severity}
    </span>
  );
}

// =========================================================
// INFO ROW
// =========================================================

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <span className="text-xs text-slate-500">{label}</span>

      <span className="text-sm font-semibold text-slate-900">
        {value || "-"}
      </span>
    </div>
  );
}

// =========================================================
// FORMAT TIME
// =========================================================

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

// =========================================================
// FORMAT DATE
// =========================================================

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

export default AIAnalysis;
