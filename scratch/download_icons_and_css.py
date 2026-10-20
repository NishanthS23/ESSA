import urllib.request
import re
import os

req = urllib.request.Request('https://www.glean.com', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

# Download the connector icons into public/icons/
icons = {
    'slack.svg': 'https://cdn.prod.website-files.com/6127a84dfe068e153ef20572/68db8e3409581eef79dba08d_slack-icon.svg',
    'gdrive.svg': 'https://cdn.prod.website-files.com/6127a84dfe068e153ef20572/69295396b34fd53464f7840f_7ab8dd51452b3aad6ded77b97cb9020e_gdrive.svg',
    'jira.svg': 'https://cdn.prod.website-files.com/6127a84dfe068e153ef20572/6a0ddf04c93d13351f44017a_logo-gradient-blue-jira.svg',
    'confluence.svg': 'https://cdn.prod.website-files.com/6127a84dfe068e153ef20572/69295396d02a1a7031f17f55_accd86c0616a0a7f67db0f5e018696ba_confluence.svg',
    'sharepoint.svg': 'https://cdn.prod.website-files.com/6127a84dfe068e153ef20572/6889dd796b9a0a6d2b189168_sharepoint.svg',
    'github.svg': 'https://cdn.prod.website-files.com/6127a84dfe068e153ef20572/69295396db08c8b07c518f87_8c2e8ad08159df5b03d9925fd3b77249_github.svg',
    'salesforce.svg': 'https://cdn.prod.website-files.com/6127a84dfe068e153ef20572/67d01b45c16b4549f2698c58_Salesforce.svg'
}

os.makedirs('public/icons', exist_ok=True)
for name, url in icons.items():
    try:
        urllib.request.urlretrieve(url, f'public/icons/{name}')
        print(f"Downloaded {name}")
    except Exception as e:
        print(f"Failed {name}: {e}")

# Also look for CSS
css_links = re.findall(r'<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"', html)
for cl in css_links:
    try:
        css = urllib.request.urlopen(cl).read().decode('utf-8', errors='ignore')
        hero_rules = [r for r in css.split('}') if 'homeexp_hero' in r]
        print(f"From {cl}, found {len(hero_rules)} hero rules:")
        for r in hero_rules[:10]:
            print(r.strip() + '}')
    except Exception as e:
        pass
