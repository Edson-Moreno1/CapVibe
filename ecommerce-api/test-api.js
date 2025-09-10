import axios from 'axios';
import fs from 'fs';

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let adminToken = '';
let testResults = [];

// Función para logging de resultados
const logResult = (test, endpoint, method, status, success, details = '') => {
  const result = {
    test,
    endpoint,
    method,
    status,
    success,
    details,
    timestamp: new Date().toISOString()
  };
  testResults.push(result);
  
  const statusEmoji = success ? '✅' : '❌';
  console.log(`${statusEmoji} ${test}: ${method} ${endpoint} - Status: ${status} ${details}`);
};

// Datos de prueba
const testUser = {
  name: 'Usuario Test',
  email: 'test@example.com',
  password: '123456'
};

const testAdmin = {
  name: 'Admin Test',
  email: 'admin@example.com',
  password: '123456',
  role: 'admin'
};

const testCategory = {
  name: 'Categoría Test',
  description: 'Descripción de categoría de prueba'
};

const testProduct = {
  name: 'Producto Test',
  description: 'Descripción del producto test',
  price: 99.99,
  stock: 10,
  brand: 'Brand Test',
  color: 'Azul',
  category: '' // Se llenará después
};

let createdIds = {
  category: null,
  product: null,
  user: null,
  shippingAddress: null,
  paymentMethod: null
};

// Función para hacer requests con manejo de errores
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {}
    };
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (data) {
      config.data = data;
      config.headers['Content-Type'] = 'application/json';
    }
    
    const response = await axios(config);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      data: error.response?.data || { message: error.message }
    };
  }
}

