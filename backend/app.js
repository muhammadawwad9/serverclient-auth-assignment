const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
//routes go below
app.get("/", async (req, res) => {
  try {
    res.json({ msg: "welcome user" });
  } catch (err) {}
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
