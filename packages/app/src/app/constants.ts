import type { ModelRef, SuggestedPlugin } from "./types";

export const MODEL_PREF_KEY = "openwork.defaultModel";
export const THINKING_PREF_KEY = "openwork.showThinking";
export const VARIANT_PREF_KEY = "openwork.modelVariant";
export const DEMO_MODE_PREF_KEY = "openwork.demoMode";
export const DEMO_SEQUENCE_PREF_KEY = "openwork.demoSequence";
export const LANGUAGE_PREF_KEY = "openwork.language";

export const DEFAULT_MODEL: ModelRef = {
  providerID: "opencode",
  modelID: "big-pickle",
};

export const SUGGESTED_PLUGINS: SuggestedPlugin[] = [
  {
    name: "opencode-scheduler",
    packageName: "opencode-scheduler",
    description: "Run scheduled jobs with the OpenCode scheduler plugin.",
    tags: ["automation", "jobs"],
    installMode: "simple",
  },
  {
    name: "opencode-browser",
    packageName: "@different-ai/opencode-browser",
    description: "Browser automation with a local extension + native host.",
    tags: ["browser", "extension"],
    aliases: ["opencode-browser"],
    installMode: "guided",
    steps: [
      {
        title: "Run the installer",
        description: "Installs the extension + native host and prepares the local broker.",
        command: "bunx @different-ai/opencode-browser@latest install",
        note: "Use npx @different-ai/opencode-browser@latest install if you do not have bunx.",
      },
      {
        title: "Load the extension",
        description:
          "Open chrome://extensions, enable Developer mode, click Load unpacked, and select the extension folder.",
        url: "chrome://extensions",
        path: "~/.opencode-browser/extension",
      },
      {
        title: "Pin the extension",
        description: "Pin OpenCode Browser Automation in your browser toolbar.",
      },
      {
        title: "Add plugin to config",
        description: "Click Add to write @different-ai/opencode-browser into opencode.json.",
      },
    ],
  },
];

export type McpDirectoryInfo = {
  name: string;
  description: string;
  url: string;
  oauth: boolean;
};

import type { WorkspaceTemplate } from "./types";

/**
 * Built-in starter templates that are always available.
 * These are loaded into the template system automatically.
 */
export type BuiltInTemplate = WorkspaceTemplate & {
  isBuiltIn: true;
  icon: "file" | "data" | "prototype" | "folder" | "calendar" | "message";
};

export const BUILT_IN_TEMPLATES: BuiltInTemplate[] = [
  {
    id: "builtin-create-file",
    title: "Create a file",
    description: "Generate documents, scripts, or any file type",
    prompt: "Help me create a new file. What kind of file would you like to create?",
    icon: "file",
    autoRun: false,
    createdAt: 0,
    scope: "global",
    isBuiltIn: true,
  },
  {
    id: "builtin-crunch-data",
    title: "Crunch data",
    description: "Analyze spreadsheets, logs, or datasets",
    prompt: "I need help analyzing some data. Please describe the data you want to analyze or share a file.",
    icon: "data",
    autoRun: false,
    createdAt: 0,
    scope: "global",
    isBuiltIn: true,
  },
  {
    id: "builtin-make-prototype",
    title: "Make a prototype",
    description: "Build quick demos and proof of concepts",
    prompt: "Let's create a prototype. What would you like to build?",
    icon: "prototype",
    autoRun: false,
    createdAt: 0,
    scope: "global",
    isBuiltIn: true,
  },
  {
    id: "builtin-organize-files",
    title: "Organize files",
    description: "Sort, rename, and structure your files",
    prompt: "I'll help you organize your files. Which folder would you like me to work with?",
    icon: "folder",
    autoRun: false,
    createdAt: 0,
    scope: "global",
    isBuiltIn: true,
  },
  {
    id: "builtin-prep-meeting",
    title: "Prep for a meeting",
    description: "Create agendas and talking points",
    prompt: "Let's prepare for your meeting. What's the meeting about and who will attend?",
    icon: "calendar",
    autoRun: false,
    createdAt: 0,
    scope: "global",
    isBuiltIn: true,
  },
  {
    id: "builtin-draft-message",
    title: "Draft a message",
    description: "Write emails, messages, or announcements",
    prompt: "I'll help you draft a message. What would you like to communicate and to whom?",
    icon: "message",
    autoRun: false,
    createdAt: 0,
    scope: "global",
    isBuiltIn: true,
  },
];

export const MCP_QUICK_CONNECT: McpDirectoryInfo[] = [
  {
    name: "Notion",
    description: "Pages, databases, and project docs in sync.",
    url: "https://mcp.notion.com/mcp",
    oauth: true,
  },
  {
    name: "Linear",
    description: "Plan sprints and ship tickets faster.",
    url: "https://mcp.linear.app/mcp",
    oauth: true,
  },
  {
    name: "Sentry",
    description: "Track releases and resolve production errors.",
    url: "https://mcp.sentry.dev/mcp",
    oauth: true,
  },
  
  {
    name: "Stripe",
    description: "Inspect payments, invoices, and subscriptions.",
    url: "https://mcp.stripe.com",
    oauth: true,
  },
  {
    name: "HubSpot",
    description: "CRM notes, companies, and pipeline status.",
    url: "https://mcp.hubspot.com/anthropic",
    oauth: true,
  },
  {
    name: "Context7",
    description: "Search product docs with richer context.",
    url: "https://mcp.context7.com/mcp",
    oauth: false,
  },
];
