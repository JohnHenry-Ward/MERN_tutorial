const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Item Model
const Item = require('../../models/Item');

// @route  GET api/items
// @desc   Get All Items
// @access Public
router.get('/', (req, res) => { // don't need to put api/items because we defined what to use in server.js 
    Item.find()
        .sort({ date: -1 })
        .then(items => res.json(items))
        .catch(() => console.log('ERROR: unable to process GET request'));
});

// @route  POST api/items
// @desc   create an item
// @access Private
router.post('/', auth, (req, res) => {
    const newItem = new Item({
        name: req.body.name
    });

    newItem.save()
        .then(item => res.json(item))
        .catch(() => console.log('ERROR: unable to process POST request'));
});

// @route  DELETE api/items
// @desc   delete an item
// @access Private
router.delete('/:id', auth, (req, res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({ success: true })))
        .catch(err => res.status(404).json({ success: false }));
})



module.exports = router;