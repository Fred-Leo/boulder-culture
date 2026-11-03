"""Dependency-free structural checks; run from any directory with Python 3.9+."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
errors = []


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.ids = []
        self.links = []
        self.scripts = []
        self.in_script = False
        self.script = ''

    def handle_starttag(self, tag, attrs):
        names = [name for name, _ in attrs]
        for name, count in Counter(names).items():
            if count > 1:
                errors.append(f'{self.path.name}: duplicate attribute {name}')
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for attribute in ('href', 'src', 'action'):
            if attrs.get(attribute):
                self.links.append(attrs[attribute])
        if tag == 'img' and 'alt' not in attrs:
            errors.append(f'{self.path.name}: image missing alt attribute')
        if tag == 'script':
            self.in_script = True
            self.script = ''

    def handle_data(self, data):
        if self.in_script:
            self.script += data

    def handle_endtag(self, tag):
        if tag == 'script':
            if self.script.strip():
                self.scripts.append(self.script)
            self.in_script = False


pages = {}
for path in sorted(DIST.glob('*.html')):
    page = Page(path)
    page.feed(path.read_text())
    pages[path.resolve()] = page
    for identifier, count in Counter(page.ids).items():
        if count > 1:
            errors.append(f'{path.name}: duplicate ID {identifier}')

for path, page in pages.items():
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc:
            continue
        target = (DIST / unquote(url.path.lstrip('/')) if url.path.startswith('/')
                  else path.parent / unquote(url.path)) if url.path else path
        if target.is_dir():
            target /= 'index.html'
        target = target.resolve()
        if not target.exists():
            errors.append(f'{path.name}: missing local target {link}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{path.name}: missing fragment {link}')

scripts = [(str(path.relative_to(ROOT)), path.read_text()) for path in DIST.glob('*.js')]
scripts += [(f'{page.path.name}:inline-{index}', source)
            for page in pages.values() for index, source in enumerate(page.scripts)]
for name, source in scripts:
    result = subprocess.run(['node', '--check', '-'], input=source, text=True, capture_output=True)
    if result.returncode:
        errors.append(f'{name}: {result.stderr}')
    if re.search(r'\bconsole\s*\.|\bdebugger\s*;', source):
        errors.append(f'{name}: debug statement')

if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print(f'PASS: {len(pages)} HTML pages; local links, fragments, IDs, attributes, image alt text; '
      f'{len(scripts)} JavaScript syntax/debug checks.')
