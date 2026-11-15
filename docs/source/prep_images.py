"""Convert the reference screenshots to clean-named PNGs and report the logo palette."""
from collections import Counter
from PIL import Image

pairs = [
    ("assets/preview.webp", "assets/ui_messages.png"),
    ("assets/preview (1).webp", "assets/ui_aiagent.png"),
    ("assets/preview (2).webp", "assets/ui_reservasi.png"),
]
for src, dst in pairs:
    im = Image.open(src).convert("RGB")
    im.save(dst)
    print(dst, im.size)

logo = Image.open("assets/logo-64.png").convert("RGBA")
print("logo size", logo.size)
opaque = [p[:3] for p in logo.getdata() if p[3] > 200]
for col, n in Counter(opaque).most_common(6):
    print("#%02x%02x%02x" % col, n)
small = logo.resize((16, 16))
for y in range(16):
    row = ""
    for x in range(16):
        r, g, b, a = small.getpixel((x, y))
        row += " " if a < 80 else ("#" if (r + g + b) < 450 else "o")
    print(row)