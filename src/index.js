const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const connectToDB = require("./configs/database.config");
const initApiRoute = require("./routes/route");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

initApiRoute(app);
connectToDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
