# State Directory

**Purpose:** Mutable progress tracking. These JSON files track where you are in the writing process and maintain consistency data.

**Who Edits:** Agents (automatically). You should rarely edit these directly.

**When Updated:** After every significant operation (scene completion, outline generation, etc.)

---

## Files in This Directory

| File | Purpose |
|------|---------|
| `story_state.json` | Project progress, scene index, plot threads |
| `character_state.json` | Character arcs, relationships, voice notes |
| `timeline_state.json` | Events, dates, ordering constraints |
| `style_state.json` | Style choices, phrase usage tracking |

---

## State vs. Canon

**State (this directory):**
- Machine-managed JSON
- Tracks WHERE you are in writing
- Updated automatically by agents
- Committed at milestones only

**Canon (`canon/` directory):**
- Human-editable Markdown
- Defines WHAT the story is
- Changes require your explicit approval
- Committed to git immediately when changed

---

## Schema Version

All state files include a `schema_version` field:

```json
{
  "schema_version": "1.0",
  ...
}
```

This enables future migrations when schemas evolve.

---

## Viewing State

Use `/novel:status` to see a human-readable summary of current state. Avoid editing JSON files directly unless debugging.

---

## Recovery

If a state file becomes corrupted:

1. Check git history: `git log --oneline state/`
2. Recover: `git checkout HEAD~1 -- state/story_state.json`
3. Or reset to defaults: Delete file, run `/novel:status` to regenerate

---

## Example State Entry

From `story_state.json`:

```json
{
  "schema_version": "1.0",
  "project": {
    "title": "Running Free",
    "format": "diary"
  },
  "progress": {
    "outline": "complete",
    "draft": "in_progress"
  },
  "current": {
    "chapter": 3,
    "scene": 2
  }
}
```

This tells agents exactly where you are in the writing process.

---

*State is managed. Trust the system or use /novel:status to inspect.*
