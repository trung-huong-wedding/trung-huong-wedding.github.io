#!/usr/bin/env python3
"""Tạo ảnh nhẹ cho trang: đọc ảnh gốc trong assets/images (jpg/jpeg) và ghi bản thu nhỏ cùng tên vào assets/thumbs.
Ảnh gốc KHÔNG bị sửa. Trang dùng bản nhẹ ở ngoài, chỉ tải ảnh gốc khi người dùng bấm phóng to.
Dùng: python3 scripts/make_thumbs.py [cạnh_dài_tối_đa=1200] [chất_lượng=80]   (cần: pip install pillow)"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
src, dst = root / "assets" / "images", root / "assets" / "thumbs"
side = int(sys.argv[1]) if len(sys.argv) > 1 else 1200
quality = int(sys.argv[2]) if len(sys.argv) > 2 else 80
dst.mkdir(exist_ok=True)
for f in sorted(p for p in src.iterdir() if p.suffix.lower() in (".jpg", ".jpeg")):
    im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")  # xoay đúng hướng theo EXIF, giữ nguyên tỉ lệ (không cắt)
    k = side / max(im.size)
    if k < 1:
        im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    out = dst / f.name
    im.save(out, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"{f.name:16s} {f.stat().st_size/1e3:8.0f}KB -> {out.stat().st_size/1e3:5.0f}KB  {im.width}x{im.height}")
