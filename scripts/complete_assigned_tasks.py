#!/usr/bin/env python3
"""
Complete all assigned tasks in a web UI, including popup/redirect flows.

This script is intentionally selector-driven so you can adapt it to most task
management UIs without editing code.
"""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from typing import Iterable, Sequence

from playwright.sync_api import Error, Locator, Page, TimeoutError, sync_playwright


@dataclass(frozen=True)
class Config:
    url: str
    email: str | None
    password: str | None
    headless: bool
    max_tasks: int
    timeout_ms: int
    popup_timeout_ms: int
    post_click_wait_ms: int
    task_selectors: Sequence[str]
    complete_selectors: Sequence[str]
    email_selectors: Sequence[str]
    password_selectors: Sequence[str]
    submit_selectors: Sequence[str]
    task_done_markers: Sequence[str]


def parse_csv(value: str) -> list[str]:
    return [part.strip() for part in value.split(",") if part.strip()]


def parse_args() -> Config:
    parser = argparse.ArgumentParser(
        description=(
            "Mark assigned tasks as complete even when clicking a task triggers "
            "a popup or redirect."
        )
    )
    parser.add_argument("--url", required=True, help="Task dashboard URL.")
    parser.add_argument("--email", help="Login email (optional).")
    parser.add_argument("--password", help="Login password (optional).")
    parser.add_argument(
        "--headed",
        action="store_true",
        help="Run with visible browser (debug mode).",
    )
    parser.add_argument(
        "--max-tasks",
        type=int,
        default=500,
        help="Safety stop after N completions (default: 500).",
    )
    parser.add_argument(
        "--timeout-ms",
        type=int,
        default=15000,
        help="Default selector/navigation timeout in milliseconds.",
    )
    parser.add_argument(
        "--popup-timeout-ms",
        type=int,
        default=2500,
        help="How long to wait for popup after clicking a task.",
    )
    parser.add_argument(
        "--post-click-wait-ms",
        type=int,
        default=800,
        help="Extra settle time after clicks in milliseconds.",
    )
    parser.add_argument(
        "--task-selectors",
        default=(
            '[data-testid="assigned-task"], '
            '.assigned-task, '
            'li.task.assigned, '
            'tr.task.assigned'
        ),
        help="Comma-separated selectors for assigned/open task rows/cards.",
    )
    parser.add_argument(
        "--complete-selectors",
        default=(
            '[data-testid="mark-complete"], '
            'button:has-text("Mark complete"), '
            'button:has-text("Complete"), '
            'button:has-text("Done"), '
            '[aria-label*="complete" i]'
        ),
        help="Comma-separated selectors for completion action buttons.",
    )
    parser.add_argument(
        "--email-selectors",
        default='input[type="email"], input[name="email"], #email',
        help="Comma-separated login email field selectors.",
    )
    parser.add_argument(
        "--password-selectors",
        default='input[type="password"], input[name="password"], #password',
        help="Comma-separated login password field selectors.",
    )
    parser.add_argument(
        "--submit-selectors",
        default=(
            'button[type="submit"], '
            'button:has-text("Sign in"), '
            'button:has-text("Log in"), '
            'input[type="submit"]'
        ),
        help="Comma-separated login submit button selectors.",
    )
    parser.add_argument(
        "--task-done-markers",
        default=(
            '[data-status="completed"], '
            '.task-completed, '
            '.status-complete, '
            'text=/completed|done/i'
        ),
        help="Comma-separated selectors/text markers that indicate completion.",
    )

    args = parser.parse_args()
    if (args.email and not args.password) or (args.password and not args.email):
        parser.error("Provide both --email and --password together.")

    return Config(
        url=args.url,
        email=args.email,
        password=args.password,
        headless=not args.headed,
        max_tasks=args.max_tasks,
        timeout_ms=args.timeout_ms,
        popup_timeout_ms=args.popup_timeout_ms,
        post_click_wait_ms=args.post_click_wait_ms,
        task_selectors=parse_csv(args.task_selectors),
        complete_selectors=parse_csv(args.complete_selectors),
        email_selectors=parse_csv(args.email_selectors),
        password_selectors=parse_csv(args.password_selectors),
        submit_selectors=parse_csv(args.submit_selectors),
        task_done_markers=parse_csv(args.task_done_markers),
    )


