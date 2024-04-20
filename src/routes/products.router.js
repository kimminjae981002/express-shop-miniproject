const express = require('express');
const router = express.Router();
const Product = require('../models/products.model');
const Category = require('../models/categories.model');
const { getAllCategories } = require('../middlewares/products')

router.get('/', getAllCategories, async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('products', { products })
    } catch (err) {
        console.error(err);
        next(err);
    }
    res.render('products')
});

router.get('/:category', getAllCategories, async (req, res, next) => {
    try {
        const { category } = req.params;
        const categories = await Product.find({category})
        res.render('products', { products: categories })
    } catch (err) {
        console.err(err);
        next(err);
    }
})


module.exports = router