import os
from PIL import Image, ImageDraw

def build_monochrome_assets():
    base_dir = r'C:\projets\portfolio-sylla'
    public_icons = os.path.join(base_dir, 'public', 'icons')
    public_images_logo = os.path.join(base_dir, 'public', 'images', 'logo')
    app_dir = os.path.join(base_dir, 'app')
    public_dir = os.path.join(base_dir, 'public')
    
    os.makedirs(public_icons, exist_ok=True)
    os.makedirs(public_images_logo, exist_ok=True)
    
    # 4 Authentic paths of the complete SY monogram
    p0 = "M 43 0 L 91 0 L 92 1 L 92 13 L 89 20 L 86 23 L 78 26 L 44 26 L 41 28 L 39 32 L 39 34 L 42 39 L 85 75 L 88 81 L 88 89 L 85 95 L 72 108 L 66 111 L 11 111 L 10 112 L 6 112 L 5 111 L 4 112 L 1 112 L 0 111 L 0 94 L 1 93 L 1 88 L 3 84 L 8 80 L 11 79 L 61 79 L 64 75 L 64 74 L 59 70 L 34 70 L 32 69 L 17 57 L 10 50 L 7 43 L 7 33 L 10 26 L 34 4 L 40 1 L 42 1 Z"
    p1 = "M 150 38 L 159 38 L 160 58 L 157 65 L 138 84 L 137 86 L 137 92 L 136 93 L 136 101 L 133 108 L 130 112 L 122 119 L 116 122 L 112 122 L 111 123 L 79 123 L 78 122 L 101 98 L 102 85 L 105 78 L 143 41 L 149 39 Z"
    p2 = "M 89 29 L 91 30 L 94 29 L 123 29 L 126 30 L 126 34 L 124 37 L 101 59 L 98 60 L 71 35 L 71 31 L 72 30 L 88 30 Z"
    p3 = "M 136 0 L 155 0 L 159 3 L 160 6 L 160 23 L 158 27 L 152 29 L 143 29 L 142 28 L 133 28 L 132 27 L 131 25 L 131 4 L 133 1 L 135 1 Z"

    # 1. Monochrome White SVG (for dark backgrounds)
    svg_white = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 161 124" width="100%" height="100%">
  <path d="{p0}" fill="#FFFFFF" />
  <path d="{p1}" fill="#FFFFFF" />
  <path d="{p2}" fill="#FFFFFF" />
  <path d="{p3}" fill="#FFFFFF" />
