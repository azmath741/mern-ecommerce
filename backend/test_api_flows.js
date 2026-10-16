import axios from "axios";

const API_URL = "http://localhost:8080/api";

const testFlows = async () => {
  console.log("=== STARTING FULL END-TO-END VERIFICATION ===");
  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    console.log("\n[Test 1] Health Check");
    const health = await axios.get(`${API_URL}/health`);
    assert(health.data.status === "ok", "Server health check returns ok");

    // 2. Fetch Products, Categories, Search, Filters
    console.log("\n[Test 2] Products Listing & Filtering");
    const productsRes = await axios.get(`${API_URL}/products?limit=5`);
    assert(productsRes.data.success === true, "Products list returns success");
    assert(productsRes.data.data.length > 0, "Products list contains items");
    assert(productsRes.data.total >= 20, "At least 20 products in database");

    // Categories
    const catRes = await axios.get(`${API_URL}/products/categories`);
    assert(catRes.data.data.length >= 5, "Categories list contains at least 5 categories");

    // Search
    const searchRes = await axios.get(`${API_URL}/products?search=Sony`);
    assert(
      searchRes.data.data.some((p) => p.title.includes("Sony")),
      "Product search by keyword returns matching items"
    );

    // Filter by category
    const filterCatRes = await axios.get(`${API_URL}/products?category=Electronics`);
    assert(
      filterCatRes.data.data.every((p) => p.category.toLowerCase() === "electronics"),
      "Filtering by Electronics returns only Electronics"
    );

    // Filter by price
    const priceRes = await axios.get(`${API_URL}/products?minPrice=50&maxPrice=100`);
    assert(
      priceRes.data.data.every((p) => p.price >= 50 && p.price <= 100),
      "Filtering by price range 50-100 returns only items in range"
    );

    // Sorting
    const sortRes = await axios.get(`${API_URL}/products?sort=price-low&limit=5`);
    const prices = sortRes.data.data.map((p) => p.price);
    const isSorted = prices.slice(1).every((p, i) => p >= prices[i]);
    assert(isSorted, "Sorting price-low returns ascending prices");

    // Product Details
    const firstProduct = productsRes.data.data[0];
    const singleProductRes = await axios.get(`${API_URL}/products/${firstProduct._id}`);
    assert(
      singleProductRes.data.data._id === firstProduct._id,
      "Product details endpoint returns exact product"
    );

    // 3. User Authentication (Signup, Duplicate check, Login)
    console.log("\n[Test 3] User Authentication & Authorization");
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    const signupRes = await axios.post(`${API_URL}/auth/signup`, {
      username: "Automation Tester",
      email: uniqueEmail,
      password: "password123",
    });
    assert(signupRes.data.success === true, "User signup succeeds");
    assert(signupRes.data.data.token !== undefined, "User signup returns JWT");
    assert(signupRes.data.data.password === undefined, "Password is NEVER returned in response");

    const userToken = signupRes.data.data.token;
    const userId = signupRes.data.data._id;

    // Duplicate email check
    try {
      await axios.post(`${API_URL}/auth/signup`, {
        username: "Duplicate",
        email: uniqueEmail,
        password: "password123",
      });
      assert(false, "Duplicate email registration was not blocked");
    } catch (err) {
      assert(err.response?.status === 400, "Duplicate email registration properly rejected with 400");
    }

    // Invalid login check
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: uniqueEmail,
        password: "wrongpassword",
      });
      assert(false, "Invalid password login was not rejected");
    } catch (err) {
      assert(err.response?.status === 401, "Invalid password login properly rejected with 401");
    }

    // Correct user login
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: uniqueEmail,
      password: "password123",
    });
    assert(loginRes.data.success === true, "Correct user login succeeds");
    assert(loginRes.data.data.role === "user", "Normal user has role 'user'");

    // Admin login
    const adminLoginRes = await axios.post(`${API_URL}/auth/login`, {
      email: "admin@example.com",
      password: "admin123",
    });
    assert(adminLoginRes.data.success === true, "Admin login succeeds");
    assert(adminLoginRes.data.data.role === "admin", "Admin user has role 'admin'");
    const adminToken = adminLoginRes.data.data.token;

    // 4. Role Authorization Checks
    console.log("\n[Test 4] Authorization & Admin Gates");
    // Normal user trying to access admin endpoint
    try {
      await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      assert(false, "Normal user was able to access admin users list");
    } catch (err) {
      assert(
        err.response?.status === 403,
        "Normal user forbidden (403) from admin endpoint"
      );
    }

    // Unauthenticated user trying to access protected endpoint
    try {
      await axios.get(`${API_URL}/users/profile`);
      assert(false, "Unauthenticated user was able to access profile");
    } catch (err) {
      assert(
        err.response?.status === 401,
        "Unauthenticated user rejected (401) from protected endpoint"
      );
    }

    // Admin accessing admin endpoint
    const adminUsersRes = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminUsersRes.data.success === true, "Admin successfully accesses user list");

    // 5. User Profile Update
    console.log("\n[Test 5] User Profile Management");
    const profileUpdateRes = await axios.put(
      `${API_URL}/users/profile`,
      {
        username: "Tester Updated",
        phone: "+1 555 999 8888",
        address: {
          street: "99 Tech Blvd",
          city: "Seattle",
          state: "WA",
          postalCode: "98101",
          country: "USA",
        },
        role: "admin", // Malicious attempt to escalate role
      },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    assert(
      profileUpdateRes.data.data.username === "Tester Updated",
      "Username successfully updated"
    );
    assert(
      profileUpdateRes.data.data.role === "user",
      "Role escalation prevented (role remains 'user')"
    );

    // 6. Admin Product CRUD
    console.log("\n[Test 6] Admin Product Management");
    const newProductRes = await axios.post(
      `${API_URL}/products`,
      {
        title: "Test Noise Canceling Earbuds Pro",
        description: "High fidelity acoustic isolation earbuds with charging case.",
        price: 189.99,
        category: "Electronics",
        brand: "AudioTech",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
        stock: 15,
        featured: true,
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert(newProductRes.data.success === true, "Admin created new product");
    const createdProductId = newProductRes.data.data._id;

    // Admin edit product
    const updateProductRes = await axios.put(
      `${API_URL}/products/${createdProductId}`,
      {
        price: 169.99,
        stock: 20,
      },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert(
      updateProductRes.data.data.price === 169.99 &&
        updateProductRes.data.data.stock === 20,
      "Admin updated product price and stock"
    );

    // 7. Order Placement & Lifecycle
    console.log("\n[Test 7] Customer Order Placement & Stock Decrement");
    const orderPayload = {
      orderItems: [
        {
          product: createdProductId,
          title: "Test Noise Canceling Earbuds Pro",
          image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
          quantity: 2,
          price: 169.99,
        },
      ],
      shippingAddress: {
        fullName: "Tester Updated",
        phone: "+1 555 999 8888",
        address: "99 Tech Blvd",
        city: "Seattle",
        state: "WA",
        postalCode: "98101",
        country: "USA",
      },
      paymentMethod: "Cash on Delivery",
      itemsPrice: 339.98,
      shippingPrice: 0,
      taxPrice: 27.2,
      totalPrice: 367.18,
    };

    const placeOrderRes = await axios.post(`${API_URL}/orders`, orderPayload, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(placeOrderRes.data.success === true, "Customer placed order");
    const createdOrderId = placeOrderRes.data.data._id;

    // Verify stock was decremented from 20 to 18
    const checkStockProduct = await axios.get(
      `${API_URL}/products/${createdProductId}`
    );
    assert(
      checkStockProduct.data.data.stock === 18,
      "Product stock accurately decremented by 2 upon order placement"
    );

    // Customer viewing their own orders
    const myOrdersRes = await axios.get(`${API_URL}/orders/myorders`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(
      myOrdersRes.data.data.some((o) => o._id === createdOrderId),
      "Customer can see their newly placed order in /myorders"
    );

    // Customer viewing specific order details
    const orderDetailsRes = await axios.get(
      `${API_URL}/orders/${createdOrderId}`,
      {
        headers: { Authorization: `Bearer ${userToken}` },
      }
    );
    assert(
      orderDetailsRes.data.data._id === createdOrderId,
      "Customer can view their order details"
    );

    // Admin updates order status to "Shipped" then "Delivered"
    console.log("\n[Test 8] Admin Order Fulfillment");
    const updateOrderStatusRes = await axios.put(
      `${API_URL}/orders/${createdOrderId}/status`,
      { status: "Shipped" },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert(
      updateOrderStatusRes.data.data.status === "Shipped",
      "Admin updated order status to 'Shipped'"
    );

    const deliverOrderRes = await axios.put(
      `${API_URL}/orders/${createdOrderId}/status`,
      { status: "Delivered" },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert(
      deliverOrderRes.data.data.status === "Delivered" &&
        deliverOrderRes.data.data.isPaid === true,
      "Delivering order automatically marks Cash on Delivery as Paid"
    );

    // 8. Admin Dashboard Telemetry
    console.log("\n[Test 9] Admin Dashboard Statistics");
    const statsRes = await axios.get(`${API_URL}/orders/stats/overview`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      statsRes.data.data.totalOrders >= 2 && statsRes.data.data.totalRevenue > 0,
      "Dashboard reflects real orders count and revenue"
    );

    // 9. Admin Deleting Product
    console.log("\n[Test 10] Admin Deleting Product");
    const deleteRes = await axios.delete(
      `${API_URL}/products/${createdProductId}`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
      }
    );
    assert(deleteRes.data.success === true, "Admin deleted test product");

    console.log(`\n========================================`);
    console.log(`TOTAL PASSED: ${passed}`);
    console.log(`TOTAL FAILED: ${failed}`);
    console.log(`========================================`);

    if (failed === 0) {
      console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! SYSTEM IS PRODUCTION READY!");
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error("Test execution caught unhandled error:", error.response?.data || error.message);
    process.exit(1);
  }
};

testFlows();

