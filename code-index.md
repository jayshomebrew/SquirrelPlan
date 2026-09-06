# Code Index

Generated: 2026-07-27 08:02:54 -07:00

Backup location: `C:\Users\jay.meyer\OneDrive - Thermo Fisher Scientific\Projects\VScode\RetirementPlan\backups\source-20260727_080214`

## How to search

- Search symbol names with `rg -n "<symbol>"` in the project root.
- Use `code-index.json` for structured lookup.

## README.md

Purpose: Project overview, run instructions, and repository conventions

Size: 3756 bytes

Symbols: none detected

## index.html

Purpose: Single-page app layout, UI sections, and script/style entry points

Size: 21313 bytes

Symbols: none detected

## style.css

Purpose: Custom visual styling, layout, responsive rules, and theme variables

Size: 6236 bytes

Symbols: none detected

## sample-data.js

Purpose: Preset financial scenarios used for onboarding and demos

Size: 5321 bytes

Symbols:
- 1: `getSampleData` (function)

## script.js

Purpose: Main application bootstrap, plan management, simulation orchestration, import/export, rendering, and UI wiring

Size: 101556 bytes

Symbols:
- 9: `SquirrelPlanApp` (window export)
- 24: `getBlankPlanData` (function)
- 41: `getInitialAppData` (function)
- 101: `getAppData` (function)
- 105: `saveAppData` (function)
- 109: `getActivePlan` (function)
- 117: `saveActivePlanData` (function)
- 147: `getActivePlanConfig` (function)
- 152: `saveActivePlanConfig` (function)
- 161: `getSettings` (function)
- 166: `saveSettings` (function)
- 179: `getUniqueId` (function)
- 195: `autoRunSimulationIfEnabled` (function)
- 200: `getAssetColor` (function)
- 212: `displayAlerts` (function)
- 227: `validateAllInputs` (function)
- 296: `parseFormattedNumber` (function)
- 304: `formatNumberForDisplay` (function)
- 315: `onFocusNumber` (function)
- 323: `onBlurNumber` (function)
- 335: `applyNumberFormatting` (function)
- 350: `syncAllocationPeriodsAssets` (function)
- 362: `addCategory` (function)
- 473: `getAssetFields` (function)
- 487: `getLiabilityFields` (function)
- 499: `getIncomeFields` (function)
- 514: `getExpenseFields` (function)
- 527: `getPensionFields` (function)
- 546: `addAllocationPeriod` (function)
- 576: `updateAllocationAssets` (function)
- 597: `updateAllocationTotal` (function)
- 609: `getAssetNames` (function)
- 615: `updateSectionTitles` (function)
- 674: `getUserInputs` (function)
- 745: `runAndRender` (function)
- 823: `renderCharts` (function)
- 928: `loadDataFromLocalStorage` (function)
- 937: `exportData` (function)
- 954: `importData` (function)
- 1008: `setUserValues` (function)
- 1062: `renderTable` (function)
- 1090: `getRandomColor` (function)
- 1097: `clearAllInputs` (function)
- 1112: `initDefaultData` (function)
- 1129: `clearSimulationResults` (function)
- 1141: `initializeTooltips` (function)
- 1145: `initializeSortable` (function)
- 1161: `runAndRenderMonteCarlo` (function)
- 1188: `renderMonteCarloChart` (function)
- 1262: `populatePlansModal` (function)
- 1549: `applyTheme` (function)
- 1588: `manageSlider` (function)

## simulation.js

Purpose: Deterministic projection engine, Monte Carlo simulation, allocation logic, and retirement checks

Size: 19724 bytes

Symbols:
- 1: `runSimulation` (function)
- 381: `getCurrentAllocation` (function)
- 393: `checkForEarlyRetirement` (function)
- 408: `randomNormal` (function)
- 416: `runMonteCarloSimulation` (function)

## sankey.js

Purpose: Custom SVG Sankey-style summary chart for income, expenses, assets, and liabilities

Size: 19602 bytes

Symbols:
- 37: `svgEl` (function)
- 43: `hexToRgba` (function)
- 48: `fmt` (function)
- 52: `clamp` (function)
- 59: `renderSankeyChart` (window export)
- 72: `pensionActive` (function)
- 80: `annual` (function)
- 85: `activeNow` (function)
- 162: `barH` (function)
- 165: `layoutCol` (function)
- 199: `maxBottom` (function)
- 229: `drawNode` (function)
- 248: `drawLabel` (function)
- 267: `drawLink` (function)
- 281: `hdr` (function)

## translator.js

Purpose: Translation dictionaries plus page language switching and lookup helpers

Size: 100403 bytes

Symbols:
- 1306: `translatePage` (function)
- 1340: `getTranslation` (function)
- 1351: `getTranslation` (window export)

## src\data.js

Purpose: Local-storage persistence helpers and app data migration utilities

Size: 3110 bytes

Symbols:
- 8: `getBlankPlanData` (function)
- 26: `getInitialAppData` (function)
- 86: `getAppData` (function)
- 90: `saveAppData` (function)
- 94: `getActivePlan` (function)
- 101: `SquirrelPlanData` (window export)

## src\events.js

Purpose: DOM event binding helpers used throughout the app

Size: 1564 bytes

Symbols:
- 6: `delegateEvent` (function)
- 18: `onClick` (function)
- 24: `onChange` (function)
- 30: `onInput` (function)
- 36: `onSubmit` (function)
- 46: `once` (function)
- 56: `SquirrelPlanEvents` (window export)

## src\ui.js

Purpose: Generic DOM show/hide/class helpers and theme helpers

Size: 2464 bytes

Symbols:
- 6: `showElement` (function)
- 11: `hideElement` (function)
- 16: `toggleElement` (function)
- 21: `setElementText` (function)
- 26: `setElementHTML` (function)
- 31: `addClass` (function)
- 36: `removeClass` (function)
- 41: `toggleClass` (function)
- 46: `showSection` (function)
- 54: `updateSectionTitle` (function)
- 60: `applyTheme` (function)
- 65: `getCurrentTheme` (function)
- 70: `SquirrelPlanUI` (window export)

## src\utils.js

Purpose: Number formatting, parsing, and input formatting helpers

Size: 2728 bytes

Symbols:
- 25: `parseFormattedNumber` (function)
- 33: `formatNumberForDisplay` (function)
- 44: `onFocusNumber` (function)
- 52: `onBlurNumber` (function)
- 59: `applyNumberFormatting` (function)
- 72: `getFormattingRules` (function)
- 77: `SquirrelPlanUtils` (window export)

## src\validation.js

Purpose: Form validation and inline error handling

Size: 2512 bytes

Symbols:
- 6: `validateInputs` (function)
- 44: `clearValidation` (function)
- 48: `validateAndHighlight` (function)
- 65: `SquirrelPlanValidation` (window export)

