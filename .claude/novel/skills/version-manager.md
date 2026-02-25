---
name: version-manager
description: Reusable skill for creating, comparing, and restoring draft snapshots
version: 1.0
---

# Version Manager Skill

This skill provides standardized patterns for version management operations in Novel Engine. Commands invoke these patterns to create snapshots, compare versions, and restore previous drafts.

## Philosophy

**Snapshots Capture Milestones:**
- Create snapshot after revision cycle completes
- Create snapshot before publishing
- Allow manual snapshots at any time

**Non-Destructive by Default:**
- Snapshots are full copies, not incremental
- Rollback creates backup of current before restoring
- Original files always preserved until explicit deletion

**Git Complementary:**
- Snapshots are file-level backups, not git replacements
- Use git for fine-grained history
- Use snapshots for named restore points

---

## Directory Structure

Snapshots are stored in `draft/versions/` with timestamped directories:

```
draft/
└── versions/
    ├── README.md                    # This template explains the structure
    ├── 2026-02-24_14-30-00/         # Snapshot directory
    │   ├── manifest.json            # Snapshot metadata
    │   ├── ch01_s01.md              # Scene copies
    │   ├── ch01_s02.md
    │   └── ...
    ├── 2026-02-25_09-15-30/
    │   ├── manifest.json
    │   └── ...
    └── ...
```

**Directory Naming:** `YYYY-MM-DD_HH-MM-SS`
- ISO 8601 date format for sorting
- Underscores for filesystem compatibility
- 24-hour time format

---

## Manifest Format

Each snapshot contains a `manifest.json` file:

```json
{
  "snapshot_id": "snap_2026-02-24_14-30-00",
  "timestamp": "2026-02-24T14:30:00Z",
  "trigger": "revision_cycle",
  "scenes_included": ["ch01_s01", "ch01_s02", "ch02_s01"],
  "scenes_count": 3,
  "total_word_count": 7500,
  "source_commit": "abc1234",
  "notes": "After completing first revision pass"
}
```

**Manifest Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `snapshot_id` | string | Unique ID: `snap_YYYY-MM-DD_HH-MM-SS` |
| `timestamp` | string | ISO 8601 timestamp of snapshot creation |
| `trigger` | string | What triggered this snapshot |
| `scenes_included` | array | List of scene IDs in this snapshot |
| `scenes_count` | integer | Number of scenes included |
| `total_word_count` | integer | Combined word count of all scenes |
| `source_commit` | string | Git commit hash at snapshot time (if available) |
| `notes` | string | Optional user notes about this snapshot |

**Trigger Values:**

| Trigger | When Created |
|---------|--------------|
| `revision_cycle` | After `/novel:check` completes a revision cycle |
| `manual` | User explicitly requested snapshot |
| `pre_publish` | Before `/novel:publish` runs |

---

## Functions

### create_snapshot(trigger, notes)

**Purpose:** Create a new snapshot of all drafted/approved scenes.

**Parameters:**
- `trigger`: One of `revision_cycle`, `manual`, `pre_publish`
- `notes`: Optional string describing this snapshot

**Returns:** Snapshot ID or null on failure

**Pattern:**

```markdown
1. Generate timestamp:
   - Use current UTC time
   - Format: YYYY-MM-DD_HH-MM-SS
   - Snapshot ID: snap_YYYY-MM-DD_HH-MM-SS

2. Create snapshot directory:
   mkdir -p draft/versions/YYYY-MM-DD_HH-MM-SS/

3. Identify scenes to include:
   a. Read state/story_state.json
   b. Filter scene_index for status in ["drafted", "approved", "needs_revision"]
   c. Collect scene IDs

4. Copy each scene:
   - Source: draft/scenes/{scene_id}.md
   - Destination: draft/versions/YYYY-MM-DD_HH-MM-SS/{scene_id}.md
   - Skip if source doesn't exist (log warning)

5. Calculate total word count:
   - Sum word_count from each scene's frontmatter
   - Or from story_state.json scene_index entries

6. Get git commit (if available):
   git rev-parse --short HEAD 2>/dev/null || echo ""

7. Create manifest.json:
   {
     "snapshot_id": "snap_YYYY-MM-DD_HH-MM-SS",
     "timestamp": "ISO 8601 timestamp",
     "trigger": trigger,
     "scenes_included": [array of scene IDs],
     "scenes_count": count,
     "total_word_count": sum,
     "source_commit": "hash or empty",
     "notes": notes or ""
   }

8. Update story_state.json:
   a. Add entry to versions.snapshots array
   b. Set versions.last_snapshot to snapshot_id

9. Return snapshot_id
```

