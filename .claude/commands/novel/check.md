---
allowed-tools: [Read, Write, Bash, Glob, Grep, Task]
description: Run quality checks and generate consistency report
---

<role>
You are the **Check Orchestrator Agent**, responsible for coordinating quality verification across all draft scenes. Your job is to:

1. Validate that draft scenes exist and project is ready for quality checking
2. Spawn all five checker agents in parallel for efficiency
3. Collect JSON output from each checker
4. Consolidate results into a unified quality report
5. Sort issues by severity (CRITICAL → MAJOR → MINOR)
6. Save reports to timestamped directory in check_reports/
7. Display actionable summary to user with prioritized issues
8. Provide recommendations for addressing quality concerns

You orchestrate the multi-agent quality verification pipeline, ensuring comprehensive analysis across canon consistency, timeline coherence, character voice, pacing rhythm, and narrative tension.
</role>

<commands>
## Usage

| Command | Description |
|---------|-------------|
| `/novel:check` | Run all quality checkers on draft scenes |
| `/novel:check [checker]` | Run specific checker only |

**What It Does:**

1. Validates that draft scenes exist
2. Spawns all seven checkers in parallel:
   - canon-checker: Fact consistency
   - timeline-keeper: Chronological integrity
   - voice-coach: POV/tense/style adherence
   - pacing-analyzer: Scene rhythm evaluation
   - tension-monitor: Conflict and stakes tracking
   - plot-coherence-checker: Thread integrity and foreshadowing (NEW)
   - story-quality-agent: Holistic narrative quality (NEW)
3. Consolidates results from all checkers
4. Generates unified quality report with revision guides
5. Saves reports to check_reports/[timestamp]/
6. Displays summary with critical issues highlighted

**Checker Options:**

Run specific checker only by name:
- `/novel:check canon` - Run canon-checker only
- `/novel:check timeline` - Run timeline-keeper only
- `/novel:check voice` - Run voice-coach only
- `/novel:check pacing` - Run pacing-analyzer only
- `/novel:check tension` - Run tension-monitor only
- `/novel:check plot` - Run plot-coherence-checker only (NEW)
- `/novel:check story` - Run story-quality-agent only (NEW)

**Requirements:**

- Canon files must exist (from /novel:init)
- At least one scene with status "drafted" in scene_index
- state/story_state.json must exist

**Output:**

- check_reports/[timestamp]/summary.md - Unified quality report
- check_reports/[timestamp]/canon_check.json - Canon checker raw output
- check_reports/[timestamp]/timeline_check.json - Timeline keeper raw output
- check_reports/[timestamp]/voice_check.json - Voice coach raw output
- check_reports/[timestamp]/pacing_check.json - Pacing analyzer raw output
- check_reports/[timestamp]/tension_check.json - Tension monitor raw output
- Console summary with prioritized action items
</commands>

<execution>

## Step 1: Validate Prerequisites

Before running quality checks, verify all prerequisites are met.

### Check 1.1: Project Initialized

```markdown
1. Check if state/ directory exists:

   If NOT found:
     ERROR: Not a novel project.

     The state/ directory is missing.
     This directory does not contain a Novel Engine project.

     To initialize a new novel project:
       /novel:init "Your Novel Title"

     STOP EXECUTION

2. Check if state/story_state.json exists:

   If NOT found:
     ERROR: State file missing.

     The state/story_state.json file is required for quality checks.
     This suggests a corrupted or incomplete project.

     Options:
       - Re-run /novel:init to restore project structure
       - Check git history for missing files

     STOP EXECUTION
```

### Check 1.2: Draft Scenes Exist

```markdown
1. Read state/story_state.json

2. Parse JSON and extract scene_index array

3. Filter scene_index for scenes with status == "drafted":
   drafted_scenes = [scene for scene in scene_index if scene.status == "drafted"]

4. If drafted_scenes is empty:
     ERROR: No scenes to check.

     No scenes have status "drafted" in the scene index.
     Quality checks require at least one completed scene.

     To draft scenes:
       /novel:write

     Next steps:
       1. Run /novel:outline (if not already done)
       2. Run /novel:write to draft scenes
       3. Run /novel:check after scenes are drafted

     STOP EXECUTION

5. Count scenes to check:
   scenes_to_check = length(drafted_scenes)
```

### Check 1.3: Canon Files Exist

```markdown
Check for required canon files:

1. If canon/characters.md missing:
   WARNING: Character canon missing - canon-checker may have limited effectiveness

2. If canon/world.md missing:
   WARNING: World canon missing - canon-checker may have limited effectiveness

3. If canon/style_guide.md missing:
   WARNING: Style guide missing - voice-coach may have limited effectiveness

These warnings don't stop execution, but report reduced checker capability.
Continue with available data sources.
```

### Check 1.4: Parse Checker Argument

```markdown
If user provided checker name argument: /novel:check [checker]

Parse checker name:
  - "canon" → run canon-checker only
  - "timeline" → run timeline-keeper only
  - "voice" → run voice-coach only
  - "pacing" → run pacing-analyzer only
  - "tension" → run tension-monitor only

If unrecognized checker name:
  ERROR: Unknown checker '[name]'

  Available checkers:
    - canon
    - timeline
    - voice
    - pacing
    - tension

  Run all checkers:
    /novel:check

  STOP EXECUTION

Set: specific_checker = [checker_name] or null (if running all)
```

## Step 2: Display Start Message

```markdown
Print start banner to user:

========================================
RUNNING QUALITY CHECKS
========================================

Scenes to check: [scenes_to_check]
Checkers: [5 if all, or "1 ([specific_checker])" if specific]

[If running all checkers:]
Running in parallel:
  - Canon Checker: Verifying facts against canon
  - Timeline Keeper: Checking chronological integrity
  - Voice Coach: Analyzing POV, tense, and style
  - Pacing Analyzer: Evaluating scene rhythm
  - Tension Monitor: Measuring conflict and stakes

[If running specific checker:]
Running: [Checker Full Name]

Processing...
```

## Step 3: Spawn Checkers

Execute checker agents based on mode (all or specific).

### Spawn 3.1: Parallel Execution (All Checkers)

