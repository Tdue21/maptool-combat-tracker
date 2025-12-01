<!--
Sync Impact Report:
Version: Initial → 1.0.0
Modified Principles: N/A (Initial version)
Added Sections: All core principles, MapTool Structure Compliance, Development Standards, Governance
Templates Status: ⚠ Pending review of plan-template.md, spec-template.md, tasks-template.md
Follow-up TODOs: None
-->

# MapTool Combat Tracker Constitution

## Core Principles

### I. MapTool Library Structure Compliance (NON-NEGOTIABLE)
All code MUST adhere to MapTool's library.json structure:
- MTScript files placed in `library/mtscript/` with `.mts` extension
- Event handlers in `library/mtscript/events/` (onInit.mts, onFirstInit.mts)
- Frontend assets in `library/public/frontend/` (HTML, CSS, JS)
- Token assets in `library/public/assets/tokens/`
- library.json MUST be valid and include all files
- events.json MUST define all event handlers correctly

**Rationale**: MapTool add-ons have a strict structure that cannot be violated or the library will fail to load.

### II. CSS Style Preservation
Existing CSS frameworks (blinddate.css, philosopher.css, main.css) MUST be maintained:
- No breaking changes to existing class names or selectors
- New styles added as extensions, not replacements
- Consistent design language across all UI components
- Responsive design patterns preserved
- Font families and color schemes maintained

**Rationale**: Visual consistency is critical for user experience; existing styles represent established design decisions.

### III. Vue.js Integration Standards
Vue.js 3 implementation MUST follow these guidelines:
- Use Composition API for new components
- Component files organized logically within HTML
- Vue global build (vue.global-3.5.13.js) used from local libs
- Reactive state management using ref/reactive
- Props and emits clearly defined
- No build step required - browser-compatible code only

**Rationale**: MapTool libraries cannot use build tools; Vue must run directly in browser via script tags.

### IV. Clean MTScript Code Generation
MTScript code MUST be:
- Well-commented with clear purpose statements
- Properly indented and formatted
- Using MapTool best practices (json.*, macro.args, etc.)
- Error handling with appropriate user feedback
- Secure (input validation, SQL injection prevention)
- Performant (minimize token iterations, cache where possible)

**Rationale**: MTScript is MapTool's proprietary language; poor code quality leads to hard-to-debug runtime issues.

### V. Cross-Component Communication
Frontend-to-MTScript communication MUST use:
- macroLink() or macroLinkText() for macro invocation
- JSON for data exchange (json.set/json.get)
- Form data properly encoded
- Clear API contracts between HTML/JS and MTScript
- Error responses handled gracefully in UI

**Rationale**: MapTool has specific protocols for frontend-backend communication that must be followed.

## MapTool Structure Compliance

### Directory Organization
```
library/
  mtscript/
    events/         # Event handlers
    public/         # Public macros
    private/        # Private helper macros
  public/
    frontend/       # HTML/CSS/JS files
      css/
      js/
        libs/       # Vue and other libraries
      images/
    assets/
      tokens/       # Token images
```

### File Naming Conventions
- MTScript files: lowercase with hyphens (e.g., `combat-tracker.mts`)
- Event handlers: exact names (onInit.mts, onFirstInit.mts, onCampaignLoad.mts)
- Frontend: kebab-case for HTML/CSS, camelCase for JS
- No spaces in filenames

## Development Standards

### Testing Approach
While MTScript has limited testing frameworks:
- Manual testing checklist required for each feature
- Test with multiple token types and edge cases
- Verify UI responsiveness at different screen sizes
- Test error conditions and edge cases
- Document test results

### Documentation Requirements
- Each macro MUST have header comment with purpose, parameters, return value
- Frontend components MUST have JSDoc comments
- README updates for user-facing features
- CHANGELOG entries for all changes

### Version Control
- Semantic versioning: MAJOR.MINOR.PATCH
- MAJOR: Breaking changes to library.json or public API
- MINOR: New features, backward compatible
- PATCH: Bug fixes, documentation updates

## Governance

This constitution supersedes all other development practices. All features, refactoring, and bug fixes MUST comply with these principles.

Amendments require:
1. Clear justification for the change
2. Impact assessment on existing code
3. Migration plan if breaking changes involved
4. Updated templates and documentation

Non-compliance blocks feature acceptance. When principles conflict, MapTool compatibility (Principle I) takes precedence.

**Version**: 1.0.0 | **Ratified**: 2025-12-01 | **Last Amended**: 2025-12-01
