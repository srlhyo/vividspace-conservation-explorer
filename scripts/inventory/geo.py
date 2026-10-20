"""Point-in-country test against the committed country outlines (Natural Earth 1:50m, public domain)."""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUTLINES = {f['properties']['code']: f['geometry'] for f in json.load(open(f'{ROOT}/public/data/geo/countries.geojson'))['features']}

def rings(g): return [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']

def inside(code, x, y):
    """Inside the country outline, or within 0.35° of one of its vertices (islands, coasts, generalised borders)."""
    c = False
    for poly in rings(OUTLINES[code]):
        for ring in poly:
            j = len(ring) - 1
            for i in range(len(ring)):
                xi, yi = ring[i]; xj, yj = ring[j]
                if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi: c = not c
                j = i
    return c or any(abs(px - x) <= 0.35 and abs(py - y) <= 0.35 for poly in rings(OUTLINES[code]) for ring in poly for px, py in ring)