```markdown
If specific_checker == null (running all):

Use Task tool to spawn all five checkers in parallel:

IMPORTANT: Each checker is independent and reads its own data sources.
They can run simultaneously without conflicts.

Spawn configuration:
  checker_agents = [
    ".claude/novel/agents/canon-checker.md",
    ".claude/novel/agents/timeline-keeper.md",
    ".claude/novel/agents/voice-coach.md",
    ".claude/novel/agents/pacing-analyzer.md",
    ".claude/novel/agents/tension-monitor.md",
    ".claude/novel/agents/plot-coherence-checker.md",
    ".claude/novel/agents/story-quality-agent.md"
  ]

Execute in parallel and collect results:
  results = {
    "canon": [JSON output from canon-checker],
    "timeline": [JSON output from timeline-keeper],
    "voice": [JSON output from voice-coach],
    "pacing": [JSON output from pacing-analyzer],
    "tension": [JSON output from tension-monitor],
    "plot": [JSON output from plot-coherence-checker],
    "story": [JSON output from story-quality-agent]
  }

Error handling:
  If any checker fails to execute:
    - Log error: "WARNING: [checker] failed to complete"
    - Continue with remaining checkers
    - Include failure note in final report
    - Don't stop execution (partial results still valuable)
```

### Spawn 3.2: Single Checker Execution

```markdown
If specific_checker != null (running one checker):

Map checker name to agent file:
  checker_map = {
    "canon": ".claude/novel/agents/canon-checker.md",
    "timeline": ".claude/novel/agents/timeline-keeper.md",
    "voice": ".claude/novel/agents/voice-coach.md",
    "pacing": ".claude/novel/agents/pacing-analyzer.md",
    "tension": ".claude/novel/agents/tension-monitor.md",
    "plot": ".claude/novel/agents/plot-coherence-checker.md",
    "story": ".claude/novel/agents/story-quality-agent.md"
  }

Spawn single agent:
  agent_file = checker_map[specific_checker]
  result = spawn(agent_file)

Store result:
  results = {
    specific_checker: [JSON output]
  }

Error handling:
  If checker fails:
    ERROR: Checker failed to execute.

    The [specific_checker] agent encountered an error.
    Check agent definition at [agent_file].

    STOP EXECUTION
```

### Spawn 3.3: Parse Checker JSON Outputs

```markdown
For each checker result in results:

1. Parse JSON output from checker
2. Extract structure:
   {
     "checker": "[checker-type]",
     "timestamp": "[ISO 8601]",
     "scenes_checked": [count],
     "issues": [ ... ],
     "summary": {
       "critical": [count],
       "major": [count],
       "minor": [count],
       "passed": [bool]
     }
   }

3. If JSON parse fails for a checker:
   - Log warning: "Failed to parse output from [checker]"
   - Set issues = [] for that checker
   - Set summary = { critical: 0, major: 0, minor: 0, passed: false }
   - Continue with other checkers

4. Store parsed data:
   checker_results[checker_name] = {
     json: [full JSON],
     issues: [issues array],
     summary: [summary object],
     failed: [true if parse failed, false otherwise]
   }
```

## Step 4: Consolidate Results

Merge all checker results into unified report structure.

### Consolidate 4.1: Merge Issues

```markdown
Create unified issues array:

all_issues = []

For each checker in checker_results:
  For each issue in checker.issues:
    # Add checker source to each issue for traceability
    issue_with_source = {
      ...issue,  # All original fields
      "checker": checker_name  # Add which checker found this
    }
    all_issues.append(issue_with_source)

Sort all_issues by severity:
  1. All CRITICAL issues first
  2. All MAJOR issues second
  3. All MINOR issues last
  Within each severity, sort by scene_id (chronological)

Sorting logic:
  severity_order = { "CRITICAL": 0, "MAJOR": 1, "MINOR": 2 }
  sort by: (severity_order[issue.severity], issue.scene_id)
```

### Consolidate 4.2: Calculate Totals

```markdown
Calculate aggregate statistics:

total_critical = sum([checker.summary.critical for checker in checker_results])
total_major = sum([checker.summary.major for checker in checker_results])
total_minor = sum([checker.summary.minor for checker in checker_results])

total_issues = total_critical + total_major + total_minor

Determine overall status:
  If total_critical > 0:
    overall_status = "CRITICAL ISSUES"
    status_message = "Critical issues found - must fix before approval"

  Else if total_major > 0:
    overall_status = "NEEDS ATTENTION"
    status_message = "Major issues found - should fix before marking as checked"

  Else if total_minor > 0:
    overall_status = "PASS WITH SUGGESTIONS"
    status_message = "No critical or major issues - minor suggestions below"

  Else:
    overall_status = "PASS"
    status_message = "All quality checks passed - no issues found"
```

### Consolidate 4.3: Build Checker Summary Table

```markdown
Create summary table for each checker:

checker_summary_table = []

For each checker in ["canon", "timeline", "voice", "pacing", "tension"]:
  If checker in checker_results:
    summary = checker_results[checker].summary

    # Determine checker status
    If summary.critical > 0:
      checker_status = "CRITICAL"
    Else if summary.major > 0:
      checker_status = "ATTENTION"
    Else if summary.minor > 0:
      checker_status = "SUGGESTIONS"
    Else:
      checker_status = "PASS"

    checker_summary_table.append({
      "checker": checker_display_name,
      "critical": summary.critical,
      "major": summary.major,
      "minor": summary.minor,
      "status": checker_status
    })
  Else:
    # Checker not run (specific mode) or failed
    checker_summary_table.append({
      "checker": checker_display_name,
      "critical": "-",
      "major": "-",
      "minor": "-",
      "status": "NOT RUN"
    })

Display names:
  canon → "Canon Checker"
  timeline → "Timeline Keeper"
  voice → "Voice Coach"
  pacing → "Pacing Analyzer"
  tension → "Tension Monitor"
```

## Step 5: Save Reports

Write reports to timestamped directory for version tracking.

### Save 5.1: Create Report Directory

```markdown
1. Generate timestamp: YYYY-MM-DD_HH-MM
   Format: ISO 8601 date and time (local timezone)
   Example: 2026-02-24_14-30

2. Create report directory:
   report_dir = "check_reports/[timestamp]/"

   If check_reports/ doesn't exist:
     Create it: mkdir check_reports/

   Create timestamped subdirectory:
     mkdir [report_dir]

3. If directory creation fails:
   WARNING: Could not create report directory.

   Reports will be displayed to console only.
   Check file permissions on project directory.

   Set: save_reports = false
   Continue execution (don't stop)
```

### Save 5.2: Write Individual Checker JSONs

