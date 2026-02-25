# Canon Directory

**Purpose:** Immutable truth about your story. These files define the core creative decisions that all agents must respect.

**Who Edits:** You (the author). Agents READ this directory but never write to it.

**When to Update:** When you make deliberate creative decisions that change the story's foundation.

---

## Files in This Directory

| File | Purpose |
|------|---------|
| `premise.md` | Core story concept, genre, theme, logline |
| `characters.md` | Character profiles, arcs, relationships |
| `world.md` | Setting, rules, institutions, conflicts |
| `style_guide.md` | POV, tense, voice, forbidden phrases |
| `timeline.md` | Anchor dates, event sequences, constraints |
| `constraints.md` | Content boundaries, genre conventions, hard rules |

---

## Canon vs. State

**Canon (this directory):**
- Human-editable Markdown
- Defines WHAT the story is
- Changes require your explicit approval
- Committed to git immediately when changed

**State (`state/` directory):**
- Machine-managed JSON
- Tracks WHERE you are in writing
- Updated automatically by agents
- Committed at milestones only

---

## Editing Tips

1. **Use the templates:** Each file has inline examples showing expected format
2. **Be specific:** Vague canon leads to inconsistent output
3. **Think constraints:** What must NEVER happen is as important as what must happen
4. **Commit often:** Git history lets you see how your story evolved

---

## Example Canon Entry

From `characters.md`:

```markdown
## Protagonist

**Name:** Alice Chen
**Age:** 14

**External Goal:** Complete a marathon by year end
**Internal Need:** Learn that progress matters more than perfection
**Fear:** Being seen as ordinary
```

Agents use this to ensure Alice's actions and growth align with her defined arc.

---

*Canon is law. Agents cannot violate canon without your explicit approval.*
