#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lifecycle helper for /cc-next task state automation."""
from __future__ import annotations

import argparse
import datetime
import pathlib
import re
import sys
from typing import List, Optional, Tuple

STATUS_START = "状态: 开始新任务"
STATUS_IN_PROGRESS = "状态: 进行中"
STATUS_WAITING = "状态: 等待测试"
STATUS_DONE = "状态: 完成"

PROGRESS_STAGE_PREFIX = "Current Stage: "
PROGRESS_STATUS_PREFIX = "Status: "
PROGRESS_NEXT_PREFIX = "Next Task: "

EVIDENCE_HEADER = "## Evidence & Attachments"

TASK_PATTERN = re.compile(
    r"^(?P<prefix>- \[(?P<tick>[ x])\] )(?P<num>\d+)\. (?P<body>.*?状态: )(?P<state>[^ ]+)(?P<tail>.*)$"
)


def state_word(text: str) -> str:
    return text.split(": ", 1)[1] if ": " in text else text


def utc_now() -> str:
    return datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")


def load_lines(path: pathlib.Path) -> List[str]:
    return path.read_text(encoding="utf-8").splitlines()


def write_lines(path: pathlib.Path, lines: List[str]) -> None:
    text = "\n".join(lines) + "\n"
    path.write_text(text, encoding="utf-8")


def strip_quotes(value: str) -> str:
    value = value.strip()
    if value in {"", "null", "~"}:
        return ""
    if value.startswith(("'", '"')) and value.endswith(("'", '"')):
        return value[1:-1]
    return value


def read_flow_pointer(project_path: pathlib.Path) -> Tuple[str, str, Optional[str]]:
    feature = session_id = last_task = ""
    in_current = False
    for raw in load_lines(project_path):
        line = raw.rstrip()
        if line.strip().startswith("current:"):
            in_current = True
            continue
        if in_current:
            if line and not line.startswith(" ") and not line.startswith("\t"):
                break
            stripped = line.strip()
            if stripped.startswith("feature:"):
                feature = strip_quotes(stripped.split(":", 1)[1])
            elif stripped.startswith("session_id:"):
                session_id = strip_quotes(stripped.split(":", 1)[1])
            elif stripped.startswith("last_task:"):
                last_task = strip_quotes(stripped.split(":", 1)[1])
    if not feature or not session_id:
        raise SystemExit("flow.current 缺少 feature/session_id，无法执行状态更新")
    return feature, session_id, last_task or None


def update_flow_last_task(project_path: pathlib.Path, task_number: int) -> None:
    lines = load_lines(project_path)
    in_current = False
    for idx, raw in enumerate(lines):
        if raw.strip().startswith("current:"):
            in_current = True
            continue
        if in_current:
            if raw and not raw.startswith(" ") and not raw.startswith("\t"):
                break
            if raw.strip().startswith("last_task:"):
                indent = raw.split("last_task:", 1)[0]
                lines[idx] = f"{indent}last_task: {task_number}"
                write_lines(project_path, lines)
                return
    raise SystemExit("未找到 flow.current.last_task 字段，无法写入任务编号")


def find_task_line(lines: List[str], expected_state: str, target_num: Optional[int]) -> Tuple[int, re.Match[str]]:
    target_word = state_word(expected_state)
    for idx, line in enumerate(lines):
        match = TASK_PATTERN.match(line)
        if not match:
            continue
        num = int(match.group("num"))
        state = match.group("state")
        if target_num is not None and num != target_num:
            continue
        if state == target_word:
            return idx, match
    raise SystemExit(
        f"未找到处于 {expected_state} 的任务" + (f"（编号 {target_num}）" if target_num else "")
    )


def count_tasks(lines: List[str]) -> Tuple[int, int]:
    total = completed = 0
    for line in lines:
        match = TASK_PATTERN.match(line)
        if not match:
            continue
        total += 1
        if match.group("tick") == "x":
            completed += 1
    return total, completed


def next_pending_task(lines: List[str]) -> Optional[int]:
    start_word = state_word(STATUS_START)
    for line in lines:
        match = TASK_PATTERN.match(line)
        if not match:
            continue
        if match.group("tick") == " " and match.group("state") == start_word:
            return int(match.group("num"))
    return None


