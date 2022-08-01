const router = require("express").Router();

const User = require("../models/User");

// Registration of user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  //   console.log(username + " " + email + " " + password);
  const newUser = new User({
    username: username,
    email: email,
    password: password,
  });
  try {
    const savedUser = await newUser.save();
    // console.log(savedUser);
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