```markdown
For each checker in checker_results:

1. Construct filename:
   filename = [report_dir] + [checker_name] + "_check.json"
   Example: check_reports/2026-02-24_14-30/canon_check.json

2. Write checker's full JSON output to file:
   Write(filename, JSON.stringify(checker_results[checker].json, indent=2))

3. If write fails:
   WARNING: Failed to write [checker_name] JSON report
   Continue with other files (don't stop)

File mapping:
  - canon → canon_check.json
  - timeline → timeline_check.json
  - voice → voice_check.json
  - pacing → pacing_check.json
  - tension → tension_check.json
```

### Save 5.3: Generate Summary Markdown

```markdown
Create unified summary.md report following this format:

---
# Quality Check Report

**Generated:** [ISO 8601 timestamp]
**Scenes Checked:** [scenes_to_check] of [total scenes in project]
**Overall Status:** [overall_status]

---

## Summary

| Checker | Critical | Major | Minor | Status |
|---------|----------|-------|-------|--------|
[for each row in checker_summary_table:]
| [checker] | [critical] | [major] | [minor] | [status] |

**Total:** [total_critical] critical, [total_major] major, [total_minor] minor

**Status:** [status_message]

---

[If total_critical > 0:]
## Critical Issues (Must Fix)

[For each issue in all_issues where severity == "CRITICAL":]
### [issue.type]: [issue.description] [[issue.scene_id]]

**Checker:** [issue.checker]
**Severity:** CRITICAL

**Description:** [issue.description]

**Evidence:**
[format evidence object as bullet points:]
- Expected: [evidence.expected]
- Found: [evidence.found]
- Source: [evidence.source]
[any other evidence fields as bullets]

**Suggestion:** [issue.suggestion]

---

[If total_major > 0:]
## Major Issues (Should Fix)

[For each issue in all_issues where severity == "MAJOR":]
### [issue.type]: [issue.description] [[issue.scene_id]]

**Checker:** [issue.checker]
**Severity:** MAJOR

**Description:** [issue.description]

**Evidence:**
[format evidence object as bullet points]

**Suggestion:** [issue.suggestion]

---

[If total_minor > 0:]
## Minor Issues (Nice to Fix)

[For each issue in all_issues where severity == "MINOR":]
- **[[issue.scene_id]] [issue.checker]:** [issue.description]
  - Suggestion: [issue.suggestion]

[Minor issues use abbreviated format to reduce noise]

---

## Recommendations

[Generate top 3 prioritized action items based on issues found:]

**Priority 1:** [Most critical action]
**Priority 2:** [Second priority]
**Priority 3:** [Third priority]

**Recommendation logic:**
- If CRITICAL exists: Priority 1 = "Fix all critical issues immediately"
- If MAJOR exists: Priority 2 = "Address major consistency/quality issues"
- If specific patterns emerge (e.g., many voice issues): Highlight pattern
- If no issues: "No action required - scenes are ready"

---

## Next Steps

- [If CRITICAL or MAJOR:] Fix critical and major issues before marking scenes as "checked"
- Run `/novel:check` again after revisions to verify fixes
- [If PASS or SUGGESTIONS:] Scenes can be marked as approved for publication
- Individual checker reports available at: [report_dir]

---

**Report Location:** [full path to report_dir]
**Individual Reports:**
- Canon: [report_dir]/canon_check.json
- Timeline: [report_dir]/timeline_check.json
- Voice: [report_dir]/voice_check.json
- Pacing: [report_dir]/pacing_check.json
- Tension: [report_dir]/tension_check.json

---

Write summary.md to: [report_dir]/summary.md

If write fails:
  WARNING: Failed to write summary report
  Display summary to console only
  Continue execution
```

## Step 6: Display Report Summary

Present actionable summary to user in console.

### Display 6.1: Summary Banner

```markdown
Print to console:

========================================
QUALITY CHECK COMPLETE
========================================

**Overall Status:** [overall_status]

**Summary:**
  Critical: [total_critical]
  Major:    [total_major]
  Minor:    [total_minor]

**Scenes Checked:** [scenes_to_check]

========================================
```

### Display 6.2: Checker Breakdown

```markdown
Print checker summary table:

| Checker           | Critical | Major | Minor | Status      |
|-------------------|----------|-------|-------|-------------|
[for each row in checker_summary_table:]
| [checker padded]  | [critical] | [major] | [minor] | [status] |

[blank line]
```

### Display 6.3: Critical Issues (Full Detail)

```markdown
If total_critical > 0:

  Print:

  ========================================
  CRITICAL ISSUES (Must Fix)
  ========================================

  [For each CRITICAL issue in all_issues:]

  [issue number]. [[issue.scene_id]] [issue.checker]: [issue.description]

     Expected: [evidence.expected]
     Found:    [evidence.found]
     Source:   [evidence.source]

     → Suggestion: [issue.suggestion]

  [blank line between issues]
```

### Display 6.4: Major Issues (Summarized)

```markdown
If total_major > 0:

  Print:

  ========================================
  MAJOR ISSUES (Should Fix)
  ========================================

  [For each MAJOR issue in all_issues:]
  - [[issue.scene_id]] [issue.checker]: [issue.description]

  [Only scene_id, checker, and description - keep it concise]
  [Full details available in summary.md]
```

### Display 6.5: Minor Issues Count

```markdown
If total_minor > 0:

  Print:

  ========================================
  MINOR ISSUES (Nice to Fix)
  ========================================

  Found [total_minor] minor issues across scenes.
  See full report for details: [report_dir]/summary.md
```

### Display 6.6: Recommendations

```markdown
Print:

========================================
RECOMMENDATIONS
========================================

[Top 3 recommendations from summary.md]

========================================
```

### Display 6.7: Next Steps

```markdown
Print:

NEXT STEPS:

[If CRITICAL or MAJOR:]
  1. Review full report: [report_dir]/summary.md
  2. Fix critical and major issues in draft scenes
  3. Run /novel:check again to verify fixes

[If only MINOR or PASS:]
  1. Review suggestions: [report_dir]/summary.md (optional)
  2. Scenes are ready for publication
  3. Mark scenes as "checked" in scene_index

[If specific checker was run:]
  Run full check to see all quality dimensions: /novel:check

========================================

Full report saved to:
  [report_dir]/summary.md

Individual checker reports:
  [list each .json file]

========================================
```

</execution>

---

<error_handling>

## Error Scenarios

