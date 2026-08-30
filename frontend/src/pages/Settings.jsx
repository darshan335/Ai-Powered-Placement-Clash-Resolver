import { useEffect, useState } from "react";

const DEFAULT_SETTINGS = {
  systemName: "Placement Management",
  officerName: "Admin",
  email: "admin@college.edu",
  conflictNotifications: true,
  aiRecommendations: true,
  autoRefresh: true,
};

function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("placementSettings");

      if (storedSettings) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(storedSettings),
        });
      }
    } catch (error) {
      console.error("Unable to load settings:", error);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem("placementSettings", JSON.stringify(settings));

      window.dispatchEvent(
        new CustomEvent("placement-settings-updated", {
          detail: settings,
        }),
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Unable to save settings:", error);
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset all settings?",
    );

    if (!confirmed) {
      return;
    }

    setSettings(DEFAULT_SETTINGS);

    localStorage.setItem("placementSettings", JSON.stringify(DEFAULT_SETTINGS));

    window.dispatchEvent(
      new CustomEvent("placement-settings-updated", {
        detail: DEFAULT_SETTINGS,
      }),
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Premium animated background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-10 h-96 w-96 animate-pulse rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 animate-pulse rounded-full bg-violet-400/10 blur-3xl [animation-delay:1s]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 animate-pulse rounded-full bg-cyan-400/10 blur-3xl [animation-delay:2s]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-7 overflow-hidden rounded-3xl border border-white/90 bg-white/90 p-7 shadow-xl shadow-indigo-100/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-2xl font-black text-white shadow-lg shadow-indigo-200">
                ⚙
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-white" />
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-indigo-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  System Configuration
                </div>

                <h1 className="bg-gradient-to-r from-slate-950 via-indigo-800 to-violet-700 bg-clip-text text-3xl font-black tracking-tight text-transparent">
                  Settings
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Configure your placement management system.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-wider text-emerald-500">
                Status
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm font-black text-emerald-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Configuration Ready
              </p>
            </div>
          </div>
        </div>

        {/* SUCCESS */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 px-5 py-4 shadow-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 font-black text-emerald-600">
              ✓
            </div>
            <div>
              <p className="text-sm font-black text-emerald-800">
                Settings saved
              </p>
              <p className="text-xs text-emerald-700">
                Your changes have been applied successfully.
              </p>
            </div>
          </div>
        )}

        {/* GENERAL SETTINGS */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-white/90 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-xl">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white via-indigo-50/30 to-violet-50/40 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg text-white shadow-md">
                ⚙
              </div>
              <div>
                <h2 className="font-black text-slate-900">General Settings</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Manage your placement system information.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                System Name
              </label>
              <input
                type="text"
                name="systemName"
                value={settings.systemName}
                onChange={handleChange}
                placeholder="Placement Management"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
              <p className="mt-2 text-xs text-slate-400">
                This name appears in the application header.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                Placement Officer
              </label>
              <input
                type="text"
                name="officerName"
                value={settings.officerName}
                onChange={handleChange}
                placeholder="Admin"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
              <p className="mt-2 text-xs text-slate-400">
                This name appears in the profile section.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                Officer Email
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                placeholder="admin@college.edu"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
              <p className="mt-2 text-xs text-slate-400">
                Used as the contact email displayed in the profile.
              </p>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-white/90 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-xl">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white via-indigo-50/30 to-cyan-50/40 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-lg text-white shadow-md">
                🔔
              </div>
              <div>
                <h2 className="font-black text-slate-900">Notifications</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Control notifications and automated features.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            <SettingToggle
              title="Conflict Notifications"
              description="Show notifications when placement scheduling conflicts are detected."
              name="conflictNotifications"
              checked={settings.conflictNotifications}
              onChange={handleChange}
            />
            <SettingToggle
              title="AI Recommendations"
              description="Enable AI-powered recommendations for scheduling conflicts."
              name="aiRecommendations"
              checked={settings.aiRecommendations}
              onChange={handleChange}
            />
            <SettingToggle
              title="Automatic Refresh"
              description="Automatically refresh placement information when required."
              name="autoRefresh"
              checked={settings.autoRefresh}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* PROFILE PREVIEW */}
        <div className="mb-6 overflow-hidden rounded-3xl border border-white/90 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-xl">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white to-violet-50/40 px-6 py-5">
            <h2 className="font-black text-slate-900">Profile Preview</h2>
            <p className="mt-1 text-xs text-slate-500">
              This is how your profile appears in the application.
            </p>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-5 shadow-sm">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-black text-white shadow-lg shadow-indigo-100">
                {(settings.officerName || "A").charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="font-black text-slate-900">
                  {settings.officerName || "Admin"}
                </p>
                <p className="text-sm font-semibold text-indigo-600">
                  Placement Officer
                </p>
                <p className="mt-1 truncate text-xs text-slate-400">
                  {settings.email || "admin@college.edu"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
          >
            Reset Settings
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-7 py-3 text-sm font-black text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
function SettingToggle({ title, description, name, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-6 px-6 py-5 transition hover:bg-indigo-50/30">
      <div>
        <p className="text-sm font-black text-slate-800">{title}</p>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <div className="relative shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />

        <div className="h-7 w-12 rounded-full bg-slate-300 shadow-inner transition peer-checked:bg-gradient-to-r peer-checked:from-indigo-600 peer-checked:to-violet-600 peer-focus:ring-4 peer-focus:ring-indigo-100" />

        <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md transition duration-200 peer-checked:translate-x-5" />
      </div>
    </label>
  );
}

export default Settings;
