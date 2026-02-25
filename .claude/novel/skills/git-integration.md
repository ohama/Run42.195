---
name: git-integration
description: Reusable skill for git auto-commit operations in novel projects
version: 1.0
---

# Git Integration Skill

This skill provides standardized patterns for git operations in Novel Engine. Commands invoke these patterns to auto-commit changes at appropriate milestones.

## Philosophy

**Commit Milestones, Not Every Change:**
- Commit after project initialization
- Commit after user edits canon files
- Commit after outline generation
- Commit after scene completion (drafted + checked)
- Commit after revision completion

**Do NOT auto-commit:**
- Every state file update (too frequent, noise)
- Planning/intermediate work (incomplete)
- On errors or failed operations

**Safety First:**
- Never force push
- Never amend commits
- Never delete branches
- Always use heredoc for multi-line messages
- Always include Co-Authored-By tag
- Graceful degradation if git unavailable

---

## Configuration

Git integration is configured in `state/story_state.json`:

```json
{
  "project": {
    "git_integration": {
      "enabled": true,
      "auto_commit_canon": true,
      "auto_commit_scenes": true,
      "auto_commit_state": false
    }
  }
}
```

**Configuration Options:**
- `enabled`: Master switch for all git operations
- `auto_commit_canon`: Auto-commit when canon files change
- `auto_commit_scenes`: Auto-commit when scenes complete quality checks
- `auto_commit_state`: Auto-commit state changes (disabled by default - too noisy)

---

## Functions

### check_git_available()

**Purpose:** Verify git is available and working.

**Returns:** Boolean

**Pattern:**

```markdown
1. Run: git --version 2>/dev/null

2. If command succeeds:
   - Git is available
   - Return true

3. If command fails:
   - Git is not installed or not in PATH
   - Log: "Git not available - version control disabled"
   - Return false
```

**Bash Implementation:**

```bash
# Check if git is available
check_git_available() {
  if git --version &>/dev/null; then
    return 0  # true
  else
    echo "WARNING: Git is not available on this system."
    echo "Version control features are disabled."
    return 1  # false
  fi
}
```

---

### check_git_repo()

**Purpose:** Verify current directory is inside a git repository.

**Returns:** Boolean

**Pattern:**

```markdown
1. Run: git rev-parse --is-inside-work-tree 2>/dev/null

2. If returns "true":
   - Inside a git repository
   - Return true

3. If fails or returns other:
   - Not in a git repository
   - Return false
```

**Bash Implementation:**

```bash
# Check if inside a git repo
check_git_repo() {
  if git rev-parse --is-inside-work-tree &>/dev/null; then
    return 0  # true
  else
    return 1  # false
  fi
}
```

---

### check_git_config()

**Purpose:** Check if git_integration is enabled in project configuration.

**Returns:** Boolean

**Pattern:**

```markdown
1. Read state/story_state.json

2. Parse JSON and extract:
   - project.git_integration.enabled

3. If enabled == true:
   - Return true

4. If enabled == false or missing:
   - Log: "Git integration disabled in project config"
   - Return false
```

**Inline Check:**

```markdown
When invoking git operations:

1. Read state/story_state.json
2. Check if .project.git_integration.enabled is true
3. If false or missing, skip git operation silently
4. Continue with normal operation
```

---

### commit_init(title)

**Purpose:** Create initial commit after /novel:init.

**Parameters:**
- `title`: Novel project title (string)

**Pattern:**

```markdown
1. Check git available (check_git_available)
   - If not available, return with warning

2. Check if in git repo (check_git_repo)
   - If not, run: git init
   - If git init fails, return with warning

3. Stage all project files:
   git add canon/ state/ beats/ draft/ .gitignore

4. Create commit with message:
   "Initialize novel project: [title]

   Created directory structure and canon templates.
   Format: [format]

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

5. If commit fails:
   - Log warning but continue
   - Project files are still created

6. Return commit hash if successful
```

**Bash Implementation:**

```bash
# Initial commit after /novel:init
commit_init() {
  local title="$1"
  local format="$2"

  # Check git available
  if ! git --version &>/dev/null; then
    echo "WARNING: Git not available. Project created without version control."
    return 1
  fi

  # Initialize if not in repo
  if ! git rev-parse --is-inside-work-tree &>/dev/null; then
    git init || {
      echo "WARNING: Could not initialize git repository."
      return 1
    }
  fi

  # Stage files
  git add canon/ state/ beats/ draft/ .gitignore 2>/dev/null

  # Commit
  git commit -m "$(cat <<EOF
Initialize novel project: $title

Created directory structure and canon templates.
Format: $format

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)" || {
    echo "WARNING: Could not create initial commit."
    return 1
  }

  echo "Created initial commit: $(git rev-parse --short HEAD)"
  return 0
}
```

