import os
from PIL import Image, ImageDraw

def build_all_assets():
    base_dir = r'C:\projets\portfolio-sylla'
    public_icons = os.path.join(base_dir, 'public', 'icons')
    public_images_logo = os.path.join(base_dir, 'public', 'images', 'logo')
    app_dir = os.path.join(base_dir, 'app')
    public_dir = os.path.join(base_dir, 'public')
    
    os.makedirs(public_icons, exist_ok=True)
    os.makedirs(public_images_logo, exist_ok=True)
    
    # 1. SVGs
    s_path = "M 41 0 L 93 0 L 93 14 L 91 18 L 87 22 L 80 25 L 44 25 L 39 31 L 39 34 L 43 39 L 49 43 L 55 49 L 87 75 L 89 78 L 89 88 L 87 93 L 73 107 L 67 110 L 0 110 L 0 89 L 1 86 L 6 81 L 10 79 L 58 79 L 59 78 L 62 79 L 65 75 L 65 72 L 60 69 L 47 69 L 45 70 L 44 69 L 35 69 L 32 68 L 16 55 L 10 49 L 8 45 L 7 42 L 7 32 L 9 29 L 9 27 L 33 4 L 38 1 L 40 1 Z"
    dot_path = "M 137 0 L 158 0 L 161 3 L 161 22 L 160 24 L 157 27 L 135 27 L 133 26 L 132 23 L 132 6 L 133 3 L 136 1 Z"
    wave_path = "M 149 39 L 160 39 L 161 40 L 161 59 L 158 65 L 148 74 L 138 85 L 137 100 L 132 109 L 121 119 L 112 122 L 82 122 L 81 120 L 97 105 L 101 100 L 103 96 L 103 84 L 104 83 L 104 80 L 139 46 L 145 41 L 148 40 Z"
    
    # Color Primary SVG
    svg_primary = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 162 124" width="100%" height="100%">
  <path d="{s_path}" fill="#0022CC" />
  <path d="{dot_path}" fill="#FF8000" />
  <path d="{wave_path}" fill="#0099FF" />
