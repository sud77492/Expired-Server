const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.put("/update_user/:email", async (req, res) => {
  try {
    const update_user = await User.update(
      { email: req.params.email },
      {
        $set: {
          expoToken: req.body.expoToken,
        },
      },
      (err, result) => {
        if (err) {
          throw err;
        }
        res.send("user updated sucessfully");
      }
    );
    //res.send(update_expire);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
});

router.get("/users", async (req, res) => {
  const users = await User.find();

  res.send(users);
});

module.exports = router;
