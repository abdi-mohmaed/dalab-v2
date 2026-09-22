import os
import sqlite3
import json
import uuid
import glob
import base64
import time
from pathlib import Path
from typing import Optional, List, Dict, Any
from dataclasses import dataclass

import requests
from PIL import Image
from openpyxl import Workbook
from openpyxl.styles import Font
from dotenv import load_dotenv
from pydantic import BaseModel, Field, ConfigDict, field_validator

# Try to import rembg, but fallback gracefully
try:
    import rembg
    REMBG_AVAILABLE = True
except ImportError:
    REMBG_AVAILABLE = False
    print("! Warning: rembg not available. Background removal will be skipped.")

# --- Models ---

class AIProductData(BaseModel):
    """Structured data extracted by AI from product images."""
    model_config = ConfigDict(str_strip_whitespace=True, extra='ignore')

    title: str = Field(..., description="Marketplace-ready product title")
    description: str = Field(..., description="Detailed 2-3 sentence description")
    shortDescription: str = Field(..., description="1 sentence short description")
    tags: str = Field(..., description="Comma-separated keywords")
    original_price_usd: float = Field(..., description="Estimated retail price in USD", ge=0)

    @field_validator('tags')
    @classmethod
    def clean_tags(cls, v: str) -> str:
        return ",".join([tag.strip() for tag in v.split(",") if tag.strip()])

# --- Services ---

class Config:
    """Centralized configuration management."""
    def __init__(self):
        load_dotenv(".env.local")
        self.db_path = "prisma/dev.db"
        self.input_dir = r"C:\Users\user\OneDrive\图片\dalab-categories-products"
        self.output_excel = "dalab_import_final.xlsx"
        self.supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.ai_api_url = os.getenv("AI_API_URL")
        self.ai_model_name = os.getenv("AI_MODEL_NAME")
        self.target_categories = {
            "beauty": "Beauty",
            "electronics": "Electronics",
            "home appliances": "Home Appliances",
            "personal care": "Personal Care"
        }

