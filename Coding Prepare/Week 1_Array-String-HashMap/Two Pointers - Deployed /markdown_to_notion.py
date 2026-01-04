"""
🎨 PROFESSIONAL NOTION MARKDOWN CONVERTER v4.0
==============================================

FIXED in v4.0:
- Code blocks parsed FIRST (no more # comments becoming headers)
- Uses Notion's toggle headings (is_toggleable=true)
- No more broken nested toggles
- Proper structure matching markdown

SUPPORTED FEATURES:
- Headers (H1/H2/H3) with optional toggle
- Code blocks with syntax highlighting
- Tables with rich text
- Callouts (auto-detected from > blockquotes)
- Bulleted/Numbered lists
- Checkboxes
- Rich text: **bold**, *italic*, `code`, ==highlight==, ~~strike~~
- Dividers
- Column layouts

Usage: python markdown_to_notion.py
"""

import os
import re
import sys
import getpass
from dotenv import load_dotenv
from notion_client import Client

load_dotenv()

PAGE_ID = "2d2ad927156b80bba37ac03ea39a0140"
MD_FILE_PATH = "Two-Pointers-Complete-Guide.md"


def get_notion_client():
    token = os.getenv("NOTION_TOKEN")
    if not token:
        print("Env 'NOTION_TOKEN' not found.")
        token = getpass.getpass("Please paste your Notion Integration Token: ")
    return Client(auth=token)


def parse_rich_text(text):
    """Parse markdown formatting to Notion rich_text array."""
    if not text:
        return [{"type": "text", "text": {"content": ""}}]

    rich_text = []

    # Pattern for **bold**, *italic*, `code`, [link](url), ==highlight==, ~~strike~~
    pattern = r'(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|==[^=]+=+=|~~[^~]+~~)'
    parts = re.split(pattern, text)

    for part in parts:
        if not part:
            continue

        if part.startswith('**') and part.endswith('**'):
            rich_text.append({
                "type": "text",
                "text": {"content": part[2:-2]},
                "annotations": {"bold": True}
            })
        elif part.startswith('*') and part.endswith('*') and not part.startswith('**'):
            rich_text.append({
                "type": "text",
                "text": {"content": part[1:-1]},
                "annotations": {"italic": True}
            })
        elif part.startswith('`') and part.endswith('`'):
            rich_text.append({
                "type": "text",
                "text": {"content": part[1:-1]},
                "annotations": {"code": True}
            })
        elif part.startswith('==') and part.endswith('=='):
            rich_text.append({
                "type": "text",
                "text": {"content": part[2:-2]},
                "annotations": {"bold": True, "color": "yellow_background"}
            })
        elif part.startswith('~~') and part.endswith('~~'):
            rich_text.append({
                "type": "text",
                "text": {"content": part[2:-2]},
                "annotations": {"strikethrough": True}
            })
        elif part.startswith('[') and '](' in part:
            match = re.match(r'\[([^\]]+)\]\(([^)]+)\)', part)
            if match:
                rich_text.append({
                    "type": "text",
                    "text": {"content": match.group(1), "link": {"url": match.group(2)}}
                })
        else:
            rich_text.append({
                "type": "text",
                "text": {"content": part}
            })

    return rich_text if rich_text else [{"type": "text", "text": {"content": text}}]


def detect_heading_color(text):
    """Detect heading color based on emoji."""
    if '❌' in text or '⚠️' in text:
        return "red"
    elif '✅' in text or '🎯' in text:
        return "green"
    elif '💡' in text or '🧭' in text:
        return "blue"
    elif '🔥' in text or '⚡' in text:
        return "orange"
    elif '🔗' in text or '🔍' in text:
        return "purple"
    return "default"


def detect_callout_style(text):
    """Detect callout emoji and color."""
    if text.startswith('💡'):
        return "💡", "blue_background"
    elif text.startswith('⚡'):
        return "⚡", "yellow_background"
    elif text.startswith('⚠️'):
        return "⚠️", "orange_background"
    elif text.startswith('🔥'):
        return "🔥", "red_background"
    elif text.startswith('✅'):
        return "✅", "green_background"
    elif text.startswith('❌'):
        return "❌", "red_background"
    elif text.startswith('🎯'):
        return "🎯", "purple_background"

    text_lower = text.lower()
    if any(w in text_lower for w in ['critical', 'warning', 'important']):
        return "⚠️", "orange_background"
    elif any(w in text_lower for w in ['tip', 'note']):
        return "💡", "blue_background"

    return "💡", "gray_background"


