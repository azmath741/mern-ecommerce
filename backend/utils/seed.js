import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import connectDB from "../config/db.js";

dotenv.config();

const sampleProducts = [
  // 1. Electronics
  {
    title: "Sony WH-1000XM5 Wireless Noise-Canceling Headphones",
    description: "Industry-leading noise cancellation optimized with two processors and 8 microphones. Exceptional sound quality with Ultra-clear hands-free calling and up to 30 hours of battery life.",
    price: 349.99,
    category: "Electronics",
    brand: "Sony",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 25,
    rating: 4.8,
    numReviews: 124,
    featured: true,
  },
  {
    title: "Apple Watch Series 9 GPS 45mm",
    description: "Smarter, brighter, and mightier. Featuring the S9 SiP chip, double tap gesture, faster Siri, and Precision Finding for iPhone. All-day 18-hour battery life with advanced health sensors.",
    price: 399.0,
    category: "Electronics",
    brand: "Apple",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 18,
    rating: 4.9,
    numReviews: 89,
    featured: true,
  },
  {
    title: "Logitech MX Master 3S Wireless Performance Mouse",
    description: "An icon remastered. With Quiet Clicks and 8K DPI track-on-glass sensor. Ergonomic silhouette crafted for the palm of your hand, offering seamless multi-device control.",
    price: 99.99,
    category: "Electronics",
    brand: "Logitech",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 40,
    rating: 4.7,
    numReviews: 210,
    featured: false,
  },
  {
    title: "Dell UltraSharp 27 4K USB-C Hub Monitor",
    description: "Brilliant color clarity with IPS Black technology and 4K UHD resolution. Extensive connectivity including RJ45 and USB-C delivering up to 90W power delivery.",
    price: 579.0,
    category: "Electronics",
    brand: "Dell",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 12,
    rating: 4.6,
    numReviews: 45,
    featured: false,
  },

  // 2. Clothing
  {
    title: "Classic Oversized Heavyweight Cotton Hoodie",
    description: "Crafted from 100% organic 450 GSM combed cotton. Featuring ribbed cuffs, kangaroo pocket, and double-lined hood for unmatched daily warmth and relaxed silhouette.",
    price: 78.0,
    category: "Clothing",
    brand: "Nordic Atelier",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 50,
    rating: 4.7,
    numReviews: 67,
    featured: true,
  },
  {
    title: "Tailored Linen Button-Down Shirt",
    description: "Breathable European flax linen tailored with a modern casual collar. Perfect for warm-weather layering, casual Fridays, and weekend coastal strolls.",
    price: 64.5,
    category: "Clothing",
    brand: "Loom & Thread",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 35,
    rating: 4.5,
    numReviews: 38,
    featured: false,
  },
  {
    title: "Raw Selvedge Denim Slim-Taper Jeans",
    description: "13.5 oz Japanese kurabo selvedge denim woven on vintage shuttle looms. Indigo dyed to develop deep personalized fades and honeycombs over time.",
    price: 135.0,
    category: "Clothing",
    brand: "Kuroki Mills",
    image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 22,
    rating: 4.8,
    numReviews: 92,
    featured: false,
  },

  // 3. Beauty
  {
    title: "Hydrating Hyaluronic & Peptides Serum 50ml",
    description: "Multi-depth hydration formula combining 5 molecular weights of Hyaluronic Acid with biomimetic copper peptides for plump, radiant, bouncy skin.",
    price: 42.0,
    category: "Beauty",
    brand: "Aura Botanicals",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 60,
    rating: 4.9,
    numReviews: 184,
    featured: true,
  },
  {
    title: "Restorative Botanical Night Facial Oil",
    description: "Enriched with cold-pressed rosehip seed, evening primrose, and squalane. Restores lipid barrier while you sleep for a luminous morning complexion.",
    price: 56.0,
    category: "Beauty",
    brand: "Vera Organics",
    image: "https://images.unsplash.com/photo-1608248597359-f83130d226fa?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1608248597359-f83130d226fa?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 45,
    rating: 4.6,
    numReviews: 76,
    featured: false,
  },
  {
    title: "Artisanal Cedarwood & Bergamot Eau de Parfum 100ml",
    description: "Complex and intoxicating blend of warm Atlas cedarwood, crisp Calabrian bergamot, vetiver, and smoky amber. Unisex everyday signature scent.",
    price: 110.0,
    category: "Beauty",
    brand: "Maison Bois",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 15,
    rating: 4.8,
    numReviews: 53,
    featured: false,
  },

  // 4. Home
  {
    title: "Minimalist Matte Ceramic Table Lamp",
    description: "Architectural stoneware base with a textured tactile glaze, paired with a natural linen drum shade. Dimmable warm LED creates an inviting ambient sanctuary.",
    price: 125.0,
    category: "Home",
    brand: "Studio Sol",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 20,
    rating: 4.8,
    numReviews: 31,
    featured: true,
  },
  {
    title: "Cast Iron Dutch Oven 5.5 Quart Enamelled",
    description: "Heavy-duty enamelled cast iron provides superior heat retention and distribution. Perfect for artisanal sourdough, slow stews, and braising.",
    price: 89.99,
    category: "Home",
    brand: "Culinary Foundry",
    image: "https://images.unsplash.com/photo-1584990347449-399a9a3b6807?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1584990347449-399a9a3b6807?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 30,
    rating: 4.9,
    numReviews: 112,
    featured: false,
  },
  {
    title: "Stoneware Matte Coffee Mug Set of 4",
    description: "Hand-thrown feeling stoneware mugs with a smooth satin matte exterior and comfortable ergonomic loop handles. Dishwasher and microwave safe.",
    price: 44.0,
    category: "Home",
    brand: "Clay & Kiln",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 45,
    rating: 4.6,
    numReviews: 64,
    featured: false,
  },

  // 5. Accessories
  {
    title: "Full-Grain Italian Leather Weekender Duffle",
    description: "Handcrafted from vegetable-tanned Tuscan leather. Features solid brass YKK zippers, dedicated shoe compartment, and padded adjustable shoulder strap.",
    price: 245.0,
    category: "Accessories",
    brand: "Tuscan Hide",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 14,
    rating: 4.9,
    numReviews: 48,
    featured: true,
  },
  {
    title: "Handcrafted Acetate Polarized Sunglasses",
    description: "Classic silhouette handcrafted from cellulose acetate with scratch-resistant polarized CR-39 lenses offering 100% UVA/UVB protection.",
    price: 85.0,
    category: "Accessories",
    brand: "Solstice Eyewear",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 35,
    rating: 4.7,
    numReviews: 83,
    featured: false,
  },
  {
    title: "Minimalist RFID Bifold Slim Leather Wallet",
    description: "Slim profile wallet crafted from top-grain leather with built-in RFID blocking shield. Holds up to 10 cards and flat cash without pocket bulk.",
    price: 38.0,
    category: "Accessories",
    brand: "Vault Craft",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 55,
    rating: 4.6,
    numReviews: 129,
    featured: false,
  },

  // 6. Sports
  {
    title: "Pro Mat Natural Tree Rubber Yoga Mat 5mm",
    description: "High-density natural open-cell rubber surface offers unmatched wet and dry grip. Non-toxic, biodegradable, and cushioned for supreme joint protection.",
    price: 68.0,
    category: "Sports",
    brand: "PranaFlow",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 30,
    rating: 4.8,
    numReviews: 95,
    featured: true,
  },
  {
    title: "Vacuum Insulated Stainless Steel Water Bottle 32oz",
    description: "Double-wall vacuum insulation keeps beverages ice cold for 24 hours or piping hot for 12. Leak-proof chug cap with durable powder-coat finish.",
    price: 34.0,
    category: "Sports",
    brand: "HydroPeak",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 65,
    rating: 4.7,
    numReviews: 154,
    featured: false,
  },
  {
    title: "High-Performance Breathable Running Shoes",
    description: "Engineered mesh upper with responsive dual-density midsole foam. Delivers energy return and adaptive stability through marathons and daily training.",
    price: 130.0,
    category: "Sports",
    brand: "Strider Athletics",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 28,
    rating: 4.9,
    numReviews: 167,
    featured: true,
  },

  // 7. Books
  {
    title: "Designing Data-Intensive Applications",
    description: "The definitive guide by Martin Kleppmann to navigating the diverse and fast-changing landscape of technologies for processing and storing data.",
    price: 49.99,
    category: "Books",
    brand: "O'Reilly Media",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 35,
    rating: 4.9,
    numReviews: 312,
    featured: true,
  },
  {
    title: "The Architecture of Art & Space: Hardcover Edition",
    description: "A breathtaking photographic exploration of modern architecture, brutalism, and Japanese minimalist interior spaces with essays by leading architects.",
    price: 65.0,
    category: "Books",
    brand: "Phaidon Press",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 18,
    rating: 4.8,
    numReviews: 44,
    featured: false,
  },
  {
    title: "Mindful Typography & Layout Systems",
    description: "A masterclass in proportions, typographic hierarchy, and grid systems for digital and print designers seeking clarity and timeless balance.",
    price: 36.5,
    category: "Books",
    brand: "Design Lab Editions",
    image: "https://images.unsplash.com/photo-1532012164546-f432f2e37b73?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1532012164546-f432f2e37b73?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 24,
    rating: 4.7,
    numReviews: 29,
    featured: false,
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing existing database collections...");
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Creating default Admin & User accounts...");
    const adminUser = await User.create({
      username: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
      phone: "+1 800 555 0199",
      address: {
        street: "742 Evergreen Terrace",
        city: "Springfield",
        state: "OR",
        postalCode: "97477",
        country: "USA",
      },
    });

    const normalUser = await User.create({
      username: "John Doe",
      email: "user@example.com",
      password: "user123",
      role: "user",
      phone: "+1 555 012 3456",
      address: {
        street: "123 Market Street",
        city: "San Francisco",
        state: "CA",
        postalCode: "94103",
        country: "USA",
      },
    });

    console.log(`Created admin: ${adminUser.email} (password: admin123)`);
    console.log(`Created customer: ${normalUser.email} (password: user123)`);

    console.log("Inserting sample products...");
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${createdProducts.length} realistic products!`);

    // Create a realistic sample order for demonstration
    const sampleOrder = await Order.create({
      user: normalUser._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          title: createdProducts[0].title,
          image: createdProducts[0].image,
          quantity: 1,
          price: createdProducts[0].price,
        },
        {
          product: createdProducts[4]._id,
          title: createdProducts[4].title,
          image: createdProducts[4].image,
          quantity: 2,
          price: createdProducts[4].price,
        }
      ],
      shippingAddress: {
        fullName: "John Doe",
        phone: "+1 555 012 3456",
        address: "123 Market Street",
        city: "San Francisco",
        state: "CA",
        postalCode: "94103",
        country: "USA",
      },
      paymentMethod: "Cash on Delivery",
      itemsPrice: 349.99 + 78.0 * 2,
      shippingPrice: 15.0,
      taxPrice: 40.48,
      totalPrice: 349.99 + 156.0 + 15.0 + 40.48,
      status: "Processing",
      isPaid: false,
    });

    console.log(`Created sample order: ${sampleOrder._id}`);
    console.log("Seeding complete!");

    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();

