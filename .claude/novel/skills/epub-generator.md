---
name: epub-generator
description: Reusable skill for generating EPUB files from compiled novel scenes using Pandoc
version: 1.0
---

# EPUB Generator Skill

This skill provides standardized patterns for generating EPUB files from drafted and approved novel scenes. It uses Pandoc for EPUB generation with proper metadata, styling, and chapter structure.

## Overview

The EPUB generation process:

1. **Prerequisites:** Verify Pandoc installation
2. **Metadata:** Prepare YAML metadata from canon/premise.md
3. **Compilation:** Order scenes by chapter and scene number
4. **Generation:** Run Pandoc with EPUB options
5. **Validation:** Optional epubcheck verification
6. **Output:** Final EPUB in draft/compiled/novel.epub

---

## Prerequisites

### Check Pandoc Installation

Before running EPUB generation, verify Pandoc is available:

```bash
# Check Pandoc installation
check_pandoc() {
  if ! command -v pandoc &> /dev/null; then
    echo "ERROR: Pandoc is not installed."
    echo ""
    echo "Install Pandoc using one of these methods:"
    echo "  - Debian/Ubuntu: sudo apt-get install pandoc"
    echo "  - macOS (Homebrew): brew install pandoc"
    echo "  - Windows: choco install pandoc"
    echo "  - Download: https://pandoc.org/installing.html"
    echo ""
    echo "After installation, run 'pandoc --version' to verify."
    return 1
  fi

  # Display version for debugging
  echo "Pandoc found: $(pandoc --version | head -n 1)"
  return 0
}
```

### Minimum Version Requirements

- Pandoc 2.0+ required for EPUB3 generation
- Recommended: Pandoc 2.14+ for best EPUB3 support

```bash
# Check Pandoc version meets minimum
check_pandoc_version() {
  local version
  version=$(pandoc --version | head -n 1 | grep -oP '\d+\.\d+')
  local major minor
  major=$(echo "$version" | cut -d. -f1)
  minor=$(echo "$version" | cut -d. -f2)

  if [ "$major" -lt 2 ]; then
    echo "WARNING: Pandoc version $version is outdated."
    echo "EPUB3 generation requires Pandoc 2.0+"
    echo "Some features may not work correctly."
    return 1
  fi

  return 0
}
```

---

## Metadata Preparation

### Metadata File Location

```
draft/compiled/metadata.yaml
```

### Initialize Metadata from Canon

Extract metadata from canon/premise.md and create metadata.yaml:

```markdown
## Metadata Initialization Pattern

1. Check if draft/compiled/metadata.yaml exists
   - If exists, use existing (preserve manual edits)
   - If not exists, initialize from template

2. Read canon/premise.md for initial values:
   - Look for "Title:" line -> extract title
   - Look for "Author:" line -> extract author name
   - Look for "Logline:" or "Synopsis:" -> extract description

3. Read state/style_state.json for language:
   - Check if language field exists
   - Default to "ko" for Korean (or "en" for English)

4. Generate UUID if identifier not set:
   - Use uuidgen command or Python uuid.uuid4()

5. Set current date for publication date

6. Check for cover image:
   - Look for images/cover.png or images/cover.jpg
   - If found, set cover-image path
```

### Metadata Template

Copy from `.claude/novel/templates/epub/metadata.yaml` and fill in values:

```yaml
---
title:
  - type: main
    text: "Novel Title Here"

creator:
  - role: author
    text: "Author Name"

identifier:
  - scheme: UUID
    text: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

language: ko

rights: "Copyright 2026 Author Name. All Rights Reserved."

date: "2026-01-01"

cover-image: ""

description: |
  Book description or synopsis here.

subject:
  - Fiction

publisher: "Self-Published"

css: "epub.css"
---
```

### Required Fields Validation

Before generating EPUB, validate metadata:

```markdown
## Metadata Validation

Required fields (will cause error if missing):
- title (at least one title entry with text)
- creator (at least one creator with role "author")
- language (ISO 639-1 code: en, ko, ja, zh, etc.)

Optional but recommended:
- identifier (UUID for book identity)
- description (blurb for e-readers)
- rights (copyright notice)
- date (publication date)
- cover-image (path to cover graphic)
```

---

## Scene Compilation

### Reading Scene Order from State

Scenes must be compiled in correct reading order based on story_state.json:

```markdown
## Scene Order Compilation Pattern

1. Load story_state.json
   - Read scene_index array

2. Filter scenes by status:
   - Default: Include only status == "approved"
   - With --include-drafts flag: Also include status == "drafted"
   - Never include: "planned", "needs_revision"

3. Sort scenes by tuple (chapter, scene):
   - Primary sort: chapter number ascending
   - Secondary sort: scene number ascending
   - Result: ch01_s01, ch01_s02, ch02_s01, ch02_s02...

4. Build file path list:
   - For each scene in sorted order:
   - Path: draft/scenes/{scene_id}.md
   - Verify file exists before including

5. Handle missing files:
   - If scene file missing, log warning
   - Skip that scene, continue with rest
   - Report missing scenes at end
```