</svg>'''
    with open(os.path.join(public_icons, 'sylla-logo-white.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_white)

    # 2. Monochrome Dark SVG (Gris Anthracite / Noir profond #0F172A)
    svg_dark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 161 124" width="100%" height="100%">
  <path d="{p0}" fill="#0F172A" />
  <path d="{p1}" fill="#0F172A" />
  <path d="{p2}" fill="#0F172A" />
  <path d="{p3}" fill="#0F172A" />
</svg>'''
    with open(os.path.join(public_icons, 'sylla-logo-dark.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_dark)

    # 3. Dynamic CurrentColor SVG (adapts to text color automatically)
    svg_curr = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 161 124" width="100%" height="100%">
  <path d="{p0}" fill="currentColor" />
  <path d="{p1}" fill="currentColor" />
  <path d="{p2}" fill="currentColor" />
  <path d="{p3}" fill="currentColor" />
</svg>'''
    with open(os.path.join(public_icons, 'sylla-logo-monochrome.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_curr)

    # 4. Color primary SVG
    svg_primary = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 161 124" width="100%" height="100%">
  <path d="{p0}" fill="#0022CC" />
  <path d="{p1}" fill="#0099FF" />
  <path d="{p2}" fill="#0022CC" />
  <path d="{p3}" fill="#FF8000" />
</svg>'''
    with open(os.path.join(public_icons, 'sylla-logo-primary.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_primary)

    # 5. MONOCHROME SUBMARK SQUIRCLE (The new primary app icon / favicon)
    # Dark #0F172A squircle with pure white #FFFFFF monogram
    svg_squircle = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="115" fill="#0F172A" />
  <rect width="508" height="508" x="2" y="2" rx="113" fill="none" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="2" />
  <g transform="translate(81, 123) scale(2.174)">
    <path d="{p0}" fill="#FFFFFF" />
    <path d="{p1}" fill="#FFFFFF" />
    <path d="{p2}" fill="#FFFFFF" />
    <path d="{p3}" fill="#FFFFFF" />
  </g>
</svg>'''
    with open(os.path.join(public_icons, 'sylla-submark-squircle.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_squircle)

    # 6. MONOCHROME SUBMARK CIRCLE
    svg_circle = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <circle cx="256" cy="256" r="256" fill="#0F172A" />
  <circle cx="256" cy="256" r="254" fill="none" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="2" />
  <g transform="translate(81, 123) scale(2.174)">
    <path d="{p0}" fill="#FFFFFF" />
    <path d="{p1}" fill="#FFFFFF" />
    <path d="{p2}" fill="#FFFFFF" />
    <path d="{p3}" fill="#FFFFFF" />
  </g>
</svg>'''
    with open(os.path.join(public_icons, 'sylla-submark-circle.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_circle)

    print('Monochrome SVGs built!')

    # 7. Raster PNGs and multi-resolution Icons using the clean solid crop
    clean_solid = Image.open('C:/Users/youss/.gemini/antigravity/brain/08a862af-2489-42bb-bb39-b3fe66fa1494/scratch/solid_monochrome_clean.png').convert('RGBA')
    w_cs, h_cs = clean_solid.size
    pix_cs = clean_solid.load()

    dark_trans = Image.new('RGBA', (w_cs, h_cs), (0,0,0,0))
    for y in range(h_cs):
        for x in range(w_cs):
            r, g, b, a = pix_cs[x, y]
            if r > 230 and g > 230 and b > 230:
                dark_trans.putpixel((x, y), (0, 0, 0, 0))
            else:
                dist = (255 - r + 255 - g + 255 - b) / 3.0
                alpha = min(255, int(dist * 255 / 150))
                dark_trans.putpixel((x, y), (15, 23, 42, alpha)) # #0F172A

    white_trans = Image.new('RGBA', (w_cs, h_cs), (0,0,0,0))
    for y in range(h_cs):
        for x in range(w_cs):
            r, g, b, a = pix_cs[x, y]
            if r > 230 and g > 230 and b > 230:
                white_trans.putpixel((x, y), (0, 0, 0, 0))
            else:
                dist = (255 - r + 255 - g + 255 - b) / 3.0
                alpha = min(255, int(dist * 255 / 150))
                white_trans.putpixel((x, y), (255, 255, 255, alpha))

    dark_trans.save(os.path.join(public_images_logo, 'sylla-logo-mono-dark.png'))
    white_trans.save(os.path.join(public_images_logo, 'sylla-logo-mono-white.png'))

    # Build the 512x512 Monochrome Squircle App Icon
    sq_size = 512
    sq_canvas = Image.new('RGBA', (sq_size, sq_size), (0, 0, 0, 0))
    draw_sq = ImageDraw.Draw(sq_canvas)
    draw_sq.rounded_rectangle([0, 0, sq_size - 1, sq_size - 1], radius=115, fill=(15, 23, 42, 255))
    draw_sq.rounded_rectangle([2, 2, sq_size - 3, sq_size - 3], radius=113, outline=(255, 255, 255, 25), width=2)
    
    scale_factor = 350.0 / w_cs
    target_w = int(w_cs * scale_factor)
    target_h = int(h_cs * scale_factor)
    scaled_white = white_trans.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    pos_x = (sq_size - target_w) // 2
    pos_y = (sq_size - target_h) // 2
    sq_canvas.paste(scaled_white, (pos_x, pos_y), scaled_white)
    
    sq_canvas.save(os.path.join(public_images_logo, 'sylla-submark-squircle.png'))
    sq_canvas.save(os.path.join(public_dir, 'icon.png'))
    sq_canvas.save(os.path.join(app_dir, 'icon.png'))

    apple_icon = sq_canvas.resize((180, 180), Image.Resampling.LANCZOS)
    apple_icon.save(os.path.join(public_dir, 'apple-icon.png'))
    apple_icon.save(os.path.join(app_dir, 'apple-icon.png'))

    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128)]
    sq_canvas.save(os.path.join(public_dir, 'favicon.ico'), format='ICO', sizes=ico_sizes)
    sq_canvas.save(os.path.join(app_dir, 'favicon.ico'), format='ICO', sizes=ico_sizes)

    circ_canvas = Image.new('RGBA', (sq_size, sq_size), (0, 0, 0, 0))
    draw_circ = ImageDraw.Draw(circ_canvas)
    draw_circ.ellipse([0, 0, sq_size - 1, sq_size - 1], fill=(15, 23, 42, 255))
    draw_circ.ellipse([2, 2, sq_size - 3, sq_size - 3], outline=(255, 255, 255, 25), width=2)
    circ_canvas.paste(scaled_white, (pos_x, pos_y), scaled_white)
    circ_canvas.save(os.path.join(public_images_logo, 'sylla-submark-circle.png'))

    print('Monochrome raster and ICO assets built and saved successfully!')

if __name__ == '__main__':
    build_monochrome_assets()
