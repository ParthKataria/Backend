const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Registration of user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  //   console.log(username + " " + email + " " + password);
  const newUser = new User({
    username: username,
    email: email,
    password: CryptoJS.AES.encrypt(password, process.env.KEY).toString(),
  });
  try {
    const savedUser = await newUser.save();
    // console.log(savedUser);
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login for existing user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).json("User does not exist");
      return;
    }

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.KEY);
    const pass = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (pass != req.body.password) {
      res.status(401).json("Wrong credentials");
      return;
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );
    const { password, ...others } = user._doc;
    // console.log({ ...others, accessToken });
    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(401).json(error);
  }
});

module.exports = router;