**Bash Implementation:**

```bash
# Create a new snapshot
create_snapshot() {
  local trigger="${1:-manual}"
  local notes="${2:-}"

  # Generate timestamp
  local ts=$(date -u +"%Y-%m-%d_%H-%M-%S")
  local snapshot_id="snap_${ts}"
  local snapshot_dir="draft/versions/${ts}"

  # Create directory
  mkdir -p "$snapshot_dir" || {
    echo "ERROR: Could not create snapshot directory"
    return 1
  }

  # Find scenes to copy
  local scene_count=0
  local total_words=0
  local scenes_json="[]"

  for scene_file in draft/scenes/ch*.md; do
    if [ -f "$scene_file" ]; then
      local scene_id=$(basename "$scene_file" .md)
      cp "$scene_file" "$snapshot_dir/"

      # Extract word count from frontmatter
      local wc=$(grep -m1 "^word_count:" "$scene_file" | sed 's/word_count: *//')
      total_words=$((total_words + ${wc:-0}))

      scenes_json=$(echo "$scenes_json" | jq --arg id "$scene_id" '. + [$id]')
      scene_count=$((scene_count + 1))
    fi
  done

  # Get git commit if available
  local commit=""
  if git rev-parse --is-inside-work-tree &>/dev/null; then
    commit=$(git rev-parse --short HEAD 2>/dev/null || echo "")
  fi

  # Create manifest
  local iso_ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

  cat > "$snapshot_dir/manifest.json" <<EOF
{
  "snapshot_id": "$snapshot_id",
  "timestamp": "$iso_ts",
  "trigger": "$trigger",
  "scenes_included": $scenes_json,
  "scenes_count": $scene_count,
  "total_word_count": $total_words,
  "source_commit": "$commit",
  "notes": "$notes"
}
EOF

  echo "Created snapshot: $snapshot_id ($scene_count scenes, $total_words words)"
  echo "$snapshot_id"
  return 0
}
```

---

### compare_versions(version_a, version_b)

**Purpose:** Generate word-level diff between two versions.

**Parameters:**
- `version_a`: Snapshot ID or "current" for draft/scenes/
- `version_b`: Snapshot ID or "current" for draft/scenes/

**Returns:** Unified diff output

**Pattern:**

```markdown
1. Resolve paths:
   - If version_a == "current": path_a = "draft/scenes"
   - Else: path_a = "draft/versions/{version_a without snap_ prefix}"

   - If version_b == "current": path_b = "draft/scenes"
   - Else: path_b = "draft/versions/{version_b without snap_ prefix}"

2. Validate both paths exist:
   - If either missing, return error

3. Get common scenes:
   - List scenes in path_a
   - List scenes in path_b
   - Find intersection

4. For each common scene, generate diff:

   a. Try git diff (word-level):
      git diff --no-index --word-diff --color=never \
        path_a/{scene_id}.md path_b/{scene_id}.md

   b. If git not available, fall back to diff:
      diff -u path_a/{scene_id}.md path_b/{scene_id}.md

5. Format output:
   - Header: "## Comparing: {version_a} vs {version_b}"
   - For each scene: "### Scene: {scene_id}"
   - Diff content
   - Summary: "Changes in X of Y scenes"

6. Return formatted diff
```

**Bash Implementation:**

