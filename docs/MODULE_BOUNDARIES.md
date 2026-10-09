# Module Boundaries & Dependency Rules

## 1. Core Principles
1. **Unidirectional Dependency Flow**: Presentation components import hooks, formatters, and constants. Components do not import from sibling components unless explicitly composed.
2. **Public Entry Points**: Consumers of the `teams` module access features through `teams/index.js` or `teams` root.
3. **Pure Logic Isolation**: Utilities (`teamFormatters.js`) and constants (`teamConstants.js`) are decoupled from React state and rendering.
4. **No Cross-Domain Leakage**: Internal details of the `teams` module (such as modal state or filter indexes) remain encapsulated within the module.

## 2. Permitted Dependencies Matrix

| Source Layer | Permitted Targets | Restricted Targets |
| :--- | :--- | :--- |
| **Pages / Consumers** (`HackathonDashboard.jsx`) | `teams/index.js` (public export) | Private internal components (e.g., `TeamTableRow.jsx`) |
| **Module Orchestrator** (`Teams.jsx`) | `hooks/*`, `components/*`, `constants/*` | Raw external APIs directly |
| **Presentation Components** (`components/*`) | `constants/*`, `utils/*`, icons from `lucide-react` | State mutation hooks directly |
| **Custom Hooks** (`hooks/*`) | `HackethonApi.js`, `constants/*`, `utils/*` | React UI elements / JSX markup |
| **Formatters** (`utils/*`) | `HackethonApi.js`, pure standard JS functions | React hooks or component state |

## 3. Event-Driven Communication
Cross-module updates rely on decoupled browser custom events rather than direct parent-child prop-drilling or global state singletons:
- `registrationUpdated`: Triggered by registration submissions; caught by `useTeams` to refresh team listings.
- `attendanceUpdated`: Triggered by `useAttendance` upon marking Present/Absent; caught by other dashboard widgets (e.g. Round 1 / Overview).
