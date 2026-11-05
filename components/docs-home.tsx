import Link from "next/link";
import {
  ArrowRight,
  Code,
  Terminal,
  Cpu,
  Shield,
  Zap,
  Layout,
  Box,
  ChevronRight,
  Globe,
} from "lucide-react";
import type { DocsLanguage } from "@/lib/language";
import { GITHUB_URLS } from "@/lib/language";
import { InstallSkillsButton } from "./install-skills-button";
import { GithubDropdown } from "./github-dropdown";

export function DocsHome({ language }: { language: DocsLanguage }) {
  const isPython = language === "python";
  const prefix = isPython ? "/python" : "/docs";
  const github = GITHUB_URLS[language];
  const sdkLink = `${prefix}/sdk/quick-start`;

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1">
          <section className="pt-20 pb-16 px-4 sm:px-6" aria-labelledby="hero-heading">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-signalBlue mb-4">
                MCP Framework · MCP SDK · MCP CLI
              </p>
              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-primary mb-5 font-heading"
              >
                Build Production-Ready
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-text-secondary">
                  MCP Servers
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed font-light">
                {isPython ? (
                  <>
                    NitroStack is a Python framework for building production Model Context Protocol (MCP) servers with Pydantic validation, modular architecture, and static UI widgets.
                  </>
                ) : (
                  <>
                    NitroStack is a TypeScript framework for building production Model Context Protocol (MCP) servers with modular architecture, type-safe tools, and interactive UI widgets. It handles transport protocols, authentication, and execution pipelines so you can focus on building agent capabilities.
                  </>
                )}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
                <Link
                  href={`${prefix}/getting-started/quickstart`}
                  className="w-full sm:w-auto h-12 px-8 inline-flex items-center justify-center bg-fd-foreground text-fd-background font-medium rounded-full hover:opacity-90 transition-opacity"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden />
                </Link>
                <GithubDropdown variant="hero" language={language} />
                <InstallSkillsButton language={language} />
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-medium">
                <Link
                  href="/docs/sdk/sdk-quick-reference"
                  className="inline-flex items-center gap-1.5 text-text-secondary hover:text-signalBlue transition-colors"
                  aria-label="MCP SDK Quick Reference"
                >
                  <Code className="w-4 h-4 opacity-80" aria-hidden />
                  SDK Quick Reference
                </Link>
                <span className="text-border-soft select-none" aria-hidden>
                  ·
                </span>
                <Link
                  href={isPython ? "/docs/cli/cli-commands" : `${prefix}/cli/cli-commands`}
                  className="inline-flex items-center gap-1.5 text-text-secondary hover:text-signalBlue transition-colors"
                  aria-label="MCP CLI Quick Reference"
                >
                  <Terminal className="w-4 h-4 opacity-80" aria-hidden />
                  CLI Quick Reference
                </Link>
              </div>
            </div>
          </section>

          <section className="px-4 sm:px-6 mb-16 sm:mb-24" aria-label="MCP Server code example">
            <div className="max-w-4xl mx-auto">
              <div className="code-block rounded-xl overflow-hidden">
                <div className="code-block-header flex items-center gap-4 h-8 px-3">
                  <div className="flex gap-2" aria-hidden>
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="text-xs font-mono font-bold text-text-primary">
                    {isPython ? "calculator_tools.py" : "user.tools.ts"}
                  </div>
                </div>
                <div className="code-block-body p-4 sm:p-8 overflow-x-auto">
                  {isPython ? <PythonSample /> : <TypeScriptSample />}
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 sm:px-6 mb-16 sm:mb-24" aria-labelledby="features-heading">
            <div className="max-w-6xl mx-auto">
              <h2 id="features-heading" className="sr-only">MCP Framework Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <BentoCard
                  icon={<Shield className="w-5 h-5" aria-hidden />}
                  title={isPython ? "Pydantic-Validated MCP SDK" : "Type-Safe MCP SDK"}
                  description={
                    isPython
                      ? "Runtime validation with Pydantic v2 models. Define tool input_schema once and get typed handlers."
                      : "End-to-end type safety with Zod schemas and TypeScript inference. Build MCP tools and resources with confidence."
                  }
                  className="md:col-span-2"
                />
                <BentoCard
                  icon={<Zap className="w-5 h-5" aria-hidden />}
                  title="Decorator-Based MCP"
                  description="Clean, declarative MCP server architecture inspired by NestJS. Ship agentic AI tools faster."
                />
                <BentoCard
                  icon={<Shield className="w-5 h-5" aria-hidden />}
                  title="MCP Auth Built-in"
                  description="Secure your MCP server with API key, JWT, and OAuth 2.1 auth patterns out of the box."
                />
                <BentoCard
                  icon={<Layout className="w-5 h-5" aria-hidden />}
                  title="UI Components for MCP"
                  description={
                    isPython
                      ? "Bind static HTML widgets with @widget and serve them from widgets/out without a React build."
                      : "Rich widgets for enhanced LLM interactions and data display inside MCP agents."
                  }
                  className="md:col-span-2"
                />
              </div>
            </div>
          </section>

          <section className="px-4 sm:px-6 mb-16 sm:mb-24 border-t border-border-soft pt-16 sm:pt-24" aria-labelledby="toolset-heading">
            <div className="max-w-6xl mx-auto">
              <h2 id="toolset-heading" className="sr-only">MCP CLI, SDK, and Deployment Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                <FeatureColumn
                  icon={<Terminal className="w-5 h-5" aria-hidden />}
                  title="MCP CLI"
                  items={
                    isPython
                      ? ["nitrostack-py init templates", "Hot-reload with nitrostack-py dev", "Pack wheels, not JS bundles"]
                      : ["Instant MCP project scaffolding", "Hot-reload dev server", "Optimized production builds"]
                  }
                  link={`${prefix}/cli/overview`}
                  linkLabel="Explore MCP CLI docs"
                />
                <FeatureColumn
                  icon={<Cpu className="w-5 h-5" aria-hidden />}
                  title="MCP SDK"
                  items={["MCP resource management", "MCP prompt templates", "MCP tool orchestration"]}
                  link={sdkLink}
                  linkLabel="Explore MCP SDK docs"
                />
                <FeatureColumn
                  icon={<Box className="w-5 h-5" aria-hidden />}
                  title="MCP Ecosystem"
                  items={
                    isPython
                      ? ["python-starter, pizzaz, oauth", "Agent skills on init", "In-process test harness"]
                      : ["MCP server templates", "Community MCP plugins", "Testing utilities"]
                  }
                  link={`${prefix}/templates/starter`}
                  linkLabel="Browse MCP templates"
                />
                <FeatureColumn
                  icon={<Globe className="w-5 h-5" aria-hidden />}
                  title="Deploy MCP Servers"
                  items={["Docker support", "Serverless ready", isPython ? "nitrostack-py start" : "Edge compatible"]}
                  link={`${prefix}/deployment/docker`}
                  linkLabel="MCP deployment guide"
                />
              </div>
            </div>
          </section>

          <section className="px-4 sm:px-6 py-16 sm:py-24 border-t border-border-soft bg-background-surface" aria-labelledby="cta-heading">
            <div className="max-w-3xl mx-auto text-center">
              <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 font-heading text-text-primary">
                Ready to build your MCP server?
              </h2>
              <p className="text-text-secondary mb-6 sm:mb-8 text-base sm:text-lg">
                Join thousands of developers building the next generation of agentic AI tools with NitroStack.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  href={isPython ? `${prefix}/getting-started/installation` : `${prefix}/cli/installation`}
                  className="w-full sm:w-auto h-10 px-6 inline-flex items-center justify-center bg-signalBlue text-white font-medium rounded-full hover:bg-blue-600 transition-colors"
                >
                  {isPython ? "Install nitrostack" : "Install MCP CLI"}
                </Link>
                <Link
                  href={isPython ? `${prefix}/getting-started/introduction` : `${prefix}/getting-started/overview`}
                  className="w-full sm:w-auto text-text-muted hover:text-text-primary transition-colors flex items-center justify-center gap-2"
                >
                  Read the docs <ChevronRight className="w-4 h-4" aria-hidden />
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-border-soft py-10 sm:py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="text-sm text-text-muted text-center md:text-left">
              © {new Date().getFullYear()} NitroStack. Open source MCP framework.
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-sm text-text-muted">
              <a href="https://x.com/nitrostackai" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
                X / Twitter
              </a>
              <a href={GITHUB_URLS.typescript} target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
                GitHub (TS)
              </a>
              <a href={GITHUB_URLS.python} target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
                GitHub (Python)
              </a>
              <a href="https://discord.com/invite/vb5n9rjtBR" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">
                Discord
              </a>
            </div>
          </div>
        </footer>
    </div>
  );
}

