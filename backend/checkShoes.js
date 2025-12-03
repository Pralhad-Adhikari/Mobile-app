const mongoose = require('mongoose');
const Shoe = require('./models/shoes');
require('dotenv').config();

const connectDB = require('./config/db');

async function checkShoes() {
  try {
    // Connect to database
    await connectDB();
    
    // Count total shoes
    const totalShoes = await Shoe.countDocuments({});
    console.log(`Total shoes in database: ${totalShoes}`);
    
    // Get all shoes
    const allShoes = await Shoe.find({});
    console.log('\nAll shoes in database:');
    allShoes.forEach((shoe, index) => {
      console.log(`${index + 1}. ${shoe.brand} ${shoe.name} - ₹${shoe.price}`);
    });
    
    // Check for duplicates
    const shoeNames = allShoes.map(shoe => shoe.name);
    const uniqueNames = [...new Set(shoeNames)];
    console.log(`\nUnique shoe names: ${uniqueNames.length}`);
    console.log(`Total shoes: ${totalShoes}`);
    
    if (uniqueNames.length !== totalShoes) {
      console.log('\n⚠️  WARNING: There might be duplicate shoes!');
      const duplicates = shoeNames.filter((name, index) => shoeNames.indexOf(name) !== index);
      console.log('Duplicate names:', duplicates);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking shoes:', error);
    process.exit(1);
  }
}

// Run the check
checkShoes();