```bash
# Compare two versions with word-level diff
compare_versions() {
  local version_a="$1"
  local version_b="$2"

  # Resolve paths
  local path_a path_b

  if [ "$version_a" = "current" ]; then
    path_a="draft/scenes"
  else
    # Remove snap_ prefix if present
    local dir_a="${version_a#snap_}"
    path_a="draft/versions/$dir_a"
  fi

  if [ "$version_b" = "current" ]; then
    path_b="draft/scenes"
  else
    local dir_b="${version_b#snap_}"
    path_b="draft/versions/$dir_b"
  fi

  # Validate paths exist
  if [ ! -d "$path_a" ]; then
    echo "ERROR: Version not found: $version_a (path: $path_a)"
    return 1
  fi

  if [ ! -d "$path_b" ]; then
    echo "ERROR: Version not found: $version_b (path: $path_b)"
    return 1
  fi

  echo "## Comparing: $version_a vs $version_b"
  echo ""

  local changed=0
  local total=0

  # Compare each scene in version_a
  for scene_file in "$path_a"/ch*.md; do
    if [ -f "$scene_file" ]; then
      local scene_id=$(basename "$scene_file" .md)
      total=$((total + 1))

      local other_file="$path_b/$scene_id.md"

      if [ -f "$other_file" ]; then
        echo "### Scene: $scene_id"
        echo ""

        # Use git diff for word-level comparison
        if git --version &>/dev/null; then
          local diff_output
          diff_output=$(git diff --no-index --word-diff=plain \
            "$scene_file" "$other_file" 2>/dev/null || true)

          if [ -n "$diff_output" ]; then
            echo '```diff'
            echo "$diff_output"
            echo '```'
            changed=$((changed + 1))
          else
            echo "*No changes*"
          fi
        else
          # Fallback to standard diff
          local diff_output
          diff_output=$(diff -u "$scene_file" "$other_file" 2>/dev/null || true)

          if [ -n "$diff_output" ]; then
            echo '```diff'
            echo "$diff_output"
            echo '```'
            changed=$((changed + 1))
          else
            echo "*No changes*"
          fi
        fi
        echo ""
      else
        echo "### Scene: $scene_id"
        echo "*Only in $version_a*"
        echo ""
        changed=$((changed + 1))
      fi
    fi
  done

  # Check for scenes only in version_b
  for scene_file in "$path_b"/ch*.md; do
    if [ -f "$scene_file" ]; then
      local scene_id=$(basename "$scene_file" .md)
      local other_file="$path_a/$scene_id.md"

      if [ ! -f "$other_file" ]; then
        echo "### Scene: $scene_id"
        echo "*Only in $version_b*"
        echo ""
        changed=$((changed + 1))
        total=$((total + 1))
      fi
    fi
  done

  echo "---"
  echo "**Summary:** Changes in $changed of $total scenes"
  return 0
}
```

**Word Diff Format:**

The `--word-diff=plain` option shows changes at word level:

```diff
[-old word-]{+new word+}
```

This is much more useful for prose comparison than line-based diffs.

---

### rollback_scene(snapshot_id, scene_id)

**Purpose:** Restore a single scene from a snapshot.

**Parameters:**
- `snapshot_id`: Source snapshot (e.g., "snap_2026-02-24_14-30-00")
- `scene_id`: Scene to restore (e.g., "ch01_s01"), or "all" for all scenes

**Returns:** Boolean success indicator

**Pattern:**

```markdown
1. Resolve snapshot path:
   - Remove snap_ prefix: dir = snapshot_id without "snap_"
   - Full path: draft/versions/{dir}/

2. Validate snapshot exists:
   - Check directory exists
   - Check manifest.json exists
   - If not, return error

3. If scene_id == "all":
   - Get scene list from manifest.json
   - Process each scene
   Else:
   - Process single scene

4. For each scene to restore:

   a. Check source exists in snapshot:
      draft/versions/{dir}/{scene_id}.md
      - If not, skip with warning

   b. Backup current scene:
      - If draft/scenes/{scene_id}.md exists:
        - Copy to draft/scenes/{scene_id}.md.bak
        - Append timestamp to backup name

   c. Copy from snapshot to current:
      cp draft/versions/{dir}/{scene_id}.md draft/scenes/{scene_id}.md

   d. Update scene status in story_state.json:
      - Set status to "drafted" (reset from approved if applicable)
      - Clear last_check timestamp
      - Add note to revision_history

5. Update story_state.json versions.last_rollback:
   {
     "snapshot_id": snapshot_id,
     "timestamp": "ISO 8601 now",
     "scenes_restored": [list of scene IDs]
   }

