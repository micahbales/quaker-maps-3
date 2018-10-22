import bodyParser = require('body-parser');
import express = require('express');
import router from './routes/router';
const app = express();

// Take raw requests and converts them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Pull in our routes
app.use(router);

export default app;
