const express = require('express');
const router = express.Router();
const Product = require('../models/products.model');
const Category = require('../models/categories.model');
const { getAllCategories } = require('../middlewares/products')

router.get('/', getAllCategories, async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('/products', {products})
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.render('products')
})


module.exports = router