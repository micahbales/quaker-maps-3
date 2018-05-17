"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("./routes/router");
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
// Serve up static files from 'public'
app.use(express.static('public'));
// Take raw requests and converts them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Pull in our routes
app.use(router_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map