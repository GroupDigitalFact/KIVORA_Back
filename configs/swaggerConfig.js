const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'Documentación Kivora API',
  },
  servers: [
    {
      url: 'http://localhost:3002', 
      description: 'Servidor local',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', "./src/**/*.model.js"],   
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