class ImageService:
    """Handles image processing and optimization."""
    @staticmethod
    def process(img_path: str, output_path: str) -> str:
        print(f"   [Image] Processing: {os.path.basename(img_path)}")
        img = Image.open(img_path)
        
        # 1. Background Removal
        if REMBG_AVAILABLE:
            try:
                img = rembg.remove(img)
            except Exception as e:
                print(f"     ! rembg error: {e}")
        
        img = img.convert("RGBA")
        
        # 2. Robust Smart-Crop (Detect product against light backgrounds)
        # Convert to grayscale to find the "blob" of the product
        grayscale = img.convert("L")
        
        # Threshold: Consider anything darker than 250 as the product
        # (This handles the slight off-white backgrounds in your screenshots)
        mask = grayscale.point(lambda p: 255 if p < 250 else 0)
        bbox = mask.getbbox()
        
        if bbox:
            # Leave a tiny 2px buffer when cropping
            img = img.crop((max(0, bbox[0]-2), max(0, bbox[1]-2), min(img.width, bbox[2]+2), min(img.height, bbox[3]+2)))
        
        # 3. Square & Pad on White (Clean presentation)
        width, height = img.size
        # High padding for that "premium" marketplace look (10%)
        max_dim = int(max(width, height) * 1.2)
        
        canvas = Image.new("RGB", (max_dim, max_dim), (255, 255, 255))
        canvas.paste(img, ((max_dim - width) // 2, (max_dim - height) // 2), img if img.mode == 'RGBA' else None)
        
        # 4. Final Optimization
        canvas = canvas.resize((1024, 1024), Image.Resampling.LANCZOS)
        canvas.save(output_path, "PNG", quality=95)
        return output_path

class AIService:
    """Handles communication with the AI Vision API."""
    def __init__(self, config: Config):
        self.url = config.ai_api_url
        self.model = config.ai_model_name

    def analyze_image(self, image_path: str) -> AIProductData:
        if not self.url:
            return self._fallback(image_path)

        try:
            with open(image_path, "rb") as f:
                encoded = base64.b64encode(f.read()).decode('utf-8')

            prompt = """Analyze this product image and extract:
            - Product Name (clear, marketplace-ready)
            - Detailed Description (2-3 sentences)
            - Short Description (1 sentence)
            - Tags (5-7 comma-separated keywords)
            - Estimated Retail Price in USD
            
            Return ONLY a JSON object with keys: title, description, shortDescription, tags, original_price_usd.
            DO NOT include markdown formatting or any other text.
            """
            
            payload = {
                "model": self.model,
                "messages": [{
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{encoded}"}}
                    ]
                }],
                "temperature": 0.1
            }
            
            res = requests.post(self.url, json=payload, timeout=60)
            res.raise_for_status()
            data = res.json()
            
            content = data['choices'][0]['message']['content'].strip()
            # Clean possible markdown
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
                
            return AIProductData.model_validate_json(content)
            
        except Exception as e:
            print(f"     ! AI Error: {e}")
            return self._fallback(image_path)

    def _fallback(self, path: str) -> AIProductData:
        print("     -> Using fallback metadata.")
        return AIProductData(
            title=f"Dalab Product {os.path.basename(path)}",
            description="Premium quality product from Dalab. High performance and durable construction.",
            shortDescription="Quality local product.",
            tags="dalab, imported, quality",
            original_price_usd=25.0
        )

class StorageService:
    """Handles file uploads to Supabase Storage."""
    def __init__(self, config: Config):
        self.url = config.supabase_url
        self.key = config.supabase_key

    def upload(self, local_path: str, bucket: str, remote_path: str) -> str:
        upload_url = f"{self.url}/storage/v1/object/{bucket}/{remote_path}"
        headers = {
            "Authorization": f"Bearer {self.key}",
            "x-upsert": "true"
        }
        with open(local_path, "rb") as f:
            res = requests.post(upload_url, headers=headers, data=f)
            if res.status_code not in [200, 201]:
                raise Exception(f"Upload failed ({res.status_code}): {res.text}")
        return f"{self.url}/storage/v1/object/public/{bucket}/{remote_path}"

class DatabaseService:
    """Handles SQLite operations for categories and products."""
    def __init__(self, config: Config):
        self.conn = sqlite3.connect(config.db_path)
    
    def ensure_categories(self, categories: Dict[str, str]):
        cursor = self.conn.cursor()
        print("   [DB] Synchronizing categories...")
        for folder, name in categories.items():
            cursor.execute("SELECT id FROM Category WHERE name = ?", (name,))
            if not cursor.fetchone():
                cat_id = f"cat_{uuid.uuid4().hex[:8]}"
                cursor.execute(
                    "INSERT INTO Category (id, name, createdAt, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
                    (cat_id, name)
                )
                print(f"     + Created: {name}")
        self.conn.commit()

    def clear_products(self):
        cursor = self.conn.cursor()
        print("   [DB] Clearing existing products...")
        cursor.execute("DELETE FROM Product WHERE source IS NULL OR source IN ('mock', 'Tradeling', 'tradeling', 'Dalab')")
        print(f"     - Deleted {cursor.rowcount} records.")
        self.conn.commit()
    
    def close(self):
        self.conn.close()

# --- Orchestrator ---

class IngestionAgent:
    """Main controller for the ingestion workflow."""
    def __init__(self):
        self.config = Config()
        self.db = DatabaseService(self.config)
        self.ai = AIService(self.config)
        self.storage = StorageService(self.config)
        self.img_proc = ImageService()
        
    def run(self):
        print("🚀 Dalab Intelligent Ingestion Agent Starting...")
        
        # 1. Prep
        self.db.ensure_categories(self.config.target_categories)
        self.db.clear_products()
        
        # 2. Excel Setup
        wb = Workbook()
        ws = wb.active
        ws.title = "Products"
        headers = ["Product ID", "SKU", "Product Title", "Full AI Description", "Short Description", 
                   "Original Price", "Base Price", "Category", "Source", "Tags", "Image", "Status"]
        ws.append(headers)
        for cell in ws[1]:
            cell.font = Font(bold=True)

        # 3. Main Loop
        processed = 0
        errors = []

        for folder, formal_name in self.config.target_categories.items():
            path = os.path.join(self.config.input_dir, folder)
            if not os.path.exists(path):
                continue
            
            print(f"\n📂 Entering Category: {formal_name}")
            images = []
            for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
                images.extend(glob.glob(os.path.join(path, ext)))
                images.extend(glob.glob(os.path.join(path, ext.upper())))

            for img_path in images:
                prod_id = f"dalab_{uuid.uuid4().hex[:8]}"
                temp_file = f"temp_{prod_id}.png"
                
                try:
                    # Pipeline
                    self.img_proc.process(img_path, temp_file)
                    ai_data = self.ai.analyze_image(temp_file)
                    
                    remote_path = f"{folder}/{prod_id}.png"
                    img_url = self.storage.upload(temp_file, "products", remote_path)
                    
                    # Calculations
                    usd_price = ai_data.original_price_usd
                    aed_price = round(usd_price * 3.6725, 2)
                    sku = f"{folder[:3].upper()}-{prod_id[6:]}"
                    
                    # Add to Excel
                    ws.append([
                        prod_id, sku, ai_data.title, ai_data.description, ai_data.shortDescription,
                        usd_price, aed_price, formal_name, "Dalab", ai_data.tags, img_url, "ACTIVE"
                    ])
                    
                    processed += 1
                    print(f"     ✅ Success: {ai_data.title}")
                    
                except Exception as e:
                    print(f"     ❌ Failed {os.path.basename(img_path)}: {e}")
                    errors.append(f"{img_path}: {e}")
                finally:
                    if os.path.exists(temp_file):
                        os.remove(temp_file)
                
                # Small breathe for rate limits
                time.sleep(0.5)

        # 4. Finish
        wb.save(self.config.output_excel)
        self.db.close()
        print(f"\n✨ Ingestion Complete!")
        print(f"   - Processed: {processed}")
        print(f"   - Errors: {len(errors)}")
        if errors:
            print("   - Check ingestion_errors.log for details.")
            with open("ingestion_errors.log", "w", encoding="utf-8") as f:
                f.write("\n".join(errors))

if __name__ == "__main__":
    IngestionAgent().run()
