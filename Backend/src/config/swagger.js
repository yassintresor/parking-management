const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Parking Management System API',
      version: '1.0.0',
      description: 'API documentation for the Parking Management System',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'OPERATOR', 'USER'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        ParkingSpace: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            space_number: { type: 'string' },
            location: { type: 'string' },
            type: { type: 'string', enum: ['COMPACT', 'LARGE', 'HANDICAP', 'ELECTRIC'] },
            status: { type: 'string', enum: ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'OUT_OF_SERVICE'] },
            hourly_rate: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Vehicle: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            license_plate: { type: 'string' },
            make: { type: 'string' },
            model: { type: 'string' },
            color: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            space_id: { type: 'integer' },
            vehicle_id: { type: 'integer' },
            start_time: { type: 'string', format: 'date-time' },
            end_time: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['ACTIVE', 'CANCELLED', 'COMPLETED'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            booking_id: { type: 'integer' },
            user_id: { type: 'integer' },
            amount: { type: 'number' },
            currency: { type: 'string' },
            method: { type: 'string', enum: ['CARD', 'MOBILE_WALLET', 'SUBSCRIPTION', 'CASH'] },
            status: { type: 'string', enum: ['PENDING', 'PAID', 'REFUNDED', 'FAILED'] },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;