#!/usr/bin/env python3
"""Tạo ảnh nhẹ cho trang: đọc ảnh gốc trong assets/images (jpg/jpeg) và ghi HAI bản cùng tên, ảnh gốc KHÔNG bị sửa:
  - assets/thumbs: bản nhỏ (mặc định cạnh dài 1200px) hiển thị ngoài trang
  - assets/full:   bản xem lớn (mặc định cạnh dài 1920px ~ Full HD) tải khi khách bấm phóng to; ảnh gốc nhỏ hơn thì chép nguyên, không phóng to
Dùng: python3 scripts/make_thumbs.py [thumb=1200] [chất_lượng_thumb=80] [full=1920] [chất_lượng_full=85]   (cần: pip install pillow)"""
import shutil
import sys
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
src, thumbs, full = root / "assets" / "images", root / "assets" / "thumbs", root / "assets" / "full"
arg = lambda i, d: int(sys.argv[i]) if len(sys.argv) > i else d
t_side, t_q, f_side, f_q = arg(1, 1200), arg(2, 80), arg(3, 1920), arg(4, 85)
thumbs.mkdir(exist_ok=True); full.mkdir(exist_ok=True)

def shrink(im, side):
    k = side / max(im.size)
    return im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS) if k < 1 else im

for f in sorted(p for p in src.iterdir() if p.suffix.lower() in (".jpg", ".jpeg")):
    im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")  # xoay đúng hướng theo EXIF, giữ nguyên tỉ lệ (không cắt)
    t = shrink(im, t_side); out_t = thumbs / f.name
    t.save(out_t, "JPEG", quality=t_q, optimize=True, progressive=True)
    if max(im.size) <= f_side and f.stat().st_size < 1_500_000:
        shutil.copy2(f, full / f.name); fw, fh = im.size
    else:
        g = shrink(im, f_side); g.save(full / f.name, "JPEG", quality=f_q, optimize=True, progressive=True); fw, fh = g.size
    print(f"{f.name:16s} gốc {f.stat().st_size/1e3:6.0f}KB -> thumb {out_t.stat().st_size/1e3:4.0f}KB {t.width}x{t.height} | full {(full/f.name).stat().st_size/1e3:5.0f}KB {fw}x{fh}")
