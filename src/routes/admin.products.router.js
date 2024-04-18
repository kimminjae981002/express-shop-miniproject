const express = require('express')
const router = express.Router()
const Product = require('../models/products.model');
const Category = require('../models/categories.model');
const fs = require('fs-extra');

router.get('/add-product', async (req, res, next) => {
    const categories = await Category.find()
    res.render('admin/add-product',{categories})
})

router.post('/', async (req, res, next) => {
    try {
    const {title, desc, price, category} = req.body
    const slug = title.replace(/\s+/g, '-').toLowerCase();
    const imageFile = req.files.image.name; // filereader api를 이용한다.

    const product = await Product.findOne({ slug })

    if (product) {
        req.flash('error', '이미 존재하는 상품입니다.');
        res.redirect('/admin/products');
    }

    const newProduct = new Product({
        title,
        slug,
        desc,
        category,
        price,
        image: imageFile,
    })

        await newProduct.save();

        // 이미지를 담을 폴더를 생성한다.
        await fs.mkdirp('src/public/products-images/' + newProduct._id); // 1경로에 이런 파일이 생긴다?
        await fs.mkdirp('src/public/products-images/' + newProduct._id + '/gallery');
        await fs.mkdirp('src/public/products-images/' + newProduct._id + '/gallery/thumbs');

        // 이미지 파일을 폴더에 넣어주기
        const productImage = req.files.image;
        const path = 'src/public/products-images/' + newProduct._id + '/' + imageFile;
        // 이미지를 path 경로로 옮긴다.
        await productImage.mv(path);

        req.flash('success', ' 상품이 생성되었습니다.');
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
        next(err)
    }
})

module.exports = router