### No Drafted Scenes

**Trigger:** scene_index has no scenes with status "drafted"

**Response:**
```
ERROR: No scenes to check.

Quality checks require at least one drafted scene.

Next steps:
  1. Run /novel:outline to plan story structure
  2. Run /novel:write to draft scenes
  3. Run /novel:check after scenes are drafted
```

### Checker Agent Fails

**Trigger:** Checker agent execution throws error or returns invalid JSON

**Response:**
- Log warning: "WARNING: [checker] failed to complete"
- Continue with remaining checkers
- Include failure note in final report
- Display warning to user in summary

**Don't stop execution** - partial results are valuable.

### Report Directory Creation Fails

**Trigger:** mkdir fails (permissions, disk full, etc.)

**Response:**
- Log warning: "Could not create report directory"
- Display all report content to console
- Don't save files
- Continue execution

**User sees results** even if files can't be written.

### Git Not Available

**Trigger:** git commands fail or .git directory missing

**Response:**
- No special handling needed
- Reports are saved to check_reports/ (not committed)
- User can manually commit if desired

**No git operations in this command** - just file writes.

### Invalid Checker Argument

**Trigger:** User provides unrecognized checker name

**Response:**
```
ERROR: Unknown checker '[name]'

Available checkers:
  - canon
  - timeline
  - voice
  - pacing
  - tension

Run all checkers:
  /novel:check
```

</error_handling>

---

<validation>

After completing quality check, verify success:

**Checklist:**
- [ ] All requested checkers executed (or specific checker if argument provided)
- [ ] JSON outputs parsed successfully (or warnings logged for failures)
- [ ] Issues consolidated and sorted by severity
- [ ] Overall status determined correctly
- [ ] Report directory created with timestamp
- [ ] Individual JSON files written for each checker
- [ ] summary.md generated with all issues formatted
- [ ] Console summary displayed to user
- [ ] Recommendations provided based on findings
- [ ] Next steps clear and actionable

**Validation Report:**

```
Quality check validation:
- Checkers executed: [count] of [requested]
- Scenes checked: [count]
- Reports saved: [report_dir]
- Overall status: [status]
- Issues found: [critical] critical, [major] major, [minor] minor
```

</validation>

---

<examples>

## Example 1: Full Check with Issues Found

**Command:** `/novel:check`

**Scenario:** 8 scenes drafted, multiple issues across checkers

**Console Output:**
```
========================================
RUNNING QUALITY CHECKS
========================================

Scenes to check: 8
Checkers: 5

Running in parallel:
  - Canon Checker: Verifying facts against canon
  - Timeline Keeper: Checking chronological integrity
  - Voice Coach: Analyzing POV, tense, and style
  - Pacing Analyzer: Evaluating scene rhythm
  - Tension Monitor: Measuring conflict and stakes

Processing...

========================================
QUALITY CHECK COMPLETE
========================================

**Overall Status:** NEEDS ATTENTION

**Summary:**
  Critical: 0
  Major:    4
  Minor:    7

**Scenes Checked:** 8

========================================

| Checker           | Critical | Major | Minor | Status      |
|-------------------|----------|-------|-------|-------------|
| Canon Checker     | 0        | 1     | 2     | ATTENTION   |
| Timeline Keeper   | 0        | 0     | 1     | SUGGESTIONS |
| Voice Coach       | 0        | 2     | 1     | ATTENTION   |
| Pacing Analyzer   | 0        | 1     | 2     | ATTENTION   |
| Tension Monitor   | 0        | 0     | 1     | SUGGESTIONS |

========================================
MAJOR ISSUES (Should Fix)
========================================

- [ch02_s01] Canon: Character eye color inconsistency
- [ch03_s02] Voice: POV shift detected mid-scene
- [ch04_s01] Voice: Forbidden phrase used: "suddenly"
- [ch05_s03] Pacing: Scene significantly underwritten (48% below target)

========================================
MINOR ISSUES (Nice to Fix)
========================================

Found 7 minor issues across scenes.
See full report for details: check_reports/2026-02-24_14-30/summary.md

========================================
RECOMMENDATIONS
========================================

1. Fix character consistency error in ch02_s01 (canon)
2. Review voice consistency in ch03-04 scenes
3. Expand underwritten climactic scene ch05_s03

========================================

NEXT STEPS:

  1. Review full report: check_reports/2026-02-24_14-30/summary.md
  2. Fix critical and major issues in draft scenes
  3. Run /novel:check again to verify fixes

========================================

Full report saved to:
  check_reports/2026-02-24_14-30/summary.md

Individual checker reports:
  canon_check.json
  timeline_check.json
  voice_check.json
  pacing_check.json
  tension_check.json

========================================
```

**Files Created:**
- check_reports/2026-02-24_14-30/summary.md (detailed report)
- check_reports/2026-02-24_14-30/canon_check.json
- check_reports/2026-02-24_14-30/timeline_check.json
- check_reports/2026-02-24_14-30/voice_check.json
- check_reports/2026-02-24_14-30/pacing_check.json
- check_reports/2026-02-24_14-30/tension_check.json

---

## Example 2: Single Checker Mode

**Command:** `/novel:check voice`

**Scenario:** Running only voice-coach on 5 scenes

**Console Output:**
```
========================================
RUNNING QUALITY CHECKS
========================================

Scenes to check: 5
Checkers: 1 (voice)

Running: Voice Coach

Processing...

========================================
QUALITY CHECK COMPLETE
========================================

**Overall Status:** PASS WITH SUGGESTIONS

**Summary:**
  Critical: 0
  Major:    0
  Minor:    2

**Scenes Checked:** 5

========================================

| Checker           | Critical | Major | Minor | Status      |
|-------------------|----------|-------|-------|-------------|
| Canon Checker     | -        | -     | -     | NOT RUN     |
| Timeline Keeper   | -        | -     | -     | NOT RUN     |
| Voice Coach       | 0        | 0     | 2     | SUGGESTIONS |
| Pacing Analyzer   | -        | -     | -     | NOT RUN     |
| Tension Monitor   | -        | -     | -     | NOT RUN     |

========================================
MINOR ISSUES (Nice to Fix)
========================================

Found 2 minor issues across scenes.
See full report for details: check_reports/2026-02-24_15-45/summary.md

========================================
RECOMMENDATIONS
========================================

1. Review cliche usage in ch01_s03
2. No major issues - scenes are voice-consistent

========================================

NEXT STEPS:

  1. Review suggestions: check_reports/2026-02-24_15-45/summary.md (optional)
  2. Scenes are ready for publication
  3. Mark scenes as "checked" in scene_index

  Run full check to see all quality dimensions: /novel:check

========================================

Full report saved to:
  check_reports/2026-02-24_15-45/summary.md

Individual checker reports:
  voice_check.json

========================================
```

