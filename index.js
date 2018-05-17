"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Load environmental variables
require('dotenv').config();
// Start App
var app_1 = require("./api/app");
app_1.default.set('port', process.env.PORT || 7777);
var server = app_1.default.listen(app_1.default.get('port'), function () {
    console.log("Express is now running on port " + process.env.PORT);
});
//# sourceMappingURL=index.js.map