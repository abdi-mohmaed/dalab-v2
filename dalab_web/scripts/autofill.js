const PrismaClient = require('@prisma/client').PrismaClient;
// Initialize without prepared statements to avoid PgBouncer conflicts in one-off scripts
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL + (process.env.DATABASE_URL.includes('?') ? '&' : '?') + 'pgbouncer=true'
        }
    }
});


const accessoryMocks = [
    {
        name: "Premium Wireless Headphones - Noise Cancelling",
        price: 249.99,
        description: "Experience world-class noise cancellation and superior audio performance with these premium wireless headphones. Features up to 30 hours of battery life and voice assistant integration.",
        brand: "AudioPro"
    },
    {
        name: "Ultra-Fast 65W GaN Charger",
        price: 39.99,
        description: "Charge multiple devices simultaneously with this compact yet powerful 65W GaN wall charger. Supports PD 3.0 and QC 4.0 fast charging standards.",
        brand: "PowerX"
    },
    {
        name: "Braided Nylon USB-C Cable 6ft",
        price: 14.99,
        description: "Extra durable braided nylon USB-C to USB-C cable. Supports 100W power delivery and 480Mbps data transfer speeds. Tangle-free design.",
        brand: "ConnectTech"
    },
    {
        name: "Magnetic Wireless Power Bank 10000mAh",
        price: 49.50,
        description: "Snap and charge firmly with strong magnetic alignment. 10000mAh capacity provides up to 2 full charges for your smartphone.",
        brand: "LuminTech"
    },
    {
        name: "Tempered Glass Screen Protector (2-Pack)",
        price: 12.99,
        description: "9H hardness tempered glass offers maximum protection against scratches and drops. Oleophobic coating reduces fingerprints.",
        brand: "ShieldGuard"
    },
    {
        name: "Silicone Anti-Slip Phone Case",
        price: 18.00,
        description: "Soft liquid silicone case with microfiber lining. Offers excellent grip and drop protection while maintaining a slim profile.",
        brand: "CaseMate"
    },
    {
        name: "Bluetooth 5.3 Earbuds with Charging Case",
        price: 59.90,
        description: "True wireless earbuds with immersive stereo sound and deep bass. Active noise cancellation and transparent mode built-in.",
        brand: "SoundPods"
    },
    {
        name: "Adjustable Aluminum Laptop Stand",
        price: 29.99,
        description: "Ergonomic laptop riser compatible with 10-15.6 inch laptops. Improves posture and laptop cooling with its hollow design.",
        brand: "ErgoDesk"
    }
];

async function run() {
    const categoryId = 'cml5k50mm0000tkg8iqluyjps'; // accessories
    
    console.log(`Fetching products for category ${categoryId}...`);
    const products = await prisma.product.findMany({
        where: { categoryId }
    });
    
    console.log(`Found ${products.length} products in accessories.`);
    
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        // Pick a random mock data or cycle through
        const mockData = accessoryMocks[i % accessoryMocks.length];
        
        console.log(`Updating product ${product.id} -> ${mockData.name}`);
        
        await prisma.product.update({
            where: { id: product.id },
            data: {
                title: mockData.name,
                description: mockData.description,
            }
        });

        // Update the first variant's price if it exists
        const variants = await prisma.productVariant.findMany({
            where: { productId: product.id }
        });
        if (variants.length > 0) {
            await prisma.productVariant.update({
                where: { id: variants[0].id },
                data: { price: mockData.price }
            });
        }

    }
    
    console.log('Update complete!');
}

run()
  .catch(e => {
      console.error(e);
      process.exit(1);
  })
  .finally(async () => {
      await prisma.$disconnect();
  });
