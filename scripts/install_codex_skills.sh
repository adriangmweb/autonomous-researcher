#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="${ROOT_DIR}/skills"
CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"
TARGET_DIR="${CODEX_HOME_DIR}/skills"

if [[ ! -d "${SKILLS_DIR}" ]]; then
  echo "Skills directory not found: ${SKILLS_DIR}" >&2
  exit 1
fi

mkdir -p "${TARGET_DIR}"

installed=0
for skill_path in "${SKILLS_DIR}"/*; do
  [[ -d "${skill_path}" ]] || continue
  skill_name="$(basename "${skill_path}")"
  ln -sfn "${skill_path}" "${TARGET_DIR}/${skill_name}"
  echo "Installed ${skill_name} -> ${TARGET_DIR}/${skill_name}"
  installed=$((installed + 1))
done

echo "Installed ${installed} skill(s)."
