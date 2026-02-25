# Versions Directory

**Purpose:** Timestamped snapshots of scene files for version history and recovery.

**Who Edits:** Managed by version-manager skill. Manual edits not recommended.

**When Updated:** After revision cycles, before publishing, or on manual request.

---

## Directory Structure

```
versions/
├── README.md                         # This file
├── 2026-02-20_10-00-00/              # Snapshot directory (timestamp format)
│   ├── manifest.json                 # Snapshot metadata
│   ├── ch01_s01.md                   # Scene copies
│   ├── ch01_s02.md
│   └── ...
├── 2026-02-22_15-30-00/
│   ├── manifest.json
│   └── ...
└── 2026-02-24_14-30-00/
    ├── manifest.json
    └── ...
```

---

## Snapshot Directory Naming

Format: `YYYY-MM-DD_HH-MM-SS`

- **Date:** ISO 8601 format (year-month-day)
- **Time:** 24-hour format (hour-minute-second)
- **Separator:** Underscores for filesystem compatibility
- **Sorting:** Chronological when sorted alphabetically

Example: `2026-02-24_14-30-00` = February 24, 2026 at 2:30:00 PM UTC

---

## Manifest File

Each snapshot contains a `manifest.json` with metadata:

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

**Fields:**

| Field | Description |
|-------|-------------|
| `snapshot_id` | Unique identifier (snap_ + timestamp) |
| `timestamp` | ISO 8601 creation time |
| `trigger` | What caused this snapshot |
| `scenes_included` | List of scene IDs in this snapshot |
| `scenes_count` | Number of scenes |
| `total_word_count` | Combined word count |
| `source_commit` | Git commit hash (if available) |
| `notes` | Optional description |

---

## Triggers

Snapshots are created automatically or manually:

| Trigger | When Created | Purpose |
|---------|--------------|---------|
| `revision_cycle` | After `/novel:check` completes a revision cycle | Track revision progress |
| `manual` | User explicitly requests snapshot | Preserve specific point |
| `pre_publish` | Before `/novel:publish` runs | Safety backup |

---

## Usage

For snapshot operations, see the **version-manager** skill:

```
.claude/novel/skills/version-manager.md
```

**Common operations:**

1. **Create snapshot:** Automatically triggered or manual request
2. **List snapshots:** View all available versions
3. **Compare versions:** Word-level diff between snapshots
4. **Rollback scene:** Restore from previous snapshot

---

## Storage Notes

- **Size:** Each snapshot is a full copy of all scenes (not incremental)
- **Growth:** Accumulates over time; consider pruning old snapshots
- **Backup:** This directory should be included in project backups
- **Git:** Recommend adding to `.gitignore` to avoid repository bloat

**Estimated size:**

```
30 scenes * 10KB average = 300KB per snapshot
10 snapshots = 3MB total
```

---

## Manual Cleanup

To remove old snapshots:

1. List available snapshots
2. Identify ones no longer needed
3. Delete the directory (e.g., `rm -rf 2026-02-20_10-00-00/`)
4. Update `story_state.json` to remove from `versions.snapshots` array

**Caution:** Deleted snapshots cannot be recovered. Consider keeping:
- All `pre_publish` snapshots
- Last 5 snapshots regardless of trigger
- At least one per major revision milestone

---

*Snapshots provide safety during the revision process. Use them freely.*
