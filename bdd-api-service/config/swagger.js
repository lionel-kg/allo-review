const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecla Express API with Swagger',
      version: '1.0.0',
      description: 'A simple Express Ecla API',
    },
  },
  // Path to the files containing JSDoc comments
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJSDoc(swaggerOptions);

export default specs;