function TypeScriptSample() {
  return (
    <pre className="font-mono text-xs sm:text-sm leading-relaxed font-bold">
      <code className="block whitespace-pre font-bold text-text-primary">
        <span className="text-fuchsia-700 dark:text-purple-400">import</span>
        {" "}
        {`{ Tool, ExecutionContext }`} <span className="text-fuchsia-700 dark:text-purple-400">from</span>{" "}
        <span className="text-emerald-800 dark:text-green-400">'@nitrostack/core'</span>
        {"\n"}
        <span className="text-fuchsia-700 dark:text-purple-400">import</span> {`{ z }`}{" "}
        <span className="text-fuchsia-700 dark:text-purple-400">from</span>{" "}
        <span className="text-emerald-800 dark:text-green-400">'zod'</span>
        {"\n\n"}
        <span className="text-blue-700 dark:text-blue-400">export class</span>{" "}
        <span className="text-amber-700 dark:text-yellow-300">UserTools</span> {`{`}
        {"\n  "}
        <span className="text-blue-700 dark:text-blue-400">@Tool</span>({`{`}
        {"\n    "}name: <span className="text-emerald-800 dark:text-green-400">'get_user'</span>,
        {"\n    "}description: <span className="text-emerald-800 dark:text-green-400">'Fetch user details'</span>,
        {"\n    "}inputSchema: z.object({`{`}
        {"\n      "}userId: z.string()
        {"\n    "}{`}`})
        {"\n  "}{`}`})
        {"\n  "}
        <span className="text-blue-700 dark:text-blue-400">async</span>{" "}
        <span className="text-amber-700 dark:text-yellow-300">getUser</span>(input: <span className="text-amber-700 dark:text-yellow-300">{`{ userId: string }`}</span>, ctx: <span className="text-amber-700 dark:text-yellow-300">ExecutionContext</span>) {`{`}
        {"\n    "}
        <span className="text-fuchsia-700 dark:text-purple-400">return</span> db.users.find(input.userId);
        {"\n  "}{`}`}
        {"\n"}
        {`}`}
      </code>
    </pre>
  );
}

