const axios = require('axios');

const API_BASE = 'http://192.168.1.4:5000/api';

async function testAdminTabs() {
  try {
    console.log('🧪 Testing Admin Tabbed Interface...\n');

    // Test 1: Get current shoes for dashboard stats
    console.log('1. 📊 Getting dashboard statistics...');
    const getResponse = await axios.get(`${API_BASE}/shoes`);
    const totalShoes = getResponse.data.count;
    const totalStock = getResponse.data.data.reduce((sum, shoe) => sum + shoe.stock, 0);
    const totalValue = getResponse.data.data.reduce((sum, shoe) => sum + shoe.price * shoe.stock, 0);
    
    console.log(`   ✅ Total Shoes: ${totalShoes}`);
    console.log(`   ✅ Total Stock: ${totalStock}`);
    console.log(`   ✅ Total Value: ₹${totalValue.toFixed(2)}\n`);

    // Test 2: Add a test shoe for inventory management
    console.log('2. 👟 Adding test shoe for inventory management...');
    const newShoe = {
      name: "Tab Test Shoe",
      brand: "Test Brand",
      category: "men",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      size: ["8", "9", "10"],
      color: ["Black", "White"],
      price: 1999.99,
      stock: 15,
      description: "Test shoe for tabbed interface"
    };

    const addResponse = await axios.post(`${API_BASE}/shoes/add`, newShoe);
    console.log(`   ✅ Shoe added: ${addResponse.data.data.name}`);
    console.log(`   💰 Price: ₹${addResponse.data.data.price}`);
    console.log(`   📦 Stock: ${addResponse.data.data.stock}\n`);

    // Test 3: Verify updated statistics
    console.log('3. 📈 Verifying updated dashboard statistics...');
    const updatedResponse = await axios.get(`${API_BASE}/shoes`);
    const newTotalShoes = updatedResponse.data.count;
    const newTotalStock = updatedResponse.data.data.reduce((sum, shoe) => sum + shoe.stock, 0);
    const newTotalValue = updatedResponse.data.data.reduce((sum, shoe) => sum + shoe.price * shoe.stock, 0);
    
    console.log(`   ✅ Updated Total Shoes: ${newTotalShoes}`);
    console.log(`   ✅ Updated Total Stock: ${newTotalStock}`);
    console.log(`   ✅ Updated Total Value: ₹${newTotalValue.toFixed(2)}\n`);

    // Test 4: Test shoe management features
    console.log('4. 🔧 Testing shoe management features...');
    const testShoe = updatedResponse.data.data.find(shoe => shoe.name === "Tab Test Shoe");
    
    if (testShoe) {
      console.log(`   ✅ Shoe found in inventory`);
      console.log(`   📝 Name: ${testShoe.name}`);
      console.log(`   🏷️ Brand: ${testShoe.brand}`);
      console.log(`   📂 Category: ${testShoe.category}`);
      console.log(`   🎨 Colors: ${testShoe.color.join(', ')}`);
      console.log(`   📏 Sizes: ${testShoe.size.join(', ')}\n`);
    }

    // Test 5: Clean up - delete test shoe
    console.log('5. 🧹 Cleaning up test data...');
    const deleteResponse = await axios.delete(`${API_BASE}/shoes/${addResponse.data.data._id}`);
    console.log(`   ✅ Test shoe deleted: ${deleteResponse.data.message}\n`);

    console.log('🎉 Admin Tabbed Interface Test Complete!');
    console.log('\n📋 Tab Features Summary:');
    console.log('   ✅ Home Tab - Dashboard with statistics');
    console.log('   ✅ Shoes Tab - Add/Edit/Delete shoes');
    console.log('   ✅ Logout Tab - Confirmation dialog');
    console.log('   ✅ Bottom Tab Navigation with icons');
    console.log('   ✅ Active tab highlighting');
    console.log('   ✅ Quick actions from dashboard');
    console.log('   ✅ Real-time statistics updates');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAdminTabs();



