import { useEffect, useState } from "react";
import api from "../api/api";

function Companies() {
  const [companies, setCompanies] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    industry: "",
  });

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  /* ================================================= */
  /* LOAD COMPANIES */
  /* ================================================= */

  const loadCompanies = async () => {
    try {
      const response = await api.get("/companies");

      setCompanies(response.data);
    } catch (error) {
      console.error(error);
      setError("Unable to load companies.");
    } finally {
      setLoading(false);
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
  /* CREATE COMPANY */
  /* ================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Please enter the company name.");
      return;
    }

    setSaving(true);

    try {
      const response = await api.post("/companies", {
        name: form.name.trim(),
        description: form.description.trim(),
        website: form.website.trim(),
        industry: form.industry.trim(),
      });

      setCompanies((previous) => [...previous, response.data]);

      setForm({
        name: "",
        description: "",
        website: "",
        industry: "",
      });

      setSuccess("Company created successfully.");
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Unable to create company.");
      }
    } finally {
      setSaving(false);
    }
  };

  /* ================================================= */
  /* DELETE COMPANY */
  /* ================================================= */

  const deleteCompany = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/companies/${id}`);

      setCompanies((previous) =>
        previous.filter((company) => company.id !== id),
      );

      setSuccess("Company deleted successfully.");
    } catch (error) {
      console.error(error);

      setError(
        "Unable to delete company. It may be used by an existing placement drive.",
      );
    }
  };

  /* ================================================= */
  /* SEARCH */
  /* ================================================= */

  const filteredCompanies = companies.filter((company) => {
    const searchText = search.trim().toLowerCase();

    return (
      company.name?.toLowerCase().includes(searchText) ||
      company.industry?.toLowerCase().includes(searchText)
    );
  });

  const totalCompanies = companies.length;
  const industries = new Set(
    companies.map((company) => company.industry?.trim()).filter(Boolean),
  ).size;
  const websites = companies.filter((company) =>
    company.website?.trim(),
  ).length;

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Premium animated background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-16 h-96 w-96 animate-pulse rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 animate-pulse rounded-full bg-violet-400/10 blur-3xl [animation-delay:1s]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 animate-pulse rounded-full bg-cyan-400/10 blur-3xl [animation-delay:2s]" />
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <div className="mb-7 overflow-hidden rounded-3xl border border-white/80 bg-white/85 p-7 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-2xl font-black text-white shadow-lg shadow-indigo-200">
                ◈
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-white" />
              </div>

              <div>
                <span className="mb-2 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-indigo-700">
                  Company Management
                </span>

                <h1 className="bg-gradient-to-r from-slate-950 via-indigo-800 to-violet-700 bg-clip-text text-3xl font-black tracking-tight text-transparent">
                  Companies
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage organizations participating in placement activities.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 text-center shadow-sm">
                <p className="text-xl font-black text-slate-900">
                  {totalCompanies}
                </p>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Companies
                </p>
              </div>
              <div className="rounded-2xl border border-violet-100 bg-violet-50/80 px-4 py-3 text-center shadow-sm">
                <p className="text-xl font-black text-violet-700">
                  {industries}
                </p>
                <p className="text-[9px] font-black uppercase tracking-wider text-violet-500">
                  Industries
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/80 px-4 py-3 text-center shadow-sm">
                <p className="text-xl font-black text-cyan-700">{websites}</p>
                <p className="text-[9px] font-black uppercase tracking-wider text-cyan-500">
                  Websites
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 font-black text-red-700">
                !
              </div>
              <div>
                <p className="text-sm font-black text-red-800">Company Error</p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 font-black text-emerald-700">
                ✓
              </div>
              <p className="text-sm font-black text-emerald-800">{success}</p>
            </div>
          </div>
        )}

        {/* CREATE COMPANY */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-xl shadow-indigo-100/30 backdrop-blur-xl">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white via-indigo-50/40 to-violet-50/40 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-black text-white shadow-md">
                +
              </div>
              <div>
                <h2 className="font-black text-slate-900">Add Company</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Register a new company for placement drives.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2"
          >
            {[
              ["name", "Company Name", "e.g. Wipro"],
              ["industry", "Industry", "e.g. Information Technology"],
              ["website", "Website", "https://example.com"],
              ["description", "Description", "Short company description"],
            ].map(([name, label, placeholder]) => (
              <div key={name}>
                <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                  {label}
                  {name === "name" && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>
                <input
                  type="text"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            ))}

            <div className="md:col-span-2 md:flex md:justify-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
              >
                {saving ? "Creating..." : "Create Company"}
              </button>
            </div>
          </form>
        </div>

        {/* COMPANY LIST */}
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
          <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-white to-indigo-50/30 px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-slate-900">
                  Registered Companies
                </h2>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700">
                  {filteredCompanies.length}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Companies available for placement drives.
              </p>
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 md:w-72"
              />
            </div>
          </div>

          {loading && (
            <div className="p-14 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />
              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading companies...
              </p>
            </div>
          )}

          {!loading && filteredCompanies.length === 0 && (
            <div className="p-14 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-2xl text-indigo-600 shadow-inner">
                ◇
              </div>
              <h3 className="mt-5 font-black text-slate-900">
                No companies found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? "Try a different search term."
                  : "Add a company using the form above."}
              </p>
            </div>
          )}

          {!loading && filteredCompanies.length > 0 && (
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onDelete={deleteCompany}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CompanyCard({ company, onDelete }) {
  const companyName = company.name || "Unknown Company";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl transition group-hover:bg-violet-500/10" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-black text-white shadow-lg shadow-indigo-200 transition group-hover:scale-110 group-hover:rotate-3">
              {companyName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-black text-slate-900">
                {companyName}
              </h3>
              <p className="mt-1 truncate text-xs font-semibold text-indigo-600">
                {company.industry || "Industry not specified"}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-black text-slate-400">
            #{company.id}
          </span>
        </div>

        <p className="mt-5 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
          {company.description || "No description available."}
        </p>

        {company.website ? (
          <a
            href={company.website}
            target="_blank"
            rel="noreferrer"
            className="mt-4 block truncate rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100"
          >
            {company.website}
          </a>
        ) : (
          <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-400">
            Website not provided
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            Placement Partner
          </span>

          <button
            type="button"
            onClick={() => onDelete(company.id)}
            className="rounded-xl border border-red-200 bg-white px-3.5 py-2 text-xs font-black text-red-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Companies;
