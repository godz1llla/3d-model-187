# -*- coding: utf-8 -*-
"""Regenerate data/*/objects-list.txt from js/main.js (UTF-8)."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
text = (ROOT / "js" / "main.js").read_text(encoding="utf-8")
pat = re.compile(
    r"nameKz:\s*'((?:[^'\\]|\\.)*)'\s*,\s*"
    r"nameRu:\s*'((?:[^'\\]|\\.)*)'\s*,\s*"
    r"nameEn:\s*'((?:[^'\\]|\\.)*)'"
)

def unescape(s: str) -> str:
    return s.replace("\\'", "'").replace('\\\\', '\\')

kz, ru, en = [], [], []
for m in pat.finditer(text):
    kz.append(unescape(m.group(1)))
    ru.append(unescape(m.group(2)))
    en.append(unescape(m.group(3)))

data = ROOT / "data"
(data / "kz" / "objects-list.txt").write_text("\n".join(kz) + "\n", encoding="utf-8")
(data / "ru" / "objects-list.txt").write_text("\n".join(ru) + "\n", encoding="utf-8")
(data / "en" / "objects-list.txt").write_text("\n".join(en) + "\n", encoding="utf-8")
print("Written", len(kz), "lines per file")