### Scene Compilation Script

```bash
# Compile scene list for Pandoc
compile_scene_list() {
  local include_drafts="${1:-false}"
  local scene_files=""
  local missing_files=""

  # Read scene_index from story_state.json
  # Filter and sort by chapter, scene
  local scenes
  if [ "$include_drafts" = "true" ]; then
    scenes=$(jq -r '.scene_index[] | select(.status == "approved" or .status == "drafted") | "\(.chapter).\(.scene).\(.id)"' state/story_state.json | sort -t. -k1,1n -k2,2n)
  else
    scenes=$(jq -r '.scene_index[] | select(.status == "approved") | "\(.chapter).\(.scene).\(.id)"' state/story_state.json | sort -t. -k1,1n -k2,2n)
  fi

  # Build file list
  for scene_info in $scenes; do
    local scene_id
    scene_id=$(echo "$scene_info" | cut -d. -f3)
    local scene_path="draft/scenes/${scene_id}.md"

    if [ -f "$scene_path" ]; then
      scene_files="$scene_files $scene_path"
    else
      missing_files="$missing_files $scene_id"
    fi
  done

  # Report missing files
  if [ -n "$missing_files" ]; then
    echo "WARNING: Missing scene files:$missing_files" >&2
  fi

  # Return file list
  echo "$scene_files"
}
```

### Empty Scene Handling

```markdown
## No Approved Scenes Warning

If no approved scenes found:

1. Check if any scenes exist at all in scene_index
   - If none: "No scenes found. Run /novel:write to create scenes first."

2. Check if scenes have "drafted" status
   - If yes: "Found [N] drafted scenes but none approved."
   - Suggest: "Run /novel:check to approve scenes, or use --include-drafts flag."

3. If scenes have "needs_revision" status
   - Warn: "Found scenes needing revision. Fix issues before publishing."
```

---

## EPUB Generation

### Pandoc Command

The core EPUB generation command:

```bash
# Generate EPUB from compiled scenes
generate_epub() {
  local output_path="${1:-draft/compiled/novel.epub}"
  local metadata_path="draft/compiled/metadata.yaml"
  local css_path="draft/compiled/epub.css"

  # Get scene files
  local scene_files
  scene_files=$(compile_scene_list)

  if [ -z "$scene_files" ]; then
    echo "ERROR: No approved scenes to compile."
    echo "Run /novel:check to approve scenes or use --include-drafts flag."
    return 1
  fi

  # Ensure metadata exists
  if [ ! -f "$metadata_path" ]; then
    echo "ERROR: Metadata file not found: $metadata_path"
    echo "Run metadata initialization first."
    return 1
  fi

  # Ensure CSS exists
  if [ ! -f "$css_path" ]; then
    echo "WARNING: CSS file not found, using defaults."
    css_path=""
  fi

  # Build Pandoc command
  local pandoc_cmd="pandoc"
  pandoc_cmd="$pandoc_cmd $metadata_path"
  pandoc_cmd="$pandoc_cmd $scene_files"
  pandoc_cmd="$pandoc_cmd --toc"
  pandoc_cmd="$pandoc_cmd --toc-depth=2"
  pandoc_cmd="$pandoc_cmd --epub-chapter-level=1"

  if [ -n "$css_path" ]; then
    pandoc_cmd="$pandoc_cmd --css=$css_path"
  fi

  pandoc_cmd="$pandoc_cmd -o $output_path"

  # Execute
  echo "Generating EPUB..."
  echo "Command: $pandoc_cmd"

  if eval "$pandoc_cmd"; then
    echo "EPUB generated successfully: $output_path"
    return 0
  else
    echo "ERROR: EPUB generation failed."
    return 1
  fi
}
```

### Pandoc Options Explained

| Option | Purpose |
|--------|---------|
| `--toc` | Generate table of contents |
| `--toc-depth=2` | Include H1 and H2 in TOC |
| `--epub-chapter-level=1` | Start new chapter at H1 headings |
| `--css=epub.css` | Apply custom stylesheet |
| `-o novel.epub` | Output file path |

### Chapter Heading Detection

Pandoc uses Markdown headings to determine chapter structure:

```markdown
## Chapter Detection

- H1 headings (`# Chapter X`) start new EPUB chapters
- Each scene file should have H1 for chapter title
- H2 headings appear in TOC but don't split chapters

Recommended scene structure:
  # Chapter 1
  ## Scene 1: Opening

  [prose]

