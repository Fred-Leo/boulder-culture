# Engineering audit

Reviewed November 2, 2026 against GitHub `main` at `717d083`. Scope: all 24 HTML documents, both original JavaScript files, both stylesheets, assets and local references, hosting manifest, and documentation.

## Findings and changes

| Finding | Resolution |
| --- | --- |
| Homepage embedded a full duplicate stylesheet | Replaced it with the shared `style.css` link. The shared stylesheet retains the Gatherings-specific spacing rule absent from the old homepage copy. |
| Identical 1,782-character gallery CSS block appeared twice | Removed the redundant copy while retaining the remaining override order. |
| Election expiry logic was copied into 21 pages | Extracted it into a deferred `election.js`; preserved the Colorado date cutoff. |
| Form code loaded on pages without forms | Removed those script references; retained it on the homepage, contact, and get-involved pages. |
| Countdown script was compressed into page markup | Extracted readable `countdown.js`, guarded missing elements, cached digit lookups, and retained interval cleanup. |
| Countdown CSS explicitly set display:grid, potentially overriding native hidden styling | Added `.countdown-digits[hidden]` to ensure the expired clock is hidden. |
| Form script duplicated the recipient URL from HTML | Derives the AJAX URL from the existing form action. Added element guards and restores the original button label after submission. |
| Gallery script was a single compressed line | Expanded it and explicitly guards both required elements. |
| Console/debug statements and JavaScript syntax | None found in the baseline; no fabricated removals. Syntax and debug checks pass after cleanup. |
| README did not describe the current page structure or operational limits | Replaced it with setup, architecture, deployment, decisions, and validation documentation. |

## Verification

- All 24 HTML files pass local target/fragment checks, duplicate ID/attribute checks, and image alt-attribute checks.
- All four resulting JavaScript files pass Node.js syntax checks and contain no console/debug statements.
- Controlled behavior checks pass for Colorado midnight banner expiry, countdown deadline and interval cleanup, and form success, activation-required, timeout, and network failure.
- `git diff --check` passes.
- Existing HTML routes, logo, photos, page content, form destinations, and hosting identity are retained.

## Limits and follow-up

This is a source-level audit with targeted behavior checks, not browser-rendered acceptance testing or a formal accessibility/security certification. No full HTML/CSS standards validator or browser console audit was run. CSS cleanup removes a byte-identical duplicate block; remaining contextual overrides were retained to avoid unverified visual changes. Do not interpret the structural check as full HTML conformance validation.

External links, current election facts, FormSubmit activation/delivery, hosting status, and the external publishing automation were not independently revalidated. No live form was submitted. No deployment was performed as part of this repository preparation.

Retained redirect pages include old preview URLs and legacy activity routes. Their lack of internal inbound links does not establish that external visitors no longer use them. Event content and common headers/footers remain duplicated across HTML pages; generating these from shared data/templates is a future refactor. The live voting page is date-specific and needs editorial maintenance after the election.
