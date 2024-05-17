import express from 'express';
import bodyParser from 'body-parser';
import Router from './src/routes';
import specs from './config/swagger';
import swaggerUI from 'swagger-ui-express';
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(bodyParser.json());
app.use('/', Router);

app.listen(process.env.API_PORT, () => {
  console.log(`Server running on port ${process.env.API_PORT}`);
});
