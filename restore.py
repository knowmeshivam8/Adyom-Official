import os
import json
import shutil
import urllib.parse

history_dir = os.path.expanduser("~/Library/Application Support/Antigravity IDE/User/History")
workspace_uri_1 = "file:///Users/shivam/Adyom%20foundation/"
workspace_uri_2 = "file:///Users/shivam/Adyom foundation/"

restored_files = []

for item in os.listdir(history_dir):
    item_path = os.path.join(history_dir, item)
    if os.path.isdir(item_path):
        entries_file = os.path.join(item_path, "entries.json")
        if os.path.exists(entries_file):
            try:
                with open(entries_file, "r") as f:
                    data = json.load(f)
                resource = data.get("resource", "")
                if resource.startswith(workspace_uri_1) or resource.startswith(workspace_uri_2):
                    parsed = urllib.parse.unquote(resource)
                    if parsed.startswith("file://"):
                        original_path = parsed[7:]
                        
                        entries = data.get("entries", [])
                        if not entries: continue
                        latest_entry = max(entries, key=lambda x: x.get("timestamp", 0))
                        source_file = os.path.join(item_path, latest_entry["id"])
                        
                        if os.path.exists(source_file):
                            os.makedirs(os.path.dirname(original_path), exist_ok=True)
                            shutil.copy2(source_file, original_path)
                            restored_files.append(original_path)
            except Exception as e:
                pass

print(f"Restored {len(restored_files)} files.")
for f in restored_files[:20]:
    print(f" - {f}")
