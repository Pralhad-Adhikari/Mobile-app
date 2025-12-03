const axios = require('axios');

const API_BASE = 'http://192.168.1.4:5000/api';

async function testAdminAPI() {
  try {
    console.log('🧪 Testing Admin API Endpoints...\n');

    // Test 1: Get current shoes
    console.log('1. Getting current shoes...');
    const getResponse = await axios.get(`${API_BASE}/shoes`);
    console.log(`   Current shoes count: ${getResponse.data.count}\n`);

    // Test 2: Add a new shoe
    console.log('2. Adding a new test shoe...');
    const newShoe = {
      name: "Test Shoe Admin",
      brand: "Test Brand",
      category: "men",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      size: ["8", "9", "10"],
      color: ["Black", "White"],
      price: 99.99,
      stock: 15,
      description: "Test shoe added via admin API"
    };

    const addResponse = await axios.post(`${API_BASE}/shoes/add`, newShoe);
    console.log(`   ✅ Shoe added successfully: ${addResponse.data.message}`);
    console.log(`   Shoe ID: ${addResponse.data.data._id}\n`);

    // Test 3: Get updated shoes list
    console.log('3. Getting updated shoes list...');
    const updatedResponse = await axios.get(`${API_BASE}/shoes`);
    console.log(`   Updated shoes count: ${updatedResponse.data.count}\n`);

    // Test 4: Update the shoe
    console.log('4. Updating the test shoe...');
    const updateData = {
      ...newShoe,
      price: 89.99,
      stock: 20
    };
    
    const updateResponse = await axios.put(`${API_BASE}/shoes/${addResponse.data.data._id}`, updateData);
    console.log(`   ✅ Shoe updated successfully: ${updateResponse.data.message}\n`);

    // Test 5: Delete the test shoe
    console.log('5. Deleting the test shoe...');
    const deleteResponse = await axios.delete(`${API_BASE}/shoes/${addResponse.data.data._id}`);
    console.log(`   ✅ Shoe deleted successfully: ${deleteResponse.data.message}\n`);

    // Test 6: Final count
    console.log('6. Final shoes count...');
    const finalResponse = await axios.get(`${API_BASE}/shoes`);
    console.log(`   Final shoes count: ${finalResponse.data.count}\n`);

    console.log('🎉 All admin API tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAdminAPI();



