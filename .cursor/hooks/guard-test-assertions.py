#!/usr/bin/env python3
"""Block test edits that weaken assertions (fewer or commented-out expect() calls)."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path


def is_test_file(file_path: str) -> bool:
    normalized = file_path.replace("\\", "/")
    match = re.search(r"(^|/)tests/.+\.(spec|test)\.[jt]sx?$", normalized)
    return match is not None


def active_expect_count(content: str) -> int:
    count = 0
    for line in content.splitlines():
        stripped = line.strip()
        if stripped.startswith("//") or stripped.startswith("*"):
            continue
        comment_idx = line.find("//")
        code = line[:comment_idx] if comment_idx >= 0 else line
        count += code.count("expect(")
    return count


def reconstruct_before(after: str, edits: list[dict]) -> str | None:
    before = after
    for edit in reversed(edits):
        new_string = edit.get("new_string", "")
        old_string = edit.get("old_string", "")
        if new_string:
            if new_string not in before:
                return None
            before = before.replace(new_string, old_string, 1)
        elif old_string and old_string not in before:
            before = before + old_string
        else:
            return None
    return before


def expect_delta_from_edits(edits: list[dict]) -> int:
    delta = 0
    for edit in edits:
        old_string = edit.get("old_string", "")
        new_string = edit.get("new_string", "")
        delta += active_expect_count(old_string) - active_expect_count(new_string)
    return delta


def main() -> None:
    raw = sys.stdin.read()
    if not raw.strip():
        sys.stderr.write("guard-test-assertions: empty stdin\n")
        sys.exit(1)

    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as exc:
        sys.stderr.write(f"guard-test-assertions: invalid JSON: {exc}\n")
        sys.exit(1)

    file_path = payload.get("file_path", "")
    if not file_path or not is_test_file(file_path):
        sys.exit(0)

    path = Path(file_path)
    if not path.is_file():
        sys.stderr.write(f"guard-test-assertions: file not found: {file_path}\n")
        sys.exit(1)

    after = path.read_text(encoding="utf-8")
    edits = payload.get("edits") or []
    after_count = active_expect_count(after)

    if not edits:
        sys.exit(0)

    reconstructed = reconstruct_before(after, edits)
    edit_delta = expect_delta_from_edits(edits)
    before_count = (
        active_expect_count(reconstructed)
        if reconstructed is not None
        else after_count + edit_delta
    )

    if after_count < before_count:
        message = (
            f"Blocked: test assertions weakened in {path.name}\n"
            f"  active expect( count: {before_count} -> {after_count}\n"
            f"  Do not delete or comment out assertions to make tests pass. "
            f"Fix the app, locator, or test data instead."
        )
        sys.stderr.write(message + "\n")
        print(
            json.dumps(
                {
                    "user_message": message,
                    "agent_message": message,
                }
            )
        )
        sys.exit(2)

    sys.stderr.write(
        f"guard-test-assertions: OK — {after_count} active expect( preserved in {path.name}\n"
    )
    sys.exit(0)


if __name__ == "__main__":
    main()
