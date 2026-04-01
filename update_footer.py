import os
import glob
import re

target_dir = r"d:\All App\Crypto project\foxian-site"
html_files = glob.glob(os.path.join(target_dir, "*.html"))

# Regex to remove Partner block
partner_pattern = re.compile(
    r'\s*<div class="footer-col">\s*<h4>Partner</h4>\s*<ul>.*?(?:</ul>\s*</div>)',
    re.DOTALL | re.IGNORECASE
)

# Regex to replace Disclaimer
disclaimer_pattern = re.compile(
    r'<p class="disclaimer">\s*(?:WARNING:)?.*?</p>',
    re.DOTALL | re.IGNORECASE
)

new_disclaimer = '<p class="disclaimer">WARNING: Trading in financial markets involves significant risk. All educational content and mentorship provided by SPROFITZONE (SPZ) is for informational and educational purposes only and does not constitute financial advice. Past performance does not guarantee future results.</p>'

updated_files = 0

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Remove partner block
    content = partner_pattern.sub('', content)
    
    # Replace disclaimer
    # Note: Sometimes the warning text inside might not have the "WARNING:" prefix exactly, 
    # but based on the index.html we saw, it starts right after class="disclaimer".
    content = disclaimer_pattern.sub(new_disclaimer, content)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        updated_files += 1
        print(f"Updated: {os.path.basename(filepath)}")

print(f"Total files updated: {updated_files}")