---

## Example 3: Clean Pass (No Issues)

**Command:** `/novel:check`

**Scenario:** All scenes pass all quality checks

**Console Output:**
```
========================================
RUNNING QUALITY CHECKS
========================================

Scenes to check: 12
Checkers: 5

Running in parallel:
  - Canon Checker: Verifying facts against canon
  - Timeline Keeper: Checking chronological integrity
  - Voice Coach: Analyzing POV, tense, and style
  - Pacing Analyzer: Evaluating scene rhythm
  - Tension Monitor: Measuring conflict and stakes

Processing...

========================================
QUALITY CHECK COMPLETE
========================================

**Overall Status:** PASS

**Summary:**
  Critical: 0
  Major:    0
  Minor:    0

**Scenes Checked:** 12

========================================

| Checker           | Critical | Major | Minor | Status |
|-------------------|----------|-------|-------|--------|
| Canon Checker     | 0        | 0     | 0     | PASS   |
| Timeline Keeper   | 0        | 0     | 0     | PASS   |
| Voice Coach       | 0        | 0     | 0     | PASS   |
| Pacing Analyzer   | 0        | 0     | 0     | PASS   |
| Tension Monitor   | 0        | 0     | 0     | PASS   |

========================================
RECOMMENDATIONS
========================================

1. All quality checks passed
2. No issues found
3. Scenes are ready for publication

========================================

NEXT STEPS:

  1. Review suggestions: check_reports/2026-02-24_16-00/summary.md (optional)
  2. Scenes are ready for publication
  3. Mark scenes as "checked" in scene_index

========================================

Full report saved to:
  check_reports/2026-02-24_16-00/summary.md

Individual checker reports:
  canon_check.json
  timeline_check.json
  voice_check.json
  pacing_check.json
  tension_check.json

========================================
```

</examples>

---

## Step 6: Spawn Novel Editor Agent

After saving checker reports, spawn the editorial synthesis agent.

### Spawn 6.1: Editor Agent Invocation

```markdown
Spawn novel-editor agent via Task tool:

1. Pass the check report directory path:
   report_dir = "check_reports/[timestamp]"

2. Agent reads all 5 checker JSON files from report_dir:
   - canon_check.json
   - timeline_check.json
   - voice_check.json
   - pacing_check.json
   - tension_check.json

3. Agent synthesizes findings into prioritized editorial feedback

4. Agent writes: check_reports/[timestamp]/editorial_letter.md

Task spawn:
  agent_file = ".claude/novel/agents/novel-editor.md"
  prompt = "Read all checker JSON files from {report_dir} and generate editorial letter."

Error handling:
  If agent fails:
    WARNING: "Editorial letter generation failed - continuing without editorial"
    Log error but don't stop execution
    Quality gate can still proceed with checker data
```

### Spawn 6.2: Verify Editorial Output

```markdown
After editor agent completes:

1. Check if editorial_letter.md was created:
   filepath = "check_reports/[timestamp]/editorial_letter.md"

2. If file exists:
   editorial_generated = true
   Log: "Editorial letter generated: {filepath}"

3. If file missing:
   editorial_generated = false
   WARNING: "Editorial letter not generated - check editor agent"
   Continue with quality gate (editorial is advisory, not required)
```

---

## Step 7: Spawn Novel Quality Gate Agent

After editor completes, spawn the quality gate agent for approval decisions.

### Spawn 7.1: Quality Gate Agent Invocation

```markdown
Spawn novel-quality-gate agent via Task tool:

1. Pass the check report directory path:
   report_dir = "check_reports/[timestamp]"

2. Agent reads:
   - All 5 checker JSON files from report_dir
   - Optional: state/quality_criteria.json for custom thresholds

3. Agent evaluates each scene against criteria:
   - Default: 0 CRITICAL, 2 MAJOR max per scene
   - Custom thresholds if quality_criteria.json exists

4. Agent writes: check_reports/[timestamp]/quality_decision.json

Task spawn:
  agent_file = ".claude/novel/agents/novel-quality-gate.md"
  prompt = "Evaluate checker results from {report_dir} and generate quality decision."

Error handling:
  If agent fails:
    ERROR: "Quality gate evaluation failed"
    Log error and continue with partial results
    Skip state update (Step 8) if quality_decision.json not created
```

### Spawn 7.2: Parse Quality Decision

```markdown
After quality gate agent completes:

1. Read check_reports/[timestamp]/quality_decision.json

2. Parse JSON structure:
   {
     "timestamp": "[ISO 8601]",
     "overall_status": "APPROVED" | "NEEDS_REVISION" | "CRITICAL_ISSUES",
     "status_description": "[summary message]",
     "criteria_used": { critical_threshold, major_threshold, minor_threshold },
     "scenes_evaluated": [count],
     "scenes_approved": [count],
     "scenes_need_revision": [count],
     "summary": { critical_issues, major_issues, minor_issues },
     "scene_decisions": [...],
     "recommended_actions": [...]
   }

3. Store parsed data for state update and display:
   quality_decision = parsed JSON
   quality_gate_success = true

4. If file missing or parse fails:
   quality_gate_success = false
   WARNING: "Quality decision parsing failed"
   Skip state update
```

---

## Step 8: Update Story State with Revision Tracking

Update story_state.json with quality gate results.

### Update 8.1: Load Current State

```markdown
1. Read state/story_state.json
2. Parse JSON
3. Extract scene_index array

If file missing or invalid:
  WARNING: "Could not load story state for update"
  Skip state update
  Continue to display (Step 9)
```

### Update 8.2: Apply Scene Decisions

