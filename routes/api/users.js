const router = require("express").Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => {
  res.json({
    msg: "Works"
  });
});

// @route   GET api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const user = await User.findOne({
    email: req.body.email
  });

  if (user) {
    errors.email = "Email already exists"
    res.status(400).json(errors);
  } else {
    const avatar = gravatar.url(req.body.email, {
      s: 200, // Size
      r: "pg", // Rating
      d: "mm" // Default
    });

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: avatar
    });

    try {
      const salt = await bcrypt.genSalt(10, newUser.password);
      try {
        const hash = await bcrypt.hash(newUser.password, salt);
        newUser.password = hash;
        try {
          const user = await newUser.save();
          res.json(user);
        } catch (err) {
          console.log(new Error(err));
        }
      } catch (err) {
        if (err) throw err;
      }
    } catch (err) {
      console.log(new Error(`Error findin salt: ${err}`));
    }
    /*
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
    */
  }
});

// @route   GET api/users/login
// @desc    Logins a user
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  const user = User.findOne({ email })
    .then(user => {
      if (!user) {
        errors.email = "User not found"
        return res.status(404).json(errors);
      } else {
        // Check Password
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (isMatch) {
              // User Matched
              // Create JWT payload
              const payload = {
                id: user.id, name: user.name, avatar: user.avatar
              }
              // Sign Token
              // takes in a payload, a secret key and an object which say
              // when to expire the token
              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: 'Bearer ' + token
                  })
                });
            } else {
              errors.password = "Incorrect password"
              return res.status(404).json(errors);
            }
          })
      }
    });
});

// @route: GET /api/user/current
// @desc:  Gets the current user
// @access: protected
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user });
});


module.exports = router;