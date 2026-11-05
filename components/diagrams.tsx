/**
 * NitroStack diagrams. One visual language for all of them:
 * a soft panel, white rounded nodes (icon tile, title, one short line),
 * thin connectors, and pill labels only where they add meaning.
 * Pure HTML/CSS (see app/global.css, "Diagrams"): follows light/dark mode
 * and stacks vertically on narrow screens.
 */
import type { ReactNode } from 'react';
import { Activity, AppWindow, Bot, Boxes, Cable, Cloud, FolderGit2, Globe, HeartPulse, Laptop, ListTree, Server, ShieldCheck, Workflow, Wrench } from 'lucide-react';

function Node({ icon, title, sub, tone = 'blue', className = '' }: { icon?: ReactNode; title: string; sub?: string; tone?: 'blue' | 'indigo'; className?: string }) {
  return (
    <div className={`nxd-node ${className}`}>
      {icon ? <span className={`nxd-tile nxd-tile-${tone}`}>{icon}</span> : null}
      <span className="nxd-node-text">
        <span className="nxd-node-title">{title}</span>
        {sub ? <span className="nxd-node-sub">{sub}</span> : null}
      </span>
    </div>
  );
}

function Link({ label }: { label?: string }) {
  return (
    <div className="nxd-link" aria-hidden="true">
      <span className="nxd-line" />
      {label ? <span className="nxd-pill">{label}</span> : null}
    </div>
  );
}

function Frame({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="nxd not-prose">
      {children}
      {caption ? <figcaption className="nxd-caption">{caption}</figcaption> : null}
    </figure>
  );
}

/** How a tool call travels from a client to your handler and back. */
export function RequestFlowDiagram() {
  return (
    <Frame caption="A tool call goes in through the transport and the pipeline; the result comes back the same way.">
      <div className="nxd-flow nxd-flow-stacked">
        <Node icon={<Bot />} title="AI client" sub="Claude, Cursor, ChatGPT" />
        <Link label="tools/call" />
        <Node icon={<Cable />} title="Transport" sub="STDIO or HTTP" tone="indigo" />
        <Link />
        <Node icon={<Workflow />} title="Pipeline" sub="Guards to pipes" tone="indigo" />
        <Link />
        <Node icon={<Wrench />} title="Your handler" sub="Your @Tool method" />
      </div>
      <div className="nxd-return" aria-hidden="true">
        <span className="nxd-line" />
        <span className="nxd-pill">result</span>
      </div>
    </Frame>
  );
}

/** The stages every call passes through, before and after the handler. */
export function PipelineDiagram() {
  return (
    <Frame caption="If a guard returns false, the call stops there and nothing after it runs.">
      <div className="nxd-stage">
        <span className="nxd-stage-label">Before your handler</span>
        <div className="nxd-flow">
          <Node icon={<ShieldCheck />} title="Guards" />
          <Link />
          <Node title="Middleware" />
          <Link />
          <Node title="Interceptors" />
          <Link />
          <Node title="Pipes" />
          <Link />
          <Node icon={<Wrench />} title="Handler" />
        </div>
      </div>
      <div className="nxd-stage">
        <span className="nxd-stage-label">After your handler</span>
        <div className="nxd-flow nxd-flow-short">
          <Node title="Interceptors" />
          <Link />
          <Node title="Exception filters" />
          <Link />
          <Node title="Response" tone="indigo" />
        </div>
      </div>
    </Frame>
  );
}

/** How a server is organized: root module, feature modules, and what they hold. */
export function ArchitectureDiagram() {
  const feature = (name: string) => (
    <div className="nxd-module">
      <span className="nxd-node-title">{name}</span>
      <span className="nxd-module-row">Tools, resources, prompts</span>
      <span className="nxd-module-row nxd-module-row-accent">Services</span>
    </div>
  );
  return (
    <Frame caption="The root module imports feature modules. Each one holds its MCP primitives and the services they use.">
      <div className="nxd-flow">
        <Node icon={<Bot />} title="AI client" />
        <Link label="MCP" />
        <div className="nxd-group">
          <span className="nxd-group-title">
            <Boxes /> AppModule
          </span>
          <div className="nxd-pair">
            {feature('Products module')}
            {feature('Orders module')}
          </div>
        </div>
      </div>
    </Frame>
  );
}

