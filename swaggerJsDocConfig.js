const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    info: {
      title: 'Api Dokumen', // Title (required)
      version: '1.0.0', // Version (required)
      description: 'Api yang digunakan untuk pasar ikan app',
    },
    basePath: '/api/v1',
  },
  apis: ['./server/routes/*'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
