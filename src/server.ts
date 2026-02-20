import app from "./app.js";
import { config } from "./config/index.js";

const port = config.port;

app.listen(port, () => {
  console.log(`Cachedigitech CRM API running at http://localhost:${port}`);
  console.log(`Health: http://localhost:${port}/health`);
  console.log(`Environment: ${config.nodeEnv}`);
});
