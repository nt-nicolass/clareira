# Gera os ícones do Clareira (logo dos três sapos, branca, em fundo preto) durante a montagem.
import os
from PIL import Image, ImageDraw

BG = (10, 10, 10, 255)
WHITE = (255, 255, 255, 255)

# Máscara da logo (silhueta dos três sapos, em escala de cinza/alpha), enviada
# como arquivo próprio no repositório.
_MASK_PATH = os.path.join(os.path.dirname(__file__), '..', 'mask_small.png')


def _mask():
    return Image.open(_MASK_PATH).convert('L')


def _logo_rgba(target_w, target_h, color):
    alpha = _mask()
    w, h = alpha.size
    ratio = min(target_w / w, target_h / h)
    nw, nh = max(1, round(w * ratio)), max(1, round(h * ratio))
    alpha = alpha.resize((nw, nh), Image.LANCZOS)
    out = Image.new('RGBA', (nw, nh), color)
    out.putalpha(alpha)
    return out


def paste_logo(img, scale, color):
    size = img.width
    lg = _logo_rgba(size * scale, size * scale, color)
    x = (size - lg.width) // 2
    y = (size - lg.height) // 2
    img.alpha_composite(lg, (x, y))


def full(size, rnd=False):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if rnd:
        d.ellipse([0, 0, size - 1, size - 1], fill=BG)
    else:
        d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * .22), fill=BG)
    paste_logo(img, .62, WHITE)
    return img


os.makedirs('public', exist_ok=True)
for s in (192, 512):
    img = Image.new('RGBA', (s, s), BG)
    paste_logo(img, .62, WHITE)
    img.save(f'public/icon-{s}.png')

R = 'resources/android/res'
for dens, base, fg, st in [('mdpi', 48, 108, 24), ('hdpi', 72, 162, 36), ('xhdpi', 96, 216, 48), ('xxhdpi', 144, 324, 72), ('xxxhdpi', 192, 432, 96)]:
    p = f'{R}/mipmap-{dens}'
    os.makedirs(p, exist_ok=True)
    full(base).save(f'{p}/ic_launcher.png')
    full(base, True).save(f'{p}/ic_launcher_round.png')
    img = Image.new('RGBA', (fg, fg), (0, 0, 0, 0))
    paste_logo(img, .40, WHITE)
    img.save(f'{p}/ic_launcher_foreground.png')
    q = f'{R}/drawable-{dens}'
    os.makedirs(q, exist_ok=True)
    img = Image.new('RGBA', (st, st), (0, 0, 0, 0))
    paste_logo(img, .8, WHITE)
    img.save(f'{q}/ic_stat_clareira.png')

os.makedirs(f'{R}/values', exist_ok=True)
with open(f'{R}/values/ic_launcher_background.xml', 'w') as fh:
    fh.write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#0A0A0A</color>\n</resources>\n')
print('Ícones gerados.')
