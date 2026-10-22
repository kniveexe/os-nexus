# OS NEXUS 2.0

A local-first INCS102 Operating Systems study platform, based on the six unique lecture PDFs selected by the student, PA1–3 and Labs1–3. The sources are organized by title, not invented lecture numbers. The study date is Saturday, 24 October 2026; the uploaded Crash Guide lists an 11:30–13:30 window, while the screenshot recalls an approximate question format. Both are attributed guidance, not a verified official blueprint.

## Open immediately

Extract this package and open `START_OS_NEXUS.html` in a modern desktop browser. The app, learning content and styles are embedded. This edition uses system fonts and needs no server for lessons, questions or simulations. Source links require Google Drive access. Keep `coverage-manifest.json` beside the HTML to use the manifest download.

Browser policies determine storage availability for `file://` pages. If the browser reports a storage error, export your progress before closing, or use the local server instructions below. The standalone file and a deployed site do not automatically share progress: transfer it with Settings → Export/Import.

## Development and local server

Use Node.js 24 (or a version supported by the locked Vite dependency).

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite. Then:

```sh
npm test
npm run build
node scripts/standalone.mjs
```

`dist/` is the deployable site. `START_OS_NEXUS.html` is the generated single-file edition. Do not edit compiled files; edit `src/` and rebuild.

## Included

- 43 substantive lessons across Foundations, Services, Processes, Threads, Scheduling and Concurrency.
- 28 complete official questions: PA1 6, PA2 10, PA3 12. Alternative PA1 is separately linked because it duplicates PA3.
- Progressive hints, preserved written drafts, Learn/Challenge/Exam modes, reference explanations and explicit checklist-based self-assessment.
- Three labs, 27 sections and 59 illustrative command examples; short practical quizzes.
- 36 independently authored assessments: 16 MCQ, 8 true/false, 6 single-choice scenarios and 6 lab-output questions.
- Mixed diagnostics, configurable mock length and optional timer, submission confirmation, scoring, topic breakdown, answer review and mistake tracking.
- Four core simulations: process state machine, system-call/interrupt journey, PCB/context switching and Linux process lifecycle. Additional required lab visualizers cover Unix permissions and CPU topology.
- Explicit completion, separate assessed understanding, confidence, bookmarks, notes, study planning, quick review, export/import and clear-progress confirmation.
- Source-linked coverage manifest, responsive desktop/tablet/mobile layout, keyboard-operable native controls and reduced-motion support.

## Project layout

- `src/data/*.json`: curriculum, assignments, labs, assessments and source references.
- `src/logic.ts`: pure assessment, progress validation, planning and simulation logic.
- `src/store.tsx`: versioned browser storage.
- `src/screens.tsx`: learning, practice, labs, revision, sources and settings.
- `src/assessment.tsx`: diagnostic and mock workflows.
- `src/simulators.tsx`: the six interactive tools.
- `tests/core.test.ts`: content integrity, assessment, persistence and simulation tests.
- `coverage-manifest.json`: inspectable topic/question/source mapping.
- `QA_REPORT.md`: executed verification and honest limits.

## GitHub Pages

Use a **new** repository named `os-nexus`; do not replace the C++ Atlas repository. Choose the intended GitHub account before uploading. The source folder does not include university PDFs, DOCX manuals or solution PDFs, but the app contains original PA wording and course-derived educational content. Review sharing before making the app public.

1. Create the new repository under the selected account. Upload this project (excluding `node_modules/`; it is already ignored).
2. In Settings → Pages, select **GitHub Actions** as the source.
3. Run **Publish OS NEXUS to GitHub Pages** from Actions.
4. Open the URL returned by the successful deployment. A repository URL is not evidence that a site has deployed.

The workflow is manual to avoid publishing simply because source was uploaded. Vite uses `base: './'`, producing relative asset paths. HashRouter keeps routes after `#`, so refresh does not request nonexistent server paths. This supports a project path such as `/os-nexus/` without rewriting routes.

Official deployment guidance: https://vite.dev/guide/static-deploy.html#github-pages
GitHub Pages overview: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

A private GitHub repository does not by itself make its Pages website private. Pages availability and access controls depend on the account/organization plan. No GitHub publication has been performed as part of this packaged build.

## Assessment and learning boundaries

- Written answers are never awarded automatic marks by keyword matching. Reviewed PA items do not contribute to objective mastery.
- Understanding levels are transparent heuristics from actual objective attempts. They are not exam-success probabilities.
- The mock format, time limits and checklists are study aids, not official GIU policies.
- Linux outputs are deterministic illustrations. Typed commands are never sent to a real shell; only a documented subset is recognized.
- Study session duration is a budget, not a promise to master every item in that time. Confidence and prior completion affect recommendations.
- A live mock, timer and responses survive refresh. Diagnostic question sets reset on a new visit, but checked attempts persist.
- Browser storage is per origin and browser profile. Export backups; there is no cross-device account or synchronization.
- The single-file edition is for trusted local study. Client-side hiding is a learning workflow, not an anti-cheating security boundary; a technical user can inspect bundled answers.

## Source handling and corrections

Source references preserve file identities and verified slide/page/section locators. Explanations and model answers are independently authored. The original documents remain in Drive under their existing permissions. Clarifications include mode switches versus process switches, interrupt return context, non-universal parent/child cascading termination, wait/exit semantics, the base/limit convention, `lsblk -t`, shell `$?`, privilege versus kernel mode, and semaphore/mutex distinctions. Coverage and references are inspectable in the app.

## Midterm question styles

Open `#/midterm` for 18 guide-referenced exercises: theory, labelled diagrams, real-life OS scenarios and worked calculations. Drafts, freehand sketches and self-checks persist in the existing v2 progress export. The mixed mock has 30 objective questions and four written exercises; its written mix is our practice design. Automatic scores include only the 30 objective questions; written work is self-reviewed after submission. The original uploaded guide and screenshot are not bundled.
