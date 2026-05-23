const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const sampleProducts = [
  // TECH
  {
    name: 'Smart Watch Pro',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&fit=crop',
    description: 'Premium smartwatch with health tracking, GPS, and 7-day battery life.',
    category: 'tech', stock: 45, rating: 4.5, reviews: 128, featured: true,
  },
  {
    name: 'Wireless Earbuds',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&fit=crop',
    description: 'True wireless earbuds with active noise cancellation and 24hr battery.',
    category: 'tech', stock: 80, rating: 4.3, reviews: 95, featured: true,
  },
  {
    name: 'Mechanical Keyboard',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&fit=crop',
    description: 'TKL mechanical keyboard with RGB backlight and tactile switches.',
    category: 'tech', stock: 30, rating: 4.7, reviews: 210, featured: false,
  },
  {
    name: 'USB-C Hub 7-in-1',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400&fit=crop',
    description: '7-port hub with 4K HDMI, 100W Power Delivery, SD card reader.',
    category: 'tech', stock: 60, rating: 4.4, reviews: 74, featured: false,
  },
  {
    name: 'Portable SSD 1TB',
    price: 109.99,
    image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400&fit=crop',
    description: 'Ultra-fast portable SSD, 1050MB/s read speed. Shock-resistant.',
    category: 'tech', stock: 25, rating: 4.8, reviews: 182, featured: true,
  },
  {
    name: 'Webcam 4K',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=400&fit=crop',
    description: '4K webcam with auto-focus, built-in mic, and privacy shutter.',
    category: 'tech', stock: 40, rating: 4.2, reviews: 56, featured: false,
  },

  // INTERIOR
  {
    name: 'Modern Desk Lamp',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1534073737927-85f1ebff1f5d?w=400&fit=crop',
    description: 'LED desk lamp with adjustable color temperature and USB charging port.',
    category: 'interior', stock: 55, rating: 4.6, reviews: 89, featured: true,
  },
  {
    name: 'Ceramic Plant Pot Set',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&fit=crop',
    description: 'Set of 3 matte white ceramic pots. Perfect for succulents.',
    category: 'interior', stock: 70, rating: 4.5, reviews: 143, featured: false,
  },
  {
    name: 'Scented Candle Set',
    price: 28.99,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&fit=crop',
    description: 'Luxury soy wax candle set: lavender, sandalwood, vanilla. 40hr burn.',
    category: 'interior', stock: 90, rating: 4.7, reviews: 231, featured: true,
  },
  {
    name: 'Wall Art Print',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&fit=crop',
    description: 'Minimalist abstract print on premium archival paper. A3 and A2 sizes.',
    category: 'interior', stock: 35, rating: 4.3, reviews: 67, featured: false,
  },

  // CLOTH
  {
    name: 'Classic White T-Shirt',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&fit=crop',
    description: '100% organic cotton premium white tee. Pre-shrunk, S to XXL.',
    category: 'cloth', stock: 120, rating: 4.4, reviews: 305, featured: true,
  },
  {
    name: 'Slim Fit Chinos',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&fit=crop',
    description: 'Stretch slim fit chinos in khaki. Wrinkle-resistant for work or casual.',
    category: 'cloth', stock: 65, rating: 4.2, reviews: 178, featured: false,
},
  {
    name: 'Oversized Hoodie',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&fit=crop',
    description: 'Soft fleece oversized hoodie with kangaroo pocket.',
    category: 'cloth', stock: 85, rating: 4.6, reviews: 412, featured: true,
  },

  // ACCESSORIES
  {
    name: 'Leather Wallet',
    price: 35.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&fit=crop',
    description: 'Slim genuine leather bifold with RFID blocking. Holds 8 cards.',
    category: 'accessories', stock: 100, rating: 4.5, reviews: 289, featured: true,
  },
  {
    name: 'Polarized Sunglasses',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&fit=crop',
    description: 'UV400 polarized sunglasses with lightweight metal frame.',
    category: 'accessories', stock: 55, rating: 4.3, reviews: 134, featured: false,
  },
  {
    name: 'Canvas Tote Bag',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400&fit=crop',
    description: 'Durable cotton canvas tote. Large capacity, machine washable.',
    category: 'accessories', stock: 150, rating: 4.4, reviews: 198, featured: true,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('🗑️  Cleared old products');

    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${inserted.length} products`);

    mongoose.connection.close();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();