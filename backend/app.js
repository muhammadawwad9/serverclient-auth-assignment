const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;
const MONGOURI = process.env.MONGOURI;
//models imports
const authRouter = require("./routers/auth");
app.use(cors());
app.use(express.json());

//connecting to the database (mongodb atlas)
mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});
mongoose.connection.on("error", (err) => {
  console.log("connection error ", err);
});

//routes go below (I use routers so its easy to separate things and to refactor in the future)
app.get("/", async (req, res) => {
  try {
    return res.json({ msg: "welcome user" });
  } catch (err) {}
});

//login and register routes will go into this router
app.use(authRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