6. Return success
```

**Bash Implementation:**

```bash
# Rollback scene(s) from a snapshot
rollback_scene() {
  local snapshot_id="$1"
  local scene_id="${2:-all}"

  # Resolve snapshot path
  local dir="${snapshot_id#snap_}"
  local snapshot_path="draft/versions/$dir"

  # Validate snapshot exists
  if [ ! -d "$snapshot_path" ]; then
    echo "ERROR: Snapshot not found: $snapshot_id"
    echo "Path: $snapshot_path"
    return 1
  fi

  if [ ! -f "$snapshot_path/manifest.json" ]; then
    echo "ERROR: Snapshot manifest missing: $snapshot_path/manifest.json"
    return 1
  fi

  local restored_count=0
  local backup_ts=$(date +"%Y%m%d_%H%M%S")

  # Determine scenes to restore
  if [ "$scene_id" = "all" ]; then
    # Get all scenes from snapshot
    for scene_file in "$snapshot_path"/ch*.md; do
      if [ -f "$scene_file" ]; then
        local sid=$(basename "$scene_file" .md)
        restore_single_scene "$snapshot_path" "$sid" "$backup_ts"
        restored_count=$((restored_count + 1))
      fi
    done
  else
    # Restore single scene
    local source_file="$snapshot_path/${scene_id}.md"
    if [ ! -f "$source_file" ]; then
      echo "ERROR: Scene not in snapshot: $scene_id"
      return 1
    fi

    restore_single_scene "$snapshot_path" "$scene_id" "$backup_ts"
    restored_count=1
  fi

  echo "Restored $restored_count scene(s) from $snapshot_id"
  echo "Backups created with suffix: .bak.$backup_ts"
  return 0
}

# Helper: restore a single scene
restore_single_scene() {
  local snapshot_path="$1"
  local scene_id="$2"
  local backup_ts="$3"

  local source="$snapshot_path/${scene_id}.md"
  local target="draft/scenes/${scene_id}.md"

  # Backup current if exists
  if [ -f "$target" ]; then
    cp "$target" "${target}.bak.${backup_ts}"
    echo "Backed up: ${target}.bak.${backup_ts}"
  fi

  # Copy from snapshot
  cp "$source" "$target"
  echo "Restored: $scene_id"
}
```

---

### list_snapshots()

**Purpose:** List all available snapshots with metadata.

**Returns:** Formatted list of snapshots

**Pattern:**

```markdown
1. Find all snapshot directories:
   ls -d draft/versions/????-??-??_??-??-??/ 2>/dev/null

2. For each directory:
   a. Read manifest.json
   b. Extract: snapshot_id, timestamp, trigger, scenes_count, total_word_count
   c. Format as table row

3. Output table:
   | Snapshot ID | Date | Trigger | Scenes | Words |
   |-------------|------|---------|--------|-------|
   | snap_2026... | 2026-02-24 14:30 | revision_cycle | 12 | 15000 |

4. Also check story_state.json for last_snapshot marker
```

**Bash Implementation:**

```bash
# List all available snapshots
list_snapshots() {
  echo "| Snapshot ID | Date | Trigger | Scenes | Words |"
  echo "|-------------|------|---------|--------|-------|"

  for dir in draft/versions/????-??-??_??-??-??/; do
    if [ -d "$dir" ]; then
      local manifest="$dir/manifest.json"
      if [ -f "$manifest" ]; then
        local sid=$(jq -r '.snapshot_id' "$manifest")
        local ts=$(jq -r '.timestamp' "$manifest" | cut -c1-16 | tr 'T' ' ')
        local trigger=$(jq -r '.trigger' "$manifest")
        local scenes=$(jq -r '.scenes_count' "$manifest")
        local words=$(jq -r '.total_word_count' "$manifest")

        echo "| $sid | $ts | $trigger | $scenes | $words |"
      fi
    fi
  done
}
```

---

### delete_snapshot(snapshot_id)

**Purpose:** Remove a snapshot to free disk space.

**Parameters:**
- `snapshot_id`: Snapshot to delete

**Returns:** Boolean success indicator

**Pattern:**

```markdown
1. Resolve path:
   dir = snapshot_id without "snap_"
   path = draft/versions/{dir}/

2. Validate exists:
   - If not, return error

3. Confirm deletion (when called interactively):
   - Show snapshot metadata
   - Require explicit confirmation

4. Remove directory:
   rm -rf draft/versions/{dir}/

5. Update story_state.json:
   - Remove from versions.snapshots array
   - Clear last_snapshot if it matches
   - Clear last_rollback if it references this snapshot