def first_visible_locator(page: Page, selectors: Iterable[str]) -> Locator | None:
    for selector in selectors:
        locator = page.locator(selector).first
        if locator.count() > 0 and locator.is_visible():
            return locator
    return None


def click_first_visible(page: Page, selectors: Iterable[str]) -> bool:
    locator = first_visible_locator(page, selectors)
    if not locator:
        return False
    locator.click(force=True)
    return True


def fill_first_visible(page: Page, selectors: Iterable[str], value: str) -> bool:
    locator = first_visible_locator(page, selectors)
    if not locator:
        return False
    locator.fill(value)
    return True


def perform_login(page: Page, config: Config) -> None:
    if not config.email or not config.password:
        return

    email_filled = fill_first_visible(page, config.email_selectors, config.email)
    password_filled = fill_first_visible(page, config.password_selectors, config.password)
    if not email_filled or not password_filled:
        print("Login fields not found; continuing unauthenticated.")
        return

    clicked = click_first_visible(page, config.submit_selectors)
    if not clicked:
        print("Login submit control not found; continuing.")
        return

    page.wait_for_timeout(config.post_click_wait_ms)
    try:
        page.wait_for_load_state("networkidle", timeout=config.timeout_ms)
    except TimeoutError:
        pass


def task_marked_complete(page: Page, markers: Sequence[str]) -> bool:
    for marker in markers:
        locator = page.locator(marker).first
        if locator.count() > 0 and locator.is_visible():
            return True
    return False


def mark_complete_on_page(page: Page, config: Config) -> bool:
    if click_first_visible(page, config.complete_selectors):
        page.wait_for_timeout(config.post_click_wait_ms)
        try:
            page.wait_for_load_state("networkidle", timeout=config.timeout_ms)
        except TimeoutError:
            pass
        return True
    return task_marked_complete(page, config.task_done_markers)


def complete_all_assigned_tasks(config: Config) -> int:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=config.headless)
        context = browser.new_context()
        page = context.new_page()
        page.set_default_timeout(config.timeout_ms)
        page.goto(config.url, wait_until="domcontentloaded", timeout=config.timeout_ms)
        perform_login(page, config)

        completed = 0
        while completed < config.max_tasks:
            task = first_visible_locator(page, config.task_selectors)
            if not task:
                print("No remaining assigned tasks were found.")
                break

            source_url = page.url
            popup_page: Page | None = None
            try:
                with page.expect_popup(timeout=config.popup_timeout_ms) as popup_info:
                    task.click(force=True)
                popup_page = popup_info.value
            except TimeoutError:
                # No popup opened; we continue in the same tab.
                task.click(force=True)
            except Error:
                # If the row became stale, retry next loop.
                page.wait_for_timeout(config.post_click_wait_ms)
                continue

            target = popup_page if popup_page else page
            try:
                target.wait_for_load_state("domcontentloaded", timeout=config.timeout_ms)
            except TimeoutError:
                pass

            did_complete = mark_complete_on_page(target, config)
            if did_complete:
                completed += 1
                print(f"Completed task #{completed}")
            else:
                print("Opened a task but no completion control was found.")

            if popup_page:
                popup_page.close()
                page.bring_to_front()
            elif page.url != source_url:
                try:
                    page.go_back(wait_until="domcontentloaded", timeout=config.timeout_ms)
                except TimeoutError:
                    page.goto(source_url, wait_until="domcontentloaded", timeout=config.timeout_ms)

            page.wait_for_timeout(config.post_click_wait_ms)

        browser.close()
        return completed


def main() -> int:
    config = parse_args()
    count = complete_all_assigned_tasks(config)
    print(f"Finished. Marked {count} task(s) complete.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