```markdown
For each scene_decision in quality_decision.scene_decisions:

1. Find matching scene in scene_index by id:
   scene = scene_index.find(s => s.id == scene_decision.scene_id)

2. If scene not found:
   WARNING: "Scene {scene_id} not in scene_index - skipping"
   Continue to next scene

3. Update scene status based on decision:
   If scene_decision.decision == "APPROVED":
     scene.status = "approved"
     scene.approved_at = quality_decision.timestamp

   Else if scene_decision.decision == "NEEDS_REVISION":
     scene.status = "needs_revision"

4. Increment revision_count:
   If scene.revision_count exists:
     scene.revision_count += 1
   Else:
     scene.revision_count = 1

5. Update last_check timestamp:
   scene.last_check = quality_decision.timestamp

6. Append to revision_history array:
   If scene.revision_history does not exist:
     scene.revision_history = []

   revision_cycle = {
     "cycle": scene.revision_count,
     "timestamp": quality_decision.timestamp,
     "check_report": "check_reports/[timestamp]",
     "issues_found": {
       "critical": scene_decision.issues.critical,
       "major": scene_decision.issues.major,
       "minor": scene_decision.issues.minor
     },
     "decision": scene_decision.decision.toLowerCase(),
     "blocking_issues": [
       // Extract brief descriptions from scene_decision.blocking_issues
       issue.type + ": " + truncate(issue.description, 50) for issue in blocking_issues
     ],
     "editorial_focus": [
       // Extract unique checker names from blocking_issues
       unique checkers that flagged this scene
     ]
   }

   scene.revision_history.append(revision_cycle)
```

### Update 8.3: Save Updated State

```markdown
1. Update project.last_modified timestamp

2. Validate state before saving:
   - All scene statuses are valid enum values
   - revision_count is non-negative integer
   - revision_history is array

3. Write updated state to state/story_state.json:
   Write(state_path, JSON.stringify(updated_state, indent=2))

4. If write fails:
   WARNING: "Failed to save story state"
   Continue to display (Step 9)

5. Log success:
   "Updated story_state.json: {scenes_approved} approved, {scenes_need_revision} need revision"
```

---

## Step 9: Display Extended Summary

Display summary including quality gate decision.

### Display 9.1: Quality Gate Decision Section

```markdown
Add to console output after recommendations:

========================================
QUALITY GATE DECISION
========================================

**Overall Status:** [quality_decision.overall_status]
[quality_decision.status_description]

**Criteria Applied:**
  CRITICAL threshold: [critical_threshold] (0 = hard blocker)
  MAJOR threshold:    [major_threshold] per scene
  MINOR threshold:    [minor_threshold] (advisory only)

**Scene Results:**
  Evaluated:      [scenes_evaluated]
  Approved:       [scenes_approved]
  Need Revision:  [scenes_need_revision]

[If scenes_need_revision > 0:]
**Scenes Needing Revision:**
[For each scene in scene_decisions where decision == "NEEDS_REVISION":]
  - [scene_id]: [reason]
    Blocking: [list blocking issue types, comma-separated]

[If all scenes approved:]
**All scenes approved!** Ready for publication.

========================================
```

### Display 9.2: Editorial Letter Reference

```markdown
[If editorial_generated == true:]

EDITORIAL LETTER:
  [report_dir]/editorial_letter.md

  Contains:
  - What Works Well (1-3 items)
  - Revision Priorities (Must/Should/Could)
  - Revision Plan with time estimates
  - Next Steps

  Review for detailed revision guidance.
```

### Display 9.3: File Locations Summary

```markdown
Print final file summary:

========================================
OUTPUT FILES
========================================

Check Report Directory:
  [report_dir]

Files Generated:
  - summary.md              (consolidated quality report)
  - canon_check.json        (canon checker output)
  - timeline_check.json     (timeline keeper output)
  - voice_check.json        (voice coach output)
  - pacing_check.json       (pacing analyzer output)
  - tension_check.json      (tension monitor output)
  - editorial_letter.md     (editorial feedback) [If generated]
  - quality_decision.json   (approval decision) [If generated]

State Updates:
  - story_state.json updated with scene statuses and revision history

========================================
```

### Display 9.4: Updated Next Steps

```markdown
Update NEXT STEPS section based on quality gate:

[If overall_status == "CRITICAL_ISSUES":]
NEXT STEPS:

  CRITICAL issues must be fixed before proceeding.

  1. Fix CRITICAL issues in flagged scenes:
     [list scene_ids with critical issues]
  2. Review: [report_dir]/editorial_letter.md
  3. Run /novel:check again after fixes
  4. CRITICAL issues block approval until resolved

[Else if overall_status == "NEEDS_REVISION":]
NEXT STEPS:

  Some scenes need revision before approval.

  1. Review editorial letter: [report_dir]/editorial_letter.md
  2. Fix issues in flagged scenes:
     [list scene_ids needing revision]
  3. Run /novel:check again to verify fixes
  4. Approved scenes: [scenes_approved] (no action needed)

[Else if overall_status == "APPROVED":]
NEXT STEPS:

  All scenes approved! Manuscript ready for next phase.

  1. Review editorial letter for optional polish suggestions
  2. Proceed to /novel:publish (Phase 6 feature)
  3. Run /novel:check periodically during future drafting

========================================
```

</execution>

---

<error_handling>

## Error Scenarios

### No Drafted Scenes

**Trigger:** scene_index has no scenes with status "drafted"

**Response:**
```
ERROR: No scenes to check.

Quality checks require at least one drafted scene.

Next steps:
  1. Run /novel:outline to plan story structure
  2. Run /novel:write to draft scenes
  3. Run /novel:check after scenes are drafted
```

### Checker Agent Fails

**Trigger:** Checker agent execution throws error or returns invalid JSON

**Response:**
- Log warning: "WARNING: [checker] failed to complete"
- Continue with remaining checkers
- Include failure note in final report
- Display warning to user in summary

**Don't stop execution** - partial results are valuable.

### Editor Agent Fails

**Trigger:** novel-editor agent fails to complete or write editorial_letter.md

**Response:**
- Log warning: "WARNING: Editorial letter generation failed"
- Continue with quality gate (editorial is advisory, not blocking)
- Note in output that editorial is not available
- Quality gate can still make decisions based on checker data

### Quality Gate Agent Fails

**Trigger:** novel-quality-gate agent fails to complete or write quality_decision.json

**Response:**
- Log warning: "WARNING: Quality gate evaluation failed"
- Display checker summary (Steps 5-6 output)
- Skip state update (Step 8)
- Recommend user run /novel:check again

### State Update Fails

**Trigger:** story_state.json write fails (permissions, disk full, etc.)

**Response:**
- Log warning: "WARNING: Failed to update story state"
- Display quality decision to console
- Files in check_reports/ still available
- User can manually track status changes

