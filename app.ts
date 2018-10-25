import bodyParser = require('body-parser');
import * as path from 'path';
import express = require('express');
import router from './routes/router';
const app = express();

// Take raw requests and converts them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files for front-end
app.use('/', express.static(path.join(__dirname + '/client/build')));

// API endpoints
app.use(router);

export default app;
