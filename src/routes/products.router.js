const express = require('express');
const router = express.Router();
const Product = require('../models/products.model');
const Category = require('../models/categories.model');

router.get('/', (req, res) => {
    res.render('products')
})


module.exports = router