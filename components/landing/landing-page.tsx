import {
  Activity,
  BarChart3,
  BellRing,
  Brain,
  CheckCircle2,
  Code2,
  DatabaseZap,
  Mail,
  Menu,
  Repeat2,
  Share2,
  Sparkles,
  Terminal,
  Wallet,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const problemCards = [
    {
      icon: Code2,
      title: "Raw Complexity",
      description:
        "Parsing operations, effects, and trades manually takes weeks of development. Mistakes lead to financial reporting errors.",
    },
    {
      icon: Activity,
      title: "Zero Context",
      description:
        "Simple transfers do not tell you if it is a subscription, a refund, or internal liquidity. We provide the semantic layer.",
    },
    {
      icon: Zap,
      title: "Indexing Lag",
      description:
        "Keeping your own database in sync with Stellar Core is resource-intensive and prone to downtime.",
    },
  ];

  const featureCards = [
    {
      icon: BarChart3,
      title: "Transaction Intelligence",
      description:
        "Auto-categorized ledger entries with metadata enrichment for every operation.",
      className: "md:col-span-3 bg-surface",
      tags: ["Merchant Detection", "Asset Valuation"],
    },
    {
      icon: Brain,
      title: "AI Insights",
      description:
        "Predictive analytics that forecasts user churn and identifies high-value wallet behavior patterns.",
      className: "md:col-span-3 bg-primary text-on-primary",
      featured: true,
    },
    {
      icon: Wallet,
      title: "Wallet Analytics",
      description:
        "Deep-dive into balance history, token distribution, and portfolio risk scores.",
      className: "md:col-span-2 bg-surface-container-lowest",
    },
    {
      icon: Repeat2,
      title: "Recurring Detection",
      description:
        "Identify and track subscription-like behavior across Stellar accounts automatically.",
      className: "md:col-span-2 bg-surface-container-lowest",
    },
    {
      icon: BellRing,
      title: "Webhooks",
      description:
        "Event triggers for transfers, recurring payments, anomaly detection, and portfolio changes.",
      className: "md:col-span-2 bg-surface-container-lowest",
    },
    {
      icon: Terminal,
      title: "Developer APIs",
      description:
        "High-performance REST and GraphQL endpoints for real-time and historical data retrieval.",
      className: "md:col-span-2 bg-surface-container-lowest",
    },
  ];

  const chartBars = [40, 60, 45, 80, 30, 65, 50, 95, 55, 40, 70, 48];

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface">
      <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface px-margin-mobile shadow-sm md:px-24">
        <div className="flex items-center gap-8">
          <a
            href="#top"
            className="font-headline-md text-headline-md font-bold text-primary"
          >
            Strelligence
          </a>
          <div className="hidden items-center gap-6 md:flex">
            {["Features", "Docs", "API", "Sign In"].map((item) => (
              <a
                key={item}
                className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
                href={
                  item === "Features"
                    ? "#features"
                    : item === "API"
                      ? "#api"
                      : "#docs"
                }
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-[5px] bg-primary-container px-4 py-2 font-label-md text-label-md text-on-primary shadow-sm transition-transform active:scale-95 sm:px-6">
            <Wallet className="size-[18px]" />
            <span className="hidden sm:inline">Connect Wallet</span>
          </button>
          <button
            aria-label="Open navigation"
            className="grid size-10 place-items-center text-on-surface md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </nav>

      <main
        id="top"
        className="mx-auto px-margin-mobile py-12 md:px-24"
      >
        <section className="mb-24 grid min-h-[716px] grid-cols-1 items-center gap-gutter lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary-fixed px-3 py-1 font-label-sm text-label-sm text-on-secondary-fixed-variant">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Now powering 200+ Stellar apps
            </div>
            <h1 className="max-w-2xl font-display-lg text-display-lg-mobile text-on-surface md:text-display-lg">
              Financial Intelligence Infrastructure for{" "}
              <span className="text-primary">Stellar Applications.</span>
            </h1>
            <p className="max-w-xl text-body-md text-on-surface-variant">
              Strelligence decodes the complexity of ledger data into actionable
              financial insights. Build high-fidelity dashboards and AI-driven
              apps in minutes.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#docs"
                className="rounded-[5px] bg-primary px-8 py-3 text-center font-label-md text-label-md text-on-primary shadow-md transition-opacity hover:opacity-90"
              >
                Get Started
              </a>
              <a
                href="#api"
                className="rounded-[5px] border border-outline-variant bg-surface px-8 py-3 text-center font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-low"
              >
                View API Docs
              </a>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <DashboardPreview />
            <div className="absolute -bottom-6 -left-6 -z-10 size-32 bg-primary-fixed opacity-20 blur-3xl" />
          </div>
        </section>

        <section className="mb-24 overflow-hidden rounded-xl bg-surface-container-low px-6 py-16 md:px-8">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              The Data Barrier
            </h2>
            <p className="mx-auto max-w-2xl text-body-md text-on-surface-variant">
              Raw blockchain data is noisy, unstructured, and difficult to
              translate into business logic. We bridge that gap.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
            {problemCards.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="group rounded-lg border border-outline-variant bg-surface-container-lowest p-8 transition-colors hover:border-primary"
              >
                <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-surface-container-high text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mb-3 font-title-sm text-title-sm text-on-surface">
                  {title}
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-24" id="features">
          <h2 className="mb-16 text-center font-headline-md text-headline-md text-on-surface">
            The Intelligent Infrastructure
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
            {featureCards.map(
              ({ icon: Icon, title, description, className, tags, featured }) => (
                <article
                  key={title}
                  className={`relative overflow-hidden rounded-xl border border-outline-variant p-8 ${className}`}
                >
                  <div className="relative z-10">
                    <Icon
                      className={`mb-4 size-7 ${
                        featured ? "text-on-primary" : "text-secondary"
                      }`}
                    />
                    <h3
                      className={`mb-2 font-title-sm text-title-sm ${
                        featured ? "text-on-primary" : "text-on-surface"
                      }`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`text-body-sm ${
                        featured
                          ? "text-on-primary/90"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {description}
                    </p>
                    {tags ? (
                      <div className="mt-8 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-surface-container-high px-3 py-1 text-label-sm text-on-surface"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  {featured ? (
                    <Sparkles className="absolute -bottom-10 -right-8 size-40 text-on-primary opacity-20" />
                  ) : null}
                </article>
              ),
            )}
          </div>
        </section>

        <section className="mb-24" id="api">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Built by developers,
                <br />
                for developers.
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Integrate Strelligence into your existing stack with just a few
                lines of code. Our SDKs handle the heavy lifting of Stellar
                ledger interaction.
              </p>
              <ul className="space-y-4">
                {[
                  "Typed TypeScript/Node.js SDK",
                  "Webhook triggers for all events",
                  "CORS-enabled for frontend direct access",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-primary" />
                    <span className="text-body-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <CodeBlock
                title="GET /api/v1/wallets/GABC.../insights"
                code={`{
  "address": "GABC...XYZ",
  "intelligence": {
    "persona": "DEX_POWER_USER",
    "recurring_payments": [
      { "id": "sub_4f2a", "amount": "12.99", "freq": "monthly" }
    ],
    "risk_score": 0.04
  },
  "updated_at": "2026-05-17T14:32:00Z"
}`}
              />
              <CodeBlock
                title="POST /webhooks/stellar.events"
                compact
                code={`strelligence.webhooks.on("recurring_payment.detected", async (event) => {
  await notifyTeam(event.wallet, event.amount, event.frequency);
});`}
              />
            </div>
          </div>
        </section>

        <section className="mb-24">
          <div className="glass-card overflow-hidden rounded-xl p-6 md:p-10">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-4">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Cashflow Visualization
                </h2>
                <p className="text-body-sm leading-relaxed text-on-surface-variant">
                  Turn static ledger entries into dynamic cashflow charts.
                  Strelligence automatically identifies inbound revenue versus
                  outbound operational costs.
                </p>
                <div className="flex items-center gap-6 border-t border-outline-variant pt-4">
                  <Metric label="Processing" value="14.2k ops/sec" />
                  <Metric label="Latency" value="< 80ms" />
                </div>
              </div>
              <div className="lg:col-span-8">
                <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
                  <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h3 className="font-label-md text-label-md text-on-surface">
                      Transaction Velocity (30d)
                    </h3>
                    <div className="flex gap-4">
                      <Legend color="bg-primary" label="Revenue" />
                      <Legend color="bg-secondary" label="Ops" />
                    </div>
                  </div>
                  <div className="flex h-48 items-end justify-between gap-2">
                    {chartBars.map((height, index) => (
                      <div
                        key={`${height}-${index}`}
                        className={`chart-bar w-full origin-bottom rounded-t-sm ${
                          index === 4 || index === 8
                            ? "bg-secondary/40"
                            : index % 3 === 0
                              ? "bg-primary/50"
                              : "bg-primary/20"
                        }`}
                        style={{
                          height: `${height}%`,
                          animationDelay: `${index * 45}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-24 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <InsightCard
            title="Recurring Payments"
            value="$48.9k"
            description="Monthly detected recurring revenue across 1,204 active wallets."
          />
          <InsightCard
            title="Monthly Trends"
            value="+18.4%"
            description="Net wallet activity growth compared with the previous 30-day period."
          />
          <InsightCard
            title="AI Insights"
            value="92"
            description="High-confidence opportunities surfaced from real-time behavior models."
          />
        </section>

        <section className="py-24 text-center" id="docs">
          <div className="mx-auto max-w-3xl space-y-8">
            <h2 className="font-display-lg text-display-lg-mobile text-on-surface md:text-display-lg">
              Ready to build the future of finance?
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Join the developers and businesses building institutional-grade
              financial apps on Stellar with Strelligence.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <a
                href="#api"
                className="w-full rounded-[5px] bg-primary px-10 py-4 font-label-md text-label-md text-on-primary shadow-lg transition-all hover:shadow-xl sm:w-auto"
              >
                Start Building
              </a>
              <a
                href="#api"
                className="w-full rounded-[5px] border border-outline bg-surface px-10 py-4 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-high sm:w-auto"
              >
                Read Documentation
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-outline-variant bg-surface-container-low py-16">
        <div className="mx-auto grid max-w-container-max grid-cols-1 gap-12 px-margin-mobile md:grid-cols-4 md:px-margin-desktop">
          <div className="space-y-4">
            <span className="font-headline-md text-headline-md font-bold text-primary">
              Strelligence
            </span>
            <p className="text-body-sm text-on-surface-variant">
              The intelligence layer for the Stellar Network.
            </p>
            <div className="flex gap-4 pt-4">
              <a
                href="#top"
                className="text-on-surface-variant transition-colors hover:text-primary"
              >
                <Share2 className="size-5" />
              </a>
              <a
                href="#top"
                className="text-on-surface-variant transition-colors hover:text-primary"
              >
                <Mail className="size-5" />
              </a>
              <a
                href="#top"
                className="text-on-surface-variant transition-colors hover:text-primary"
              >
                <Code2 className="size-5" />
              </a>
            </div>
          </div>
          <FooterLinks
            title="Product"
            links={["Features", "API Reference", "Pricing", "Changelog"]}
          />
          <FooterLinks
            title="Developers"
            links={["Docs", "Status", "SDKs", "Github"]}
          />
          <FooterLinks
            title="Company"
            links={["About", "Contact", "Privacy", "Terms"]}
          />
        </div>
        <div className="mx-auto mt-16 flex max-w-container-max flex-col justify-between gap-4 border-t border-outline-variant px-margin-mobile pt-8 text-label-sm text-on-surface-variant opacity-60 md:flex-row md:px-margin-desktop">
          <p>© 2026 Strelligence Inc. All rights reserved.</p>
          <p>Designed for the Stellar Ecosystem.</p>
        </div>
      </footer>
    </div>
  );
}

function DashboardPreview() {
  const bars = [42, 28, 52, 34, 74, 46, 58, 36, 81, 63, 45, 70, 38, 88, 56];

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-dashboard">
      <div className="flex items-center gap-2 border-b border-outline-variant bg-surface-container-low px-4 py-2">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-error opacity-40" />
          <span className="size-3 rounded-full bg-secondary opacity-40" />
          <span className="size-3 rounded-full bg-primary opacity-40" />
        </div>
      </div>
      <div className="dashboard-grid bg-[#061114] p-8 sm:p-12">
        <div className="mx-auto rounded-xl border border-white/10 bg-[#102429]/90 p-5 shadow-2xl shadow-primary/20">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="font-mono text-[11px] text-white/50">
                Portfolio Flow Distribution
              </p>
              <h3 className="mt-1 font-title-sm text-title-sm text-white">
                Stellar Treasury Intelligence
              </h3>
            </div>
            <span className="rounded-full bg-secondary/30 px-3 py-1 font-mono text-[10px] text-secondary-container">
              LIVE
            </span>
          </div>
          <div className="mb-5 grid grid-cols-3 gap-3">
            {["Revenue", "Subscriptions", "Risk"].map((label, index) => (
              <div
                key={label}
                className="rounded border border-white/10 bg-white/5 p-3"
              >
                <p className="font-mono text-[10px] text-white/40">{label}</p>
                <p className="mt-1 font-mono text-sm text-white">
                  {index === 0 ? "$128.4k" : index === 1 ? "1,204" : "0.04"}
                </p>
              </div>
            ))}
          </div>
          <div className="flex h-44 items-end gap-1 border-t border-white/10 pt-6">
            {bars.map((height, index) => (
              <span
                key={`${height}-${index}`}
                className={`chart-bar flex-1 origin-bottom rounded-t-sm ${
                  index % 4 === 0 ? "bg-secondary-container" : "bg-primary-fixed-dim"
                }`}
                style={{
                  height: `${height}%`,
                  animationDelay: `${index * 35}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeBlock({
  title,
  code,
  compact = false,
}: {
  title: string;
  code: string;
  compact?: boolean;
}) {
  return (
    <div className="code-block rounded-xl p-5 shadow-xl md:p-6">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-2">
        <span className="font-label-sm text-label-sm text-white/40">{title}</span>
        <div className="flex gap-2">
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/20" />
        </div>
      </div>
      <pre
        className={`overflow-x-auto whitespace-pre text-[13px] leading-relaxed text-white/90 ${
          compact ? "text-[12px]" : ""
        }`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-label-sm text-on-surface-variant">{label}</p>
      <p className="font-title-sm text-title-sm text-primary">{value}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2 text-label-sm text-on-surface">
      <span className={`size-3 rounded-sm ${color}`} />
      {label}
    </span>
  );
}

function InsightCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8">
      <DatabaseZap className="mb-5 size-7 text-primary" />
      <p className="mb-2 font-label-md text-label-md text-on-surface-variant">
        {title}
      </p>
      <p className="mb-4 font-display-lg text-4xl font-bold text-primary">
        {value}
      </p>
      <p className="text-body-sm text-on-surface-variant">{description}</p>
    </article>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="mb-6 font-label-md text-label-md text-on-surface">{title}</h3>
      <ul className="space-y-4 text-body-sm text-on-surface-variant">
        {links.map((link) => (
          <li key={link}>
            <a href="#top" className="transition-colors hover:text-primary">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
