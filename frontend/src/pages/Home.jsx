import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [activeStep, setActiveStep] = useState(0);

  // =====================================================
  // ANIMATED WORKFLOW
  // =====================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((previous) => (previous + 1) % 4);
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900">
      {/* =====================================================
          PREMIUM BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Gradient orbs */}

        <div className="home-orb orb-purple absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-violet-400/20 blur-[110px] animate-pulse" />

        <div className="home-orb orb-blue absolute -right-48 top-10 h-[550px] w-[550px] rounded-full bg-indigo-400/20 blur-[110px] animate-pulse [animation-delay:1s]" />

        <div className="home-orb orb-cyan absolute bottom-[-250px] left-[30%] h-[500px] w-[500px] rounded-full bg-cyan-300/15 blur-[110px] animate-pulse [animation-delay:2s]" />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Particles */}

        <span className="particle p1" />
        <span className="particle p2" />
        <span className="particle p3" />
        <span className="particle p4" />
        <span className="particle p5" />
        <span className="particle p6" />
        <span className="particle p7" />
        <span className="particle p8" />
      </div>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/70 shadow-sm shadow-slate-200/30 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          {/* LOGO */}

          <div className="group flex cursor-pointer items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-violet-500/30 blur-md transition duration-300 group-hover:blur-lg" />

              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-lg font-bold text-white shadow-lg">
                P
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">Placement</p>

              <p className="text-xs text-slate-500">Clash Resolver</p>
            </div>
          </div>

          {/* NAVIGATION */}

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="nav-link text-sm font-medium text-slate-600"
            >
              How It Works
            </a>

            <a
              href="#features"
              className="nav-link text-sm font-medium text-slate-600"
            >
              Features
            </a>

            <a
              href="#ai"
              className="nav-link text-sm font-medium text-slate-600"
            >
              AI Resolution
            </a>
          </div>

          {/* DASHBOARD */}

          <NavLink
            to="/"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <span className="relative z-10">
              Open Dashboard
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>

            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
          </NavLink>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* =================================================
              HERO LEFT
          ================================================= */}

          <div className="hero-left">
            {/* Badge */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>

              <span className="text-xs font-bold tracking-wide text-indigo-700">
                AI POWERED PLACEMENT MANAGEMENT
              </span>
            </div>

            {/* Heading */}

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-[68px]">
              Smarter schedules.
              <span className="hero-gradient block">Fewer conflicts.</span>
              Better placements.
            </h1>

            {/* Animated underline */}

            <div className="mt-5 h-1 w-28 overflow-hidden rounded-full bg-indigo-100">
              <div className="hero-line h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600" />
            </div>

            {/* Description */}

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              An intelligent placement scheduling system that detects drive
              clashes, identifies affected students, and recommends alternative
              slots — helping placement officers make faster, smarter scheduling
              decisions.
            </p>

            {/* Buttons */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <NavLink
                to="/"
                className="group rounded-xl bg-slate-950 px-7 py-4 text-center text-sm font-bold text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-2xl"
              >
                Explore Dashboard
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </NavLink>

              <a
                href="#how-it-works"
                className="rounded-xl border border-slate-200 bg-white/80 px-7 py-4 text-center text-sm font-bold text-slate-700 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-lg"
              >
                See How It Works
              </a>
            </div>

            {/* Mini stats */}

            <div className="mt-10 flex flex-wrap items-center gap-7">
              <MiniStat number="01" label="Conflict Detection" />

              <div className="h-8 w-px bg-slate-200" />

              <MiniStat number="02" label="Student Impact" />

              <div className="h-8 w-px bg-slate-200" />

              <MiniStat number="03" label="AI Resolution" />
            </div>
          </div>

          {/* =================================================
              HERO RIGHT
          ================================================= */}

          <div className="relative hero-right">
            {/* Glow */}

            <div className="absolute inset-10 rounded-full bg-indigo-500/10 blur-[80px]" />

            {/* Main dashboard card */}

            <div className="relative rounded-[28px] border border-white/90 bg-white/85 p-5 shadow-[0_30px_80px_rgba(79,70,229,0.15)] backdrop-blur-2xl transition duration-500 hover:-translate-y-1 hover:shadow-[0_40px_100px_rgba(79,70,229,0.20)] sm:p-6">
              {/* Browser header */}

              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                </div>

                <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <span className="text-[9px] font-semibold text-slate-500">
                    SYSTEM ACTIVE
                  </span>
                </div>
              </div>

              {/* Dashboard title */}

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                    AI Analysis
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-900">
                    Schedule Intelligence
                  </h3>
                </div>

                <div className="ai-icon flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-lg text-white shadow-lg shadow-indigo-200">
                  ✦
                </div>
              </div>

              {/* Conflict cards */}

              <div className="mt-6 space-y-3">
                <DriveCard
                  company="Infosys"
                  time="10:00 AM – 1:00 PM"
                  active={activeStep >= 0}
                />

                <div className="relative flex items-center justify-center">
                  <div className="absolute h-px w-full bg-slate-100" />

                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-red-100 bg-red-50 text-xs text-red-500">
                    ⚠
                  </div>
                </div>

                <DriveCard
                  company="TCS"
                  time="10:00 AM – 1:00 PM"
                  active={activeStep >= 1}
                />
              </div>

              {/* Affected students */}

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    ♙
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Affected Students
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Eligible for both drives
                    </p>
                  </div>
                </div>

                <span className="text-2xl font-black text-slate-900">05</span>
              </div>

              {/* AI analyzing */}

              <div
                className={`
                  mt-4
                  rounded-2xl
                  border
                  p-4
                  transition-all
                  duration-700
                  ${
                    activeStep === 2
                      ? "border-indigo-200 bg-indigo-50 shadow-md shadow-indigo-100"
                      : "border-slate-100 bg-white"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <span className="absolute inset-0 animate-ping rounded-xl bg-indigo-200 opacity-30" />

                    <span className="relative">✦</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-indigo-700">
                        AI ANALYSIS
                      </p>

                      <span className="text-[9px] font-medium text-slate-400">
                        {activeStep === 2 ? "ANALYZING..." : "READY"}
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-indigo-100">
                      <div
                        className={`ai-progress h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 ${
                          activeStep === 2 ? "w-4/5" : "w-1/3"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation */}

              <div
                className={`
                  mt-4
                  rounded-2xl
                  border
                  p-4
                  transition-all
                  duration-700
                  ${
                    activeStep === 3
                      ? "border-emerald-200 bg-emerald-50 shadow-lg shadow-emerald-100"
                      : "border-slate-100 bg-white"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    ✓
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                        Recommended Slot
                      </p>

                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[8px] font-bold text-emerald-700">
                        AVAILABLE
                      </span>
                    </div>

                    <p className="mt-2 text-lg font-bold text-slate-900">
                      1:00 PM – 4:00 PM
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-500">
                      01 September 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating notification */}

            <div className="floating-card absolute -right-4 top-16 hidden rounded-2xl border border-white bg-white/90 p-3 shadow-xl shadow-emerald-100/50 backdrop-blur-xl sm:block">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  ✓
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-800">
                    Conflict Resolved
                  </p>

                  <p className="text-[9px] text-slate-400">
                    Alternative slot found
                  </p>
                </div>
              </div>
            </div>

            {/* Floating AI badge */}

            <div className="floating-card-two absolute -bottom-5 -left-5 hidden rounded-2xl border border-indigo-400/20 bg-slate-950 p-4 shadow-xl shadow-indigo-300/20 sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                  ✦
                </div>

                <div>
                  <p className="text-[10px] font-bold text-white">AI Powered</p>

                  <p className="text-[9px] text-slate-400">Smart scheduling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROBLEM SECTION
      ===================================================== */}

      <section className="relative z-10 border-y border-slate-200/70 bg-white/60 py-24 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="THE CHALLENGE"
            title="Placement scheduling shouldn't be a guessing game."
            description="When several companies conduct drives at overlapping times, the same students may be eligible for multiple opportunities. Your system makes these conflicts visible and actionable."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <ProblemCard
              number="01"
              icon="⚠"
              title="Overlapping Drives"
              description="Multiple companies can accidentally be scheduled for the same date and time."
            />

            <ProblemCard
              number="02"
              icon="♙"
              title="Student Conflicts"
              description="Students eligible for multiple drives may be forced to choose between opportunities."
            />

            <ProblemCard
              number="03"
              icon="◷"
              title="Manual Resolution"
              description="Placement officers need to identify a suitable alternative schedule quickly."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <SectionHeading
          eyebrow="HOW IT WORKS"
          title="One workflow. Complete visibility."
          description="The system turns placement scheduling into a simple, structured process."
        />

        <div className="relative mt-16">
          {/* Desktop line */}

          <div className="absolute left-[10%] right-[10%] top-[42px] hidden h-px bg-gradient-to-r from-indigo-200 via-violet-300 to-cyan-200 lg:block" />

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <WorkflowStep
              number="01"
              icon="♙"
              title="Register Students"
              description="Maintain student information and placement eligibility."
              active={activeStep === 0}
            />

            <WorkflowStep
              number="02"
              icon="◇"
              title="Add Companies"
              description="Store company details and placement information."
              active={activeStep === 1}
            />

            <WorkflowStep
              number="03"
              icon="◷"
              title="Schedule Drives"
              description="Create placement drives with date and time slots."
              active={activeStep === 2}
            />

            <WorkflowStep
              number="04"
              icon="✦"
              title="Resolve Conflicts"
              description="Detect clashes and receive alternative recommendations."
              active={activeStep === 3}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          AI SECTION
      ===================================================== */}

      <section
        id="ai"
        className="relative z-10 overflow-hidden bg-[#090b18] py-24"
      >
        {/* Background */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />

          <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-fuchsia-600/15 blur-[120px]" />

          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* LEFT */}

            <div>
              <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-indigo-300">
                INTELLIGENT RESOLUTION
              </span>

              <h2 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Detect the clash.
                <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Let AI find the way out.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                Instead of stopping at conflict detection, the system evaluates
                available schedules and presents an alternative slot that avoids
                existing placement drives.
              </p>

              <div className="mt-8 space-y-4">
                <DarkFeature
                  number="01"
                  text="Detect overlapping placement drives"
                />

                <DarkFeature number="02" text="Identify affected students" />

                <DarkFeature number="03" text="Evaluate available time slots" />

                <DarkFeature
                  number="04"
                  text="Recommend a suitable alternative"
                />
              </div>
            </div>

            {/* RIGHT */}

            <div className="relative">
              <div className="absolute inset-0 rounded-[30px] bg-indigo-500/10 blur-3xl" />

              <div className="relative rounded-[30px] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
                {/* Header */}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
                      ✦
                    </div>

                    <div>
                      <p className="text-sm font-bold text-white">
                        AI Recommendation
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Placement scheduling analysis
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[9px] font-bold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    READY
                  </span>
                </div>

                {/* Conflict */}

                <div className="mt-7 rounded-2xl border border-red-400/10 bg-red-400/[0.06] p-5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-red-300">
                    Detected Conflict
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-white">Infosys</p>

                      <p className="mt-1 text-xs text-slate-500">
                        10:00 AM – 1:00 PM
                      </p>
                    </div>

                    <span className="text-sm font-bold text-red-300">VS</span>

                    <div className="text-right">
                      <p className="text-base font-bold text-white">TCS</p>

                      <p className="mt-1 text-xs text-slate-500">
                        10:00 AM – 1:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow */}

                <div className="flex justify-center py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
                    ↓
                  </div>
                </div>

                {/* Recommendation */}

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                      ✓
                    </div>

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-300">
                        Recommended Alternative
                      </p>

                      <p className="mt-2 text-xl font-black text-white">
                        1:00 PM – 4:00 PM
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        01 September 2026
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 h-px bg-white/10" />

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Affected students
                    </span>

                    <span className="text-sm font-bold text-white">5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <SectionHeading
          eyebrow="FEATURES"
          title="Built around the complete placement workflow."
          description="Everything you need to organize, monitor and resolve placement scheduling."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon="⚠"
            title="Conflict Detection"
            description="Automatically detect overlapping placement drive schedules."
          />

          <FeatureCard
            icon="♙"
            title="Affected Students"
            description="Identify students impacted by conflicting placement drives."
          />

          <FeatureCard
            icon="◷"
            title="Schedule Checker"
            description="Validate proposed schedules before creating placement drives."
          />

          <FeatureCard
            icon="✦"
            title="AI Recommendations"
            description="Find suitable alternative slots for conflicting schedules."
          />

          <FeatureCard
            icon="▣"
            title="Drive Management"
            description="Create, edit and manage placement drives from one dashboard."
          />

          <FeatureCard
            icon="◇"
            title="Company Management"
            description="Maintain company information used throughout the placement process."
          />
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="relative z-10 px-6 pb-24 lg:px-8">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-10 shadow-2xl shadow-indigo-200 transition duration-500 hover:shadow-indigo-300/60 sm:p-14">
          {/* Glow */}

          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

          <div className="relative text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl text-white backdrop-blur-xl">
              ✦
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Ready to resolve placement conflicts smarter?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-indigo-100">
              Explore the dashboard and see how the complete placement
              scheduling workflow works.
            </p>

            <NavLink
              to="/"
              className="mt-8 inline-flex items-center rounded-xl bg-white px-7 py-4 text-sm font-bold text-indigo-700 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              Open Placement Dashboard
              <span className="ml-2">→</span>
            </NavLink>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="relative z-10 border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-bold text-white">
              P
            </div>

            <span className="text-sm font-bold text-slate-700">
              Placement Clash Resolver
            </span>
          </div>

          <p className="text-xs text-slate-400">
            AI Powered Placement Drive Clash Resolver
          </p>
        </div>
      </footer>

      {/* =====================================================
          CSS ANIMATIONS
      ===================================================== */}

      <style>
        {`

          /* ==========================================
             BACKGROUND ORBS
          ========================================== */

          @keyframes movePurple {
            0%, 100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(100px, 80px, 0) scale(1.12);
            }
          }

          @keyframes moveBlue {
            0%, 100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(-90px, 70px, 0) scale(1.08);
            }
          }

          @keyframes moveCyan {
            0%, 100% {
              transform: translate3d(0, 0, 0);
            }

            50% {
              transform: translate3d(60px, -70px, 0);
            }
          }


          /* ==========================================
             HERO
          ========================================== */

          @keyframes heroLeft {
            from {
              opacity: 0;
              transform: translateY(30px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes heroRight {
            from {
              opacity: 0;
              transform: translateX(40px) scale(.97);
            }

            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }

          .hero-left {
            animation: heroLeft .9s ease-out both;
          }

          .hero-right {
            animation: heroRight 1s ease-out .15s both;
          }


          /* ==========================================
             GRADIENT TEXT
          ========================================== */

          @keyframes gradientMove {
            0% {
              background-position: 0% 50%;
            }

            50% {
              background-position: 100% 50%;
            }

            100% {
              background-position: 0% 50%;
            }
          }

          .hero-gradient {
            background: linear-gradient(
              90deg,
              #4f46e5,
              #7c3aed,
              #c026d3,
              #4f46e5
            );

            background-size: 250% auto;

            -webkit-background-clip: text;
            background-clip: text;

            -webkit-text-fill-color: transparent;

            animation: gradientMove 7s ease infinite;
          }


          /* ==========================================
             HERO LINE
          ========================================== */

          @keyframes lineMove {
            0% {
              transform: translateX(-100%);
            }

            50% {
              transform: translateX(100%);
            }

            100% {
              transform: translateX(100%);
            }
          }

          .hero-line {
            animation: lineMove 3s ease-in-out infinite;
          }


          /* ==========================================
             FLOATING CARDS
          ========================================== */

          @keyframes floatOne {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }

            50% {
              transform: translateY(-10px) rotate(.5deg);
            }
          }

          @keyframes floatTwo {
            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(9px);
            }
          }

          .floating-card {
            animation: floatOne 4s ease-in-out infinite;
          }

          .floating-card-two {
            animation: floatTwo 5s ease-in-out infinite;
          }


          /* ==========================================
             AI ICON
          ========================================== */

          @keyframes aiRotate {
            0% {
              transform: rotate(0deg);
            }

            100% {
              transform: rotate(360deg);
            }
          }

          .ai-icon {
            animation: aiRotate 8s linear infinite;
          }


          /* ==========================================
             AI PROGRESS
          ========================================== */

          @keyframes progressMove {
            0% {
              transform: translateX(-110%);
            }

            100% {
              transform: translateX(230%);
            }
          }

          .ai-progress {
            animation: progressMove 2s ease-in-out infinite;
          }


          /* ==========================================
             PARTICLES
          ========================================== */

          .particle {
            position: absolute;

            width: 4px;
            height: 4px;

            border-radius: 999px;

            background: rgba(99, 102, 241, .35);

            animation: particleFloat 8s ease-in-out infinite;
          }

          .p1 {
            left: 10%;
            top: 25%;
            animation-delay: 0s;
          }

          .p2 {
            left: 25%;
            top: 70%;
            animation-delay: 1s;
          }

          .p3 {
            left: 42%;
            top: 20%;
            animation-delay: 2s;
          }

          .p4 {
            left: 58%;
            top: 65%;
            animation-delay: 3s;
          }

          .p5 {
            left: 70%;
            top: 25%;
            animation-delay: 4s;
          }

          .p6 {
            left: 82%;
            top: 55%;
            animation-delay: 5s;
          }

          .p7 {
            left: 90%;
            top: 18%;
            animation-delay: 2.5s;
          }

          .p8 {
            left: 15%;
            top: 90%;
            animation-delay: 4.5s;
          }

          @keyframes particleFloat {
            0%, 100% {
              transform: translateY(0) scale(1);
              opacity: .2;
            }

            50% {
              transform: translateY(-30px) scale(1.8);
              opacity: .7;
            }
          }


          /* ==========================================
             NAV HOVER
          ========================================== */

          .nav-link {
            position: relative;
            transition: color .25s ease;
          }

          .nav-link::after {
            content: "";

            position: absolute;

            left: 0;
            right: 0;
            bottom: -7px;

            height: 2px;

            border-radius: 999px;

            background: linear-gradient(
              90deg,
              #4f46e5,
              #c026d3
            );

            transform: scaleX(0);

            transform-origin: center;

            transition: transform .3s ease;
          }

          .nav-link:hover {
            color: #4f46e5;
          }

          .nav-link:hover::after {
            transform: scaleX(1);
          }


          /* ==========================================
             REDUCE MOTION
          ========================================== */

          @media (prefers-reduced-motion: reduce) {

            *,
            *::before,
            *::after {
              animation-duration: .01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: .01ms !important;
            }

          }

        `}
      </style>
    </div>
  );
}

// =====================================================
// MINI STAT
// =====================================================

function MiniStat({ number, label }) {
  return (
    <div className="group cursor-default">
      <p className="text-lg font-black text-indigo-600 transition duration-300 group-hover:scale-110">
        {number}
      </p>

      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  );
}

// =====================================================
// DRIVE CARD
// =====================================================

function DriveCard({ company, time, active }) {
  return (
    <div
      className={`
        flex
        items-center
        justify-between
        rounded-2xl
        border
        p-4
        transition-all
        duration-700
        ${active ? "border-red-100 bg-red-50/50" : "border-slate-100 bg-white"}
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            text-sm
            font-bold
            ${
              active
                ? "bg-white text-red-500 shadow-sm"
                : "bg-slate-100 text-slate-500"
            }
          `}
        >
          {company.charAt(0)}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">{company}</p>

          <p className="mt-0.5 text-[10px] text-slate-400">Placement Drive</p>
        </div>
      </div>

      <div className="text-right">
        <p className="text-xs font-semibold text-slate-700">{time}</p>

        <span
          className={`
            mt-1
            inline-block
            text-[8px]
            font-bold
            ${active ? "text-red-500" : "text-slate-400"}
          `}
        >
          {active ? "CONFLICT" : "SCHEDULED"}
        </span>
      </div>
    </div>
  );
}

// =====================================================
// SECTION HEADING
// =====================================================

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="text-[10px] font-black tracking-[0.25em] text-indigo-600">
        {eyebrow}
      </span>

      <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
        {description}
      </p>
    </div>
  );
}

// =====================================================
// PROBLEM CARD
// =====================================================

function ProblemCard({ number, icon, title, description }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 p-7 shadow-sm backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/80">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl transition duration-500 group-hover:bg-indigo-500/10" />

      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 text-lg text-indigo-600 transition duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>

        <span className="text-xs font-black text-slate-200">{number}</span>
      </div>

      <h3 className="mt-6 text-base font-bold text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

      <div className="mt-6 h-1 w-10 overflow-hidden rounded-full bg-indigo-100">
        <div className="h-full w-0 rounded-full bg-indigo-600 transition-all duration-500 group-hover:w-full" />
      </div>
    </div>
  );
}

// =====================================================
// WORKFLOW STEP
// =====================================================

function WorkflowStep({ number, icon, title, description, active }) {
  return (
    <div className="group relative text-center">
      <div
        className={`
          relative
          z-10
          mx-auto
          flex
          h-[84px]
          w-[84px]
          items-center
          justify-center
          rounded-2xl
          border
          bg-white
          text-xl
          shadow-xl
          transition-all
          duration-500
          ${
            active
              ? "border-indigo-200 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-200"
              : "border-slate-100 text-indigo-600"
          }
        `}
      >
        {icon}

        <span
          className={`
            absolute
            -right-2
            -top-2
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            text-[9px]
            font-black
            ${active ? "bg-white text-indigo-600" : "bg-slate-900 text-white"}
          `}
        >
          {number}
        </span>
      </div>

      <h3 className="mt-6 text-base font-bold text-slate-900">{title}</h3>

      <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

// =====================================================
// DARK FEATURE
// =====================================================

function DarkFeature({ number, text }) {
  return (
    <div className="group flex items-center gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[9px] font-bold text-indigo-300 transition duration-300 group-hover:bg-indigo-500/20">
        {number}
      </div>

      <p className="text-sm text-slate-300 transition group-hover:text-white">
        {text}
      </p>
    </div>
  );
}

// =====================================================
// FEATURE CARD
// =====================================================

function FeatureCard({ icon, title, description }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/80">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/5 blur-2xl transition duration-500 group-hover:bg-indigo-500/10" />

      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 text-lg text-indigo-600 transition duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white">
          {icon}
        </div>

        <h3 className="mt-5 text-base font-bold text-slate-900">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

        <div className="mt-5 flex items-center gap-1 text-[10px] font-bold text-indigo-600 opacity-0 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100">
          Explore feature →
        </div>
      </div>
    </div>
  );
}

export default Home;
