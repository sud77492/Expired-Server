require("./models/User");
require("./models/Category");
require("./models/Expire");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const expireRoutes = require("./routes/expireRoutes");
const requireAuth = require("./middlewares/requireAuth");

require("dotenv").config({ path: "variables.env" });
console.log(process.env.DB_URL);

//npm run dev
const app = express();

app.use(bodyParser.json());

app.use(authRoutes);
app.use(expireRoutes);
const mongoUri =
  "mongodb+srv://admin:passwordpassword@cluster0.njh5j.mongodb.net/test?retryWrites=true&w=majority";

//const mongoUri =
//  "mongodb+srv://admin:passwordpassword@cluster0.vcmfg.mongodb.net/test?retryWrites=true&w=majority";
//mongoose.connect(mongoUri || process.env.DB_URL, {
mongoose.connect(process.env.DB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

/*mongoose
  .connect(mongoUri, {
    useUnifiedTopology: false,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB Connected!"))
  .catch((err) => {
    console.log(err.message);
  });*/

// mongoose
//   .connect(mongoUri, { useUnifiedTopology: true, useNewUrlParser: true })
//   .then(() => console.log("Connected"))
//   .catch((err) => console.log("Caught", err.stack));

mongoose.connection.on("connected", () => {
  console.log("connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to mongo"), err;
});

app.get("/", requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`);
});

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
  console.log("listening on port 3000");
});
