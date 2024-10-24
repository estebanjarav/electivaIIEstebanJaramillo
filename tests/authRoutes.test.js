// tests/authRoutes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app'); // Importa la aplicación correctamente
let mongoServer;
let server; // Variable para almacenar el servidor

// tests/authRoutes.test.js
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  // Asignar un puerto dinámicamente
  server = app.listen(0, () => {
    const port = server.address().port;
    console.log(`Test server running on port ${port}`);
  });
});


// tests/authRoutes.test.js
// tests/authRoutes.test.js
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();

  if (server) {
    await new Promise((resolve) => {
      server.close(() => {
        console.log('Test server closed');
        resolve();
      });
    });
  }
});



beforeEach(async () => {
  // Limpiar las colecciones antes de cada prueba
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

describe('Auth Service', () => {
  it('should register a new user', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should login an existing user', async () => {
    // Primero, registra un usuario
    await request(server)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    // Luego, intenta iniciar sesión con ese usuario
    const res = await request(server)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
