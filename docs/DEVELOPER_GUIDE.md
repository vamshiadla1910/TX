# Developer Guide: Teams Module & Hackathon Portal

## Development Commands

All commands should be executed inside the `TX` application directory:

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev

# Run unit tests
npm test

# Build production bundle
npm run build

# Run ESLint on the teams module
npx eslint src/modules/marketing/presentation/pages/HackathonDashboard/teams
```

---

## Directory Structure

```
TX/src/modules/marketing/presentation/pages/HackathonDashboard/teams/
├── components/
│   ├── TeamDetailsModal.jsx    # Full team review modal dialog
│   ├── TeamSearchFilters.jsx   # Search input & filter buttons
│   ├── TeamStats.jsx           # 4 summary statistics cards
│   ├── TeamTableRow.jsx        # Individual table row with status & actions
│   ├── TeamsEmptyState.jsx     # "No teams found" empty state
│   ├── TeamsError.jsx          # Error state display with retry button
│   ├── TeamsHeader.jsx         # Header title & refresh button
│   ├── TeamsLoading.jsx        # Loading spinner view
│   ├── TeamsNotification.jsx   # Success notification alert
│   └── TeamsTable.jsx          # Table wrapper & headers
├── constants/
│   └── teamConstants.js        # Filter types, statuses, event names, timeouts
├── hooks/
│   ├── useAttendance.js        # Attendance mutation, savingId, and notifications
│   ├── useTeamFilters.js       # Search, filter predicates, and team counts
│   └── useTeams.js             # Team data fetching & event listener
├── utils/
│   └── teamFormatters.js       # Pure normalization for lead name and member count
├── index.js                    # Public module entry point
├── Teams.css                   # Scoped styles for the module
├── Teams.jsx                   # High-level composition orchestrator
└── teams.test.mjs              # Unit tests for the module
```

---

## Adding New Features to the Teams Module

1. **State / Business Logic**: Add or modify custom hooks inside `hooks/`. Keep pure calculations inside `utils/`.
2. **UI Elements**: Create scoped presentational components in `components/`. Pass callbacks and data down via props.
3. **Public API**: Export new public symbols from `teams/index.js`.
4. **Verification**: Always run `npm test`, `npx eslint src/.../teams`, and `npm run build` prior to committing.
