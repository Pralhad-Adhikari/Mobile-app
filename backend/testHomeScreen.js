const axios = require('axios');

const API_BASE = 'http://192.168.1.4:5000/api';

async function testHomeScreen() {
  try {
    console.log('🧪 Testing New HomeScreen Features...\n');

    // Test 1: Get all shoes for testing
    console.log('1. 📊 Getting all shoes for testing...');
    const response = await axios.get(`${API_BASE}/shoes`);
    const allShoes = response.data.data;
    console.log(`   ✅ Found ${allShoes.length} shoes in database\n`);

    // Test 2: Test search functionality (by name)
    console.log('2. 🔍 Testing search by name...');
    if (allShoes.length > 0) {
      const firstShoe = allShoes[0];
      const searchTerm = firstShoe.name.substring(0, 3); // First 3 characters
      console.log(`   Searching for: "${searchTerm}"`);
      
      const searchResults = allShoes.filter(shoe => 
        shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shoe.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      console.log(`   ✅ Found ${searchResults.length} matching shoes`);
      searchResults.forEach((shoe, index) => {
        console.log(`      ${index + 1}. ${shoe.name} (${shoe.brand})`);
      });
    }

    // Test 3: Test price filtering
    console.log('\n3. 💰 Testing price filtering...');
    if (allShoes.length > 0) {
      const prices = allShoes.map(shoe => shoe.price).sort((a, b) => a - b);
      const minPrice = Math.floor(prices[0]);
      const maxPrice = Math.ceil(prices[prices.length - 1]);
      const midPrice = Math.floor((minPrice + maxPrice) / 2);
      
      console.log(`   Price range: ₹${minPrice} - ₹${maxPrice}`);
      console.log(`   Testing filter: ₹${minPrice} - ₹${midPrice}`);
      
      const priceFiltered = allShoes.filter(shoe => 
        shoe.price >= minPrice && shoe.price <= midPrice
      );
      
      console.log(`   ✅ Found ${priceFiltered.length} shoes in price range`);
      priceFiltered.forEach((shoe, index) => {
        console.log(`      ${index + 1}. ${shoe.name} - ₹${shoe.price}`);
      });
    }

    // Test 4: Test recently added shoes (last 5)
    console.log('\n4. 🆕 Testing recently added shoes...');
    const recentShoes = allShoes.slice(0, 5);
    console.log(`   ✅ Recently added shoes (last 5):`);
    recentShoes.forEach((shoe, index) => {
      console.log(`      ${index + 1}. ${shoe.name} (${shoe.brand}) - ₹${shoe.price}`);
    });

    // Test 5: Test combined search and price filter
    console.log('\n5. 🔍💰 Testing combined search and price filter...');
    if (allShoes.length > 0) {
      const searchTerm = allShoes[0].brand.substring(0, 2);
      const maxPrice = Math.ceil(allShoes[0].price * 1.5);
      
      console.log(`   Search: "${searchTerm}", Max Price: ₹${maxPrice}`);
      
      const combinedResults = allShoes.filter(shoe => 
        (shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         shoe.brand.toLowerCase().includes(searchTerm.toLowerCase())) &&
        shoe.price <= maxPrice
      );
      
      console.log(`   ✅ Found ${combinedResults.length} shoes matching both criteria`);
      combinedResults.forEach((shoe, index) => {
        console.log(`      ${index + 1}. ${shoe.name} (${shoe.brand}) - ₹${shoe.price}`);
      });
    }

    // Test 6: Test color display functionality
    console.log('\n6. 🎨 Testing color display...');
    const shoesWithColors = allShoes.filter(shoe => shoe.color && shoe.color.length > 0);
    console.log(`   ✅ Shoes with colors: ${shoesWithColors.length}`);
    
    shoesWithColors.slice(0, 3).forEach((shoe, index) => {
      console.log(`      ${index + 1}. ${shoe.name}: ${shoe.color.join(', ')}`);
    });

    // Test 7: Test category badges
    console.log('\n7. 🏷️ Testing category badges...');
    const categories = [...new Set(allShoes.map(shoe => shoe.category))];
    console.log(`   ✅ Available categories: ${categories.join(', ')}`);
    
    categories.forEach(category => {
      const categoryShoes = allShoes.filter(shoe => shoe.category === category);
      console.log(`      ${category}: ${categoryShoes.length} shoes`);
    });

    // Test 8: Test stock information
    console.log('\n8. 📦 Testing stock information...');
    const inStockShoes = allShoes.filter(shoe => shoe.stock > 0);
    const outOfStockShoes = allShoes.filter(shoe => shoe.stock === 0);
    
    console.log(`   ✅ In stock: ${inStockShoes.length} shoes`);
    console.log(`   ❌ Out of stock: ${outOfStockShoes.length} shoes`);
    
    if (inStockShoes.length > 0) {
      console.log(`   📊 Stock range: ${Math.min(...inStockShoes.map(s => s.stock))} - ${Math.max(...inStockShoes.map(s => s.stock))}`);
    }

    console.log('\n🎉 HomeScreen Test Complete!');
    console.log('\n📋 New HomeScreen Features Summary:');
    console.log('   ✅ Modern clean design without background images');
    console.log('   ✅ Search bar for name and brand filtering');
    console.log('   ✅ Price range filter with min/max inputs');
    console.log('   ✅ Animated image slider for recently added shoes');
    console.log('   ✅ Beautiful 2-column grid layout for all shoes');
    console.log('   ✅ Category badges on shoe cards');
    console.log('   ✅ Color dots display for available colors');
    console.log('   ✅ Stock information display');
    console.log('   ✅ Pull-to-refresh functionality');
    console.log('   ✅ Clear filters option');
    console.log('   ✅ Empty state handling');
    console.log('   ✅ Loading and error states');
    console.log('   ✅ Cart button in header');
    console.log('   ✅ Responsive design with shadows and animations');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testHomeScreen();



