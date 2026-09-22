import os
import sys
import json
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

# Configuration
OUTPUT_DIR = "public/uploads/banners"
FONTS_DIR = "C:/Windows/Fonts" # Standard windows fonts
DEFAULT_FONT = "arial.ttf"

def ensure_dir(d):
    if not os.path.exists(d):
        os.makedirs(d)

class BannerGenerator:
    def __init__(self, config):
        self.config = config
        self.width = config.get("width", 1200)
        self.height = config.get("height", 400)
        self.title = config.get("title", "")
        self.subtitle = config.get("subtitle", "")
        self.style = config.get("style", "Modern")
        self.colors = config.get("colors", ["#000000", "#FFFFFF"])
        self.image_path = config.get("image_path", None)
        self.banner_type = config.get("banner_type", "Hero")
        self.is_gif = config.get("format", "PNG").upper() == "GIF"
        self.fps = config.get("fps", 15)
        self.duration = config.get("duration", 2) # seconds
        
        # Adjust dimensions based on banner type if not provided
        if self.banner_type == "Strip":
            self.height = 120
        elif self.banner_type == "Grid":
            self.width = 400
            self.height = 400

    def get_font(self, size, bold=False):
        font_name = "arialbd.ttf" if bold else "arial.ttf"
        try:
            return ImageFont.truetype(os.path.join(FONTS_DIR, font_name), size)
        except:
            return ImageFont.load_default()

    def create_gradient_background(self, colors):
        base = Image.new("RGB", (self.width, self.height), colors[0])
        top = Image.new("RGB", (self.width, self.height), colors[1])
        mask = Image.new("L", (self.width, self.height))
        for y in range(self.height):
            mask.paste(int(255 * (y / self.height)), (0, y, self.width, y + 1))
        base.paste(top, (0, 0), mask)
        return base

    def apply_style_effects(self, img):
        if self.style == "Vibrant":
            enhancer = ImageEnhance.Color(img)
            img = enhancer.enhance(1.5)
        elif self.style == "Minimal":
            img = img.filter(ImageFilter.SMOOTH)
        return img

    def draw_content(self, img, frame_idx=0):
        draw = ImageDraw.Draw(img)
        
        # Draw background image if provided
        if self.image_path and os.path.exists(self.image_path):
            bg_img = Image.open(self.image_path).convert("RGBA")
            # Aspect fill resize
            bg_aspect = bg_img.width / bg_img.height
            target_aspect = self.width / self.height
            if bg_aspect > target_aspect:
                new_h = self.height
                new_w = int(new_h * bg_aspect)
            else:
                new_w = self.width
                new_h = int(new_w / bg_aspect)
            bg_img = bg_img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            # Center crop
            left = (new_w - self.width) / 2
            top = (new_h - self.height) / 2
            bg_img = bg_img.crop((left, top, left + self.width, top + self.height))
            
            # Blend with background color/gradient a bit if needed
            img.paste(bg_img, (0,0), bg_img)

        # Draw Title
        if self.title:
            font_size = 60 if self.banner_type == "Hero" else 30
            font = self.get_font(font_size, bold=True)
            
            # Text animation if GIF
            y_offset = 0
            if self.is_gif:
                y_offset = math.sin(frame_idx * 0.2) * 5
                
            # Get text dimensions using textbbox
            bbox = draw.textbbox((0, 0), self.title, font=font)
            w = bbox[2] - bbox[0]
            h = bbox[3] - bbox[1]
            pos = ((self.width - w) / 2, (self.height - h) / 2 + y_offset)
            
            # Simple shadow
            draw.text((pos[0]+2, pos[1]+2), self.title, fill=(0,0,0,100), font=font)
            draw.text(pos, self.title, fill=self.colors[1], font=font)

        # Draw Subtitle / Prompt
        if self.subtitle:
            font_size = 30 if self.banner_type == "Hero" else 15
            font = self.get_font(font_size, bold=False)
            
            # Get text dimensions using textbbox
            bbox = draw.textbbox((0, 0), self.subtitle, font=font)
            w = bbox[2] - bbox[0]
            h = bbox[3] - bbox[1]
            # Position below title (approx 60% down)
            y_pos = (self.height / 2) + 40
            pos = ((self.width - w) / 2, y_pos)
            
            draw.text((pos[0]+1, pos[1]+1), self.subtitle, fill=(0,0,0,100), font=font)
            draw.text(pos, self.subtitle, fill="#FFFFFF", font=font)

        return img

    def generate(self):
        ensure_dir(OUTPUT_DIR)
        filename = f"generated_{random.randint(1000, 9999)}_{'anim' if self.is_gif else 'static'}"
        
        if not self.is_gif:
            # Static Image
            img = self.create_gradient_background(self.colors)
            img = self.draw_content(img)
            img = self.apply_style_effects(img)
            path = f"{filename}.png"
            img.save(os.path.join(OUTPUT_DIR, path))
            return path
        else:
            # Animated GIF
            frames = []
            num_frames = self.fps * self.duration
            for i in range(num_frames):
                frame = self.create_gradient_background(self.colors)
                frame = self.draw_content(frame, i)
                frame = self.apply_style_effects(frame)
                frames.append(frame.convert("P", palette=Image.ADAPTIVE))
            
            path = f"{filename}.gif"
            frames[0].save(
                os.path.join(OUTPUT_DIR, path),
                save_all=True,
                append_images=frames[1:],
                duration=1000 // self.fps,
                loop=0,
                optimize=True
            )
            return path

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Missing config JSON")
        sys.exit(1)
    
    try:
        config = json.loads(sys.argv[1])
        generator = BannerGenerator(config)
        result_path = generator.generate()
        print(f"SUCCESS:{result_path}")
    except Exception as e:
        print(f"ERROR:{str(e)}")
        sys.exit(1)
