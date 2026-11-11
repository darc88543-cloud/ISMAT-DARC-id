import zlib
import struct
import math
import os

def create_png(filename, width, height, is_maskable=False):
    raw_data = bytearray()
    
    # Center coords and scales
    cx = width / 2.0
    cy = height / 2.0
    scale = (width / 512.0) * (0.75 if is_maskable else 0.92)

    for y in range(height):
        raw_data.append(0)  # filter type 0
        for x in range(width):
            # Normalized relative to center
            dx = (x - cx) / scale
            dy = (y - cy) / scale
            
            # Distance from center
            r = math.sqrt(dx*dx + dy*dy)
            
            # Default dark base background: #06180f -> (6, 24, 15)
            # Radial subtle background glow
            bg_glow = max(0.0, 1.0 - (r / 260.0))
            r_val = int(6 + 10 * bg_glow)
            g_val = int(24 + 40 * bg_glow)
            b_val = int(15 + 25 * bg_glow)
            a_val = 255

            # If not maskable, round corners at edge of icon canvas
            if not is_maskable:
                corner_radius = width * 0.22
                in_corner_x = (x < corner_radius and y < corner_radius) or \
                              (x > width - corner_radius and y < corner_radius) or \
                              (x < corner_radius and y > height - corner_radius) or \
                              (x > width - corner_radius and y > height - corner_radius)
                if in_corner_x:
                    cx_c = corner_radius if x < corner_radius else width - corner_radius
                    cy_c = corner_radius if y < corner_radius else height - corner_radius
                    dist_c = math.hypot(x - cx_c, y - cy_c)
                    if dist_c > corner_radius:
                        a_val = 0
            
            if a_val > 0:
                # 1. Shield contour check
                # Shield coordinates in 512 space:
                # Top points: (-140, -110) to (140, -110), Top apex (0, -160)
                # Bottom curve to (0, 150)
                in_shield = False
                if dy >= -160 and dy <= 160 and abs(dx) <= 150:
                    if dy < -100:
                        # Top angled roof
                        roof_y = -160 + abs(dx) * 0.4
                        if dy >= roof_y:
                            in_shield = True
                    elif dy <= 60:
                        in_shield = True
                    else:
                        # Bottom point taper
                        taper_w = 150 * (1.0 - ((dy - 60) / 100.0) ** 1.4)
                        if abs(dx) <= max(0, taper_w):
                            in_shield = True

                if in_shield:
                    # Dark emerald shield surface
                    shield_shade = 0.2 + 0.8 * ((dy + 160) / 320.0)
                    r_val = int(10 * shield_shade)
                    g_val = int(45 * shield_shade + 15)
                    b_val = int(28 * shield_shade + 10)

                    # Shield border highlight
                    # Near edge of shield?
                    edge_dist = min(abs(dx - 145), abs(dx + 145))
                    if edge_dist < 4:
                        r_val, g_val, b_val = 0, 230, 118

                # 2. Apex Letter "A" Monogram
                # Main legs of A: apex at (0, -120), base left (-75, 80), base right (75, 80)
                # Thickness ~ 24px
                in_a = False
                in_a_highlight = False

                # Slanted left leg: line from (0, -120) to (-75, 80)
                # Slanted right leg: line from (0, -120) to (75, 80)
                if -125 <= dy <= 85:
                    t = (dy - (-120)) / 200.0  # 0 at top, 1 at bottom
                    if 0.0 <= t <= 1.0:
                        center_left = -75.0 * t
                        center_right = 75.0 * t
                        
                        dist_left = abs(dx - center_left)
                        dist_right = abs(dx - center_right)
                        
                        thickness = 15.0 + 7.0 * t
                        if dist_left <= thickness or dist_right <= thickness:
                            in_a = True
                            if dist_left <= 4.0 or dist_right <= 4.0:
                                in_a_highlight = True

                # Crossbar blade between dy in [-10, 15]
                if -10 <= dy <= 15 and abs(dx) <= 52:
                    in_a = True
                    if abs(dy - 2) <= 3:
                        in_a_highlight = True

                # Inner triangle cutout (make sure A has hole)
                if -60 <= dy <= -12:
                    t_hole = (dy - (-70)) / 60.0
                    if 0.0 <= t_hole <= 1.0:
                        hole_w = 26.0 * t_hole
                        if abs(dx) <= hole_w:
                            in_a = False
                            in_a_highlight = False

                # Top apex diamond crystal: around (0, -90)
                diamond_d = abs(dx) * 1.3 + abs(dy - (-95))
                if diamond_d <= 18:
                    in_a = True
                    in_a_highlight = True

                # Speed chevron underneath A: dy in [105, 122]
                chev_y = 105 + abs(dx) * 0.45
                if abs(dx) <= 45 and abs(dy - chev_y) <= 4:
                    in_a = True
                    in_a_highlight = True

                if in_a:
                    if in_a_highlight:
                        # Bright cyan/white electric highlight
                        r_val, g_val, b_val = 220, 255, 245
                    else:
                        # Vivid neon emerald #00E676 to cyan #00F5D4
                        grad_t = (dy + 120) / 240.0
                        r_val = int(0 + 0 * grad_t)
                        g_val = int(245 - 35 * grad_t)
                        b_val = int(212 - 94 * grad_t)

            raw_data.extend([min(255, max(0, r_val)),
                             min(255, max(0, g_val)),
                             min(255, max(0, b_val)),
                             min(255, max(0, a_val))])

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    idat = chunk(b'IDAT', zlib.compress(bytes(raw_data), 9))
    iend = chunk(b'IEND', b'')

    with open(filename, 'wb') as f:
        f.write(header + ihdr + idat + iend)
    print(f"Generated {filename} ({width}x{height})")

os.makedirs('public', exist_ok=True)
create_png('public/pwa-192x192.png', 192, 192, is_maskable=False)
create_png('public/pwa-512x512.png', 512, 512, is_maskable=False)
create_png('public/pwa-maskable-512x512.png', 512, 512, is_maskable=True)
create_png('public/apple-touch-icon.png', 180, 180, is_maskable=False)