/** STDIO and HTTP side by side, as two identical lanes. */
export function TransportsDiagram() {
  const lane = (name: string, command: string, client: ReactNode, label: string, server: string, accent = false) => (
    <div className={`nxd-lane ${accent ? 'nxd-lane-accent' : ''}`}>
      <span className="nxd-lane-title">{name}</span>
      <code className="nxd-lane-cmd">{command}</code>
      {client}
      <div className="nxd-vlink" aria-hidden="true">
        <span className="nxd-line" />
        <span className="nxd-pill">{label}</span>
      </div>
      <Node icon={<Server />} title="NitroStack server" sub={server} tone="indigo" />
    </div>
  );
  return (
    <Frame caption="The same server code, reached two ways.">
      <div className="nxd-lanes">
        {lane('STDIO', 'npm run dev', <Node icon={<Laptop />} title="Local client" sub="Claude Desktop, Cursor" />, 'starts the process', 'stdin and stdout')}
        {lane('HTTP', 'npm start', <Node icon={<Globe />} title="Remote clients" sub="Web apps, many at once" />, 'POST /mcp', 'localhost:3000/mcp', true)}
      </div>
    </Frame>
  );
}

function VLink({ label }: { label?: string }) {
  return (
    <div className="nxd-vlink" aria-hidden="true">
      <span className="nxd-line" />
      {label ? <span className="nxd-pill">{label}</span> : null}
    </div>
  );
}

/** Dual mode: two kinds of client reach one server process. */
export function DualTransportDiagram() {
  return (
    <Frame caption="One process serves both. Your tools, resources, and prompts are registered once.">
      <div className="nxd-converge nxd-split">
        <Node className="nxd-node-stack" icon={<Laptop />} title="Local client" sub="Starts the server" />
        <Node className="nxd-node-stack" icon={<Globe />} title="Remote clients" sub="Any number at once" />
        <VLink label="stdin / stdout" />
        <VLink label="POST /mcp" />
        <div className="nxd-span">
          <Node icon={<Server />} title="NitroStack server" sub="transport: dual · STDIO, /mcp, /sse, /mcp/health" tone="indigo" />
        </div>
      </div>
    </Frame>
  );
}

/** Where to look, in order, to confirm which transport Studio is using. */
export function VerifyTransportDiagram() {
  return (
    <Frame caption="Check from the outside in: what Studio reports, what it logged, then the server itself.">
      <div className="nxd-flow nxd-flow-stacked">
        <Node icon={<AppWindow />} title="Project card" sub="Transport: STDIO or HTTP" />
        <Link />
        <Node icon={<Cable />} title="Logs, Connection" sub="How Studio connected" tone="indigo" />
        <Link />
        <Node icon={<ListTree />} title="Logs, Traffic" sub="Each request and reply" tone="indigo" />
        <Link />
        <Node icon={<HeartPulse />} title="Health endpoint" sub="GET /mcp/health" />
      </div>
    </Frame>
  );
}

/** NitroStudio at a glance: your server, Studio's three areas, and NitroCloud. */
export function StudioMapDiagram() {
  const area = (name: string, items: string) => (
    <div className="nxd-module">
      <span className="nxd-node-title">{name}</span>
      <span className="nxd-module-row">{items}</span>
    </div>
  );
  return (
    <Frame caption="Studio connects to your server, gives you three areas to work in, and deploys to NitroCloud.">
      <div className="nxd-column">
        <Node icon={<FolderGit2 />} title="Your MCP server" sub="A local project, or a prebuilt server" />
        <VLink label="STDIO or HTTP" />
        <div className="nxd-group">
          <span className="nxd-group-title">
            <Activity /> NitroStudio
          </span>
          <div className="nxd-trio">
            {area('Inspect', 'App Canvas, Tools, Resources, Prompts, Tasks')}
            {area('Agent', 'AI Chat, Compose, Skills')}
            {area('System', 'Test Cases, Health, Logs, Deployments, Authentication')}
          </div>
        </div>
        <VLink label="Deploy" />
        <Node icon={<Cloud />} title="NitroCloud" sub="Your live app, with its own URL" tone="indigo" />
      </div>
    </Frame>
  );
}

/** What `nitrostack-cli dev` starts, and how NitroStudio connects to it. */
export function DevServerDiagram() {
  return (
    <Frame caption="One command starts both processes. NitroStudio, a separate app, connects to them.">
      <div className="nxd-converge nxd-split">
        <div className="nxd-span">
          <Node icon={<Laptop />} title="nitrostack-cli dev" sub="npm run dev" />
        </div>
        <VLink label="starts" />
        <VLink label="starts" />
        <Node className="nxd-node-stack" icon={<Server />} title="MCP server" sub="STDIO, TypeScript watch, reloads on save" tone="indigo" />
        <Node className="nxd-node-stack" icon={<AppWindow />} title="Widget server" sub="Next.js dev on port 3001, hot reload" tone="indigo" />
        <VLink label="STDIO" />
        <VLink label="localhost:3001" />
        <div className="nxd-span">
          <Node icon={<Activity />} title="NitroStudio" sub="Connects to the server and renders its widgets" />
        </div>
      </div>
    </Frame>
  );
}
