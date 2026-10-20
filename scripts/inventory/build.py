"""Rebuild public/data/catalogue.json and docs/inventory/uncatalogued-areas.csv from committed inputs.

Run from anywhere with: npm run data:build (which also regenerates the CSV export and coverage report).
Intermediate files go to a temporary directory that is removed afterwards. To keep them (for example
stage2-review.txt, which lists name matches, merges and rejected locations for review), pass a
directory: python3 scripts/inventory/build.py /path/to/workdir
"""
import os, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))

def run(work):
    for stage in ('stage1.py', 'stage2.py', 'stage3.py'):
        print(f'--- {stage}', flush=True)
        subprocess.run([sys.executable, '-B', os.path.join(HERE, stage), work], check=True)

if len(sys.argv) > 1:
    os.makedirs(sys.argv[1], exist_ok=True)
    run(sys.argv[1])
else:
    with tempfile.TemporaryDirectory(prefix='inventory-build-') as work:
        run(work)
