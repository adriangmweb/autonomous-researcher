// ---------------------------------------------------------------------------
// Filesystem reader for kb/ artifacts
// Runs server-side only (uses Node fs).
// ---------------------------------------------------------------------------

import fs from "fs/promises";
import path from "path";
import {
  type Artifact,
  type ArtifactPrefix,
  type ArtifactSummary,
  ARTIFACT_DIRS,
  type ActivityEntry,
  type Backlog,
  type Challenge,
  type Decision,
} from "./types";
import {
  parseArtifact,
  parseBacklog,
  parseChallenge,
  parseDecisions,
  matchesPrefix,
} from "./parser";

// ---------------------------------------------------------------------------
// Resolve the kb root — defaults to ../kb relative to the project
// ---------------------------------------------------------------------------

function kbRoot(): string {
  const envRoot = process.env.KB_ROOT;
  if (envRoot) {
    return path.isAbsolute(envRoot)
      ? envRoot
      : path.resolve(/* turbopackIgnore: true */ process.cwd(), envRoot);
  }
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), "../kb");
}

function missionPath(file: string): string {
  return path.join(kbRoot(), "mission", file);
}

function artifactDir(prefix: ArtifactPrefix): string {
  return path.join(kbRoot(), ARTIFACT_DIRS[prefix]);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function readFile(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getMtime(filePath: string): Promise<Date> {
  try {
    const stat = await fs.stat(filePath);
    return stat.mtime;
  } catch {
    return new Date(0);
  }
}

// ---------------------------------------------------------------------------
// Mission file readers
// ---------------------------------------------------------------------------

export async function getChallenge(): Promise<Challenge> {
  const content = await readFile(missionPath("CHALLENGE.md"));
  return parseChallenge(content);
}

export async function getBacklog(): Promise<Backlog> {
  const content = await readFile(missionPath("BACKLOG.md"));
  return parseBacklog(content);
}

export async function getDecisions(): Promise<Decision[]> {
  const content = await readFile(missionPath("DECISIONS.md"));
  return parseDecisions(content);
}

export async function getCeoRequests(): Promise<string> {
  return readFile(missionPath("CEO_REQUESTS.md"));
}

// ---------------------------------------------------------------------------
// Artifact readers
// ---------------------------------------------------------------------------

/**
 * List all artifacts of a given prefix, sorted by ID.
 */
export async function listArtifacts(prefix: ArtifactPrefix): Promise<ArtifactSummary[]> {
  const dir = artifactDir(prefix);
  if (!(await fileExists(dir))) return [];

  const files = await fs.readdir(dir);
  const artifacts: ArtifactSummary[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    if (!matchesPrefix(file, prefix)) continue;

    const filePath = path.join(dir, file);
    const [content, mtime] = await Promise.all([
      readFile(filePath),
      getMtime(filePath),
    ]);
    const parsed = parseArtifact(content, file, prefix, mtime);
    // Return summary (without raw/sections)
    artifacts.push({
      id: parsed.id,
      prefix: parsed.prefix,
      idNum: parsed.idNum,
      title: parsed.title,
      filename: parsed.filename,
      metadata: parsed.metadata,
      mtime: parsed.mtime,
    });
  }

  return artifacts.sort((a, b) => a.idNum - b.idNum);
}

/**
 * Get a single artifact by prefix and ID string (e.g. "T001").
 */
export async function getArtifact(
  prefix: ArtifactPrefix,
  id: string,
): Promise<Artifact | null> {
  const dir = artifactDir(prefix);
  if (!(await fileExists(dir))) return null;

  const files = await fs.readdir(dir);
  const target = files.find((f) => f.startsWith(id + "-") && f.endsWith(".md"));
  if (!target) return null;

  const filePath = path.join(dir, target);
  const [content, mtime] = await Promise.all([
    readFile(filePath),
    getMtime(filePath),
  ]);
  return parseArtifact(content, target, prefix, mtime);
}

/**
 * Get all artifacts across all prefixes. Useful for dashboard aggregation.
 */
export async function listAllArtifacts(): Promise<ArtifactSummary[]> {
  const prefixes: ArtifactPrefix[] = [
    "T", "H", "E", "F", "L", "FT", "INV", "IMP", "RET", "CR", "SR",
  ];
  const results = await Promise.all(prefixes.map(listArtifacts));
  return results.flat();
}

/**
 * Get recent activity — all artifacts sorted by modification time (newest first).
 */
export async function getRecentActivity(limit = 15): Promise<ActivityEntry[]> {
  const all = await listAllArtifacts();
  return all
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
    .slice(0, limit)
    .map((a) => ({
      id: a.id,
      prefix: a.prefix,
      title: a.title,
      mtime: a.mtime,
      status: a.metadata["Status"],
    }));
}

/**
 * Resolve the URL path for an artifact detail page.
 */
export function artifactUrl(prefix: ArtifactPrefix, id: string): string {
  const routes: Record<ArtifactPrefix, string> = {
    T: "/tasks",
    H: "/research/hypotheses",
    E: "/research/experiments",
    F: "/research/findings",
    L: "/research/literature",
    FT: "/engineering/features",
    INV: "/engineering/investigations",
    IMP: "/engineering/implementations",
    RET: "/engineering/retrospectives",
    CR: "/reviews",
    SR: "/reviews",
  };
  return `${routes[prefix]}/${id}`;
}
