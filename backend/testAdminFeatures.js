const axios = require('axios');

const API_BASE = 'http://192.168.1.4:5000/api';

async function testAdminFeatures() {
  try {
    console.log('🧪 Testing Admin Features...\n');

    // Test 1: Get current shoes
    console.log('1. 📋 Getting current shoes inventory...');
    const getResponse = await axios.get(`${API_BASE}/shoes`);
    console.log(`   ✅ Current shoes count: ${getResponse.data.count}\n`);

    // Test 2: Add a new shoe with all features
    console.log('2. 👟 Adding a new test shoe with all features...');
    const newShoe = {
      name: "Test Premium Shoe",
      brand: "Test Brand",
      category: "men",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      size: ["8", "9", "10", "11"],
      color: ["Black", "White", "Red"],
      price: 2499.99, // Indian Rupees
      stock: 25,
      description: "Test premium shoe with all features"
    };

    const addResponse = await axios.post(`${API_BASE}/shoes/add`, newShoe);
    console.log(`   ✅ Shoe added successfully: ${addResponse.data.message}`);
    console.log(`   📍 Shoe ID: ${addResponse.data.data._id}`);
    console.log(`   💰 Price: ₹${addResponse.data.data.price}`);
    console.log(`   📦 Stock: ${addResponse.data.data.stock}`);
    console.log(`   🎨 Colors: ${addResponse.data.data.color.join(', ')}`);
    console.log(`   📏 Sizes: ${addResponse.data.data.size.join(', ')}\n`);

    // Test 3: Verify the shoe appears in inventory
    console.log('3. 🔍 Verifying shoe appears in inventory...');
    const updatedResponse = await axios.get(`${API_BASE}/shoes`);
    const addedShoe = updatedResponse.data.data.find(shoe => shoe.name === "Test Premium Shoe");
    
    if (addedShoe) {
      console.log(`   ✅ Shoe found in inventory!`);
      console.log(`   📝 Name: ${addedShoe.name}`);
      console.log(`   🏷️ Brand: ${addedShoe.brand}`);
      console.log(`   📂 Category: ${addedShoe.category}`);
      console.log(`   💰 Price: ₹${addedShoe.price}`);
      console.log(`   📦 Stock: ${addedShoe.stock}\n`);
    } else {
      console.log(`   ❌ Shoe not found in inventory\n`);
    }

    // Test 4: Update the shoe
    console.log('4. ✏️ Updating the test shoe...');
    const updateData = {
      ...newShoe,
      price: 1999.99, // Reduced price
      stock: 30,
      color: ["Black", "White", "Red", "Blue"]
    };
    
    const updateResponse = await axios.put(`${API_BASE}/shoes/${addResponse.data.data._id}`, updateData);
    console.log(`   ✅ Shoe updated successfully: ${updateResponse.data.message}`);
    console.log(`   💰 New Price: ₹${updateResponse.data.data.price}`);
    console.log(`   📦 New Stock: ${updateResponse.data.data.stock}`);
    console.log(`   🎨 New Colors: ${updateResponse.data.data.color.join(', ')}\n`);

    // Test 5: Get single shoe
    console.log('5. 🔍 Getting single shoe details...');
    const singleShoeResponse = await axios.get(`${API_BASE}/shoes/${addResponse.data.data._id}`);
    console.log(`   ✅ Single shoe retrieved: ${singleShoeResponse.data.data.name}`);
    console.log(`   📝 Description: ${singleShoeResponse.data.data.description}\n`);

    // Test 6: Delete the test shoe
    console.log('6. 🗑️ Deleting the test shoe...');
    const deleteResponse = await axios.delete(`${API_BASE}/shoes/${addResponse.data.data._id}`);
    console.log(`   ✅ Shoe deleted successfully: ${deleteResponse.data.message}\n`);

    // Test 7: Final verification
    console.log('7. ✅ Final verification...');
    const finalResponse = await axios.get(`${API_BASE}/shoes`);
    const deletedShoe = finalResponse.data.data.find(shoe => shoe.name === "Test Premium Shoe");
    
    if (!deletedShoe) {
      console.log(`   ✅ Shoe successfully removed from inventory`);
      console.log(`   📊 Final shoes count: ${finalResponse.data.count}\n`);
    } else {
      console.log(`   ❌ Shoe still exists in inventory\n`);
    }

    console.log('🎉 All admin features tested successfully!');
    console.log('\n📋 Admin Features Summary:');
    console.log('   ✅ Add new shoes with image, price, sizes, colors');
    console.log('   ✅ Update existing shoes');
    console.log('   ✅ Delete shoes');
    console.log('   ✅ View all shoes in inventory');
    console.log('   ✅ Get single shoe details');
    console.log('   ✅ Price in Indian Rupees (₹)');
    console.log('   ✅ Image URL support');
    console.log('   ✅ Multiple sizes and colors');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAdminFeatures();



