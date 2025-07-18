require("dotenv").config();
require("./config/database.js");
const app = require("./app");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
