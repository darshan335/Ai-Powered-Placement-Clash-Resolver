import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Drives from "./pages/Drives";
import Conflicts from "./pages/Conflicts";
import Students from "./pages/Students";
import Companies from "./pages/Companies";
import AIAnalysis from "./pages/AIAnalysis";
import Settings from "./pages/Settings";
import CreateDrive from "./pages/CreateDrive";
import ScheduleChecker from "./pages/ScheduleChecker";
import EditDrive from "./pages/EditDrive";
import EditStudent from "./pages/EditStudent";
import Home from "./pages/Home";

// =====================================================
// DEFAULT SETTINGS
// =====================================================

const DEFAULT_SETTINGS = {
  systemName: "AI Powered Placement Drive Clash Resolver",
  officerName: "Darshan K G",
  email: "admin@college.edu",
  conflictNotifications: true,
  aiRecommendations: true,
  autoRefresh: true,
};

function App() {
  // =====================================================
  // SETTINGS
  // =====================================================

  const [appSettings, setAppSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem("placementSettings");

      if (savedSettings) {
        return {
          ...DEFAULT_SETTINGS,
          ...JSON.parse(savedSettings),
        };
      }
    } catch (error) {
      console.error("Unable to load settings:", error);
    }

    return DEFAULT_SETTINGS;
  });

  // Listen for settings changes
  useEffect(() => {
    const handleSettingsUpdate = (event) => {
      setAppSettings({
        ...DEFAULT_SETTINGS,
        ...event.detail,
      });
    };

    window.addEventListener("placement-settings-updated", handleSettingsUpdate);

    return () => {
      window.removeEventListener(
        "placement-settings-updated",
        handleSettingsUpdate,
      );
    };
  }, []);

  // =====================================================
  // SIDEBAR STATE
  // =====================================================

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Scheduling conflict detected",
      message: "A placement drive conflict requires attention.",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      title: "Placement drive scheduled",
      message: "A new placement drive has been scheduled.",
      time: "10 minutes ago",
      unread: true,
    },
    {
      id: 3,
      title: "AI recommendation available",
      message: "An alternative slot is available for analysis.",
      time: "1 hour ago",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  // =====================================================
  // PROFILE
  // =====================================================

  const [showProfile, setShowProfile] = useState(false);

  // =====================================================
  // MENU
  // =====================================================

  const menuItems = [
    {
      name: "Home",
      path: "/home",
      icon: "⌂",
    },
    {
      name: "Dashboard",
      path: "/",
      icon: "▦",
    },
    {
      name: "Placement Drives",
      path: "/drives",
      icon: "▣",
    },
    {
      name: "Conflicts",
      path: "/conflicts",
      icon: "⚠",
    },
    {
      name: "Students",
      path: "/students",
      icon: "♙",
    },
    {
      name: "Companies",
      path: "/companies",
      icon: "◇",
    },
    {
      name: "AI Analysis",
      path: "/ai-analysis",
      icon: "✦",
    },
  ];

  // =====================================================
  // NOTIFICATION FUNCTIONS
  // =====================================================

  const toggleNotifications = () => {
    setShowNotifications((previous) => !previous);

    setShowProfile(false);
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false,
      })),
    );
  };

  const markNotificationAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: false,
            }
          : notification,
      ),
    );
  };

  // =====================================================
  // PROFILE FUNCTIONS
  // =====================================================

  const toggleProfile = () => {
    setShowProfile((previous) => !previous);

    setShowNotifications(false);
  };

  // =====================================================
  // SIDEBAR
  // =====================================================

  const toggleSidebar = () => {
    setSidebarCollapsed((previous) => !previous);
  };

  // =====================================================
  // APP
  // =====================================================

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-indigo-50/20 to-violet-50/20 text-slate-900">
        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <aside
          className={`
            fixed
            left-0
            top-0
            z-50
            h-screen
            border-r
            border-white/80
            bg-white/80
            shadow-[8px_0_40px_rgba(15,23,42,0.05)]
            backdrop-blur-2xl
            transition-all
            duration-300
            ease-in-out
            ${sidebarCollapsed ? "w-[82px]" : "w-64"}
          `}
        >
          {/* ================================================= */}
          {/* LOGO */}
          {/* ================================================= */}

          <div
            className={`
              flex
              h-20
              items-center
              border-b
              border-white/70
              bg-white/40
              transition-all
              duration-300
              ${sidebarCollapsed ? "justify-center px-2" : "px-6"}
            `}
          >
            <div
              className={`
                flex
                items-center
                transition-all
                duration-300
                ${sidebarCollapsed ? "justify-center" : "gap-3"}
              `}
            >
              {/* Logo */}

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-xl font-bold text-white shadow-lg shadow-indigo-200 transition duration-300 hover:scale-105">
                P
              </div>

              {/* Logo text */}

              <div
                className={`
                  overflow-hidden
                  whitespace-nowrap
                  transition-all
                  duration-300
                  ${
                    sidebarCollapsed
                      ? "w-0 translate-x-[-10px] opacity-0"
                      : "w-[150px] translate-x-0 opacity-100"
                  }
                `}
              >
                <p className="text-sm font-bold text-slate-900">Placement</p>

                <p className="text-xs text-slate-500">Clash Resolver</p>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* COLLAPSE BUTTON */}
          {/* ================================================= */}

          <button
            type="button"
            onClick={toggleSidebar}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="
              absolute
              -right-3
              top-[58px]
              z-[100]
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              border
              border-white
              bg-gradient-to-br
              from-white
              to-indigo-50
              text-sm
              font-black
              text-indigo-600
              shadow-[0_8px_24px_rgba(79,70,229,0.16)]
              ring-1
              ring-indigo-100/70
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:scale-110
              hover:from-indigo-600
              hover:to-violet-600
              hover:text-white
              hover:shadow-[0_12px_30px_rgba(79,70,229,0.3)]
            "
          >
            <span
              className={`
                transition-transform
                duration-300
                ${sidebarCollapsed ? "rotate-180" : ""}
              `}
            >
              ‹
            </span>
          </button>

          {/* ================================================= */}
          {/* MENU */}
          {/* ================================================= */}

          <div className="h-[calc(100vh-80px)] overflow-y-auto overflow-x-hidden px-3 py-7">
            {/* MAIN MENU */}

            <p
              className={`
                mb-4
                px-3
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-400
                transition-all
                duration-300
                ${
                  sidebarCollapsed
                    ? "h-0 overflow-hidden opacity-0"
                    : "h-auto opacity-100"
                }
              `}
            >
              Main Menu
            </p>

            {/* MENU ITEMS */}

            <div className="space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={sidebarCollapsed ? item.name : ""}
                  className={({ isActive }) =>
                    `
                    group
                    relative
                    flex
                    h-12
                    w-full
                    items-center
                    rounded-2xl
                    transition-all
                    duration-300
                    ${sidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"}
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50 text-indigo-700 shadow-md shadow-indigo-100/50 ring-1 ring-indigo-100/70"
                        : "text-slate-600 hover:bg-gradient-to-r hover:from-indigo-50/70 hover:to-violet-50/50 hover:text-indigo-700"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active line */}

                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-600 to-violet-600" />
                      )}

                      {/* Icon */}

                      <span
                        className={`
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          text-sm
                          transition-all
                          duration-300
                          ${
                            isActive
                              ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200"
                              : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                          }
                          group-hover:scale-105
                        `}
                      >
                        {item.icon}
                      </span>

                      {/* Text */}

                      <span
                        className={`
                          overflow-hidden
                          whitespace-nowrap
                          text-sm
                          font-semibold
                          transition-all
                          duration-300
                          ${
                            sidebarCollapsed
                              ? "w-0 opacity-0"
                              : "w-auto opacity-100"
                          }
                        `}
                      >
                        {item.name}
                      </span>

                      {/* Tooltip */}

                      {sidebarCollapsed && (
                        <span
                          className="
                            pointer-events-none
                            absolute
                            left-[66px]
                            z-[200]
                            whitespace-nowrap
                            rounded-lg
                            bg-slate-900
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-white
                            opacity-0
                            shadow-xl
                            transition
                            duration-200
                            group-hover:opacity-100
                          "
                        >
                          {item.name}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* ================================================= */}
            {/* SYSTEM */}
            {/* ================================================= */}

            <p
              className={`
                mb-4
                mt-10
                px-3
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-slate-400
                transition-all
                duration-300
                ${
                  sidebarCollapsed
                    ? "h-0 overflow-hidden opacity-0"
                    : "h-auto opacity-100"
                }
              `}
            >
              System
            </p>

            {/* SETTINGS */}

            <NavLink
              to="/settings"
              title={sidebarCollapsed ? "Settings" : ""}
              className={({ isActive }) =>
                `
                group
                relative
                flex
                h-12
                w-full
                items-center
                rounded-xl
                transition-all
                duration-300
                ${sidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"}
                ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50 text-indigo-700 shadow-md shadow-indigo-100/50 ring-1 ring-indigo-100/70"
                    : "text-slate-600 hover:bg-gradient-to-r hover:from-indigo-50/70 hover:to-violet-50/50 hover:text-indigo-700"
                }
                `
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-600 to-violet-600" />
                  )}

                  <span
                    className={`
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      text-sm
                      transition-all
                      duration-300
                      ${
                        isActive
                          ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200"
                          : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                      }
                      group-hover:scale-105
                    `}
                  >
                    ⚙
                  </span>

                  <span
                    className={`
                      overflow-hidden
                      whitespace-nowrap
                      text-sm
                      font-semibold
                      transition-all
                      duration-300
                      ${
                        sidebarCollapsed
                          ? "w-0 opacity-0"
                          : "w-auto opacity-100"
                      }
                    `}
                  >
                    Settings
                  </span>

                  {sidebarCollapsed && (
                    <span
                      className="
                        pointer-events-none
                        absolute
                        left-[66px]
                        z-[200]
                        whitespace-nowrap
                        rounded-lg
                        bg-slate-900
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        text-white
                        opacity-0
                        shadow-xl
                        transition
                        duration-200
                        group-hover:opacity-100
                      "
                    >
                      Settings
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </div>
        </aside>

        {/* ================================================= */}
        {/* MAIN CONTENT */}
        {/* ================================================= */}

        <main
          className={`
            min-h-screen
            transition-all
            duration-300
            ease-in-out
            ${sidebarCollapsed ? "ml-[96px]" : "ml-[294px]"}
          `}
        >
          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <header
            className="
              sticky
              top-0
              z-40
              flex
              min-h-[88px]
              items-center
              justify-between
              overflow-visible
              border-b
              border-white/60
              bg-white/75
              px-5
              shadow-[0_10px_40px_rgba(79,70,229,0.07)]
              backdrop-blur-2xl
              md:px-8
            "
          >
            {/* Soft premium header glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="header-glow-left absolute -left-24 -top-28 h-64 w-64 animate-pulse rounded-full bg-indigo-500/10 blur-3xl" />
              <div className="header-glow-right absolute -right-24 -top-32 h-72 w-72 animate-pulse rounded-full bg-fuchsia-500/10 blur-3xl [animation-delay:1s]" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent" />
            </div>

            {/* LEFT: brand/title */}
            <div className="relative min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <span className="hidden rounded-full border border-indigo-200/70 bg-gradient-to-r from-indigo-50 to-violet-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600 sm:inline-flex">
                  ✦ AI Powered
                </span>

                <span className="hidden items-center gap-1.5 text-[10px] font-semibold text-emerald-600 md:inline-flex">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  System Active
                </span>
              </div>

              <h1 className="mt-1 truncate bg-gradient-to-r from-slate-950 via-indigo-900 to-violet-700 bg-clip-text text-lg font-black tracking-[-0.02em] text-transparent sm:text-xl md:text-[22px]">
                {appSettings.systemName ||
                  "AI Powered Placement Drive Clash Resolver"}
              </h1>

              <p className="mt-0.5 truncate text-xs font-medium text-slate-500 sm:text-sm">
                Smart placement scheduling system
              </p>
            </div>

            {/* RIGHT */}
            <div className="relative ml-4 flex shrink-0 items-center gap-2 sm:gap-4">
              {/* Notification */}
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleNotifications}
                  aria-label="Notifications"
                  className={`
                    group
                    relative
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-slate-200/80
                    bg-white/80
                    text-base
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:border-indigo-200
                    hover:bg-indigo-50
                    hover:shadow-lg
                    ${
                      showNotifications
                        ? "border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 shadow-lg shadow-indigo-100"
                        : "text-slate-500"
                    }
                  `}
                >
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-fuchsia-500/0 transition group-hover:from-indigo-500/5 group-hover:to-fuchsia-500/5" />
                  <span className="relative text-lg">🔔</span>

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-[19px] min-w-[19px] items-center justify-center rounded-full border-2 border-white bg-gradient-to-r from-red-500 to-rose-600 px-1 text-[9px] font-black text-white shadow-md shadow-red-200">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-14 z-[100] w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-white/80 bg-white/95 shadow-[0_25px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
                    <div className="bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/70 px-5 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Notifications
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {unreadCount} unread
                          </p>
                        </div>
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllAsRead}
                            className="rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-indigo-600 transition hover:bg-indigo-100"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() =>
                            markNotificationAsRead(notification.id)
                          }
                          className={`flex w-full gap-3 border-t border-slate-100 px-5 py-4 text-left transition hover:bg-indigo-50/50 ${
                            notification.unread ? "bg-indigo-50/30" : "bg-white"
                          }`}
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600">
                            {notification.title.includes("conflict")
                              ? "⚠"
                              : notification.title.includes("AI")
                                ? "✦"
                                : "✓"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`text-sm ${notification.unread ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}
                              >
                                {notification.title}
                              </p>
                              {notification.unread && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,.7)]" />
                              )}
                            </div>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-[10px] text-slate-400">
                              {notification.time}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-200 bg-slate-50/70 px-5 py-3">
                      <NavLink
                        to="/conflicts"
                        onClick={() => setShowNotifications(false)}
                        className="block text-center text-xs font-bold text-indigo-600 transition hover:text-violet-700"
                      >
                        View scheduling conflicts →
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden h-11 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent sm:block" />

              {/* Profile */}
              <div className="relative">
                <button
                  type="button"
                  onClick={toggleProfile}
                  aria-label="Open profile menu"
                  className={`
                    group
                    flex
                    items-center
                    gap-2.5
                    rounded-2xl
                    border
                    border-transparent
                    px-1.5
                    py-1.5
                    transition-all
                    duration-300
                    hover:border-slate-200
                    hover:bg-white/80
                    hover:shadow-lg
                    ${showProfile ? "border-indigo-100 bg-white shadow-lg" : ""}
                  `}
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-30 blur-md transition group-hover:opacity-50" />
                    <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-sm font-black text-white shadow-lg shadow-indigo-200 ring-2 ring-white">
                      {(appSettings.officerName || "Admin")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
                  </div>

                  <div className="hidden text-left md:block">
                    <p className="max-w-[150px] truncate text-sm font-bold text-slate-900">
                      {appSettings.officerName || "Admin"}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-slate-500">
                        Placement Officer
                      </span>
                      <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    </div>
                  </div>

                  <span
                    className={`hidden text-xs text-slate-400 transition-transform duration-300 md:inline-block ${showProfile ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </button>

                {/* Profile dropdown */}
                {showProfile && (
                  <div className="absolute right-0 top-14 z-[100] w-[min(92vw,300px)] overflow-hidden rounded-2xl border border-white/80 bg-white/95 shadow-[0_25px_70px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white">
                      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                      <div className="relative flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-lg font-black backdrop-blur-xl">
                          {(appSettings.officerName || "Admin")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">
                            {appSettings.officerName || "Admin"}
                          </p>
                          <p className="mt-0.5 text-xs text-indigo-100">
                            Placement Officer
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <div className="mb-1 rounded-xl bg-slate-50 px-3 py-2.5">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          Account
                        </p>
                        <p className="mt-1 truncate text-xs font-medium text-slate-600">
                          {appSettings.email || "admin@college.edu"}
                        </p>
                      </div>

                      <NavLink
                        to="/settings"
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          ⚙
                        </span>
                        Settings
                      </NavLink>

                      <button
                        type="button"
                        onClick={() => {
                          alert(
                            "Logout functionality can be connected when authentication is added.",
                          );
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
                          ↪
                        </span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ================================================= */}
          {/* PAGE AREA */}
          {/* ================================================= */}

          <section className="relative min-h-[calc(100vh-80px)] w-full overflow-x-hidden p-5 md:p-8 lg:p-9">
            {/* Animated background */}

            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
              <div className="app-bg-one absolute -left-32 -top-32 h-80 w-80 animate-pulse rounded-full bg-indigo-400/10 blur-3xl" />

              <div className="app-bg-two absolute -right-32 top-20 h-80 w-80 animate-pulse rounded-full bg-violet-400/10 blur-3xl [animation-delay:1s]" />

              <div className="app-bg-three absolute bottom-0 left-1/3 h-72 w-72 animate-pulse rounded-full bg-cyan-400/10 blur-3xl [animation-delay:2s]" />
            </div>

            {/* ================================================= */}
            {/* ROUTES */}
            {/* ================================================= */}

            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<Dashboard />} />

              <Route path="/drives" element={<Drives />} />

              <Route path="/drives/create" element={<CreateDrive />} />

              <Route path="/drives/edit/:id" element={<EditDrive />} />

              <Route path="/conflicts" element={<Conflicts />} />

              <Route path="/students" element={<Students />} />

              <Route path="/students/edit/:id" element={<EditStudent />} />

              <Route path="/companies" element={<Companies />} />

              <Route path="/ai-analysis" element={<AIAnalysis />} />

              <Route path="/schedule-checker" element={<ScheduleChecker />} />

              <Route path="/settings" element={<Settings />} />
            </Routes>
          </section>
        </main>

        {/* ================================================= */}
        {/* ANIMATIONS */}
        {/* ================================================= */}


      </div>
    </BrowserRouter>
  );
}

export default App;
