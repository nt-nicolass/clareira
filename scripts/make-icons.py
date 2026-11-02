# Gera os ícones do Clareira (letra C amarela em fundo preto) durante a montagem.
import os
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

f = TTFont('node_modules/@fontsource/fraunces/files/fraunces-latin-700-normal.woff'); f.flavor = None
f.save('/tmp/fraunces.ttf')
FT = '/tmp/fraunces.ttf'; BG = (10, 10, 10, 255); Y = (245, 197, 24, 255)

def glyph(img, size, scale, color):
    d = ImageDraw.Draw(img); font = ImageFont.truetype(FT, int(size * scale))
    b = d.textbbox((0, 0), 'C', font=font); w = b[2] - b[0]; h = b[3] - b[1]
    d.text(((size - w) / 2 - b[0], (size - h) / 2 - b[1]), 'C', font=font, fill=color)

def full(size, rnd=False):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    if rnd: d.ellipse([0, 0, size - 1, size - 1], fill=BG)
    else: d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * .22), fill=BG)
    glyph(img, size, .62, Y); return img

os.makedirs('public', exist_ok=True)
for s in (192, 512):
    img = Image.new('RGBA', (s, s), BG); glyph(img, s, .62, Y); img.save(f'public/icon-{s}.png')
R = 'resources/android/res'
for dens, base, fg, st in [('mdpi', 48, 108, 24), ('hdpi', 72, 162, 36), ('xhdpi', 96, 216, 48), ('xxhdpi', 144, 324, 72), ('xxxhdpi', 192, 432, 96)]:
    p = f'{R}/mipmap-{dens}'; os.makedirs(p, exist_ok=True)
    full(base).save(f'{p}/ic_launcher.png'); full(base, True).save(f'{p}/ic_launcher_round.png')
    img = Image.new('RGBA', (fg, fg), (0, 0, 0, 0)); glyph(img, fg, .40, Y); img.save(f'{p}/ic_launcher_foreground.png')
    q = f'{R}/drawable-{dens}'; os.makedirs(q, exist_ok=True)
    img = Image.new('RGBA', (st, st), (0, 0, 0, 0)); glyph(img, st, .8, (255, 255, 255, 255)); img.save(f'{q}/ic_stat_clareira.png')
os.makedirs(f'{R}/values', exist_ok=True)
open(f'{R}/values/ic_launcher_background.xml', 'w').write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0A0A0A</color>\n</resources>\n')
print('Ícones gerados.')
