const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); //hash passwords
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// User Model
const User = require('../../models/User');

// @route  POST api/auth
// @desc   Auth user
// @access Public
router.post('/', (req, res) => { // don't need to put api/auth because we defined what to use in server.js 
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({
            msg: 'Please enter all fields'
        }); //user did not send correct info
    }

    // check for existing user
    User.findOne({ email })
        .then(user => {
            if(!user) {
                return res.status(400).json({
                    msg: 'User does not exist'
                });
            }

            // validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) {
                        return res.status(400).json({
                            msg: 'Invalid password'
                        })
                    }

                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        // { expiresIn: 3600 } //1 hour
                        (err, token) => {
                            if (err) {
                                throw err;
                            }
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        }
                    );
                });

        });
});

// @route  GET api/auth/user
// @desc   Get user data
// @access Private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password') //don't get the password
        .then(user => {
            if (user) {
                return res.json(user);
            }
            return res.status(404).json({
                msg: 'User not found'
            })
        });
});

module.exports = router;