This ensures proper chapter navigation in e-readers.
```

---

## Validation (Optional)

### Using epubcheck

If epubcheck is installed, validate the generated EPUB:

```bash
# Validate EPUB with epubcheck
validate_epub() {
  local epub_path="${1:-draft/compiled/novel.epub}"

  # Check if epubcheck available
  if ! command -v epubcheck &> /dev/null; then
    echo "INFO: epubcheck not installed. Skipping validation."
    echo "Install: https://github.com/w3c/epubcheck"
    return 0
  fi

  echo "Validating EPUB..."
  if epubcheck "$epub_path"; then
    echo "EPUB validation passed."
    return 0
  else
    echo "WARNING: EPUB validation found issues."
    echo "The file may still be readable but might have compatibility issues."
    return 1
  fi
}
```

### Common Validation Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Missing required metadata | Empty title/author | Fill in metadata.yaml |
| Invalid language code | Wrong format | Use ISO 639-1 (en, ko) |
| Cover image not found | Wrong path | Check images/cover.png exists |
| Invalid date format | Wrong format | Use YYYY-MM-DD |

---

## Output Location

### Default Output Path

```
draft/compiled/
├── metadata.yaml    # EPUB metadata (edit before publish)
├── epub.css         # EPUB styling
└── novel.epub       # Generated EPUB file
```

### Output File Naming

Default: `novel.epub`

For versioned output:
- `novel_v1.epub` - First draft
- `novel_v2.epub` - After revision
- `novel_final.epub` - Publication ready

```bash
# Generate with version suffix
generate_epub "draft/compiled/novel_v$(date +%Y%m%d).epub"
```

---

## Error Handling

### Error Categories

```markdown
## Error Handling Patterns

### CRITICAL (blocks generation)
- Pandoc not installed: Installation instructions
- No approved scenes: Suggest /novel:check or --include-drafts
- Missing metadata file: Suggest initialization

### WARNING (continue with notice)
- Missing scene file: Skip, continue, report at end
- Missing CSS file: Use Pandoc defaults
- Missing cover image: Generate without cover
- epubcheck issues: Report but don't fail

### INFO (informational)
- epubcheck not installed: Skip validation
- Using default values: Note which fields defaulted
```

### Recovery Patterns

```markdown
## Recovery from Common Issues

1. Pandoc not found:
   - Display installation commands for each OS
   - Suggest downloading from pandoc.org

2. No approved scenes:
   - Count total scenes vs approved
   - Suggest --include-drafts if many drafted
   - Suggest /novel:check if not run yet

3. Metadata incomplete:
   - List missing required fields
   - Generate defaults where possible
   - Prompt user to edit metadata.yaml

4. Scene file missing:
   - Log which scene_id is missing
   - Continue with available scenes
   - Report gap in chapter sequence
```

---

## Full Workflow Example

```markdown
## Complete EPUB Generation Workflow

1. **Check Prerequisites**
   Run: check_pandoc
   Expected: "Pandoc found: pandoc 2.x.x"

2. **Prepare Metadata**
   - Copy template: cp .claude/novel/templates/epub/metadata.yaml draft/compiled/
   - Edit: Fill in title, author, description
   - Verify: Check required fields present

3. **Prepare Styling**
   - Copy template: cp .claude/novel/templates/epub/epub.css draft/compiled/
   - Customize: Edit typography if desired

4. **Verify Scenes**
   - Run: /novel:check (if not done)
   - Verify approved scenes in story_state.json

5. **Generate EPUB**
   Run: generate_epub
   Output: draft/compiled/novel.epub

6. **Validate (optional)**
   Run: validate_epub
   Output: Validation report

7. **Review**
   - Open novel.epub in e-reader
   - Check: TOC navigation works
   - Check: Chapter breaks correct
   - Check: Styling applied
```

---

## Integration with /novel:publish

This skill is invoked by the `/novel:publish` command. The command:

1. Calls `check_pandoc()` to verify prerequisites
2. Initializes metadata from canon if needed
3. Calls `compile_scene_list()` to get scene order
4. Calls `generate_epub()` to create EPUB
5. Optionally calls `validate_epub()` if epubcheck available
6. Reports final output location and file size

---

## File Size Estimation

```bash
# Estimate final EPUB size
estimate_epub_size() {
  # Get total word count from story_state
  local word_count
  word_count=$(jq '.progress.total_word_count // 0' state/story_state.json)

  # Rough estimate: 1KB per 1000 words (text only)
  local text_kb=$((word_count / 1000))

  # Check for cover image size
  local cover_kb=0
  if [ -f "images/cover.png" ]; then
    cover_kb=$(du -k "images/cover.png" | cut -f1)
  elif [ -f "images/cover.jpg" ]; then
    cover_kb=$(du -k "images/cover.jpg" | cut -f1)
  fi

  local total_kb=$((text_kb + cover_kb + 50))  # 50KB overhead
  echo "Estimated EPUB size: ${total_kb}KB"
}
```

---

## Graceful Degradation

EPUB generation follows graceful degradation principles:

```markdown
## Degradation Levels

1. **Full functionality**
   - Pandoc installed
   - All scenes approved
   - Metadata complete
   - CSS present
   - Cover image available

2. **Partial functionality**
   - Some scenes missing: Generate with available
   - CSS missing: Use Pandoc defaults
   - Cover missing: Generate without cover

3. **Blocked**
   - Pandoc not installed: Cannot generate
   - No scenes at all: Nothing to compile
   - No metadata: Cannot set required EPUB fields
```

---

*EPUB Generator Skill v1.0*
*For use with Novel Engine publishing workflow*
