# OS NEXUS — Verification record

Build date: 22 October 2026. This is a verified local release candidate, not a verified live GitHub Pages deployment.

## Executed automated checks

`npm test`: **43 tests passed**. The tests check:

- 43 core lessons across six lecture domains and populated learning templates.
- 28 official questions with unique stable IDs and the exact 6/10/12 assignment distribution; PA2 scenario subparts preserved.
- 36 generated objective questions in the requested 16/8/6/6 distribution, valid answer indices and populated explanations.
- Three labs, 27 substantive sections, valid practical-quiz mappings.
- Source identity resolution, lesson/PA associations and coverage references.
- All six valid standard process transitions, invalid transitions and terminal-state behavior.
- Linux start/STOP/CONT/TERM lifecycle, absent/wrong PIDs, permission bits, topology/page sizes, unsupported-command rejection.
- Exclusive logical-address limit and base translation boundary examples.
- Correct, wrong and unanswered mock grading; timer boundaries and untimed mode.
- Completion separated from assessed understanding; distinct/repeated-evidence rules.
- JSON progress round-trip for drafts, notes, confidence, bookmarks and active exam; malformed import rejection.
- Study budgets, source-first planning and retrieval reservation.

`npm run build`: **passed** (TypeScript and Vite production build). The app bundle is about 611 kB uncompressed / 192 kB gzip before small final UI additions. Vite reports the normal >500 kB chunk advisory because the complete offline content bank is bundled; this is not a build failure.

Content checks executed during authoring also verified all 28 questions against normalized original source wording, source-key discrepancies, scheduling worked-example arithmetic, question count/IDs and numerical assessment answers. These do not constitute independent instructor certification.

## Executed browser checks

Chromium through the provided browser automation interface, against the local preview:

| Area | Observed result |
|---|---|
| Desktop dashboard | Rendered six domains, correct totals and real activity counts |
| Lesson navigation | Source-grounded lesson, notes, confidence and related PA links rendered |
| Refresh persistence | Completed lesson, saved note and confidence survived reload |
| PA Challenge | Reference reveal disabled before submission; unlocked after a nonempty attempt |
| PA self-assessment | Concept checklist/reference explanations appeared; explicit review action worked |
| PA Exam | No hint button; reference reveal locked during the written attempt |
| Process simulator | New → Ready → Running → Waiting worked; Waiting → Running rejected with explanation |
| System-call journey | Advanced through all eight steps to return/resume |
| Context switch | Advanced through all five steps; P1 context saved and P2 PC/registers restored |
| Linux lifecycle | Start, STOP (T), CONT (S), status inspection and TERM reflected in monitor |
| Timed mock | Six-question attempt started; response and countdown survived reload |
| Mock submission | Confirmation showed five blanks; one correct answer plus five blanks scored 1/6 |
| Diagnostic | Correct feedback appeared and choices locked after checking |
| Practical lab quiz | Lab 3's two questions completed and scored 2/2 |
| Lab completion | Explicit completion action worked |
| Sprint | Two hours with 30-minute blocks generated four blocks |
| Export/import | JSON file downloaded; reimport confirmation and success observed with progress retained |
| Mobile | 390-pixel iframe (375 CSS-pixel content after scrollbar): dashboard, navigation, labs and lab detail had no horizontal overflow |
| Tablet | 768-pixel iframe content width equaled document scroll width |
| Standalone edition | Embedded HTML rendered through HTTP preview; local `file://` opening could not be exercised because the cloud browser only permits HTTP/HTTPS |

The browser logs sampled showed browser-extension metadata errors, not app-origin exceptions. QA activity stays in that test browser; no test progress is bundled in the deliverable.

## Limits and remaining deployment step

- GitHub Pages publication has **not** been executed. Two GitHub accounts are connected; the destination owner must be selected. The connector has no repository-creation operation. The project is prepared for a new `os-nexus` repository, with a manual Pages workflow and no changes to C++ Atlas.
- Actual mobile-device Safari/Chrome testing, cross-browser certification and exhaustive screen-reader auditing were not performed. Responsive checks used a desktop browser iframe with mobile/tablet CSS widths.
- Automatic timer-expiry math was unit-tested; the browser test covered timer persistence and manual submission, not waiting for a full real-time deadline.
- Clear-progress confirmation and malformed-import handling are implemented; no user study data was deleted during browser QA.
- The generated questions and explanations were reviewed against sources and primary documentation. This is not the official exam or official marking scheme.
- The Linux terminal models a documented subset and one child process; it is not a VM or arbitrary shell.
- P2 enhancements such as a full scheduling playground, spaced repetition and advanced statistics are intentionally outside this release.