def update_progress(lines: List[str], current_task: int, stage_label: str, total: int, completed: int) -> None:
    percent = int(round(completed * 100.0 / total)) if total else 0
    for idx, line in enumerate(lines):
        if line.startswith(PROGRESS_STAGE_PREFIX):
            lines[idx] = f"{PROGRESS_STAGE_PREFIX}任务{current_task} {stage_label}"
        elif line.startswith(PROGRESS_STATUS_PREFIX):
            lines[idx] = f"{PROGRESS_STATUS_PREFIX}{completed}/{total} ({percent}%)"
    upcoming = next_pending_task(lines)
    for idx, line in enumerate(lines):
        if line.startswith(PROGRESS_NEXT_PREFIX):
            if upcoming is None:
                lines[idx] = f"{PROGRESS_NEXT_PREFIX}全部任务已完成"
            else:
                lines[idx] = f"{PROGRESS_NEXT_PREFIX}任务{upcoming} {STATUS_START}"
            break


def rewrite_task_line(lines: List[str], idx: int, match: re.Match[str], new_state: str, tick: Optional[str]) -> None:
    number = match.group("num")
    body = match.group("body")
    tail = match.group("tail")
    mark = tick if tick is not None else match.group("tick")
    lines[idx] = f"- [{'x' if mark == 'x' else ' '}] {number}. {body}{new_state}{tail}"


def append_timeline(session_path: pathlib.Path, task_number: int, stage_label: str, tail: str) -> None:
    lines = load_lines(session_path)
    insert_at = None
    for idx, line in enumerate(lines):
        if line.strip() == EVIDENCE_HEADER:
            insert_at = idx
            break
    if insert_at is None:
        raise SystemExit("session.md 缺少 Evidence 区块，无法写入时间线")
    suffix = tail.rstrip()
    entry_tail = suffix if suffix else ""
    entry = f"- {utc_now()} 任务 {task_number} 状态: {stage_label}{entry_tail}"
    if entry in lines:
        return
    lines.insert(insert_at, entry)
    write_lines(session_path, lines)


def stage_to_state(stage: str) -> Tuple[str, str, str]:
    if stage == "start":
        return STATUS_START, state_word(STATUS_IN_PROGRESS), "进行中"
    if stage == "await":
        return STATUS_IN_PROGRESS, state_word(STATUS_WAITING), "等待测试"
    if stage == "complete":
        return STATUS_WAITING, state_word(STATUS_DONE), "完成"
    raise ValueError(stage)


def ensure_state(current_state: str, expected: str, task_desc: str) -> None:
    if current_state != state_word(expected):
        raise SystemExit(f"任务{task_desc} 当前状态为 {current_state}，无法执行该阶段（期望 {expected}）")


def main() -> None:
    parser = argparse.ArgumentParser(description="自动维护 /cc-next 任务状态")
    parser.add_argument("--stage", required=True, choices=["start", "await", "complete"], help="要执行的阶段")
    parser.add_argument("--task", type=int, help="指定任务编号；默认自动推断")
    parser.add_argument("--project", default=".specs/project.yml")
    parser.add_argument("--features-root", default=".specs/features")
    args = parser.parse_args()

    project_path = pathlib.Path(args.project)
    feature, session_id, _ = read_flow_pointer(project_path)

    tasks_path = pathlib.Path(args.features_root) / feature / "tasks.md"
    session_path = pathlib.Path(args.features_root) / feature / "sessions" / session_id / "session.md"
    if not tasks_path.exists() or not session_path.exists():
        raise SystemExit("找不到任务或会话文件，请确认会话已经初始化")

    lines = load_lines(tasks_path)
    total, completed = count_tasks(lines)

    expected, next_state_word, stage_label = stage_to_state(args.stage)

    idx, match = find_task_line(lines, expected, args.task)
    task_number = int(match.group("num"))
    ensure_state(match.group("state"), expected, str(task_number))

    new_tick = None
    if args.stage == "complete":
        new_tick = "x"
        completed += 1

    rewrite_task_line(lines, idx, match, next_state_word, new_tick)
    update_progress(lines, task_number, stage_label, total, completed)
    write_lines(tasks_path, lines)

    append_timeline(session_path, task_number, stage_label, match.group("tail"))

    if args.stage == "start":
        update_flow_last_task(project_path, task_number)

    print(f"任务{task_number} 已更新至 状态: {stage_label}")


if __name__ == "__main__":
    try:
        main()
    except SystemExit as exc:
        if exc.code:
            print(exc, file=sys.stderr)
            sys.exit(exc.code)
        raise