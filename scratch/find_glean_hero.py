import urllib.request
import re

req = urllib.request.Request(
    'https://www.glean.com',
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'https://[^"\'\s>]+\.(?:mp4|webm|png|jpg|webp)', html)
        print("Found assets:")
        for m in set(matches):
            if any(k in m.lower() for k in ['hero', 'video', 'background', 'bg', 'ribbon', 'wave', 'home']):
                print("  Candidate:", m)
except Exception as e:
    print("Error:", e)