function PythonSample() {
  return (
    <pre className="font-mono text-xs sm:text-sm leading-relaxed font-bold">
      <code className="block whitespace-pre font-bold text-text-primary">
        <span className="text-fuchsia-700 dark:text-purple-400">from</span> pydantic <span className="text-fuchsia-700 dark:text-purple-400">import</span> BaseModel{"\n"}
        <span className="text-fuchsia-700 dark:text-purple-400">from</span> nitrostack <span className="text-fuchsia-700 dark:text-purple-400">import</span> injectable, tool, ExecutionContext{"\n\n"}
        <span className="text-blue-700 dark:text-blue-400">class</span> <span className="text-amber-700 dark:text-yellow-300">GetUserInput</span>(BaseModel):{"\n"}
        {"    "}user_id: str{"\n\n"}
        <span className="text-blue-700 dark:text-blue-400">@injectable</span>(){"\n"}
        <span className="text-blue-700 dark:text-blue-400">class</span> <span className="text-amber-700 dark:text-yellow-300">UserTools</span>:{"\n"}
        {"    "}
        <span className="text-blue-700 dark:text-blue-400">@tool</span>(name=<span className="text-emerald-800 dark:text-green-400">"get_user"</span>, description=<span className="text-emerald-800 dark:text-green-400">"Fetch user details"</span>, input_schema=GetUserInput){"\n"}
        {"    "}
        <span className="text-blue-700 dark:text-blue-400">async def</span> <span className="text-amber-700 dark:text-yellow-300">get_user</span>(self, input: GetUserInput, context: ExecutionContext):{"\n"}
        {"        "}
        <span className="text-fuchsia-700 dark:text-purple-400">return</span> {`{"id": input.user_id}`}
      </code>
    </pre>
  );
}

function BentoCard({
  icon,
  title,
  description,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl border border-border-panel bg-background-surface hover:border-signalBlue/30 transition-colors ${className}`}
    >
      <div className="w-10 h-10 rounded-lg bg-background-base flex items-center justify-center text-text-primary mb-5 border border-border-soft">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-bold mb-2 text-text-primary font-heading">
        {title}
      </h3>
      <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{description}</p>
    </div>
  );
}

function FeatureColumn({
  icon,
  title,
  items,
  link,
  linkLabel,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  link: string;
  linkLabel: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-text-primary font-bold">
        {icon}
        <h3>{title}</h3>
      </div>
      <ul className="space-y-3 mb-4">
        {items.map((item, i) => (
          <li key={i} className="text-text-secondary text-sm">
            {item}
          </li>
        ))}
      </ul>
      <Link
        href={link}
        className="text-sm font-medium text-signalBlue hover:opacity-80 flex items-center gap-1"
        aria-label={linkLabel}
      >
        Learn more <ArrowRight className="w-3 h-3" aria-hidden />
      </Link>
    </div>
  );
}
