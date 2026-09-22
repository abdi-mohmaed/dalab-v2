import os
from PIL import Image

def test_crop(img_path, output_path):
    print(f"Testing crop for: {img_path}")
    img = Image.open(img_path)
    img = img.convert("RGBA")
    
    # Current logic
    grayscale = img.convert("L")
    mask = grayscale.point(lambda p: 255 if p < 250 else 0)
    bbox = mask.getbbox()
    
    if bbox:
        print(f"Found bbox: {bbox}")
        cropped = img.crop((max(0, bbox[0]-2), max(0, bbox[1]-2), min(img.width, bbox[2]+2), min(img.height, bbox[3]+2)))
        
        # Square and Pad
        width, height = cropped.size
        max_dim = int(max(width, height) * 1.2)
        canvas = Image.new("RGB", (max_dim, max_dim), (255, 255, 255))
        canvas.paste(cropped, ((max_dim - width) // 2, (max_dim - height) // 2), cropped if cropped.mode == 'RGBA' else None)
        
        canvas.save(output_path)
        print(f"Saved test result to: {output_path}")
    else:
        print("No bbox found with current logic!")

if __name__ == "__main__":
    test_img = r"C:\Users\user\OneDrive\图片\dalab-categories-products\beauty\WhatsApp Image 2026-01-27 at 12.40.40 PM (1).jpeg"
    test_crop(test_img, "crop_test_result.png")
