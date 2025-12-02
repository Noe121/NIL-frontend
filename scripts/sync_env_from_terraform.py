#!/usr/bin/env python3
"""
Utility script that syncs frontend .env values with Terraform outputs.

Usage:
  python scripts/sync_env_from_terraform.py \
      --env-dir ../NILbx-env/environments/dev \
      --env-file .env.production
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, Iterable, Tuple

ROOT = Path(__file__).resolve().parents[1]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Update frontend environment files using Terraform outputs."
    )
    default_env_dir = ROOT.parent / "NILbx-env" / "environments" / "dev"
    parser.add_argument(
        "--env-dir",
        type=Path,
        default=default_env_dir,
        help="Path to the Terraform environment directory (default: %(default)s)",
    )
    parser.add_argument(
        "--env-file",
        type=Path,
        default=ROOT / ".env.production",
        help="Path to the env file to update (default: %(default)s)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the values that would be written without modifying the env file.",
    )
    return parser.parse_args()


def run_terraform_output(env_dir: Path) -> Dict[str, Dict[str, str]]:
    try:
        result = subprocess.run(
            ["terraform", "output", "-json"],
            cwd=env_dir,
            check=True,
            capture_output=True,
            text=True,
        )
    except FileNotFoundError as exc:
        raise SystemExit("terraform executable not found in PATH") from exc
    except subprocess.CalledProcessError as exc:
        error = exc.stderr.strip() or exc.stdout.strip() or "unknown error"
        raise SystemExit(f"terraform output failed: {error}") from exc

    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise SystemExit(f"failed to parse terraform output JSON: {exc}") from exc


def lookup_output(
    outputs: Dict[str, Dict[str, str]], candidates: Iterable[str]
) -> str:
    for key in candidates:
        data = outputs.get(key)
        if data:
            if isinstance(data, dict) and "value" in data:
                return str(data["value"]).rstrip("/")
            return str(data).rstrip("/")
    raise KeyError(f"None of the output keys were found: {', '.join(candidates)}")


def build_env_values(outputs: Dict[str, Dict[str, str]]) -> Dict[str, str]:
    base_url = lookup_output(outputs, ("api_gateway_invoke_url", "api_base_url"))

    def make_url(*parts: str) -> str:
        return "/".join([base_url.rstrip("/")] + [p.strip("/") for p in parts if p])

    return {
        "VITE_API_URL": base_url,
        "VITE_AUTH_SERVICE_URL": make_url("auth"),
        "VITE_COMPANY_API_URL": make_url("api", "company"),
        "VITE_ANALYTICS_SERVICE_URL": make_url("analytics"),
        "VITE_CHECKIN_SERVICE_URL": make_url("checkin"),
        "VITE_DELIVERABLE_SERVICE_URL": make_url("deliverable"),
        "VITE_MARKETING_MATERIALS_SERVICE_URL": make_url("marketing-materials"),
        "VITE_MEDIA_UPLOAD_SERVICE_URL": make_url("media-upload"),
        "VITE_SOCIAL_VERIFICATION_SERVICE_URL": make_url("social-verification"),
        "VITE_BLOCKCHAIN_SERVICE_URL": make_url("blockchain"),
    }


def update_env_file(env_file: Path, updates: Dict[str, str], dry_run: bool) -> None:
    existing_lines = env_file.read_text().splitlines() if env_file.exists() else []
    updated_lines = []
    applied_keys = set()

    for line in existing_lines:
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in line:
            updated_lines.append(line)
            continue

        key, _, current_value = line.partition("=")
        key = key.strip()
        if key in updates:
            updated_value = updates[key]
            updated_lines.append(f"{key}={updated_value}")
            applied_keys.add(key)
        else:
            updated_lines.append(line)

    for key, value in updates.items():
        if key not in applied_keys:
            updated_lines.append(f"{key}={value}")

    if dry_run:
        print("🔍 Dry run: the following values would be written:")
        for key in updates:
            print(f"{key}={updates[key]}")
        return

    env_file.write_text("\n".join(updated_lines) + "\n")
    print(f"✅ Updated {env_file} with {len(updates)} Terraform-derived values.")


def main() -> None:
    args = parse_args()
    env_dir = args.env_dir.resolve()
    env_file = args.env_file.resolve()

    if not env_dir.exists():
        raise SystemExit(f"Terraform directory not found: {env_dir}")

    outputs = run_terraform_output(env_dir)
    env_values = build_env_values(outputs)
    update_env_file(env_file, env_values, args.dry_run)

    print("✨ Current values:")
    for key, value in env_values.items():
        print(f"  {key} = {value}")


if __name__ == "__main__":
    try:
        main()
    except KeyError as exc:
        raise SystemExit(str(exc)) from exc
