// ---------------------------------------------------------------------------
// Core types for the Autonomous Researcher knowledge base
// ---------------------------------------------------------------------------

/** Every tracked artifact prefix in the system */
export type ArtifactPrefix =
  | "T"
  | "H"
  | "E"
  | "F"
  | "L"
  | "FT"
  | "INV"
  | "IMP"
  | "RET"
  | "CR"
  | "SR";

/** Maps each prefix to its kb/ sub-directory (relative to kb root) */
export const ARTIFACT_DIRS: Record<ArtifactPrefix, string> = {
  T: "tasks",
  H: "research/hypotheses",
  E: "research/experiments",
  F: "research/findings",
  L: "research/literature",
  FT: "engineering/features",
  INV: "engineering/investigations",
  IMP: "engineering/implementations",
  RET: "engineering/retrospectives",
  CR: "reports",
  SR: "reports",
};

/** Human-readable label for each prefix */
export const ARTIFACT_LABELS: Record<ArtifactPrefix, string> = {
  T: "Task",
  H: "Hypothesis",
  E: "Experiment",
  F: "Finding",
  L: "Literature",
  FT: "Feature",
  INV: "Investigation",
  IMP: "Implementation",
  RET: "Retrospective",
  CR: "Challenge Review",
  SR: "Strategic Review",
};

// --- Statuses ---------------------------------------------------------------

export type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED";
export type HypothesisStatus = "PROPOSED" | "TESTING" | "CONFIRMED" | "REJECTED";
export type ExperimentStatus = "DESIGNED" | "RUNNING" | "COMPLETED" | "FAILED";
export type FeatureStatus = "PROPOSED" | "INVESTIGATING" | "IN PROGRESS" | "DELIVERED" | "ITERATING";
export type InvestigationStatus = "IN PROGRESS" | "COMPLETED";
export type ImplementationStatus = "IN PROGRESS" | "DELIVERED" | "NEEDS ITERATION";
export type FindingImpact = "HIGH" | "MEDIUM" | "LOW";
export type LiteratureType = "PAPER" | "BLOG" | "REPO" | "BENCHMARK" | "SURVEY";
export type Priority = "P0" | "P1" | "P2" | "P3";
export type TaskType = "research" | "engineering";

/** Union of all possible status values */
export type AnyStatus = string;

// --- Color maps -------------------------------------------------------------

export type StatusColor = {
  bg: string;
  text: string;
};

export const STATUS_COLORS: Record<string, StatusColor> = {
  // Not started
  BACKLOG: { bg: "bg-stone-100", text: "text-stone-600" },
  PROPOSED: { bg: "bg-stone-100", text: "text-stone-600" },
  DESIGNED: { bg: "bg-stone-100", text: "text-stone-600" },
  // Queued
  TODO: { bg: "bg-blue-50", text: "text-blue-600" },
  INVESTIGATING: { bg: "bg-blue-50", text: "text-blue-600" },
  // Active
  IN_PROGRESS: { bg: "bg-blue-100", text: "text-blue-700" },
  "IN PROGRESS": { bg: "bg-blue-100", text: "text-blue-700" },
  TESTING: { bg: "bg-blue-100", text: "text-blue-700" },
  RUNNING: { bg: "bg-blue-100", text: "text-blue-700" },
  // Success
  DONE: { bg: "bg-emerald-50", text: "text-emerald-700" },
  COMPLETED: { bg: "bg-emerald-50", text: "text-emerald-700" },
  CONFIRMED: { bg: "bg-emerald-50", text: "text-emerald-700" },
  DELIVERED: { bg: "bg-emerald-50", text: "text-emerald-700" },
  // Attention
  BLOCKED: { bg: "bg-red-50", text: "text-red-700" },
  FAILED: { bg: "bg-red-50", text: "text-red-700" },
  REJECTED: { bg: "bg-red-50", text: "text-red-700" },
  // Rework
  "NEEDS ITERATION": { bg: "bg-amber-50", text: "text-amber-700" },
  ITERATING: { bg: "bg-amber-50", text: "text-amber-700" },
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  P0: "text-red-600",
  P1: "text-orange-500",
  P2: "text-blue-500",
  P3: "text-stone-400",
};

export const TYPE_COLORS: Record<TaskType, { bg: string; text: string }> = {
  research: { bg: "bg-violet-50", text: "text-violet-700" },
  engineering: { bg: "bg-teal-50", text: "text-teal-700" },
};

export const IMPACT_COLORS: Record<FindingImpact, { bg: string; text: string }> = {
  HIGH: { bg: "bg-red-50", text: "text-red-700" },
  MEDIUM: { bg: "bg-amber-50", text: "text-amber-700" },
  LOW: { bg: "bg-stone-100", text: "text-stone-500" },
};

// --- Artifact data shapes ---------------------------------------------------

/** Summary used in list views */
export interface ArtifactSummary {
  id: string;           // e.g. "T001", "H002"
  prefix: ArtifactPrefix;
  idNum: number;
  title: string;
  filename: string;
  metadata: Record<string, string>;
  mtime: Date;
}

/** Full artifact with body content */
export interface Artifact extends ArtifactSummary {
  sections: Record<string, string>; // keyed by ## heading
  raw: string;
}

// --- Mission types ----------------------------------------------------------

export interface Challenge {
  raw: string;
  metadata: Record<string, string>;
  sections: Record<string, string>;
  isSet: boolean;
}

export interface BacklogTask {
  id: string;
  task: string;
  status: string;
  priority: string;
  type: string;
  linked: string;
}

export interface Backlog {
  lastUpdated: string;
  lastIds: Record<string, number>;
  tasks: BacklogTask[];
}

export interface Decision {
  number: string;
  date: string;
  type: string;
  decision: string;
  summary: string;
}

// --- Activity ---------------------------------------------------------------

export interface ActivityEntry {
  id: string;
  prefix: ArtifactPrefix;
  title: string;
  mtime: Date;
  status?: string;
}

// --- Traceability -----------------------------------------------------------

/** Upstream/downstream references parsed from metadata */
export interface ArtifactRelations {
  task?: string;
  hypothesis?: string;
  experiment?: string;
  feature?: string;
  investigation?: string;
  implementation?: string;
  challengeReview?: string;
}

/**
 * Extract known reference fields from artifact metadata.
 */
export function extractRelations(metadata: Record<string, string>): ArtifactRelations {
  return {
    task: metadata["Task"],
    hypothesis: metadata["Hypothesis"],
    experiment: metadata["Experiment"],
    feature: metadata["Feature"],
    investigation: metadata["Investigation"],
    implementation: metadata["Implementation"],
    challengeReview: metadata["Challenge Review"],
  };
}

// --- Active statuses (for dashboard "in progress" panel) --------------------

const ACTIVE_STATUSES = new Set([
  "IN_PROGRESS",
  "IN PROGRESS",
  "TESTING",
  "RUNNING",
]);

export function isActiveStatus(status: string | undefined): boolean {
  if (!status) return false;
  return ACTIVE_STATUSES.has(status.toUpperCase());
}

export function isBlockedStatus(status: string | undefined): boolean {
  if (!status) return false;
  return status.toUpperCase() === "BLOCKED";
}