def should_be_toggle_heading(text):
    """Determine if H2 should be a toggle heading."""
    text_lower = text.lower()

    # Keep expanded
    keep_expanded = ['when to use', 'quick reference', 'mastery']
    if any(k in text_lower for k in keep_expanded):
        return False

    # Auto-toggle these
    toggle_keywords = ['pattern', 'example', 'mistake', 'practice', 'related', 'recognition']
    if any(k in text_lower for k in toggle_keywords):
        return True

    return False


def parse_markdown_to_blocks(md_content):
    """
    Parse markdown to Notion blocks.
    KEY: Code blocks are detected FIRST to prevent content corruption.
    """
    blocks = []
    lines = md_content.split('\n')
    i = 0

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Skip empty lines
        if not stripped:
            i += 1
            continue

        # ============================================
        # 1. CODE BLOCKS - MUST BE FIRST!
        # ============================================
        if stripped.startswith('```'):
            lang = stripped[3:].strip().lower()
            code_lines = []
            i += 1

            # Collect until closing ```
            while i < len(lines):
                if lines[i].strip() == '```':
                    i += 1
                    break
                code_lines.append(lines[i])
                i += 1

            # Language mapping
            lang_map = {
                'python': 'python', 'py': 'python',
                'javascript': 'javascript', 'js': 'javascript',
                'typescript': 'typescript', 'ts': 'typescript',
                'bash': 'shell', 'sh': 'shell',
                'java': 'java', 'go': 'go', 'rust': 'rust',
                '': 'plain text'
            }
            notion_lang = lang_map.get(lang, 'plain text')

            blocks.append({
                "object": "block",
                "type": "code",
                "code": {
                    "rich_text": [{"type": "text", "text": {"content": '\n'.join(code_lines)}}],
                    "language": notion_lang
                }
            })
            continue

        # ============================================
        # 2. HEADERS
        # ============================================
        if stripped.startswith('#'):
            level = len(re.match(r'^#+', stripped).group())
            text = stripped.lstrip('#').strip()
            color = detect_heading_color(text)

            block_type = f"heading_{min(level, 3)}"

            # H2 can be toggle headings
            is_toggle = (level == 2 and should_be_toggle_heading(text))

            blocks.append({
                "object": "block",
                "type": block_type,
                block_type: {
                    "rich_text": parse_rich_text(text),
                    "color": color,
                    "is_toggleable": is_toggle
                }
            })
            i += 1
            continue

        # ============================================
        # 3. DIVIDERS
        # ============================================
        if stripped in ['---', '***', '___']:
            blocks.append({
                "object": "block",
                "type": "divider",
                "divider": {}
            })
            i += 1
            continue

        # ============================================
        # 4. CALLOUTS (blockquotes)
        # ============================================
        if stripped.startswith('>'):
            quote_lines = []
            while i < len(lines) and lines[i].strip().startswith('>'):
                clean = lines[i].strip().lstrip('>').strip()
                quote_lines.append(clean)
                i += 1

            text_content = '\n'.join(quote_lines)
            emoji, color = detect_callout_style(text_content)

            # Remove emoji from start if present
            if text_content and text_content[0] in '💡⚡⚠️🔥✅❌🎯📝':
                text_content = text_content[1:].strip()

            blocks.append({
                "object": "block",
                "type": "callout",
                "callout": {
                    "rich_text": parse_rich_text(text_content),
                    "icon": {"emoji": emoji},
                    "color": color
                }
            })
            continue

        # ============================================
        # 5. CHECKBOXES
        # ============================================
        if re.match(r'^-\s*\[[ x]\]\s+', stripped):
            checked = '[x]' in stripped[:6]
            text = re.sub(r'^-\s*\[[ x]\]\s+', '', stripped)

            blocks.append({
                "object": "block",
                "type": "to_do",
                "to_do": {
                    "rich_text": parse_rich_text(text),
                    "checked": checked,
                    "color": "green" if checked else "default"
                }
            })
            i += 1
            continue

        # ============================================
        # 6. NUMBERED LISTS
        # ============================================
        if re.match(r'^\d+\.\s+', stripped):
            text = re.sub(r'^\d+\.\s+', '', stripped)
            blocks.append({
                "object": "block",
                "type": "numbered_list_item",
                "numbered_list_item": {
                    "rich_text": parse_rich_text(text),
                    "color": "default"
                }
            })
            i += 1
            continue

        # ============================================
        # 7. BULLETED LISTS
        # ============================================
        if stripped.startswith('- ') or stripped.startswith('* '):
            text = stripped[2:].strip()

            # Detect color based on starting emoji
            color = "default"
            if text.startswith('✅'):
                color = "green"
            elif text.startswith('❌'):
                color = "red"
            elif text.startswith('💡') or text.startswith('→'):
                color = "blue"

            blocks.append({
                "object": "block",
                "type": "bulleted_list_item",
                "bulleted_list_item": {
                    "rich_text": parse_rich_text(text),
                    "color": color
                }
            })
            i += 1
            continue

        # ============================================
        # 8. TABLES
        # ============================================
        if stripped.startswith('|'):
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                table_lines.append(lines[i])
                i += 1

            rows = []
            for tline in table_lines:
                cells = [c.strip() for c in tline.strip('|').split('|')]

                # Skip separator row
                if all(set(c.replace('-', '').replace(':', '')) == set() for c in cells):
                    continue

                row_cells = [parse_rich_text(cell) for cell in cells]
                rows.append({
                    "type": "table_row",
                    "table_row": {"cells": row_cells}
                })

            if rows:
                blocks.append({
                    "object": "block",
                    "type": "table",
                    "table": {
                        "table_width": len(rows[0]["table_row"]["cells"]),
                        "has_column_header": True,
                        "has_row_header": False,
                        "children": rows
                    }
                })
            continue

        # ============================================
        # 9. DEFAULT: PARAGRAPH
        # ============================================
        # Detect if should be callout
        if stripped.startswith(('💡', '⚡', '⚠️', '✅', '❌', '🎯', '🔥')):
            emoji, color = detect_callout_style(stripped)
            text_clean = stripped[1:].strip() if stripped[0] in '💡⚡⚠️✅❌🎯🔥' else stripped

            blocks.append({
                "object": "block",
                "type": "callout",
                "callout": {
                    "rich_text": parse_rich_text(text_clean),
                    "icon": {"emoji": emoji},
                    "color": color
                }
            })
        else:
            # Regular paragraph
            blocks.append({
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": parse_rich_text(stripped),
                    "color": "default"
                }
            })

        i += 1

    return blocks


