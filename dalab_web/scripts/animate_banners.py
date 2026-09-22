import os
import sys
import math
from PIL import Image, ImageDraw, ImageEnhance

# Configuration
BANNER_DIR = "public/banners"
ARTIFACT_DIR = "C:/Users/user/.gemini/antigravity/brain/37039668-fffd-4bb5-9164-fdf05a8448c5"
OUTPUT_FPS = 15
TOTAL_FRAMES = 30  # 2 seconds at 15fps

def ensure_dir(d):
    if not os.path.exists(d):
        os.makedirs(d)

def animate_ramadan_banner(base_path, output_name):
    print(f"Animating Ramadan banner: {base_path}")
    base_img = Image.open(base_path).convert("RGBA")
    # Resize to standard hero banner size
    base_img = base_img.resize((1200, 400), Image.Resampling.LANCZOS)
    
    frames = []
    
    for i in range(TOTAL_FRAMES):
        # Create a copy of the base image
        frame = base_img.copy()
        draw = ImageDraw.Draw(frame)
        
        # Add twinkling lights (yellow dots with pulsing alpha/brightness)
        # We'll place them strategically or just across the top
        for j in range(30):
            # Seed based on j to keep positions constant across frames
            light_x = (j * 40 + 50) % 1200
            light_y = (math.sin(j) * 20 + 40)
            
            # Brightness oscillation
            phase = i * 0.4 + j * 0.5
            brightness = int(200 + 55 * math.sin(phase))
            radius = 2 + math.sin(phase) * 1
            
            # Draw glow
            glow_color = (255, 255, 200, int(100 + 50 * math.sin(phase)))
            draw.ellipse([light_x - radius*2, light_y - radius*2, light_x + radius*2, light_y + radius*2], fill=glow_color)
            
            # Draw core
            draw.ellipse([light_x - radius, light_y - radius, light_x + radius, light_y + radius], fill=(255, 255, brightness, 255))
            
        frames.append(frame.convert("RGB"))
        
    frames[0].save(
        os.path.join(BANNER_DIR, output_name),
        save_all=True,
        append_images=frames[1:],
        duration=1000 // OUTPUT_FPS,
        loop=0,
        optimize=True
    )
    print(f"Saved: {output_name}")

def animate_eid_banner(base_path, output_name):
    print(f"Animating Eid banner: {base_path}")
    base_img = Image.open(base_path).convert("RGBA")
    base_img = base_img.resize((1200, 400), Image.Resampling.LANCZOS)
    
    frames = []
    
    for i in range(TOTAL_FRAMES):
        frame = base_img.copy()
        
        # Pulsing effect for the entire image (subtle)
        # or we could try to pulse specific areas, but global brightness is easier
        enhancer = ImageEnhance.Brightness(frame)
        factor = 1.0 + 0.05 * math.sin(i * 0.3)
        frame = enhancer.enhance(factor)
        
        frames.append(frame.convert("RGB"))
        
    frames[0].save(
        os.path.join(BANNER_DIR, output_name),
        save_all=True,
        append_images=frames[1:],
        duration=1000 // OUTPUT_FPS,
        loop=0,
        optimize=True
    )
    print(f"Saved: {output_name}")

def animate_zaad_banner(base_path, output_name):
    print(f"Animating ZAAD promo strip: {base_path}")
    base_img = Image.open(base_path).convert("RGBA")
    # This is a strip, so 1200x120 or similar
    base_img = base_img.resize((1200, 150), Image.Resampling.LANCZOS)
    
    frames = []
    
    for i in range(TOTAL_FRAMES):
        frame = base_img.copy()
        draw = ImageDraw.Draw(frame)
        
        # Shimmer effect: a diagonal bright line moving across
        shimmer_x = (i * 60) % 2400 - 600
        shimmer_width = 100
        
        # Draw a semi-transparent white polygon for shimmer
        overlay = Image.new("RGBA", frame.size, (255, 255, 255, 0))
        o_draw = ImageDraw.Draw(overlay)
        
        points = [
            (shimmer_x, 0),
            (shimmer_x + shimmer_width, 0),
            (shimmer_x + shimmer_width - 50, 150),
            (shimmer_x - 50, 150)
        ]
        o_draw.polygon(points, fill=(255, 255, 255, 40))
        
        frame = Image.alpha_composite(frame, overlay)
        
        frames.append(frame.convert("RGB"))
        
    frames[0].save(
        os.path.join(BANNER_DIR, output_name),
        save_all=True,
        append_images=frames[1:],
        duration=1000 // OUTPUT_FPS,
        loop=0,
        optimize=True
    )
    print(f"Saved: {output_name}")

if __name__ == "__main__":
    ensure_dir(BANNER_DIR)
    
    # Paths from tool output (need to replace these with actual paths found or passed)
    # I'll look for files starting with the names in the artifact dir
    files = os.listdir(ARTIFACT_DIR)
    ramadan_base = next((f for f in files if f.startswith("ramadan_ready_base")), None)
    eid_base = next((f for f in files if f.startswith("eid_sale_base")), None)
    zaad_base = next((f for f in files if f.startswith("zaad_promo_base")), None)
    
    if ramadan_base:
        animate_ramadan_banner(os.path.join(ARTIFACT_DIR, ramadan_base), "ramadan_hero.gif")
    if eid_base:
        animate_eid_banner(os.path.join(ARTIFACT_DIR, eid_base), "eid_sale.gif")
    if zaad_base:
        animate_zaad_banner(os.path.join(ARTIFACT_DIR, zaad_base), "zaad_promo.gif")
