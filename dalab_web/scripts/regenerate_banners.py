import os
import sys
import math
from PIL import Image, ImageDraw, ImageEnhance

# Configuration
BANNER_DIR = "public/banners"
ARTIFACT_DIR = "C:/Users/user/.gemini/antigravity/brain/37039668-fffd-4bb5-9164-fdf05a8448c5"
OUTPUT_FPS_HERO = 15
OUTPUT_FPS_STRIP = 12
FRAMES_HERO = 30  # 2 seconds at 15fps
FRAMES_STRIP = 24  # 2 seconds at 12fps

def ensure_dir(d):
    if not os.path.exists(d):
        os.makedirs(d)

def animate_ramadan_hero(base_path, output_name):
    """Ramadan banner with twinkling fairy lights"""
    print(f"Animating Ramadan hero: {base_path}")
    base_img = Image.open(base_path).convert("RGBA")
    base_img = base_img.resize((1200, 400), Image.Resampling.LANCZOS)
    
    frames = []
    
    for i in range(FRAMES_HERO):
        frame = base_img.copy()
        draw = ImageDraw.Draw(frame, 'RGBA')
        
        # Add twinkling lights across the banner
        for j in range(25):
            x = 50 + j * 48
            y = 30 + math.sin(j * 0.5) * 10
            
            # Brightness oscillation
            phase = i * 0.4 + j * 0.6
            brightness = int(200 + 55 * math.sin(phase))
            radius = 2 + math.sin(phase) * 0.5
            
            # Draw glow
            glow_alpha = int(80 + 40 * math.sin(phase))
            draw.ellipse(
                [x - radius*2, y - radius*2, x + radius*2, y + radius*2],
                fill=(255, 255, 200, glow_alpha)
            )
            
            # Draw core
            draw.ellipse(
                [x - radius, y - radius, x + radius, y + radius],
                fill=(255, 255, brightness, 255)
            )
        
        frames.append(frame.convert("RGB"))
    
    # Save as GIF
    frames[0].save(
        os.path.join(BANNER_DIR, output_name),
        save_all=True,
        append_images=frames[1:],
        duration=1000 // OUTPUT_FPS_HERO,
        loop=0,
        optimize=True
    )
    print(f"✓ Saved: {output_name}")

def animate_eid_sale_hero(base_path, output_name):
    """Eid sale banner with pulsing effect"""
    print(f"Animating Eid sale hero: {base_path}")
    base_img = Image.open(base_path).convert("RGBA")
    base_img = base_img.resize((1200, 400), Image.Resampling.LANCZOS)
    
    frames = []
    
    for i in range(FRAMES_HERO):
        frame = base_img.copy()
        
        # Subtle brightness pulse
        enhancer = ImageEnhance.Brightness(frame)
        factor = 1.0 + 0.08 * math.sin(i * 0.25)
        frame = enhancer.enhance(factor)
        
        # Add slight contrast variation
        enhancer2 = ImageEnhance.Contrast(frame)
        factor2 = 1.0 + 0.05 * math.sin(i * 0.3)
        frame = enhancer2.enhance(factor2)
        
        frames.append(frame.convert("RGB"))
    
    frames[0].save(
        os.path.join(BANNER_DIR, output_name),
        save_all=True,
        append_images=frames[1:],
        duration=1000 // OUTPUT_FPS_HERO,
        loop=0,
        optimize=True
    )
    print(f"✓ Saved: {output_name}")

def animate_fashion_hero(base_path, output_name):
    """Fashion banner with subtle shimmer"""
    print(f"Animating Fashion hero: {base_path}")
    base_img = Image.open(base_path).convert("RGBA")
    base_img = base_img.resize((1200, 400), Image.Resampling.LANCZOS)
    
    frames = []
    
    for i in range(FRAMES_HERO):
        frame = base_img.copy()
        
        # Subtle shimmer effect
        enhancer = ImageEnhance.Contrast(frame)
        factor = 1.0 + 0.05 * math.sin(i * 0.3)
        frame = enhancer.enhance(factor)
        
        # Slight brightness variation
        enhancer2 = ImageEnhance.Brightness(frame)
        factor2 = 1.0 + 0.03 * math.sin(i * 0.4)
        frame = enhancer2.enhance(factor2)
        
        frames.append(frame.convert("RGB"))
    
    frames[0].save(
        os.path.join(BANNER_DIR, output_name),
        save_all=True,
        append_images=frames[1:],
        duration=1000 // OUTPUT_FPS_HERO,
        loop=0,
        optimize=True
    )
    print(f"✓ Saved: {output_name}")

def animate_zaad_strip(base_path, output_name):
    """ZAAD strip with diagonal shimmer effect"""
    print(f"Animating ZAAD strip: {base_path}")
    base_img = Image.open(base_path).convert("RGBA")
    # Resize to exact target dimensions
    base_img = base_img.resize((1200, 80), Image.Resampling.LANCZOS)
    
    frames = []
    
    for i in range(FRAMES_STRIP):
        frame = base_img.copy()
        
        # Diagonal shimmer moving left to right
        shimmer_x = (i * 80) % 2400 - 600
        shimmer_width = 120
        
        # Create overlay for shimmer
        overlay = Image.new('RGBA', (1200, 80), (255, 255, 255, 0))
        draw = ImageDraw.Draw(overlay)
        
        # Draw diagonal shine
        points = [
            (shimmer_x, 0),
            (shimmer_x + shimmer_width, 0),
            (shimmer_x + shimmer_width - 40, 80),
            (shimmer_x - 40, 80)
        ]
        draw.polygon(points, fill=(255, 255, 255, 50))
        
        # Composite shimmer onto frame
        frame = Image.alpha_composite(frame, overlay)
        frames.append(frame.convert('RGB'))
    
    frames[0].save(
        os.path.join(BANNER_DIR, output_name),
        save_all=True,
        append_images=frames[1:],
        duration=1000 // OUTPUT_FPS_STRIP,
        loop=0,
        optimize=True
    )
    print(f"✓ Saved: {output_name}")

if __name__ == "__main__":
    ensure_dir(BANNER_DIR)
    
    # Find generated base images
    files = os.listdir(ARTIFACT_DIR)
    
    ramadan_base = next((f for f in files if 'ramadan_hero_new' in f and f.endswith('.png')), None)
    eid_base = next((f for f in files if 'eid_sale_new' in f and f.endswith('.png')), None)
    fashion_base = next((f for f in files if 'fashion_hero_new' in f and f.endswith('.png')), None)
    zaad_base = next((f for f in files if 'uploaded_image_1769025692928' in f and f.endswith('.png')), None)
    
    print("=" * 60)
    print("BANNER ANIMATION SCRIPT")
    print("=" * 60)
    
    if ramadan_base:
        animate_ramadan_hero(os.path.join(ARTIFACT_DIR, ramadan_base), 'ramadan_hero.gif')
    else:
        print("⚠ Ramadan base image not found")
    
    if eid_base:
        animate_eid_sale_hero(os.path.join(ARTIFACT_DIR, eid_base), 'eid_sale.gif')
    else:
        print("⚠ Eid sale base image not found")
    
    if fashion_base:
        animate_fashion_hero(os.path.join(ARTIFACT_DIR, fashion_base), 'fashion_hero.gif')
    else:
        print("⚠ Fashion base image not found")
    
    if zaad_base:
        animate_zaad_strip(os.path.join(ARTIFACT_DIR, zaad_base), 'zaad_promo.gif')
    else:
        print("⚠ ZAAD base image not found")
    
    print("=" * 60)
    print("ANIMATION COMPLETE!")
    print("=" * 60)
