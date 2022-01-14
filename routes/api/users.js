const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); //hash passwords
const config = require('config');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../../models/User');

// @route  POST api/users
// @desc   Register new user
// @access Public
router.post('/', (req, res) => { // don't need to put api/users because we defined what to use in server.js 
    const { name, email, password } = req.body;
    // Simple validation
    if (!name || !email || !password) {
        return res.status(400).json({
            msg: 'Please fill out all fields'
        }); //user did not send correct info
    }

    // check for existing user
    User.findOne({ email })
        .then(user => {
            if(user) {
                return res.status(400).json({
                    msg: 'User already exists!'
                });
            }

            //user does not exist yet
            const newUser = new User({
                name,
                email,
                password
            });

            // create salt and hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) {
                        throw err;
                    }

                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
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
        })
});

module.exports = router;