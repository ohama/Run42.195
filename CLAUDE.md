# 제주 소년의 마라톤 도전기

## Project Overview

Korean coming-of-age novel in diary format. A 14-year-old boy's one-year journey from dreading his bus commute to completing a full marathon.

- **Format:** 104 diary entries
- **Timeline:** March 2024 - March 2025
- **Protagonist:** Kim Doyun (김도윤), middle school student in Jeju

## Current Task: English Translation

Translating the complete novel into natural English for adult readers (40s demographic).

### Translation Guidelines

1. **Voice:** Preserve the authentic voice of a 14-year-old Korean boy
2. **Tone:** Natural, fluent English (not literal translation)
3. **Cultural elements:** Keep Korean names, places (Jeju, Jocheon), food (seaweed soup) without over-explaining
4. **Running terms:** Use standard English running/marathon vocabulary
5. **Format:** Maintain diary entry structure with date headers
6. **Units:** Keep metric (km) - do not convert to miles

### File Structure

```
draft/scenes/          # Korean originals
translation/en/scenes/ # English translations
study/en/              # English conversation study guides
```

### Naming Convention

- Original: `entry_001.md` ~ `entry_104.md`
- Translation: Same filenames in `translation/en/scenes/`
- Study Guide: `entry_001_analysis.md` in `study/en/`

## English Study Guide (Comprehensive)

Each translated entry gets a companion study guide for English conversation practice.
Target: 40대 성인 영어 학습자

### File Structure

```
study/en/entry_001_analysis.md
study/en/entry_002_analysis.md
...
```

### Document Structure (10 Parts + Appendix)

```
# Entry XXX - Comprehensive English Conversation Study Guide

# PART 1: EVERYDAY EXPRESSIONS (일상 표현)
# PART 2: PHYSICAL SENSATIONS (신체 감각 표현)
# PART 3: DESCRIBING SPACES/SITUATIONS (공간/상황 묘사)
# PART 4: PHRASAL VERBS (구동사)
# PART 5: CONVERSATIONAL PATTERNS (회화 패턴)
# PART 6: EXPRESSING EMOTIONS (감정 표현)
# PART 7: TEEN/CASUAL SPEECH FEATURES (구어체 특징)
# PART 8: SENTENCE STARTERS (문장 시작 표현)
# PART 9: VOCABULARY BY CATEGORY (주제별 어휘)
# PART 10: EXTENDED PRACTICE (연습)
# APPENDIX: Quick Reference Cards
```

### Each Part Should Include

#### Part 1-3: Expression Analysis
- 원문에서 추출한 표현
- Korean equivalent (한국어 의미)
- Nuance/Usage 설명
- Formality levels (격식 수준 표)
- Variations (유사 표현들)
- Practice Dialogue (연습 대화)
- Common Mistakes (흔한 실수)

#### Part 4: Phrasal Verbs
- 동사 + 전치사 조합
- 원래 의미 vs 비유적 의미
- Similar verbs 비교 (grab vs take vs get)
- Example sentences from text

#### Part 5: Conversational Patterns
- Pattern structure 공식화
- 5+ 예문 제공
- Alternative structures
- When to use / When not to use

#### Part 6: Emotions
- Emotion spectrum (강도별 표현)
- Physical manifestations (신체 증상 표현)
- Context-appropriate usage

#### Part 7: Casual Speech
- Incomplete sentences (불완전 문장)
- Filler words (um, uh, like, you know)
- Hedging words (kind of, sort of, maybe)
- Intensifiers (totally, literally, super)

#### Part 8: Sentence Starters
- Category별 정리 (Honesty, Contrast, Hypothetical, Emphasis)
- Usage examples

#### Part 9: Vocabulary
- Category별 단어장 (Transportation, School, Weather, Physical States)
- Useful phrases for each category

#### Part 10: Practice
- Dialogue Practice (3+ scenarios)
- Writing Prompts (3+ prompts)
- Fill-in-the-Blank Exercises
- Discussion Questions (5+)

#### Appendix: Quick Reference Cards
- 5장의 빠른 참조 카드
- 핵심 표현만 정리

### Format Guidelines

1. **표 활용**: Expression | Korean | Usage/Nuance
2. **스펙트럼 표시**: 강도/격식 수준을 ★☆☆☆☆ 형식으로
3. **코드 블록**: 대화 예시, 패턴 구조에 사용
4. **한국어 병기**: 모든 표현에 한국어 의미 포함
5. **실제 텍스트 인용**: 원문에서 직접 예문 가져오기
6. **Pronunciation tips**: 발음이 어려운 단어에 /표기/
7. **Cultural notes**: 문화적 차이 설명 필요시

### Quality Checklist

- [ ] 모든 10개 파트 포함
- [ ] 각 표현에 한국어 의미 있음
- [ ] 연습 대화 3개 이상
- [ ] 빈칸 채우기 연습 포함
- [ ] Quick Reference Cards 5장
- [ ] 1,000줄 이상 분량

### Progress

See `TRANSLATION_PLAN.md` for detailed status.

## Commands

- `/novel:status` - Check project status
- `/novel:check` - Run quality checks
- `/novel:publish` - Export to EPUB