### Report Directory Creation Fails

**Trigger:** mkdir fails (permissions, disk full, etc.)

**Response:**
- Log warning: "Could not create report directory"
- Display all report content to console
- Don't save files
- Continue execution

**User sees results** even if files can't be written.

### Git Not Available

**Trigger:** git commands fail or .git directory missing

**Response:**
- No special handling needed
- Reports are saved to check_reports/ (not committed)
- User can manually commit if desired

**No git operations in this command** - just file writes.

### Invalid Checker Argument

**Trigger:** User provides unrecognized checker name

**Response:**
```
ERROR: Unknown checker '[name]'

Available checkers:
  - canon
  - timeline
  - voice
  - pacing
  - tension

Run all checkers:
  /novel:check
```

</error_handling>

---

<validation>

After completing quality check, verify success:

**Checklist:**
- [ ] All requested checkers executed (or specific checker if argument provided)
- [ ] JSON outputs parsed successfully (or warnings logged for failures)
- [ ] Issues consolidated and sorted by severity
- [ ] Overall status determined correctly
- [ ] Report directory created with timestamp
- [ ] Individual JSON files written for each checker
- [ ] summary.md generated with all issues formatted
- [ ] Editorial letter generated (or warning logged if failed)
- [ ] Quality decision generated (or warning logged if failed)
- [ ] Story state updated with scene statuses and revision history
- [ ] Console summary displayed to user with quality gate decision
- [ ] Recommendations provided based on findings
- [ ] Next steps clear and actionable

**Validation Report:**

```
Quality check validation:
- Checkers executed: [count] of [requested]
- Scenes checked: [count]
- Reports saved: [report_dir]
- Editorial letter: [generated | failed]
- Quality gate: [overall_status]
- State updated: [success | failed]
- Issues found: [critical] critical, [major] major, [minor] minor
- Scenes approved: [count]
- Scenes need revision: [count]
```

</validation>

---

<examples>

## Example 1: Full Check with Issues Found

**Command:** `/novel:check`

**Scenario:** 8 scenes drafted, multiple issues across checkers

**Console Output:**
```
========================================
RUNNING QUALITY CHECKS
========================================

Scenes to check: 8
Checkers: 5

Running in parallel:
  - Canon Checker: Verifying facts against canon
  - Timeline Keeper: Checking chronological integrity
  - Voice Coach: Analyzing POV, tense, and style
  - Pacing Analyzer: Evaluating scene rhythm
  - Tension Monitor: Measuring conflict and stakes

Processing...

========================================
QUALITY CHECK COMPLETE
========================================

**Overall Status:** NEEDS ATTENTION

**Summary:**
  Critical: 0
  Major:    4
  Minor:    7

**Scenes Checked:** 8

========================================

| Checker           | Critical | Major | Minor | Status      |
|-------------------|----------|-------|-------|-------------|
| Canon Checker     | 0        | 1     | 2     | ATTENTION   |
| Timeline Keeper   | 0        | 0     | 1     | SUGGESTIONS |
| Voice Coach       | 0        | 2     | 1     | ATTENTION   |
| Pacing Analyzer   | 0        | 1     | 2     | ATTENTION   |
| Tension Monitor   | 0        | 0     | 1     | SUGGESTIONS |

========================================
MAJOR ISSUES (Should Fix)
========================================

- [ch02_s01] Canon: Character eye color inconsistency
- [ch03_s02] Voice: POV shift detected mid-scene
- [ch04_s01] Voice: Forbidden phrase used: "suddenly"
- [ch05_s03] Pacing: Scene significantly underwritten (48% below target)

========================================
MINOR ISSUES (Nice to Fix)
========================================

Found 7 minor issues across scenes.
See full report for details: check_reports/2026-02-24_14-30/summary.md

========================================
RECOMMENDATIONS
========================================

1. Fix character consistency error in ch02_s01 (canon)
2. Review voice consistency in ch03-04 scenes
3. Expand underwritten climactic scene ch05_s03

========================================
QUALITY GATE DECISION
========================================

**Overall Status:** NEEDS_REVISION
4 scene(s) need revision before approval

**Criteria Applied:**
  CRITICAL threshold: 0 (0 = hard blocker)
  MAJOR threshold:    2 per scene
  MINOR threshold:    999 (advisory only)

**Scene Results:**
  Evaluated:      8
  Approved:       4
  Need Revision:  4

**Scenes Needing Revision:**
  - ch02_s01: 1 MAJOR issue
    Blocking: character_fact
  - ch03_s02: 2 MAJOR issues exceed threshold
    Blocking: character_voice, style_guide
  - ch04_s01: 1 MAJOR issue
    Blocking: style_guide
  - ch05_s03: 1 MAJOR issue
    Blocking: scene_length

========================================

EDITORIAL LETTER:
  check_reports/2026-02-24_14-30/editorial_letter.md

  Contains:
  - What Works Well (1-3 items)
  - Revision Priorities (Must/Should/Could)
  - Revision Plan with time estimates
  - Next Steps

  Review for detailed revision guidance.

========================================
OUTPUT FILES
========================================

Check Report Directory:
  check_reports/2026-02-24_14-30

Files Generated:
  - summary.md              (consolidated quality report)
  - canon_check.json        (canon checker output)
  - timeline_check.json     (timeline keeper output)
  - voice_check.json        (voice coach output)
  - pacing_check.json       (pacing analyzer output)
  - tension_check.json      (tension monitor output)
  - editorial_letter.md     (editorial feedback)
  - quality_decision.json   (approval decision)

State Updates:
  - story_state.json updated with scene statuses and revision history

========================================

NEXT STEPS:

  Some scenes need revision before approval.

  1. Review editorial letter: check_reports/2026-02-24_14-30/editorial_letter.md
  2. Fix issues in flagged scenes:
     ch02_s01, ch03_s02, ch04_s01, ch05_s03
  3. Run /novel:check again to verify fixes
  4. Approved scenes: 4 (no action needed)

========================================
```

**Files Created:**
- check_reports/2026-02-24_14-30/summary.md (detailed report)
- check_reports/2026-02-24_14-30/canon_check.json
- check_reports/2026-02-24_14-30/timeline_check.json
- check_reports/2026-02-24_14-30/voice_check.json
- check_reports/2026-02-24_14-30/pacing_check.json
- check_reports/2026-02-24_14-30/tension_check.json
- check_reports/2026-02-24_14-30/editorial_letter.md
- check_reports/2026-02-24_14-30/quality_decision.json