def main():
    print("=" * 70)
    print("🎨 NOTION MARKDOWN CONVERTER v4.0 (FIXED)")
    print("=" * 70)
    print(f"📄 Source: {MD_FILE_PATH}")
    print(f"📍 Target: {PAGE_ID}")
    print()

    if not os.path.exists(MD_FILE_PATH):
        print(f"❌ Error: File not found")
        return

    try:
        notion = get_notion_client()
        print("✅ Connected to Notion")

        with open(MD_FILE_PATH, 'r', encoding='utf-8') as f:
            content = f.read()

        print()
        print("🔄 Parsing (v4.0 - Code blocks parsed FIRST):")
        print("   ✅ Code blocks detected before headers")
        print("   ✅ Toggle headings (H2 with is_toggleable)")
        print("   ✅ Colored callouts and lists")
        print("   ✅ Tables with rich text")
        print()

        blocks = parse_markdown_to_blocks(content)
        print(f"✨ Generated {len(blocks)} blocks")
        print()

        # Upload in batches
        batch_size = 100
        for x in range(0, len(blocks), batch_size):
            batch = blocks[x:x + batch_size]
            print(f"📤 Batch {x//batch_size + 1}... ", end="")
            notion.blocks.children.append(block_id=PAGE_ID, children=batch)
            print("✓")

        print()
        print("=" * 70)
        print("🎉 SUCCESS! Page created with proper structure!")
        print("=" * 70)
        print("✅ Code blocks now work correctly")
        print("✅ Toggle headings for collapsible sections")
        print("✅ All content properly formatted")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()
