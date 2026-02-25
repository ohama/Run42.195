#!/usr/bin/env bash
# validate-schemas.sh - Validate JSON schemas and default state files
# Usage: bash .claude/novel/schemas/validate-schemas.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PASS_COUNT=0
FAIL_COUNT=0

echo "================================================"
echo "Novel Engine Schema Validation"
echo "================================================"
echo ""

# Colors for output (if terminal supports it)
if [ -t 1 ]; then
    GREEN='\033[0;32m'
    RED='\033[0;31m'
    NC='\033[0m' # No Color
else
    GREEN=''
    RED=''
    NC=''
fi

pass() {
    echo -e "${GREEN}PASS${NC}: $1"
    PASS_COUNT=$((PASS_COUNT + 1))
}

fail() {
    echo -e "${RED}FAIL${NC}: $1"
    FAIL_COUNT=$((FAIL_COUNT + 1))
}

# ============================================
# Test 1: All schema files are valid JSON
# ============================================
echo "--- Test 1: Schema files are valid JSON ---"

for schema in story_state character_state timeline_state style_state; do
    if jq empty "$SCRIPT_DIR/${schema}.schema.json" 2>/dev/null; then
        pass "${schema}.schema.json is valid JSON"
    else
        fail "${schema}.schema.json is invalid JSON"
    fi
done

echo ""

# ============================================
# Test 2: All default files are valid JSON
# ============================================
echo "--- Test 2: Default state files are valid JSON ---"

for state in story_state character_state timeline_state style_state; do
    if jq empty "$SCRIPT_DIR/${state}.default.json" 2>/dev/null; then
        pass "${state}.default.json is valid JSON"
    else
        fail "${state}.default.json is invalid JSON"
    fi
done

echo ""

# ============================================
# Test 3: Schemas have required meta fields
# ============================================
echo "--- Test 3: Schemas have required meta fields ---"

for schema in story_state character_state timeline_state style_state; do
    file="$SCRIPT_DIR/${schema}.schema.json"

    # Check $schema field
    if jq -e '.["$schema"]' "$file" > /dev/null 2>&1; then
        pass "${schema}: has \$schema field"
    else
        fail "${schema}: missing \$schema field"
    fi

    # Check schema_version in properties
    if jq -e '.properties.schema_version' "$file" > /dev/null 2>&1; then
        pass "${schema}: defines schema_version property"
    else
        fail "${schema}: missing schema_version property"
    fi
done

echo ""

# ============================================
# Test 4: Default files have schema_version
# ============================================
echo "--- Test 4: Default files have schema_version ---"

for state in story_state character_state timeline_state style_state; do
    file="$SCRIPT_DIR/${state}.default.json"

    version=$(jq -r '.schema_version // empty' "$file" 2>/dev/null)
    if [ -n "$version" ]; then
        pass "${state}.default.json has schema_version: $version"
    else
        fail "${state}.default.json missing schema_version"
    fi
done

echo ""

# ============================================
# Test 5: story_state schema has required properties
# ============================================
echo "--- Test 5: story_state schema structure ---"

file="$SCRIPT_DIR/story_state.schema.json"
for prop in project progress current open_threads resolved_threads scene_index diary_metadata; do
    if jq -e ".properties.${prop}" "$file" > /dev/null 2>&1; then
        pass "story_state: has '$prop' property"
    else
        fail "story_state: missing '$prop' property"
    fi
done

echo ""

# ============================================
# Test 6: character_state schema has required properties
# ============================================
echo "--- Test 6: character_state schema structure ---"

file="$SCRIPT_DIR/character_state.schema.json"
for prop in characters relationships voice_notes arc_notes; do
    if jq -e ".properties.${prop}" "$file" > /dev/null 2>&1; then
        pass "character_state: has '$prop' property"
    else
        fail "character_state: missing '$prop' property"
    fi
done

echo ""

# ============================================
# Test 7: timeline_state schema has required properties
# ============================================
echo "--- Test 7: timeline_state schema structure ---"

file="$SCRIPT_DIR/timeline_state.schema.json"
for prop in anchors events constraints; do
    if jq -e ".properties.${prop}" "$file" > /dev/null 2>&1; then
        pass "timeline_state: has '$prop' property"
    else
        fail "timeline_state: missing '$prop' property"
    fi
done

echo ""

# ============================================
# Test 8: style_state schema has required properties
# ============================================
echo "--- Test 8: style_state schema structure ---"

file="$SCRIPT_DIR/style_state.schema.json"
for prop in pov tense voice forbidden_phrases cliche_watchlist; do
    if jq -e ".properties.${prop}" "$file" > /dev/null 2>&1; then
        pass "style_state: has '$prop' property"
    else
        fail "style_state: missing '$prop' property"
    fi
