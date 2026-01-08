const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Full Stack Test API',
      version: '1.0.0',
      description: 'API documentation for the Full Stack Test project',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  // Point to the route files for JSDoc comments
  apis: ['./routes/*.js', './routes/**/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
