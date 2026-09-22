import { Product } from '@/types/product';

export const mockProducts: Product[] = [
    // Dalab (General/Featured)
    {
        id: 'd1',
        title: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
        price: 4699,
        image: 'https://placehold.co/600x600/1a1a1a/ffffff?text=iPhone+15+Pro+Max',
        rating: 4.9,
        store: 'dalab',
        category: 'phone',
        images: [
            { id: 'img1', url: 'https://placehold.co/600x600/1a1a1a/ffffff?text=View+1', order: 1 },
            { id: 'img2', url: 'https://placehold.co/600x600/1a1a1a/ffffff?text=View+2', order: 2 }
        ]
    },
    {
        id: 'd2',
        title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        price: 1199,
        image: 'https://placehold.co/600x600/333333/ffffff?text=Sony+XM5',
        rating: 4.7,
        store: 'dalab',
        category: 'electronics'
    },
    {
        id: 'd3',
        title: 'Dyson V15 Detect Absolute Vacuum Cleaner',
        price: 2899,
        image: 'https://placehold.co/600x600/6600cc/ffffff?text=Dyson+V15',
        rating: 4.8,
        store: 'dalab',
        category: 'home applicable'
    },

    // Amazon (Electronics/Diverse)
    {
        id: 'a1',
        title: 'PlayStation 5 Console (Slim Version) International',
        price: 1849,
        image: 'https://placehold.co/600x600/000000/ffffff?text=PS5+Slim',
        rating: 4.8,
        store: 'amazon',
        category: 'electronics'
    },
    {
        id: 'a2',
        title: 'Samsung Galaxy S24 Ultra 5G AI Smartphone',
        price: 4099,
        image: 'https://placehold.co/600x600/000000/ffffff?text=S24+Ultra',
        rating: 4.6,
        store: 'amazon',
        category: 'phone'
    },
    {
        id: 'a3',
        title: 'Kindle Paperwhite (16 GB) - 6.8" display',
        price: 599,
        image: 'https://placehold.co/600x600/333333/ffffff?text=Kindle',
        rating: 4.9,
        store: 'amazon',
        category: 'electronics'
    },
    {
        id: 'a4',
        title: 'Nespresso Vertuo Next Coffee Machine',
        price: 649,
        image: 'https://placehold.co/600x600/333333/ffffff?text=Nespresso',
        rating: 4.5,
        store: 'amazon',
        category: 'home and kitchen'
    },

    // Shein (Fashion/Beauty/Accessories)
    {
        id: 's1',
        title: 'Floral Print Boho Maxi Dress',
        price: 89,
        image: 'https://placehold.co/600x600/ff9999/000000?text=Maxi+Dress',
        rating: 4.3,
        store: 'shein',
        category: 'beauty'
    },
    {
        id: 's2',
        title: 'Chunky Knit Oversized Sweater',
        price: 120,
        image: 'https://placehold.co/600x600/cc9966/000000?text=Sweater',
        rating: 4.4,
        store: 'shein',
        category: 'beauty'
    },
    {
        id: 's3',
        title: 'Makeup Brush Set 15pcs Professional',
        price: 45,
        image: 'https://placehold.co/600x600/ffccff/000000?text=Brush+Set',
        rating: 4.6,
        store: 'shein',
        category: 'personal care'
    },
    {
        id: 's4',
        title: 'Rhinestone Decor Evening Clutch Bag',
        price: 75,
        image: 'https://placehold.co/600x600/000000/ffffff?text=Clutch',
        rating: 4.7,
        store: 'shein',
        category: 'beauty'
    },

    // Temu (Budget/Variety)
    {
        id: 't1',
        title: 'Portable Mini Blender USB Rechargeable',
        price: 35,
        image: 'https://placehold.co/600x600/99ff99/000000?text=Mini+Blender',
        rating: 4.1,
        store: 'temu',
        category: 'home and kitchen'
    },
    {
        id: 't2',
        title: 'Wireless Earbuds Bluetooth 5.3',
        price: 29,
        image: 'https://placehold.co/600x600/ffffff/000000?text=Earbuds',
        rating: 3.9,
        store: 'temu',
        category: 'electronics'
    },
    {
        id: 't3',
        title: 'Silicone Kitchen Utensil Set 12pcs',
        price: 55,
        image: 'https://placehold.co/600x600/ff6666/ffffff?text=Utensils',
        rating: 4.5,
        store: 'temu',
        category: 'home and kitchen'
    },
    {
        id: 't4',
        title: 'Men\'s Casual Running Shoes Breathable',
        price: 65,
        image: 'https://placehold.co/600x600/666666/ffffff?text=Running+Shoes',
        rating: 4.2,
        store: 'temu',
        category: 'beauty'
    },

    // Best Buy (Electronics)
    {
        id: 'bb1',
        title: 'LG C3 Series 65-Inch Class OLED evo 4K Processor',
        price: 6499,
        image: 'https://placehold.co/600x600/000000/ffffff?text=LG+OLED+TV',
        rating: 4.9,
        store: 'bestbuy',
        category: 'electronics'
    },
    {
        id: 'bb2',
        title: 'MacBook Air 13.6" Laptop - Apple M2 chip',
        price: 3999,
        image: 'https://placehold.co/600x600/333333/ffffff?text=MacBook+Air',
        rating: 4.8,
        store: 'bestbuy',
        category: 'electronics'
    },
    {
        id: 'bb3',
        title: 'GoPro HERO12 Black Action Camera',
        price: 1599,
        image: 'https://placehold.co/600x600/000000/ffffff?text=GoPro+12',
        rating: 4.7,
        store: 'bestbuy',
        category: 'electronics'
    },

    // More Dalab items to fill list
    {
        id: 'd4',
        title: 'Organic Protein Powder Vanilla 1kg',
        price: 150,
        image: 'https://placehold.co/600x600/99cc00/ffffff?text=Protein',
        rating: 4.5,
        store: 'dalab',
        category: 'health & nutrition'
    },
    {
        id: 'd5',
        title: 'CeraVe Moisturizing Cream 453g',
        price: 85,
        image: 'https://placehold.co/600x600/ffffff/000066?text=CeraVe',
        rating: 4.8,
        store: 'dalab',
        category: 'personal care'
    },
    {
        id: 'd6',
        title: 'Ariel Automatic Laundry Detergent Powder 2.5kg',
        price: 45,
        image: 'https://placehold.co/600x600/009933/ffffff?text=Ariel',
        rating: 4.6,
        store: 'dalab',
        category: 'supermarket'
    },
    {
        id: 'd7',
        title: 'Nutella Hazelnut Spread 750g',
        price: 28,
        image: 'https://placehold.co/600x600/663300/ffffff?text=Nutella',
        rating: 4.9,
        store: 'dalab',
        category: 'supermarket'
    },
    {
        id: 'd8',
        title: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
        price: 4699,
        image: 'https://placehold.co/600x600/1a1a1a/ffffff?text=iPhone+15+Pro+Max',
        rating: 4.9,
        store: 'dalab',
        category: 'phone',
    },

    // New Categories: Office Supply
    {
        id: 'o1',
        title: 'Ergonomic Office Chair with Lumbar Support',
        price: 299,
        image: 'https://placehold.co/600x600/333333/ffffff?text=Office+Chair',
        rating: 4.6,
        store: 'amazon',
        category: 'office supply'
    },
    {
        id: 'o2',
        title: 'HP LaserJet Pro Wireless Printer',
        price: 349,
        image: 'https://placehold.co/600x600/ffffff/000000?text=Printer',
        rating: 4.4,
        store: 'bestbuy',
        category: 'office supply'
    },
    {
        id: 'o3',
        title: 'Moleskine Classic Notebook Hard Cover',
        price: 22,
        image: 'https://placehold.co/600x600/000000/ffffff?text=Notebook',
        rating: 4.8,
        store: 'amazon',
        category: 'office supply'
    }
];
