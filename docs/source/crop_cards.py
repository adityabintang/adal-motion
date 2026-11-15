"""Crop feature cards from the reservation screenshot (no customer data in these regions)."""
from PIL import Image

src = Image.open("assets/ui_reservasi.png").convert("RGB")
crops = {
    "assets/card_menu.png": (878, 55, 1399, 397),       # Pengaturan Menu
    "assets/card_reservasi.png": (342, 412, 1399, 664),  # Pengingat WA + Google Calendar
    "assets/card_meja.png": (342, 55, 862, 397),         # Pengaturan Meja
}
for dst, box in crops.items():
    im = src.crop(box)
    w, h = im.size
    im = im.resize((w * 2, h * 2), Image.LANCZOS)
    im.save(dst)
    print(dst, im.size)