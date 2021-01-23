const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Expire = mongoose.model("Expire");

const Category = mongoose.model("Category");

const router = express.Router();

router.use(requireAuth);

router.get("/expires", async (req, res) => {
  const expires = await Expire.find({ userId: req.user._id });

  res.send(expires);
});

router.get("/expires/less", async (req, res) => {
  const expires = await Expire.find({
    userId: req.user._id,
    expiry: {
      $lt: new Date().toISOString(),
    },
  });
  res.send(expires);
});

router.get("/expires/greater", async (req, res) => {
  //const expires = await Expire.find({ userId: req.user._id });
  // const expires = await Expire.find({
  //   expiry: {
  //     $gte: "2020-11-05T06:05:19.785Z",
  //     $lt: new Date().toISOString(),
  //   },
  // });
  const expires = await Expire.find({
    userId: req.user._id,
    expiry: {
      $gte: new Date().toISOString(),
    },
  });

  res.send(expires);
});

router.get("/expires/days", async (req, res) => {
  //const expires = await Expire.find({ userId: req.user._id });
  // const expires = await Expire.find({
  //   expiry: {
  //     $gte: "2020-11-05T06:05:19.785Z",
  //     $lt: new Date().toISOString(),
  //   },
  // });
  const expires = await Expire.aggregate([
    /** Filter out docs */
    { $match: { userId: req.user._id } },
    {
      $addFields: {
        daysCount: {
          $round: {
            $divide: [
              {
                $subtract: ["$expiry", new Date()],
              },
              86400000,
            ],
          },
        },
      },
    },
    /*{
      $project: {
        date_diff: {
          $subtract: [
            new Date("2020-11-05T08:46:02.552Z"),
            new Date("2020-11-29T08:46:02.552Z"),
          ],
        },
      },
    },
    {
      $project: {
        days: { $divide: ["$date_diff", 1000 * 60 * 60 * 24] },
      },
    },*/
  ]);

  res.send(expires);
});

router.delete("/delete_expire/:id", async (req, res) => {
  try {
    const delete_category = await Expire.deleteOne({ _id: req.params.id });
    res.send(delete_category);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.get("/categories", async (req, res) => {
  const categories = await Category.find();

  res.send(categories);
});

router.post("/category", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(422).send({ error: "You must provide category name" });
  }
  try {
    const category = new Category({ name });
    await category.save();
    res.send(category);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.delete("/delete_category/:id", async (req, res) => {
  try {
    const delete_category = await Category.deleteOne({ _id: req.params.id });
    res.send(delete_category);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.delete("/delete_expire/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const delete_expire = await Expire.deleteOne({ _id: req.params.id });
    res.send(delete_expire);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.put("/update_expire/:id", async (req, res) => {
  try {
    // const update_expire = await Expire.update(
    //   { _id: req.params.id },
    //   {
    //     name,
    //     category,
    //     product,
    //     expiry,
    //     photo,
    //   }
    // );

    const update_expire = await Expire.update(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          category: req.body.category,
          product: req.body.product,
          expiry: req.body.expiry,
          photo: "https://randomuser.me/api/portraits/women/44.jpg",
          notifications: req.body.notifications,
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

router.post("/expires", async (req, res) => {
  const { name, category, product, expiry, photo, notifications } = req.body;

  //console.log(req.body);

  // if (!name || !category || !product || !expiry || !photo) {
  //   return res.status(422).send({
  //     error: "You must provide a name, category, product, expiry, photo",
  //   });
  // }

  try {
    const expire = new Expire({
      name,
      category,
      product,
      expiry,
      photo,
      notifications,
      userId: req.user._id,
    });
    await expire.save();
    res.send(expire);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;
