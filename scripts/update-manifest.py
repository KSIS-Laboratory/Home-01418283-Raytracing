#!/usr/bin/env python3
"""
Update file manifest with current modification times.
Run this script when you've updated slide files to auto-update the manifest.
"""

import json
import os
from datetime import datetime
from pathlib import Path

def update_manifest():
    """Update file-manifest.json with current file modification times."""
    
    base_dir = Path(__file__).parent.parent
    slides_dir = base_dir / 'slides'
    manifest_file = base_dir / 'file-manifest.json'
    
    # Load existing manifest
    if manifest_file.exists():
        with open(manifest_file, 'r') as f:
            manifest = json.load(f)
    else:
        manifest = {}
    
    # Update timestamps for all PDF files in slides directory
    if slides_dir.exists():
        for pdf_file in sorted(slides_dir.glob('*.pdf')):
            # Get file modification time
            mod_time = os.path.getmtime(pdf_file)
            # Convert to ISO 8601 format
            iso_time = datetime.utcfromtimestamp(mod_time).isoformat() + 'Z'
            
            # Use relative path for the key
            rel_path = f"slides/{pdf_file.name}"
            manifest[rel_path] = iso_time
            
            print(f"Updated: {rel_path} -> {iso_time}")
    
    # Write updated manifest
    with open(manifest_file, 'w') as f:
        json.dump(manifest, f, indent=2)
        f.write('\n')  # Add trailing newline
    
    print(f"\n✓ Manifest updated: {manifest_file}")

if __name__ == '__main__':
    update_manifest()
