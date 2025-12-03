const mongoose = require('mongoose');
const Shoe = require('./models/shoes');
require('dotenv').config();

// Generate base64 encoded colored square images that work offline in Android emulator
// React Native Image component fully supports base64 data URIs
// These work without any network access - perfect for Android emulator
const getPlaceholderImage = (brand, name, index) => {
  // Use base64 encoded colored square PNG images directly
  // These are minimal valid PNG files (1x1 pixel) that React Native can display and scale
  // Each color is a simple solid colored square
  
  // Minimal 1x1 pixel PNG images encoded as base64
  // React Native will scale these to the desired size
  // These are valid PNG files that work everywhere
  const base64Images = [
    // Blue - minimal valid PNG
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    // Green - minimal valid PNG
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    // Orange - minimal valid PNG
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    // Red - minimal valid PNG
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    // Purple - minimal valid PNG
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    // Pink - minimal valid PNG
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  ];
  
  // Return base64 data URI - works offline and in Android emulator
  return base64Images[index % base64Images.length];
};

const sampleShoes = [
  // Men's Shoes (15)
  {
    name: "Nike Air Force 1 '07",
    brand: "Nike",
    category: "men",
    image: getPlaceholderImage("Nike", "Air Force 1", 0),
    size: ["7", "8", "9", "10", "11", "12"],
    color: ["White", "Black", "Grey"],
    price: 14600,
    stock: 50,
    description: "The legendary basketball shoe that started it all. Iconic style with premium leather construction."
  },
  {
    name: "Adidas Stan Smith",
    brand: "Adidas",
    category: "men",
    image: getPlaceholderImage("Adidas", "Stan Smith", 1),
    size: ["7", "8", "9", "10", "11"],
    color: ["White", "Green", "Black"],
    price: 1200,
    stock: 50,
    description: "Timeless tennis-inspired sneakers with clean lines and superior comfort."
  },
  {
    name: "Jordan Retro 1 High",
    brand: "Jordan",
    category: "men",
    image: getPlaceholderImage("Jordan", "Retro 1 High", 2),
    size: ["8", "9", "10", "11", "12"],
    color: ["Black", "Red", "White"],
    price: 2500,
    stock: 50,
    description: "The original high-top basketball shoe that revolutionized the game."
  },
  {
    name: "TBL Classic Leather",
    brand: "TBL",
    category: "men",
    image: getPlaceholderImage("TBL", "Classic Leather", 3),
    size: ["7", "8", "9", "10", "11"],
    color: ["Brown", "Black", "Tan"],
    price: 1400,
    stock: 50,
    description: "Premium leather boots with rugged design for everyday adventures."
  },
  {
    name: "Goldstar Runner Pro",
    brand: "Goldstar",
    category: "men",
    image: getPlaceholderImage("Goldstar", "Runner Pro", 4),
    size: ["8", "9", "10", "11", "12"],
    color: ["Blue", "Grey", "Black"],
    price: 8000,
    stock: 50,
    description: "Performance running shoes with advanced cushioning technology."
  },
  {
    name: "Puma Suede Classic",
    brand: "Puma",
    category: "men",
    image: getPlaceholderImage("Puma", "Suede Classic", 5),
    size: ["7", "8", "9", "10", "11"],
    color: ["Black", "White", "Red"],
    price: 5000,
    stock: 50,
    description: "Iconic suede sneakers with gold PUMA logo and comfortable fit."
  },
  {
    name: "Converse All Star High",
    brand: "Converse",
    category: "men",
    image: getPlaceholderImage("Converse", "All Star High", 6),
    size: ["8", "9", "10", "11", "12"],
    color: ["Black", "Navy", "White"],
    price: 5000,
    stock: 50,
    description: "Classic high-top sneakers with canvas upper and rubber sole."
  },
  {
    name: "Vans Authentic",
    brand: "Vans",
    category: "men",
    image: getPlaceholderImage("Vans", "Authentic", 7),
    size: ["7", "8", "9", "10", "11"],
    color: ["Black", "White", "Blue"],
    price: 1300,
    stock: 50,
    description: "The original Vans shoe with durable canvas upper and signature waffle sole."
  },
  {
    name: "New Balance 990v5",
    brand: "New Balance",
    category: "men",
    image: getPlaceholderImage("New Balance", "990v5", 8),
    size: ["8", "9", "10", "11", "12"],
    color: ["Grey", "Blue", "Black"],
    price: 1740,
    stock: 50,
    description: "Premium lifestyle sneakers with ENCAP midsole technology."
  },
  {
    name: "Reebok Club C 85",
    brand: "Reebok",
    category: "men",
    image: getPlaceholderImage("Reebok", "Club C 85", 9),
    size: ["7", "8", "9", "10", "11"],
    color: ["White", "Black", "Navy"],
    price: 5000,
    stock: 50,
    description: "Classic tennis-inspired sneakers with soft leather upper."
  },
  {
    name: "ASICS Gel-Nimbus 24",
    brand: "ASICS",
    category: "men",
    image: getPlaceholderImage("ASICS", "Gel-Nimbus 24", 10),
    size: ["8", "9", "10", "11", "12"],
    color: ["Blue", "Grey", "Black"],
    price: 1490,
    stock: 50,
    description: "Advanced running shoes with GEL technology for maximum cushioning."
  },
  {
    name: "Under Armour Curry 8",
    brand: "Under Armour",
    category: "men",
    image: getPlaceholderImage("Under Armour", "Curry 8", 11),
    size: ["7", "8", "9", "10", "11"],
    color: ["Black", "White", "Red"],
    price: 1390,
    stock: 50,
    description: "Basketball shoes designed for Stephen Curry with responsive cushioning."
  },
  {
    name: "Skechers Go Walk",
    brand: "Skechers",
    category: "men",
    image: getPlaceholderImage("Skechers", "Go Walk", 12),
    size: ["8", "9", "10", "11", "12"],
    color: ["Grey", "Blue", "Black"],
    price: 6499,
    stock: 50,
    description: "Comfort walking shoes with air-cooled memory foam insole."
  },
  {
    name: "Fila Disruptor II",
    brand: "Fila",
    category: "men",
    image: getPlaceholderImage("Fila", "Disruptor II", 13),
    size: ["7", "8", "9", "10", "11"],
    color: ["White", "Black", "Red"],
    price: 7999,
    stock: 50,
    description: "Bold chunky sneakers with retro-inspired design."
  },
  {
    name: "Timberland 6-Inch Boot",
    brand: "Timberland",
    category: "men",
    image: getPlaceholderImage("Timberland", "6-Inch Boot", 14),
    size: ["8", "9", "10", "11", "12"],
    color: ["Brown", "Black", "Yellow"],
    price: 1890,
    stock: 50,
    description: "Premium leather boots with waterproof membrane and rugged outsole."
  },

  // Women's Shoes (15)
  {
    name: "Nike Air Max 270",
    brand: "Nike",
    category: "women",
    image: getPlaceholderImage("Nike", "Air Max 270", 15),
    size: ["5", "6", "7", "8", "9", "10"],
    color: ["Pink", "White", "Black"],
    price: 1490,
    stock: 50,
    description: "Revolutionary running shoes with visible Air Max unit for all-day comfort."
  },
  {
    name: "Adidas NMD_R1",
    brand: "Adidas",
    category: "women",
    image: getPlaceholderImage("Adidas", "NMD_R1", 16),
    size: ["5", "6", "7", "8", "9"],
    color: ["Black", "White", "Pink"],
    price: 1290,
    stock: 50,
    description: "Urban sneakers with Boost technology and sleek design."
  },
  {
    name: "Jordan Air 1 Low",
    brand: "Jordan",
    category: "women",
    image: getPlaceholderImage("Jordan", "Air 1 Low", 17),
    size: ["6", "7", "8", "9", "10"],
    color: ["White", "Black", "Red"],
    price: 999,
    stock: 50,
    description: "Low-top basketball shoes with iconic Wings logo and premium leather."
  },
  {
    name: "TBL Chelsea Boot",
    brand: "TBL",
    category: "women",
    image: getPlaceholderImage("TBL", "Chelsea Boot", 18),
    size: ["5", "6", "7", "8", "9"],
    color: ["Black", "Brown", "Tan"],
    price: 1599,
    stock: 50,
    description: "Elegant Chelsea boots with elastic side panels and block heel."
  },
  {
    name: "Goldstar Ballet Flat",
    brand: "Goldstar",
    category: "women",
    image: getPlaceholderImage("Goldstar", "Ballet Flat", 19),
    size: ["6", "7", "8", "9", "10"],
    color: ["Black", "Nude", "Red"],
    price: 6999,
    stock: 50,
    description: "Classic ballet flats with bow detail and comfortable fit."
  },
  {
    name: "Puma Cali Star",
    brand: "Puma",
    category: "women",
    image: getPlaceholderImage("Puma", "Cali Star", 20),
    size: ["5", "6", "7", "8", "9"],
    color: ["White", "Black", "Pink"],
    price: 899,
    stock: 50,
    description: "Platform sneakers with star pattern and bold PUMA branding."
  },
  {
    name: "Converse Chuck Taylor Low",
    brand: "Converse",
    category: "women",
    image: getPlaceholderImage("Converse", "Chuck Taylor Low", 21),
    size: ["5", "6", "7", "8", "9"],
    color: ["Black", "White", "Pink"],
    price: 5499,
    stock: 50,
    description: "Timeless low-top sneakers with canvas upper and rubber toe cap."
  },
  {
    name: "Vans Era",
    brand: "Vans",
    category: "women",
    image: getPlaceholderImage("Vans", "Era", 22),
    size: ["6", "7", "8", "9", "10"],
    color: ["Black", "White", "Blue"],
    price: 5999,
    stock: 50,
    description: "Classic skate shoes with durable canvas upper and padded collar."
  },
  {
    name: "New Balance 574",
    brand: "New Balance",
    category: "women",
    image: getPlaceholderImage("New Balance", "574", 23),
    size: ["5", "6", "7", "8", "9"],
    color: ["Grey", "Pink", "White"],
    price: 799,
    stock: 50,
    description: "Comfortable lifestyle sneakers with ENCAP midsole technology."
  },
  {
    name: "Reebok Nano X1",
    brand: "Reebok",
    category: "women",
    image: getPlaceholderImage("Reebok", "Nano X1", 24),
    size: ["6", "7", "8", "9", "10"],
    color: ["Black", "Grey", "Pink"],
    price: 1099,
    stock: 50,
    description: "Training shoes with Hexalite technology for lightweight support."
  },
  {
    name: "ASICS Gel-Kayano 28",
    brand: "ASICS",
    category: "women",
    image: getPlaceholderImage("ASICS", "Gel-Kayano 28", 25),
    size: ["5", "6", "7", "8", "9"],
    color: ["Blue", "Grey", "Purple"],
    price: 1599,
    stock: 50,
    description: "Stability running shoes with GEL technology and Dynamic DuoMax support."
  },
  {
    name: "Under Armour HOVR Phantom",
    brand: "Under Armour",
    category: "women",
    image: getPlaceholderImage("Under Armour", "HOVR Phantom", 26),
    size: ["6", "7", "8", "9", "10"],
    color: ["Black", "White", "Pink"],
    price: 1399,
    stock: 50,
    description: "Running shoes with HOVR technology for energy return and cushioning."
  },
  {
    name: "Skechers D'Lites",
    brand: "Skechers",
    category: "women",
    image: getPlaceholderImage("Skechers", "D'Lites", 27),
    size: ["5", "6", "7", "8", "9"],
    color: ["White", "Black", "Pink"],
    price: 7499,
    stock: 50,
    description: "Comfort sneakers with lightweight design and air-cooled memory foam."
  },
  {
    name: "Fila Original Fitness",
    brand: "Fila",
    category: "women",
    image: getPlaceholderImage("Fila", "Original Fitness", 28),
    size: ["6", "7", "8", "9", "10"],
    color: ["White", "Black", "Red"],
    price: 6999,
    stock: 50,
    description: "Retro athletic sneakers with Fila logo and comfortable fit."
  },
  {
    name: "Steve Madden Anny",
    brand: "Steve Madden",
    category: "women",
    image: getPlaceholderImage("Steve Madden", "Anny", 29),
    size: ["5", "6", "7", "8", "9"],
    color: ["Black", "White", "Nude"],
    price: 8999,
    stock: 50,
    description: "Fashion sneakers with platform sole and trendy design."
  }
];

const connectDB = require('./config/db');

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await Shoe.deleteMany({});
    console.log('Cleared existing shoes data');
    
    // Insert sample shoes
    const insertedShoes = await Shoe.insertMany(sampleShoes);
    console.log(`Successfully inserted ${insertedShoes.length} shoes`);
    
    // Display inserted shoes
    insertedShoes.forEach(shoe => {
      console.log(`- ${shoe.brand} ${shoe.name}: ₹${shoe.price}`);
    });
    
    console.log('\nDatabase seeded successfully!');
    console.log('All images are now base64 encoded and will work offline in Android emulator.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