---

### commit_canon_changes()

**Purpose:** Detect and commit user edits to canon files.

**When to Call:**
- Before /novel:outline runs (commit canon before generating structure)
- Before /novel:write runs (commit canon before drafting)
- When /novel:status runs (opportunistic commit)

**Invocation Pattern:**

Since there is no continuous daemon watching for file changes, canon change
detection happens at command invocation points. Commands should call
commit_canon_changes() at the start of their execution, before reading canon.

This ensures:
1. User edits are versioned before being used
2. Clear git history showing canon evolution
3. Ability to rollback if generated content is poor

**Pattern:**

```markdown
1. Check git config (git_integration.enabled AND auto_commit_canon)
   - If either false, skip silently

2. Check for changed canon files:
   git status --porcelain canon/

3. If output is empty:
   - No changes to commit
   - Return (no action needed)

4. If changes detected:
   a. Parse which files changed from git status output

   b. Determine commit message based on changed files:
      - premise.md -> "Update premise"
      - characters.md -> "Update character profiles"
      - world.md -> "Update world building"
      - style_guide.md -> "Update style guide"
      - timeline.md -> "Update timeline"
      - constraints.md -> "Update constraints"
      - Multiple files -> "Update canon files"

   c. Stage canon directory:
      git add canon/

   d. Commit:
      "[message]

      Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

5. Return commit hash
```

**Bash Implementation:**

```bash
# Detect and commit canon changes
commit_canon_changes() {
  # Check if git available and in repo
  if ! git rev-parse --is-inside-work-tree &>/dev/null; then
    return 1
  fi

  # Check for changes
  local changed_files
  changed_files=$(git status --porcelain canon/ 2>/dev/null)

  if [ -z "$changed_files" ]; then
    # No changes
    return 0
  fi

  # Determine message based on changed files
  local msg="Update canon files"

  if echo "$changed_files" | grep -q "premise.md"; then
    msg="Update premise"
  elif echo "$changed_files" | grep -q "characters.md"; then
    msg="Update character profiles"
  elif echo "$changed_files" | grep -q "world.md"; then
    msg="Update world building"
  elif echo "$changed_files" | grep -q "style_guide.md"; then
    msg="Update style guide"
  elif echo "$changed_files" | grep -q "timeline.md"; then
    msg="Update timeline"
  elif echo "$changed_files" | grep -q "constraints.md"; then
    msg="Update constraints"
  fi

  # If multiple files changed, use generic message
  local file_count
  file_count=$(echo "$changed_files" | wc -l)
  if [ "$file_count" -gt 1 ]; then
    msg="Update canon files"
  fi

  # Stage and commit
  git add canon/

  git commit -m "$(cat <<EOF
$msg

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)" || {
    echo "WARNING: Could not commit canon changes."
    return 1
  }

  echo "Committed canon changes: $(git rev-parse --short HEAD)"
  return 0
}
```

---

### commit_scene_completion(scene_id)

**Purpose:** Commit a completed scene after it passes quality checks.

**Parameters:**
- `scene_id`: Scene identifier (e.g., "ch01_s01")

**When to Call:**
- After scene passes quality gate (drafted + checked status)
- After revision completes

**Pattern:**

```markdown
1. Check git config (git_integration.enabled AND auto_commit_scenes)
   - If either false, skip silently

2. Determine scene file path:
   draft/scenes/[scene_id].md

3. Check scene file exists
   - If not, return with warning

4. Get scene metadata from story_state.json:
   - chapter number
   - scene number
   - word count
   - scene title (if available from beats)

5. Stage scene and state files:
   git add draft/scenes/[scene_id].md
   git add state/story_state.json
   git add state/character_state.json (if exists)
   git add state/timeline_state.json (if exists)

6. Commit:
   "Complete scene [scene_id]: [title or description]

   Chapter [X], Scene [Y]
   Word count: [count]

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

7. Return commit hash
```

**Bash Implementation:**