</svg>'''
    with open(os.path.join(public_icons, 'sylla-logo-primary.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_primary)
        
    # Monochrome White SVG
    svg_white = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 162 124" width="100%" height="100%">
  <path d="{s_path}" fill="#FFFFFF" />
  <path d="{dot_path}" fill="#FFFFFF" />
  <path d="{wave_path}" fill="#FFFFFF" />
</svg>'''
    with open(os.path.join(public_icons, 'sylla-logo-white.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_white)
        
    # Monochrome Dark (Anthracite #1E293B) SVG
    svg_dark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 162 124" width="100%" height="100%">
  <path d="{s_path}" fill="#1E293B" />
  <path d="{dot_path}" fill="#1E293B" />
  <path d="{wave_path}" fill="#1E293B" />
</svg>'''
    with open(os.path.join(public_icons, 'sylla-logo-dark.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_dark)
        
    # Submark Squircle SVG (Official App Icon / Favicon)
    svg_squircle = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="sqGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0022CC" />
      <stop offset="100%" stop-color="#021887" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="115" fill="url(#sqGrad)" />
  <g transform="translate(81, 123) scale(2.174)">
    <path d="{s_path}" fill="#FFFFFF" />
    <path d="{dot_path}" fill="#FF8000" />
    <path d="{wave_path}" fill="#0099FF" />
  </g>
</svg>'''
    with open(os.path.join(public_icons, 'sylla-submark-squircle.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_squircle)

    # Submark Circle SVG
    svg_circle = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="circGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0022CC" />
      <stop offset="100%" stop-color="#021887" />
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="256" fill="url(#circGrad)" />
  <g transform="translate(81, 123) scale(2.174)">
    <path d="{s_path}" fill="#FFFFFF" />
    <path d="{dot_path}" fill="#FF8000" />
    <path d="{wave_path}" fill="#0099FF" />
  </g>
</svg>'''
    with open(os.path.join(public_icons, 'sylla-submark-circle.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_circle)

    print('Vector SVGs generated!')

    # 2. Raster PNGs and Icons from scratch crops
    raw_board = Image.open(r'C:\Users\youss\.gemini\antigravity\brain\08a862af-2489-42bb-bb39-b3fe66fa1494\.user_uploaded\media_1794057301231_488e4bbc.jpg')

    # Squircle Submark: crop (496, 446, 610, 560)
    sq_raw = raw_board.crop((496, 446, 610, 560)).convert('RGBA')
    # Apply rounded mask
    mask_sq = Image.new('L', sq_raw.size, 0)
    draw_sq = ImageDraw.Draw(mask_sq)
    draw_sq.rounded_rectangle([0, 0, sq_raw.width - 1, sq_raw.height - 1], radius=25, fill=255)
    sq_raw.putalpha(mask_sq)

    # High-resolution 512x512 Squircle
    sq_512 = sq_raw.resize((512, 512), Image.Resampling.LANCZOS)
    sq_512.save(os.path.join(public_images_logo, 'sylla-submark-squircle.png'))

    # Circle Submark
    circ_raw = raw_board.crop((496, 585, 610, 699)).convert('RGBA')
    mask_circ = Image.new('L', circ_raw.size, 0)
    draw_circ = ImageDraw.Draw(mask_circ)
    draw_circ.ellipse([0, 0, circ_raw.width - 1, circ_raw.height - 1], fill=255)
    circ_raw.putalpha(mask_circ)
    circ_512 = circ_raw.resize((512, 512), Image.Resampling.LANCZOS)
    circ_512.save(os.path.join(public_images_logo, 'sylla-submark-circle.png'))

    # Favicon and App Icons (using the Squircle submark)
    # Multi-size ICO: 16, 32, 48, 64, 128
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128)]
    sq_512.save(os.path.join(public_dir, 'favicon.ico'), format='ICO', sizes=ico_sizes)
    sq_512.save(os.path.join(app_dir, 'favicon.ico'), format='ICO', sizes=ico_sizes)

    # icon.png (512x512) and 32x32
    sq_512.save(os.path.join(public_dir, 'icon.png'))
    sq_512.save(os.path.join(app_dir, 'icon.png'))
    
    # apple-icon.png (180x180)
    apple_icon = sq_raw.resize((180, 180), Image.Resampling.LANCZOS)
    apple_icon.save(os.path.join(public_dir, 'apple-icon.png'))
    apple_icon.save(os.path.join(app_dir, 'apple-icon.png'))

    # Color Logo emblem
    logo_color = Image.open(r'C:\Users\youss\.gemini\antigravity\brain\08a862af-2489-42bb-bb39-b3fe66fa1494\scratch\sylla_logo_color_trans.png')
    logo_color.save(os.path.join(public_images_logo, 'sylla-logo-color.png'))
    logo_color_lg = logo_color.resize((logo_color.width * 3, logo_color.height * 3), Image.Resampling.LANCZOS)
    logo_color_lg.save(os.path.join(public_images_logo, 'sylla-logo-color-hd.png'))

    # Monochrome white emblem
    logo_white = Image.open(r'C:\Users\youss\.gemini\antigravity\brain\08a862af-2489-42bb-bb39-b3fe66fa1494\scratch\sylla_mono_white_trans.png')
    logo_white.save(os.path.join(public_images_logo, 'sylla-logo-mono-white.png'))
    logo_white_lg = logo_white.resize((logo_white.width * 3, logo_white.height * 3), Image.Resampling.LANCZOS)
    logo_white_lg.save(os.path.join(public_images_logo, 'sylla-logo-mono-white-hd.png'))

    # Monochrome dark emblem
    logo_dark = Image.open(r'C:\Users\youss\.gemini\antigravity\brain\08a862af-2489-42bb-bb39-b3fe66fa1494\scratch\sylla_mono_dark_trans.png')
    logo_dark.save(os.path.join(public_images_logo, 'sylla-logo-mono-dark.png'))
    logo_dark_lg = logo_dark.resize((logo_dark.width * 3, logo_dark.height * 3), Image.Resampling.LANCZOS)
    logo_dark_lg.save(os.path.join(public_images_logo, 'sylla-logo-mono-dark-hd.png'))

    print('All raster and ICO assets built and saved successfully!')

if __name__ == '__main__':
    build_all_assets()
