"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const index_js_1 = require("./config/index.js");
const port = index_js_1.config.port;
app_js_1.default.listen(port, () => {
    console.log(`Cachedigitech CRM API running at http://localhost:${port}`);
    console.log(`Health: http://localhost:${port}/health`);
    console.log(`Environment: ${index_js_1.config.nodeEnv}`);
});
//# sourceMappingURL=server.js.map