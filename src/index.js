const express = require("express");
const path = require("path");
require("dotenv").config();

const connectToDB = require("./configs/database.config");
const initApiRoute = require("./routes/route");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

initApiRoute(app);
connectToDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
