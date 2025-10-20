# Content Creation Guide for VIP1 Rooms

## Overview
You have 5 VIP1 room templates to fill with ChatGPT/Grok:
1. `career_burnout.json`
2. `negotiation_mastery.json`
3. `habit_building.json`
4. `diabetes_advanced.json`
5. `confidence_building.json`

## What to Fill:

### 1. Room Essay (Main Content)
Replace: `"FILL THIS WITH CHATGPT: ..."`

**Prompt for ChatGPT/Grok:**
```
Write a comprehensive 400-500 word essay about [TOPIC] for health/wellness education app.

Requirements:
- Practical, actionable advice
- Evidence-based when possible
- Write in both English and Vietnamese
- Include specific examples
- Clear structure with bullet points
- Professional but friendly tone

Topic: [career burnout / negotiation / habits / diabetes / confidence]
```

### 2. Entry Content (3 entries per room)
Replace: `"FILL WITH CHATGPT: ..."`

**Prompt for ChatGPT/Grok:**
```
Write a concise 150-200 word guide about [ENTRY TOPIC].

Format requirements:
- Start with bold heading using **HEADING**
- Use bullet points and numbered lists
- Include specific actionable steps
- Professional but conversational
- Write in both English and Vietnamese
- Make it immediately useful

Entry topic: [specific entry from the template]
```

### 3. Keywords (3-5 per entry)
Replace: `["FILL: add 3-5 keywords"]`

**Prompt for ChatGPT/Grok:**
```
Generate 5 keywords/phrases that someone would type when searching for [TOPIC].

Requirements:
- Natural language (how real people search)
- Both English and Vietnamese versions
- Mix of questions and statements
- Include common variations

Example:
- "how to deal with burnout"
- "cách đối phó với kiệt sức"
```

## Step-by-Step Process:

### For Each Room:

**Step 1: Generate Essay**
1. Copy the essay prompt above to ChatGPT
2. Replace [TOPIC] with room name
3. Get both English and Vietnamese versions
4. Paste into the JSON file replacing "FILL THIS WITH CHATGPT..."

**Step 2: Generate 3 Entries**
For each entry in the room:
1. Read the "FILL WITH CHATGPT:" instruction
2. Ask ChatGPT to write that specific content
3. Get both EN and VI versions
4. Paste into the `"copy": { "en": "...", "vi": "..." }` section

**Step 3: Generate Keywords**
For each entry:
1. Ask ChatGPT for 5 keywords related to that entry
2. Get both EN and VI versions
3. Replace `["FILL: add 3-5 keywords"]` with the array

**Step 4: Update Metadata**
After filling content:
1. Count words in English essay
2. Update `"word_count_en": [number]`
3. Count words in Vietnamese essay
4. Update `"word_count_vi": [number]`

## Example ChatGPT Conversation:

**You:**
```
Write a 400-word essay about career burnout recovery for a wellness app.

Include:
- Signs of burnout
- Recovery strategies
- Prevention tips
- Work-life balance

Write in both English and Vietnamese.
Professional but friendly tone.
```

**ChatGPT will respond with essay**

**You:**
```
Now write 3 short guides (150-200 words each) about:

1. Recognizing burnout signs (physical, emotional, behavioral)
2. Step-by-step burnout recovery protocol
3. Setting healthy work boundaries

Each guide should:
- Start with bold heading
- Use bullet points
- Be actionable
- Include both English and Vietnamese

Format like this:
**HEADING**
[content]
```

**ChatGPT will respond with 3 entries**

**You:**
```
Generate 5 keywords for each of these 3 burnout topics:
1. Recognizing burnout signs
2. Burnout recovery
3. Work boundaries

Format:
Topic 1 EN: [5 keywords]
Topic 1 VI: [5 keywords]
```

## Quality Checklist:

Before sending content to me:
- [ ] All "FILL" text removed
- [ ] Both EN and VI versions present
- [ ] Word counts updated
- [ ] Keywords are natural phrases (not single words)
- [ ] Content is actionable (not just theory)
- [ ] Proper markdown formatting (**, bullets, numbers)
- [ ] Professional tone maintained

## Time Estimate:

- Per room with ChatGPT: 15-20 minutes
- All 5 rooms: ~90 minutes
- Much faster than me writing it (saves you credits!)

## Tips:

1. **Do all 5 essays first** - Then do all entries - Batch similar tasks
2. **Copy-paste efficiently** - Use JSON validators to check formatting
3. **Keep ChatGPT conversations organized** - One conversation per room
4. **Save originals** - Keep ChatGPT responses in case you need to regenerate

## When Ready:

Send me the completed JSON files and I'll:
1. Integrate them into the app
2. Add to VIP1 page
3. Copy to supabase functions
4. Test everything works

---

**Questions?** Ask me about:
- JSON formatting issues
- How to structure specific content
- Vietnamese translation help
- Testing the rooms
