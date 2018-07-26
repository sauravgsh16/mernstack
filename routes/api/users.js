const router = require('express').Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');


// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => {
  res.json({msg: "Wroks"});
});

// @route   GET api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    res.status(400).json({
      email: "Email already exists"
    });
  } else {
    const avatar = gravatar.url(req.body.email, {
      s: 200,  // Size
      r: 'pg', // Rating
      d: 'mm'  // Default
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
        try{
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
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password

  const user = await User.findOne({ email: email });

  if (user) {

  } else {
    res.status(404).json();
  }


});


module.exports = router;