// Tests de Autenticación
async function testAuth() {
  console.log('\n🔐 TESTING AUTHENTICATION...');
  
  // Test registro usuario normal
  let result = await makeRequest('POST', '/auth/register', testUser);
  logResult('User Registration', '/auth/register', 'POST', result.status, result.success);
  
  // Test registro admin (modificamos el usuario para que sea admin)
  const adminUser = { ...testAdmin, email: 'admin2@example.com' };
  result = await makeRequest('POST', '/auth/register', adminUser);
  logResult('Admin Registration', '/auth/register', 'POST', result.status, result.success);
  
  // Test login usuario normal
  result = await makeRequest('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  logResult('User Login', '/auth/login', 'POST', result.status, result.success);
  if (result.success && result.data.token) {
    authToken = result.data.token;
  }
  
  // Test login admin
  result = await makeRequest('POST', '/auth/login', {
    email: adminUser.email,
    password: adminUser.password
  });
  if (result.success && result.data.token) {
    adminToken = result.data.token;
  }
  
  // Test login con credenciales inválidas
  result = await makeRequest('POST', '/auth/login', {
    email: 'noexiste@example.com',
    password: 'wrongpassword'
  });
  logResult('Invalid Login', '/auth/login', 'POST', result.status, !result.success);
}

// Tests de Categorías (CRUD completo)
async function testCategories() {
  console.log('\n📁 TESTING CATEGORIES CRUD...');
  
  // CREATE - Sin autenticación (debería fallar)
  let result = await makeRequest('POST', '/categories', testCategory);
  logResult('Create Category (No Auth)', '/categories', 'POST', result.status, !result.success);
  
  // CREATE - Con autenticación de admin
  result = await makeRequest('POST', '/categories', testCategory, adminToken);
  logResult('Create Category (Admin)', '/categories', 'POST', result.status, result.success);
  if (result.success) {
    createdIds.category = result.data._id;
  }
  
  // READ ALL - Público
  result = await makeRequest('GET', '/categories');
  logResult('Get All Categories', '/categories', 'GET', result.status, result.success);
  
  // READ BY ID - Público
  if (createdIds.category) {
    result = await makeRequest('GET', `/categories/${createdIds.category}`);
    logResult('Get Category by ID', `/categories/${createdIds.category}`, 'GET', result.status, result.success);
  }
  
  // UPDATE - Con admin
  if (createdIds.category) {
    result = await makeRequest('PUT', `/categories/${createdIds.category}`, {
      name: 'Categoría Actualizada',
      description: 'Descripción actualizada'
    }, adminToken);
    logResult('Update Category', `/categories/${createdIds.category}`, 'PUT', result.status, result.success);
  }
  
  // DELETE - Sin autorización (debería fallar)
  if (createdIds.category) {
    result = await makeRequest('DELETE', `/categories/${createdIds.category}`);
    logResult('Delete Category (No Auth)', `/categories/${createdIds.category}`, 'DELETE', result.status, !result.success);
  }
}

// Tests de Productos (CRUD completo)
async function testProducts() {
  console.log('\n📦 TESTING PRODUCTS CRUD...');
  
  // Asignar categoría al producto
  if (createdIds.category) {
    testProduct.category = createdIds.category;
  }
  
  // CREATE
  let result = await makeRequest('POST', '/products', testProduct, authToken);
  logResult('Create Product', '/products', 'POST', result.status, result.success);
  if (result.success) {
    createdIds.product = result.data._id;
  }
  
  // READ ALL (público)
  result = await makeRequest('GET', '/products');
  logResult('Get All Products', '/products', 'GET', result.status, result.success);
  
  // READ BY ID (público)
  if (createdIds.product) {
    result = await makeRequest('GET', `/products/${createdIds.product}`);
    logResult('Get Product by ID', `/products/${createdIds.product}`, 'GET', result.status, result.success);
  }
  
  // UPDATE
  if (createdIds.product) {
    result = await makeRequest('PUT', `/products/${createdIds.product}`, {
      ...testProduct,
      name: 'Producto Actualizado',
      price: 149.99
    }, authToken);
    logResult('Update Product', `/products/${createdIds.product}`, 'PUT', result.status, result.success);
  }
  
  // DELETE
  if (createdIds.product) {
    result = await makeRequest('DELETE', `/products/${createdIds.product}`, null, authToken);
    logResult('Delete Product', `/products/${createdIds.product}`, 'DELETE', result.status, result.success);
  }
}

// Tests de Usuarios
async function testUsers() {
  console.log('\n👥 TESTING USERS...');
  
  // GET user profile
  let result = await makeRequest('GET', '/users/profile', null, authToken);
  logResult('Get User Profile', '/users/profile', 'GET', result.status, result.success);
  
  // UPDATE user profile
  result = await makeRequest('PUT', '/users/profile', {
    name: 'Usuario Actualizado'
  }, authToken);
  logResult('Update User Profile', '/users/profile', 'PUT', result.status, result.success);
  
  // GET all users (admin only)
  result = await makeRequest('GET', '/users', null, adminToken);
  logResult('Get All Users (Admin)', '/users', 'GET', result.status, result.success);
  
  // GET all users (normal user - should fail)
  result = await makeRequest('GET', '/users', null, authToken);
  logResult('Get All Users (Normal User)', '/users', 'GET', result.status, !result.success);
}

// Tests de Cart
async function testCart() {
  console.log('\n🛒 TESTING CART...');
  
  // GET empty cart
  let result = await makeRequest('GET', '/cart', null, authToken);
  logResult('Get Cart', '/cart', 'GET', result.status, result.success);
  
  // ADD to cart (sin producto válido, debería fallar)
  result = await makeRequest('POST', '/cart/add', {
    productId: '507f1f77bcf86cd799439011', // ID ficticio
    quantity: 1
  }, authToken);
  logResult('Add to Cart (Invalid Product)', '/cart/add', 'POST', result.status, !result.success);
  
  // CLEAR cart
  result = await makeRequest('DELETE', '/cart/clear', null, authToken);
  logResult('Clear Cart', '/cart/clear', 'DELETE', result.status, result.success);
}

// Tests de Shipping Addresses
async function testShippingAddresses() {
  console.log('\n📍 TESTING SHIPPING ADDRESSES...');
  
  const testAddress = {
    nombre: 'Casa Test',
    calle: 'Calle Test 123',
    ciudad: 'Ciudad Test',
    estado: 'Estado Test',
    codigoPostal: '12345',
    esPorDefecto: true
  };
  
  // CREATE
  let result = await makeRequest('POST', '/shipping-addresses', testAddress, authToken);
  logResult('Create Shipping Address', '/shipping-addresses', 'POST', result.status, result.success);
  if (result.success) {
    createdIds.shippingAddress = result.data._id;
  }
  
  // READ ALL
  result = await makeRequest('GET', '/shipping-addresses', null, authToken);
  logResult('Get Shipping Addresses', '/shipping-addresses', 'GET', result.status, result.success);
  
  // READ BY ID
  if (createdIds.shippingAddress) {
    result = await makeRequest('GET', `/shipping-addresses/${createdIds.shippingAddress}`, null, authToken);
    logResult('Get Shipping Address by ID', `/shipping-addresses/${createdIds.shippingAddress}`, 'GET', result.status, result.success);
  }
  
  // UPDATE
  if (createdIds.shippingAddress) {
    result = await makeRequest('PUT', `/shipping-addresses/${createdIds.shippingAddress}`, {
      ...testAddress,
      nombre: 'Casa Actualizada'
    }, authToken);
    logResult('Update Shipping Address', `/shipping-addresses/${createdIds.shippingAddress}`, 'PUT', result.status, result.success);
  }
  
  // DELETE
  if (createdIds.shippingAddress) {
    result = await makeRequest('DELETE', `/shipping-addresses/${createdIds.shippingAddress}`, null, authToken);
    logResult('Delete Shipping Address', `/shipping-addresses/${createdIds.shippingAddress}`, 'DELETE', result.status, result.success);
  }
}

// Tests de Payment Methods
async function testPaymentMethods() {
  console.log('\n💳 TESTING PAYMENT METHODS...');
  
  const testPayment = {
    tipo: 'tarjeta_credito',
    nombre: 'Mi Tarjeta Test',
    nombreTitular: 'Usuario Test',
    esPorDefecto: true
  };
  
  // CREATE
  let result = await makeRequest('POST', '/payment-methods', testPayment, authToken);
  logResult('Create Payment Method', '/payment-methods', 'POST', result.status, result.success);
  if (result.success) {
    createdIds.paymentMethod = result.data._id;
  }
  
  // READ ALL
  result = await makeRequest('GET', '/payment-methods', null, authToken);
  logResult('Get Payment Methods', '/payment-methods', 'GET', result.status, result.success);
  
  // READ BY ID
  if (createdIds.paymentMethod) {
    result = await makeRequest('GET', `/payment-methods/${createdIds.paymentMethod}`, null, authToken);
    logResult('Get Payment Method by ID', `/payment-methods/${createdIds.paymentMethod}`, 'GET', result.status, result.success);
  }
  
  // UPDATE
  if (createdIds.paymentMethod) {
    result = await makeRequest('PUT', `/payment-methods/${createdIds.paymentMethod}`, {
      ...testPayment,
      nombre: 'Tarjeta Actualizada'
    }, authToken);
    logResult('Update Payment Method', `/payment-methods/${createdIds.paymentMethod}`, 'PUT', result.status, result.success);
  }
  
  // DELETE (Deactivate)
  if (createdIds.paymentMethod) {
    result = await makeRequest('DELETE', `/payment-methods/${createdIds.paymentMethod}`, null, authToken);
    logResult('Delete Payment Method', `/payment-methods/${createdIds.paymentMethod}`, 'DELETE', result.status, result.success);
  }
}

// Tests de Orders
async function testOrders() {
  console.log('\n📋 TESTING ORDERS...');
  
  const testOrder = {
    items: [
      {
        product: '507f1f77bcf86cd799439011', // ID ficticio
        quantity: 1,
        price: 99.99
      }
    ],
    total: 99.99,
    direccionEnvio: {
      calle: 'Calle Test 123',
      ciudad: 'Ciudad Test',
      estado: 'Estado Test',
      codigoPostal: '12345'
    }
  };
  
  // CREATE (probablemente falle por producto inválido)
  let result = await makeRequest('POST', '/orders', testOrder, authToken);
  logResult('Create Order', '/orders', 'POST', result.status, result.success, 
           !result.success ? 'Expected to fail with invalid product ID' : '');
  
  // GET user orders
  result = await makeRequest('GET', '/orders/my-orders', null, authToken);
  logResult('Get User Orders', '/orders/my-orders', 'GET', result.status, result.success);
  
  // GET all orders (admin only)
  result = await makeRequest('GET', '/orders', null, adminToken);
  logResult('Get All Orders (Admin)', '/orders', 'GET', result.status, result.success);
}

// Test de endpoints sin autenticación
async function testUnauthorizedAccess() {
  console.log('\n🚫 TESTING UNAUTHORIZED ACCESS...');
  
  const protectedEndpoints = [
    { method: 'POST', endpoint: '/products', data: testProduct },
    { method: 'PUT', endpoint: '/products/123' },
    { method: 'DELETE', endpoint: '/products/123' },
    { method: 'GET', endpoint: '/users/profile' },
    { method: 'POST', endpoint: '/categories', data: testCategory },
    { method: 'GET', endpoint: '/cart' },
    { method: 'POST', endpoint: '/orders', data: {} }
  ];
  
  for (const endpoint of protectedEndpoints) {
    const result = await makeRequest(endpoint.method, endpoint.endpoint, endpoint.data);
    logResult('Unauthorized Access Test', endpoint.endpoint, endpoint.method, result.status, !result.success);
  }
}

// Test de validaciones
async function testValidations() {
  console.log('\n✅ TESTING VALIDATIONS...');
  
  // Test registro con datos inválidos
  const invalidUsers = [
    { name: '', email: 'invalid', password: '123' }, // Datos inválidos
    { email: 'test@test.com', password: '123456' }, // Sin nombre
    { name: 'Test', password: '123456' } // Sin email
  ];
  
  for (const invalidUser of invalidUsers) {
    const result = await makeRequest('POST', '/auth/register', invalidUser);
    logResult('Invalid User Registration', '/auth/register', 'POST', result.status, !result.success);
  }
  
  // Test producto con datos inválidos
  const invalidProducts = [
    { name: '', price: -10, stock: -5 }, // Datos inválidos
    { description: 'Test' }, // Sin campos requeridos
    { name: 'Test', price: 'invalid' } // Precio inválido
  ];
  
  for (const invalidProduct of invalidProducts) {
    const result = await makeRequest('POST', '/products', invalidProduct, authToken);
    logResult('Invalid Product Creation', '/products', 'POST', result.status, !result.success);
  }
}

// Función principal de tests
async function runAllTests() {
  console.log('🧪 INICIANDO TESTS COMPLETOS DE LA API...\n');
  
  try {
    await testAuth();
    await testCategories();
    await testProducts();
    await testUsers();
    await testCart();
    await testShippingAddresses();
    await testPaymentMethods();
    await testOrders();
    await testUnauthorizedAccess();
    await testValidations();
    
    // Generar reporte final
    console.log('\n📊 RESUMEN DE RESULTADOS:');
    const successful = testResults.filter(r => r.success).length;
    const failed = testResults.filter(r => !r.success).length;
    const total = testResults.length;
    
    console.log(`Total tests: ${total}`);
    console.log(`✅ Exitosos: ${successful}`);
    console.log(`❌ Fallidos: ${failed}`);
    console.log(`Porcentaje de éxito: ${((successful / total) * 100).toFixed(1)}%`);
    
    // Guardar resultados detallados
    const reportData = {
      summary: {
        total,
        successful,
        failed,
        successRate: `${((successful / total) * 100).toFixed(1)}%`,
        timestamp: new Date().toISOString()
      },
      results: testResults
    };
    
    fs.writeFileSync('test-results.json', JSON.stringify(reportData, null, 2));
    console.log('\n📄 Resultados detallados guardados en test-results.json');
    
  } catch (error) {
    console.error('❌ Error ejecutando tests:', error.message);
  }
}

// Ejecutar tests directamente
runAllTests().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});

export default runAllTests;
