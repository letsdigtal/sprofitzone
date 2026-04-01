import os
import glob
import re

target_dir = r"d:\All App\Crypto project\foxian-site"

# Define directory renames
dir_renames = {
    "Events Images and videos": "events-images-and-videos",
    "Images": "images"
}

# Recursively gather all tracking data
file_path_replacements = {} 

for old_dir_name, new_dir_name in dir_renames.items():
    old_dir_path = os.path.join(target_dir, old_dir_name)
    if not os.path.exists(old_dir_path):
        continue
    
    # Iterate over files inside
    for filename in os.listdir(old_dir_path):
        old_file_path = os.path.join(old_dir_path, filename)
        if os.path.isfile(old_file_path):
            # new filename: lowercase, spaces -> -, parentheses removed
            new_filename = filename.replace(' ', '-').replace('(', '').replace(')', '').lower()
            
            file_path_replacements[f"{old_dir_name}/{filename}"] = f"{new_dir_name}/{new_filename}"
            # Also track with %20 just in case it's hardcoded in HTML
            urlencoded_filename = filename.replace(' ', '%20')
            file_path_replacements[f"{old_dir_name}/{urlencoded_filename}"] = f"{new_dir_name}/{new_filename}"

# Rename logic
# 1. Update HTML/CSS/JS files FIRST so we don't accidentally lose link info
files_to_update = []
files_to_update.extend(glob.glob(os.path.join(target_dir, "*.html")))
files_to_update.extend(glob.glob(os.path.join(target_dir, "*.css")))
files_to_update.extend(glob.glob(os.path.join(target_dir, "*.js")))

for filepath in files_to_update:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Replace references (case-insensitive) for every mapped file
    for old_ref, new_ref in file_path_replacements.items():
        pattern = re.compile(re.escape(old_ref), re.IGNORECASE)
        content = pattern.sub(new_ref, content)
        
        # Windows backslash version if it exists
        old_ref_win = old_ref.replace('/', '\\')
        pattern_win = re.compile(re.escape(old_ref_win), re.IGNORECASE)
        content = pattern_win.sub(new_ref, content)
        
    # Also replace bare directory names if somehow they missed specific filenames
    for old_dir_name, new_dir_name in dir_renames.items():
        pattern = re.compile(re.escape(old_dir_name + '/'), re.IGNORECASE)
        content = pattern.sub(new_dir_name + '/', content)
        
        pattern_win = re.compile(re.escape(old_dir_name + '\\'), re.IGNORECASE)
        content = pattern_win.sub(new_dir_name + '/', content)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

# 2. Rename physical files
for old_dir_name, new_dir_name in dir_renames.items():
    old_dir_path = os.path.join(target_dir, old_dir_name)
    if not os.path.exists(old_dir_path):
        continue
    
    for filename in os.listdir(old_dir_path):
        old_file_path = os.path.join(old_dir_path, filename)
        if os.path.isfile(old_file_path):
            new_filename = filename.replace(' ', '-').replace('(', '').replace(')', '').lower()
            if filename != new_filename:
                new_file_path = os.path.join(old_dir_path, new_filename)
                
                # Careful rename for case-only changes in Windows
                if new_filename.lower() == filename.lower():
                    temp_path = os.path.join(old_dir_path, filename + "_temp")
                    os.rename(old_file_path, temp_path)
                    os.rename(temp_path, new_file_path)
                else:
                    os.rename(old_file_path, new_file_path)

# 3. Rename physical directories
for old_dir_name, new_dir_name in dir_renames.items():
    old_dir_path = os.path.join(target_dir, old_dir_name)
    new_dir_path = os.path.join(target_dir, new_dir_name)
    
    if os.path.exists(old_dir_path) and not os.path.exists(new_dir_path):
        if old_dir_name.lower() == new_dir_name.lower():
            temp_path = old_dir_path + "_temp"
            os.rename(old_dir_path, temp_path)
            os.rename(temp_path, new_dir_path)
        else:
            os.rename(old_dir_path, new_dir_path)
            
print("Successfully fixed all Netlify paths")