```bash
# Commit completed scene
commit_scene_completion() {
  local scene_id="$1"
  local title="${2:-Scene}"
  local word_count="${3:-0}"

  # Check if git available and in repo
  if ! git rev-parse --is-inside-work-tree &>/dev/null; then
    return 1
  fi

  # Check scene file exists
  if [ ! -f "draft/scenes/${scene_id}.md" ]; then
    echo "WARNING: Scene file not found: draft/scenes/${scene_id}.md"
    return 1
  fi

  # Parse scene_id to get chapter and scene numbers
  # Format: chXX_sYY
  local chapter scene
  chapter=$(echo "$scene_id" | sed 's/ch\([0-9]*\)_s.*/\1/' | sed 's/^0*//')
  scene=$(echo "$scene_id" | sed 's/ch[0-9]*_s\([0-9]*\)/\1/' | sed 's/^0*//')

  # Stage files
  git add "draft/scenes/${scene_id}.md"
  git add state/story_state.json 2>/dev/null
  git add state/character_state.json 2>/dev/null
  git add state/timeline_state.json 2>/dev/null

  # Commit
  git commit -m "$(cat <<EOF
Complete scene ${scene_id}: ${title}

Chapter ${chapter}, Scene ${scene}
Word count: ${word_count}

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)" || {
    echo "WARNING: Could not commit scene completion."
    return 1
  }

  echo "Committed scene: $(git rev-parse --short HEAD)"
  return 0
}
```

---

### commit_outline()

**Purpose:** Commit generated outline and beat plan.

**When to Call:**
- After /novel:outline completes successfully

**Pattern:**

```markdown
1. Check git config (git_integration.enabled)
   - If false, skip silently

2. Stage outline files:
   git add beats/outline.md
   git add beats/act_structure.md
   git add beats/beat_plan.md
   git add state/story_state.json

3. Commit:
   "Generate story outline

   Created story structure and scene beat plan.
   Total planned scenes: [count]

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

4. Return commit hash
```

---

### commit_revision(scene_id, issue_addressed)

**Purpose:** Commit a revised scene.

**Parameters:**
- `scene_id`: Scene identifier
- `issue_addressed`: Brief description of what was fixed

**Pattern:**

```markdown
1. Check git config

2. Stage revised scene and state:
   git add draft/scenes/[scene_id].md
   git add state/*.json

3. Commit:
   "Revise scene [scene_id]: [issue_addressed]

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

4. Return commit hash
```

---

## Auto-Commit Scenarios

### When to Auto-Commit

| Scenario | Function | Trigger |
|----------|----------|---------|
| Project initialized | commit_init() | /novel:init completes |
| User edits canon | commit_canon_changes() | Before /novel:outline, /novel:write, /novel:status |
| Outline generated | commit_outline() | /novel:outline completes |
| Scene drafted + checked | commit_scene_completion() | After quality gate passes |
| Scene revised | commit_revision() | After revision accepted |

### When NOT to Auto-Commit

| Scenario | Reason |
|----------|--------|
| State file update | Too frequent, creates noise |
| Planning phase work | Intermediate, incomplete |
| Check failures | Should not commit broken state |
| Errors or exceptions | Should not commit error state |

---

## Graceful Degradation

Git operations should NEVER block the main workflow.

**If git not available:**
```markdown
1. Log warning once: "Git not available - version control disabled"
2. Continue with normal operation
3. User can still use the tool without git
```

**If git operation fails:**
```markdown
1. Log warning: "Could not commit [operation]: [error]"
2. Continue with normal operation
3. Changes are still saved to files
4. User can commit manually if desired
```

**If git_integration disabled in config:**
```markdown
1. Skip git operations silently
2. No warnings needed (user explicitly disabled)
3. Continue with normal operation
```

---

## Commit Message Format

All commits follow this format:

```
[type]: [short description]

[optional body with details]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**Types used:**
- `Initialize novel project: [title]` - Initial setup
- `Update [canon file]` - Canon changes
- `Generate story outline` - Outline creation
- `Complete scene [id]: [title]` - Scene completion
- `Revise scene [id]: [issue]` - Scene revision

**Always use heredoc for multi-line messages:**

```bash
git commit -m "$(cat <<'EOF'
Message line 1

Message line 2

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

---

## Safety Rules

1. **Never force push:** No `git push --force`
2. **Never amend:** Always create new commits
3. **Never delete:** No `git branch -D`, no destructive operations
4. **Never commit secrets:** Ensure .gitignore excludes sensitive files
5. **Always verify before commit:** Check files exist and are valid
6. **Always use Co-Authored-By:** Credit AI assistance
7. **Always graceful degradation:** Git failure should not break workflow

---

*Git Integration Skill v1.0*
*For use with Novel Engine auto-commit functionality*