6. Return success
```

**Safety Note:** This is a destructive operation. Always verify snapshot_id before deletion.

---

## Integration with State Manager

Version management integrates with story_state.json via the state-manager skill.

**Reading version data:**

```markdown
1. Load story_state.json using state-manager
2. Access versions object:
   - versions.snapshots: Array of snapshot entries
   - versions.last_snapshot: Most recent snapshot ID
   - versions.last_rollback: Last rollback details
```

**Writing version data:**

```markdown
1. Load current state
2. Update versions object:
   - For new snapshot: append to snapshots array, set last_snapshot
   - For rollback: set last_rollback object
3. Save using state-manager
```

**Snapshot entry in state:**

```json
{
  "snapshot_id": "snap_2026-02-24_14-30-00",
  "timestamp": "2026-02-24T14:30:00Z",
  "trigger": "revision_cycle",
  "scenes_count": 12
}
```

Note: Full manifest lives in the snapshot directory, state only tracks summary.

---

## Error Handling

### Snapshot Creation Errors

| Error | Cause | Recovery |
|-------|-------|----------|
| Directory creation failed | Permissions | Check draft/versions/ permissions |
| No scenes to snapshot | Empty draft | Complete at least one scene first |
| State update failed | Corrupted state | Snapshot still valid, fix state manually |

### Comparison Errors

| Error | Cause | Recovery |
|-------|-------|----------|
| Version not found | Invalid ID | List snapshots to see available |
| No common scenes | Completely different versions | May be comparing wrong snapshots |
| Git not available | Git not installed | Falls back to standard diff |

### Rollback Errors

| Error | Cause | Recovery |
|-------|-------|----------|
| Snapshot not found | Deleted or invalid ID | List available snapshots |
| Scene not in snapshot | Scene created after snapshot | Cannot restore what wasn't captured |
| Backup failed | Disk full | Free space, retry |
| State update failed | Corrupted state | Files restored, fix state manually |

---

## Common Workflows

### Create Manual Snapshot

```markdown
1. User requests snapshot via command or agent
2. Call create_snapshot("manual", "Before major revision")
3. Verify snapshot created:
   - Check directory exists
   - Check manifest.json valid
   - Check state updated
4. Report snapshot ID to user
```

### Compare Current to Last Snapshot

```markdown
1. Get last_snapshot from story_state.json
2. Call compare_versions(last_snapshot, "current")
3. Show diff output
4. Highlight scenes with most changes
```

### Restore Scene After Bad Edit

```markdown
1. List available snapshots
2. User selects snapshot
3. Call rollback_scene(snapshot_id, "ch03_s02")
4. Verify restore:
   - Check backup created
   - Check scene content matches snapshot
5. Inform user scene status reset to "drafted"
```

### Automated Post-Revision Snapshot

```markdown
After /novel:check completes a full revision cycle:

1. Check if any scenes were approved this cycle
2. If yes, call create_snapshot("revision_cycle", "Revision cycle N complete")
3. Log snapshot ID
4. Continue with normal flow
```

---

## Cleanup and Maintenance

### Pruning Old Snapshots

Over time, snapshots accumulate. Suggested cleanup strategy:

```markdown
1. Keep last 5 snapshots always
2. Keep all pre_publish snapshots
3. For revision_cycle snapshots older than 30 days:
   - Keep every 3rd one
   - Delete others
4. Never auto-delete; require user confirmation
```

### Disk Space Estimation

Each snapshot copies all drafted scenes. Estimate:

```
Snapshot size = (number of scenes) * (average scene size)
               = 30 scenes * 10KB average = 300KB per snapshot
               = 10 snapshots = 3MB

Total: Usually <10MB even for large projects
```

### Backup Cleanup

Rollback creates `.bak` files. Clean periodically:

```bash
# Find old backups (>7 days)
find draft/scenes -name "*.bak.*" -mtime +7

# Remove after verification
find draft/scenes -name "*.bak.*" -mtime +7 -delete
```

---

## Safety Rules

1. **Never delete without confirmation:** Snapshot deletion is permanent
2. **Always backup before rollback:** Create .bak file first
3. **Preserve manifest integrity:** Manifest is source of truth for snapshot
4. **Handle missing files gracefully:** Skip with warning, don't fail entirely
5. **Update state atomically:** Use state-manager patterns
6. **Log all operations:** Help user track what happened

---

*Version Manager Skill v1.0*
*For use with Novel Engine version control functionality*
