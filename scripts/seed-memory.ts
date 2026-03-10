/**
 * Seed default HAM knowledge into ~/.agent-os/memory-ham.db
 * Run once: npx tsx scripts/seed-memory.ts
 */

import dotenv from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { mkdirSync } from 'node:fs';

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

import { TieredStore } from '../packages/core/src/memory/tiered-store.js';

const DB_PATH = process.env['DB_PATH']?.replace('~', homedir()) ?? resolve(homedir(), '.agent-os', 'memory.db');
mkdirSync(resolve(homedir(), '.agent-os'), { recursive: true });

const SEED_CHUNKS = [
  {
    topic: 'agentOS-overview',
    L0: 'AgentOS: open-source AI agent, multi-channel, HAM memory, MIT',
    L1: 'AgentOS is an open-source personal AI agent with hierarchical memory (HAM), multi-LLM routing, and multi-channel access (CLI, Discord, Web API).',
    L2: 'AgentOS is a TypeScript/Node.js AI agent system built as a Turborepo monorepo. It features HAM (Hierarchical Adaptive Memory) for token-efficient context, smart routing between Claude and Gemini, MCP tool support, and runs on CLI, Discord, and HTTP/SSE. 100% self-hosted, MIT licensed, SQLite-only storage.',
    L3: 'AgentOS is a fully open-source AI agent platform built with TypeScript 5.7 strict, Node.js, and organized as a Turborepo monorepo with 5 packages: shared (types/config), core (engine/memory/LLM), cli (REPL), discord (bot), web (Hono HTTP+SSE API), and ui (Next.js dashboard). The core innovation is HAM — a 4-level memory compression system that reduces token usage by ~82% vs naive full-context approaches. It supports Claude (Anthropic) and Gemini (Google) with intelligent auto-routing, MCP (Model Context Protocol) tool servers, built-in tools (web_fetch, bash, read_file, write_file), named agent profiles, and hot-reloading skill files. All data stored in SQLite with WAL mode — no external database required.',
    tags: ['overview', 'features', 'open-source', 'architecture'],
  },
  {
    topic: 'ham-memory',
    L0: 'HAM: 4-level compression, state machine routing, 400-token budget, 82% savings',
    L1: 'HAM compresses knowledge to L0 (8 tokens), L1 (35 tokens), L2 (150 tokens), L3 (500+ tokens). A regex state machine picks the right depth — total budget 400 tokens.',
    L2: 'Hierarchical Adaptive Memory (HAM) stores each topic at 4 compression levels. A zero-cost regex state machine detects conversation state (INTRO, PROBLEM, SOLUTION, DEEP_DIVE, CTA, FEATURES, GENERAL) and maps it to a retrieval depth. Routine questions load L1 (35 tokens); deep technical queries load L3 (500+ tokens). Active memory is capped at 400 tokens with access-weighted pruning. Result: ~82% fewer tokens vs naive full-context.',
    L3: 'Full HAM specification: Knowledge chunks are compressed using Gemini Flash in parallel (L0/L1/L2 in Promise.all). L0 is an 8-token headline always in memory. L1 is a 35-token summary loaded for INTRO/GENERAL/CTA states. L2 is a 150-token detail for PROBLEM/SOLUTION/FEATURES. L3 is 500+ token raw content for DEEP_DIVE. The StateRouter is a regex state machine (7 states, no LLM calls, ~0ms). HAMRetriever scores topics by keyword (+2) and tag (+1) overlap, loads at the right depth, prunes by access frequency if over budget. Compression is cached by SHA-256 hash. Skills are auto-ingested on startup.',
    tags: ['memory', 'ham', 'tokens', 'compression', 'state-machine'],
  },
  {
    topic: 'llm-routing',
    L0: 'Routing: cc:→Claude, g:→Gemini, auto=Gemini Flash classifies',
    L1: 'Prefix cc: forces Claude, g: forces Gemini. In auto mode, Gemini Flash classifies the message and picks the best model at near-zero cost.',
    L2: 'LLM routing has 3 modes: (1) Prefix — cc: routes to Claude, g: routes to Gemini, prefix stripped before sending. (2) Auto — Gemini Flash classifies the message: complex reasoning/code → Claude, quick questions/summaries → Gemini. (3) Force — set DEFAULT_MODEL=claude or DEFAULT_MODEL=gemini in .env. Classification adds ~50ms but saves 30-50% on API costs.',
    L3: 'Full routing documentation: LLMRouter accepts an IClassifier interface (enables mock injection for tests). stripPrefix() extracts cc: or g: prefix. If present, routes directly. If DEFAULT_MODEL env var is set, overrides auto. Otherwise calls Gemini Flash with a system prompt that returns "claude" or "gemini". Routes: complex reasoning, code generation, long-form analysis → Claude (claude-sonnet-4-6). Quick factual answers, summaries, classification, short Q&A → Gemini (gemini-2.0-flash). This routing cuts average API spend by 30-50% vs always using Claude Sonnet.',
    tags: ['routing', 'claude', 'gemini', 'llm', 'cost'],
  },
  {
    topic: 'cli-commands',
    L0: 'CLI commands: /help /clear /model /skills /memory /exit',
    L1: 'Available commands: /help, /clear (reset history), /model <claude|gemini|auto>, /skills (list), /memory list|stats|add, /exit.',
    L2: 'CLI REPL commands: /help — show all commands. /clear — clears conversation history for current session. /model <name> — switch LLM (claude, gemini, auto). /skills — list all loaded skill files with character counts. /memory list — show all HAM knowledge topics with L0 headlines. /memory stats — show token usage, access counts, last accessed timestamps. /memory add <topic> <content> — compress and store new knowledge via Gemini Flash. /exit — quit the agent. Prefix messages with cc: (Claude) or g: (Gemini) to force a model per-message.',
    L3: 'Full CLI documentation: Start with npm run cli from the repo root (or node packages/cli/dist/index.js). The REPL uses readline with SIGINT handling. Conversation persists in SQLite at DB_PATH (~/.agent-os/memory.db by default). Each CLI session creates a new conversation keyed by process PID. Skills are loaded from SKILLS_DIR (~/.claude/skills by default) on startup and hot-reload when files change (chokidar watch). Named agents can be loaded with --agent <name> flag from AGENTS_DIR. The --model flag sets the default model for the session.',
    tags: ['cli', 'commands', 'repl', 'usage'],
  },
  {
    topic: 'installation-quickstart',
    L0: 'Install: clone, npm install, add API key to .env, npm run build, npm run cli',
    L1: 'Clone repo, npm install, copy .env.example → .env, add ANTHROPIC_API_KEY or GOOGLE_API_KEY, npm run build, then npm run cli.',
    L2: 'Quick start: (1) git clone https://github.com/ajstars1/agent-os && cd agent-os. (2) npm install. (3) cp .env.example .env — add at minimum ANTHROPIC_API_KEY (Claude) or GOOGLE_API_KEY (Gemini). (4) npm run build. (5) npm run cli to start the REPL. For Discord: add DISCORD_TOKEN + DISCORD_CLIENT_ID to .env, then npm run dev:discord. For web API: npm run dev:web (port 3000). For dashboard: npm run dev:ui (port 3002).',
    L3: 'Full installation: Prerequisites: Node.js 18+. Steps: git clone https://github.com/ajstars1/agent-os.git, cd agent-os, npm install (installs all 5 workspace packages). Copy .env.example to .env. Required: ANTHROPIC_API_KEY for Claude, GOOGLE_API_KEY for Gemini (at least one required). Run npm run build to compile TypeScript for all packages. Run npm run cli for the interactive REPL. For seeding default knowledge: npm run seed-memory. For the benchmark: npm run benchmark. For the web dashboard: start both npm run dev:web and npm run dev:ui. The UI connects to the API at NEXT_PUBLIC_API_URL (default: http://localhost:3000).',
    tags: ['install', 'setup', 'quickstart', 'getting-started'],
  },
  {
    topic: 'mcp-tools',
    L0: 'MCP: JSON-RPC 2.0 stdio + 4 builtins: web_fetch, bash, read_file, write_file',
    L1: 'Supports MCP (Model Context Protocol) tool servers over stdio. Built-in tools: web_fetch, bash (sandboxed), read_file, write_file (path-jailed).',
    L2: 'MCP integration uses JSON-RPC 2.0 over child_process stdio. Configure servers in .mcp.json at project root. Each entry has command + args. Built-in tools: web_fetch(url) — HTTP GET with text extraction. bash(command) — runs in sandboxed mkdtemp dir. read_file(path) — reads file, jailed to ALLOWED_DIRS. write_file(path, content) — writes file, jailed to ALLOWED_DIRS. Tools are auto-registered with the LLM and invoked automatically when needed.',
    L3: 'Full MCP documentation: MCPClient spawns a child process and communicates over stdin/stdout using JSON-RPC 2.0. On connect(), sends initialize + tools/list. ToolRegistry stores definitions + handlers. callTool() checks builtin handlers first, then routes to MCP clients. Builtin tools: web_fetch fetches URL and extracts text (up to maxLength chars); bash creates mkdtemp sandbox per invocation and cleans up; read_file validates path against ALLOWED_DIRS env var (empty = unrestricted); write_file same path validation. Configure .mcp.json: { "servers": { "name": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path"] } } }.',
    tags: ['mcp', 'tools', 'bash', 'filesystem', 'protocol'],
  },
];

async function seed(): Promise<void> {
  process.stdout.write(`\nSeeding HAM knowledge to ${DB_PATH}\n\n`);

  const store = new TieredStore(DB_PATH);
  let added = 0;
  let skipped = 0;

  for (const chunk of SEED_CHUNKS) {
    const existing = store.getByTopic(chunk.topic);
    if (existing) {
      process.stdout.write(`  \x1b[2mskip\x1b[0m  ${chunk.topic}\n`);
      skipped++;
      continue;
    }

    store.addChunk({
      ...chunk,
      lastAccessed: 0,
      accessCount: 0,
    });
    process.stdout.write(`  \x1b[32madd\x1b[0m   ${chunk.topic}\n`);
    added++;
  }

  process.stdout.write(`\n  ${added} added, ${skipped} already existed\n`);
  process.stdout.write(`  Run \x1b[36mnpm run cli\x1b[0m and try \x1b[36m/memory list\x1b[0m\n\n`);

  store.close();
}

seed().catch((err: unknown) => {
  process.stderr.write(String(err instanceof Error ? err.stack : err) + '\n');
  process.exit(1);
});
