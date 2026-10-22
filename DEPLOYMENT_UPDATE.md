# Midterm question-style update — 22 October 2026

Adapted the supplied screenshot and 48-page Midterm Crash Guide into an integrated written practice workshop and mixed mock.

- 18 original, page-referenced exercises: 4 diagrams, 4 theory, 6 real-life scenarios, 4 calculations.
- 30 MCQ/true-false items plus one written exercise of each type per mixed mock. The exact written mix is labelled as practice design.
- Typed answers, freehand sketches, undo and self-review checklists persist in the existing v2 progress schema through optional fields. Old exports remain valid.
- Model answers unlock after submission in a mock. Only objective answers enter score/history/mastery; written checks remain separate.
- Guide timing and screenshot recollection are explicitly distinguished from confirmed official information.
- Semantic MathML equations, given-value tables, diagram models and PDF page trails.

Validation: 71 tests pass, production build succeeds. Browser verified draft/sketch persistence, mixed mock navigation, hidden solutions, submission/review and score denominator, light-mode equations, and mobile 375px layouts in both themes without document overflow.

# OS NEXUS update — 22 October 2026

- Light/dark mode toggle in the top bar, saved independently of study progress.
- KaTeX produces semantic MathML locally; no external formula service or font dependency.
- Given-value tables in calculation questions; equations in Amdahl, scheduling, memory protection and latency explanations.
- Four Theo decks reviewed: Services & Protection, Processes, Threads and CPU Scheduling.
- 18 scheduling datasets from the slides with computed timelines and per-process/average calculations.
- 12 adapted conceptual exercises, including all Threads scenarios and scheduling Exercises 5-7 to 5-12.
- Three added lessons: hybrid thread/process designs, context-switch cost cases, and multicore/pipeline design.
- Added CMOS/RTC, timer, I/O chunking, SMP queue and latency details; linked existing PA2/PA3 exercises to Theo coverage.
- Clarifies slide simplifications: finite waiting versus starvation risk; ready-to-start delay versus dispatch overhead; real I/O stacks and memory protection conventions.

Validation: 64 tests pass, including all 18 slide average answer sets and scheduling invariants, RR boundary order and SRT equality behavior. Production TypeScript/Vite build succeeds. Browser verified math rendering, persistent theme, existing saved progress, and mobile width 375 px with solutions open (no document overflow). Tables and timelines scroll within their own containers.

Source: app/ is the complete maintainable React/Vite project. Root index.html, assets/ and coverage-manifest.json are the production build used by GitHub Pages. Earlier loose source files are historical and are not loaded by the website.

Build from app/: npm ci; npm test; npm run build. Publish the CONTENTS of app/dist to repository root, preserving the assets directory. Keep Pages on main / root. Do not replace root index.html with the source app/index.html.

Progress uses the existing os-nexus.progress.v2 storage key and has not been reset.