done

echo ""

# ============================================
# Test 9: Enum values are correct
# ============================================
echo "--- Test 9: Enum values validation ---"

# story_state.project.format
expected_formats='["chapter","diary","serial","short_story"]'
actual_formats=$(jq -c '.properties.project.properties.format.enum | sort' "$SCRIPT_DIR/story_state.schema.json" 2>/dev/null)
if [ "$actual_formats" = "$expected_formats" ]; then
    pass "story_state.project.format enum is correct"
else
    fail "story_state.project.format enum mismatch (got: $actual_formats)"
fi

# style_state.pov
expected_pov='["first","second","third_limited","third_omniscient"]'
actual_pov=$(jq -c '.properties.pov.enum | sort' "$SCRIPT_DIR/style_state.schema.json" 2>/dev/null)
if [ "$actual_pov" = "$expected_pov" ]; then
    pass "style_state.pov enum is correct"
else
    fail "style_state.pov enum mismatch (got: $actual_pov)"
fi

# style_state.tense
expected_tense='["past","present"]'
actual_tense=$(jq -c '.properties.tense.enum | sort' "$SCRIPT_DIR/style_state.schema.json" 2>/dev/null)
if [ "$actual_tense" = "$expected_tense" ]; then
    pass "style_state.tense enum is correct"
else
    fail "style_state.tense enum mismatch (got: $actual_tense)"
fi

# style_state.voice
expected_voice='["clean","lyrical","minimal","ornate"]'
actual_voice=$(jq -c '.properties.voice.enum | sort' "$SCRIPT_DIR/style_state.schema.json" 2>/dev/null)
if [ "$actual_voice" = "$expected_voice" ]; then
    pass "style_state.voice enum is correct"
else
    fail "style_state.voice enum mismatch (got: $actual_voice)"
fi

echo ""

# ============================================
# Test 10: Default values match enums
# ============================================
echo "--- Test 10: Default values match schema enums ---"

# story_state.default.json format
format=$(jq -r '.project.format' "$SCRIPT_DIR/story_state.default.json" 2>/dev/null)
if echo "$expected_formats" | grep -q "\"$format\""; then
    pass "story_state default format '$format' is valid"
else
    fail "story_state default format '$format' not in enum"
fi

# style_state.default.json pov
pov=$(jq -r '.pov' "$SCRIPT_DIR/style_state.default.json" 2>/dev/null)
if echo "$expected_pov" | grep -q "\"$pov\""; then
    pass "style_state default pov '$pov' is valid"
else
    fail "style_state default pov '$pov' not in enum"
fi

# style_state.default.json tense
tense=$(jq -r '.tense' "$SCRIPT_DIR/style_state.default.json" 2>/dev/null)
if echo "$expected_tense" | grep -q "\"$tense\""; then
    pass "style_state default tense '$tense' is valid"
else
    fail "style_state default tense '$tense' not in enum"
fi

# style_state.default.json voice
voice=$(jq -r '.voice' "$SCRIPT_DIR/style_state.default.json" 2>/dev/null)
if echo "$expected_voice" | grep -q "\"$voice\""; then
    pass "style_state default voice '$voice' is valid"
else
    fail "style_state default voice '$voice' not in enum"
fi

echo ""

# ============================================
# Test 11: Invalid data detection (negative test)
# ============================================
echo "--- Test 11: Validation catches invalid data ---"

# Create temporary invalid file
TEMP_INVALID=$(mktemp)
cat > "$TEMP_INVALID" << 'EOF'
{
  "schema_version": "1.0",
  "pov": "invalid_pov",
  "tense": "future",
  "voice": "clean"
}
EOF

# Check that pov value is not in enum
invalid_pov=$(jq -r '.pov' "$TEMP_INVALID" 2>/dev/null)
if echo "$expected_pov" | grep -q "\"$invalid_pov\""; then
    fail "Validation should reject invalid pov '$invalid_pov'"
else
    pass "Validation correctly rejects invalid pov '$invalid_pov'"
fi

# Check that tense value is not in enum
invalid_tense=$(jq -r '.tense' "$TEMP_INVALID" 2>/dev/null)
if echo "$expected_tense" | grep -q "\"$invalid_tense\""; then
    fail "Validation should reject invalid tense '$invalid_tense'"
else
    pass "Validation correctly rejects invalid tense '$invalid_tense'"
fi

rm -f "$TEMP_INVALID"

echo ""

# ============================================
# Summary
# ============================================
echo "================================================"
echo "SUMMARY"
echo "================================================"
echo ""
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}All validations passed!${NC}"
    exit 0
else
    echo -e "${RED}Some validations failed.${NC}"
    exit 1
fi