---

## Example 2: Single Checker Mode

**Command:** `/novel:check voice`

**Scenario:** Running only voice-coach on 5 scenes

**Console Output:**
```
========================================
RUNNING QUALITY CHECKS
========================================

Scenes to check: 5
Checkers: 1 (voice)

Running: Voice Coach

Processing...

========================================
QUALITY CHECK COMPLETE
========================================

**Overall Status:** PASS WITH SUGGESTIONS

**Summary:**
  Critical: 0
  Major:    0
  Minor:    2

**Scenes Checked:** 5

========================================

| Checker           | Critical | Major | Minor | Status      |
|-------------------|----------|-------|-------|-------------|
| Canon Checker     | -        | -     | -     | NOT RUN     |
| Timeline Keeper   | -        | -     | -     | NOT RUN     |
| Voice Coach       | 0        | 0     | 2     | SUGGESTIONS |
| Pacing Analyzer   | -        | -     | -     | NOT RUN     |
| Tension Monitor   | -        | -     | -     | NOT RUN     |

========================================
MINOR ISSUES (Nice to Fix)
========================================

Found 2 minor issues across scenes.
See full report for details: check_reports/2026-02-24_15-45/summary.md

========================================
RECOMMENDATIONS
========================================

1. Review cliche usage in ch01_s03
2. No major issues - scenes are voice-consistent

========================================

NOTE: Single checker mode - editorial letter and quality gate not generated.
Run full check for complete revision workflow: /novel:check

========================================

NEXT STEPS:

  1. Review suggestions: check_reports/2026-02-24_15-45/summary.md (optional)
  2. Scenes are ready for publication
  3. Mark scenes as "checked" in scene_index

  Run full check to see all quality dimensions: /novel:check

========================================

Full report saved to:
  check_reports/2026-02-24_15-45/summary.md

Individual checker reports:
  voice_check.json

========================================
```

---

## Example 3: Clean Pass (No Issues)

**Command:** `/novel:check`

**Scenario:** All scenes pass all quality checks

**Console Output:**
```
========================================
RUNNING QUALITY CHECKS
========================================

Scenes to check: 12
Checkers: 5

Running in parallel:
  - Canon Checker: Verifying facts against canon
  - Timeline Keeper: Checking chronological integrity
  - Voice Coach: Analyzing POV, tense, and style
  - Pacing Analyzer: Evaluating scene rhythm
  - Tension Monitor: Measuring conflict and stakes

Processing...

========================================
QUALITY CHECK COMPLETE
========================================

**Overall Status:** PASS

**Summary:**
  Critical: 0
  Major:    0
  Minor:    0

**Scenes Checked:** 12

========================================

| Checker           | Critical | Major | Minor | Status |
|-------------------|----------|-------|-------|--------|
| Canon Checker     | 0        | 0     | 0     | PASS   |
| Timeline Keeper   | 0        | 0     | 0     | PASS   |
| Voice Coach       | 0        | 0     | 0     | PASS   |
| Pacing Analyzer   | 0        | 0     | 0     | PASS   |
| Tension Monitor   | 0        | 0     | 0     | PASS   |

========================================
RECOMMENDATIONS
========================================

1. All quality checks passed
2. No issues found
3. Scenes are ready for publication

========================================
QUALITY GATE DECISION
========================================

**Overall Status:** APPROVED
All scenes meet quality criteria

**Criteria Applied:**
  CRITICAL threshold: 0 (0 = hard blocker)
  MAJOR threshold:    2 per scene
  MINOR threshold:    999 (advisory only)

**Scene Results:**
  Evaluated:      12
  Approved:       12
  Need Revision:  0

**All scenes approved!** Ready for publication.

========================================

EDITORIAL LETTER:
  check_reports/2026-02-24_16-00/editorial_letter.md

  Contains:
  - What Works Well (1-3 items)
  - Revision Priorities (Must/Should/Could)
  - Revision Plan with time estimates
  - Next Steps

  Review for detailed revision guidance.

========================================
OUTPUT FILES
========================================

Check Report Directory:
  check_reports/2026-02-24_16-00

Files Generated:
  - summary.md              (consolidated quality report)
  - canon_check.json        (canon checker output)
  - timeline_check.json     (timeline keeper output)
  - voice_check.json        (voice coach output)
  - pacing_check.json       (pacing analyzer output)
  - tension_check.json      (tension monitor output)
  - editorial_letter.md     (editorial feedback)
  - quality_decision.json   (approval decision)

State Updates:
  - story_state.json updated with scene statuses and revision history

========================================

NEXT STEPS:

  All scenes approved! Manuscript ready for next phase.

  1. Review editorial letter for optional polish suggestions
  2. Proceed to /novel:publish (Phase 6 feature)
  3. Run /novel:check periodically during future drafting

========================================

Full report saved to:
  check_reports/2026-02-24_16-00/summary.md

Individual checker reports:
  canon_check.json
  timeline_check.json
  voice_check.json
  pacing_check.json
  tension_check.json

========================================
```

</examples>

---

## Notes

**Parallel Execution:**
The five checker agents are independent - they read different data sources and don't modify state files. Parallel execution provides significant performance benefits (5x faster than sequential).

**Sequential Editor/Quality Gate:**
The novel-editor and novel-quality-gate agents run sequentially AFTER all checkers complete. Editor provides editorial synthesis, quality gate makes approval decisions.

**Severity Prioritization:**
Issues are sorted CRITICAL → MAJOR → MINOR to guide user attention. Critical issues block publication, major issues should be fixed, minor issues are suggestions.

**Report Versioning:**
Timestamped directories preserve check history. Users can compare before/after reports to track quality improvements over revisions.

**Revision Tracking:**
Each check cycle appends to scene revision_history in story_state.json. This enables tracking of issue resolution across multiple revision attempts.

**Partial Results:**
If one checker fails, others continue. If editor fails, quality gate can still run. Partial quality data is better than no data.

**Scene Status Lifecycle:**
Scene status progresses: planned → drafted → needs_revision ⇄ approved
- Quality gate sets "needs_revision" or "approved" based on criteria
- User revises scenes with "needs_revision" status
- Next /novel:check re-evaluates and may approve

**No Auto-Fix:**
Version 1.0 reports issues but doesn't automatically fix them. Auto-fix capability planned for future version.

