# Turns editable.json (from export-editable.js) into canva-editable.html:
# every shape, photo frame, line and text is a separate element Canva can edit.
import json
d = json.load(open('editable.json')); L = d['L']
def box(x, y, w, h, style, label=''):
    return f'<div data-label="{label}" style="position:absolute;left:{x:.1f}px;top:{y:.1f}px;width:{w:.1f}px;height:{h:.1f}px;{style}"></div>'
parts = []
for s in L['shapes']:
    r = '50%' if (s['w'] == s['h'] and s['r'] * 2 == s['w']) else f"{s['r']}px"
    parts.append(box(s['x'], s['y'], s['w'], s['h'], f"background:{s['fill']};border-radius:{r}", s['name']))
holes = [L['hero']] + L['bPhotos'] + L['cPhotos']
names = ['Passfoto', 'Bewerbungsfoto', 'LinkedIn', 'Baby', 'Hochzeit', 'Familie', 'Business-Ambiente']
for h in holes:  # white mat behind each photo
    parts.append(box(h['x'] - 9, h['y'] - 9, h['w'] + 18, h['h'] + 18, f"background:#FFFFFF;border-radius:{h['r'] + 9}px", 'Rahmen'))
for h, n in zip(holes, names):
    parts.append(box(h['x'], h['y'], h['w'], h['h'], f"background:#B9B2A9;border-radius:{h['r']}px", 'Foto ' + n))
hx, hy, hw, hh = L['hero']['x'], L['hero']['y'], L['hero']['w'], L['hero']['h']; hx2, hy2 = hx + hw, hy + hh
g = 'background:#17915A;border-radius:2px'
parts += [box(hx2 + 28.5, hy, 3, hh, g), box(hx2 + 20, hy - 1.5, 20, 3, g), box(hx2 + 20, hy2 - 1.5, 20, 3, g),
          box(hx, hy2 + 24.5, hw, 3, g), box(hx - 1.5, hy2 + 16, 3, 20, g), box(hx2 - 1.5, hy2 + 16, 3, 20, g)]
for it in d['items']:
    if it['kind'] == 'box':
        st = f"background:{it['bg']};border-radius:{it['radius']}"
        if it['border']: st += f";border:{it['border']};box-sizing:border-box"
        parts.append(box(it['x'], it['y'], it['w'], it['h'], st))
for it in d['items']:
    if it['kind'] != 'text': continue
    s = it['style']; txt = it['html']
    if s['textTransform'] == 'uppercase': txt = txt.upper()
    pad = it['w'] * 0.08 + 8
    st = (f"position:absolute;left:{it['x']:.1f}px;top:{it['y']:.1f}px;width:{it['w'] + pad:.1f}px;white-space:nowrap;"
          f"font-family:{s['fontFamily']};font-size:{s['fontSize']};font-weight:{s['fontWeight']};font-style:{s['fontStyle']};"
          f"color:{s['color']};letter-spacing:{s['letterSpacing']};line-height:{it['h']:.1f}px;margin:0")
    parts.append(f'<div style="{st}">{txt}</div>')
html = f'''<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><title>Hegart Studio Poster A1 editierbar</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Poppins:wght@400;700&display=swap" rel="stylesheet">
<style>html,body{{margin:0}}.page{{position:relative;width:2245px;height:3179px;overflow:hidden;background:#F8F7F2}}</style>
</head><body>
<div class="page" data-document-role="page" data-label="Hegart Studio A1">
{chr(10).join(parts)}
</div></body></html>'''
open('../canva-editable.html', 'w').write(html)
