const express = require('express');
const router = express.Router();
const Product = require('../models/products.model');
const Category = require('../models/categories.model');
const fs = require('fs-extra');
const { getAllCategories } = require('../middlewares/products');

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
        console.error(err);
        next(err);
    }
})

router.get('/:category/:product', async (req, res, next) => {
    try {
        const product = await Product.findOne({ slug: req.params.product });
        const galleryDir = 'src/public/products-images/' + product._id + '/gallery';
        const galleryImages = await fs.readdir(galleryDir); // 경로에 해당하는 파일을 읽어온다.
        res.render('product', { product, galleryImages })
    } catch (err) {
        console.error(err);
        next(err);
    }
})


module.exports = router