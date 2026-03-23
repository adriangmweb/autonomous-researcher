// ---------------------------------------------------------------------------
// Markdown parser for kb/ artifacts
// Ported from scripts/kb_validate.py — same regex, same semantics.
// ---------------------------------------------------------------------------

import type { Artifact, ArtifactPrefix, BacklogTask, Backlog, Challenge, Decision } from "./types";

// Regex ported from kb_validate.py line 35
const META_RE = /^>\s+\*\*(.+?)\*\*:\s*(.+?)\s*$/;
const HTML_COMMENT_RE = /<!--[\s\S]*?-->/g;
const HEADING_RE = /^##\s+(.+)$/;
const FILENAME_RES: Record<ArtifactPrefix, RegExp> = {
  T: /^T(\d{3})-.+\.md$/,
  H: /^H(\d{3})-.+\.md$/,
  E: /^E(\d{3})-.+\.md$/,
  F: /^F(\d{3})-.+\.md$/,
  L: /^L(\d{3})-.+\.md$/,
  FT: /^FT(\d{3})-.+\.md$/,
  INV: /^INV(\d{3})-.+\.md$/,
  IMP: /^IMP(\d{3})-.+\.md$/,
  RET: /^RET(\d{3})-.+\.md$/,
  CR: /^CR(\d{3})-.+\.md$/,
  SR: /^SR(\d{3})-.+\.md$/,
};

/**
 * Extract blockquote metadata from markdown content.
 * Matches lines like: > **Key**: Value
 */
export function parseMetadata(text: string): Record<string, string> {
  const metadata: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const match = META_RE.exec(line.trim());
    if (match) {
      metadata[match[1].trim()] = match[2].trim();
    }
  }
  return metadata;
}

/**
 * Extract the # title from markdown.
 */
export function parseTitle(text: string): string {
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("# ") && !trimmed.startsWith("## ")) {
      // Remove the artifact ID prefix if present (e.g. "# T001 — Title" → "Title")
      const raw = trimmed.slice(2).trim();
      const dashMatch = raw.match(/^[A-Z]+\d{3}\s*[—–-]\s*(.+)$/);
      return dashMatch ? dashMatch[1].trim() : raw;
    }
  }
  return "Untitled";
}

/**
 * Split markdown into sections keyed by ## headings.
 * Content before the first ## heading is keyed as "_preamble".
 */
export function parseSections(text: string): Record<string, string> {
  const cleaned = text.replace(HTML_COMMENT_RE, "");
  const sections: Record<string, string> = {};
  let currentKey = "_preamble";
  let currentLines: string[] = [];

  for (const line of cleaned.split("\n")) {
    const headingMatch = HEADING_RE.exec(line.trim());
    if (headingMatch) {
      // Save previous section
      sections[currentKey] = currentLines.join("\n").trim();
      currentKey = headingMatch[1].trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  // Save last section
  sections[currentKey] = currentLines.join("\n").trim();

  return sections;
}

/**
 * Parse a full artifact file into structured data.
 */
export function parseArtifact(
  content: string,
  filename: string,
  prefix: ArtifactPrefix,
  mtime: Date,
): Artifact {
  const re = FILENAME_RES[prefix];
  const fileMatch = re.exec(filename);
  const idNum = fileMatch ? parseInt(fileMatch[1], 10) : 0;
  const id = `${prefix}${String(idNum).padStart(3, "0")}`;

  return {
    id,
    prefix,
    idNum,
    title: parseTitle(content),
    filename,
    metadata: parseMetadata(content),
    sections: parseSections(content),
    raw: content,
    mtime,
  };
}

/**
 * Check if a filename matches a given artifact prefix pattern.
 */
export function matchesPrefix(filename: string, prefix: ArtifactPrefix): boolean {
  return FILENAME_RES[prefix].test(filename);
}

// ---------------------------------------------------------------------------
// Mission file parsers
// ---------------------------------------------------------------------------

/**
 * Parse CHALLENGE.md
 */
export function parseChallenge(content: string): Challenge {
  const metadata = parseMetadata(content);
  const sections = parseSections(content);
  const isSet = !content.includes("NOT SET") && !content.includes("Not assigned yet");
  return { raw: content, metadata, sections, isSet };
}

/**
 * Parse BACKLOG.md — extract Last IDs and task table rows.
 */
export function parseBacklog(content: string): Backlog {
  const metadata = parseMetadata(content);
  const lastUpdated = metadata["Last updated"] || "";

  // Parse Last IDs line: > T: 000 | H: 000 | ...
  const lastIds: Record<string, number> = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith(">")) continue;
    const inner = trimmed.replace(/^>\s*/, "");
    if (!inner.includes("T:")) continue;
    for (const part of inner.split("|")) {
      const [key, val] = part.split(":").map((s) => s.trim());
      if (key && val !== undefined) {
        const num = parseInt(val, 10);
        if (!isNaN(num)) lastIds[key] = num;
      }
    }
    break;
  }

  // Parse task table
  const tasks: BacklogTask[] = [];
  let inTasks = false;
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (line === "## Tasks") { inTasks = true; continue; }
    if (!inTasks) continue;
    if (!line) continue;
    if (line.startsWith("## ")) break;
    if (!line.startsWith("|")) continue;
    const columns = line
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());
    if (!columns[0] || columns[0] === "ID" || columns[0].startsWith("---")) continue;
    if (columns.length < 6) continue;
    tasks.push({
      id: columns[0],
      task: columns[1],
      status: columns[2],
      priority: columns[3],
      type: columns[4],
      linked: columns[5],
    });
  }

  return { lastUpdated, lastIds, tasks };
}

/**
 * Parse DECISIONS.md — extract the decision table + detail entries.
 */
export function parseDecisions(content: string): Decision[] {
  const decisions: Decision[] = [];
  let inTable = false;
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (line.startsWith("| #") || line.startsWith("| ID")) {
      inTable = true;
      continue;
    }
    if (!inTable) continue;
    if (!line.startsWith("|")) { inTable = false; continue; }
    const columns = line
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());
    if (!columns[0] || columns[0].startsWith("---")) continue;
    if (columns.length < 4) continue;
    decisions.push({
      number: columns[0],
      date: columns[1],
      type: columns[2],
      decision: columns[3],
      summary: columns[4] || columns[3],
    });
  }
  return decisions;
}
