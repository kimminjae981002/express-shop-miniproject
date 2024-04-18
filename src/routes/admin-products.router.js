const express = require('express')
const router = express.Router()
const Product = require('../models/products.model');
const Category = require('../models/categories.model');
const fs = require('fs-extra');
const { checkAdmin } = require('../middlewares/auth');
const ResizeImg = require('resize-img');

// 상품 추가 render
router.get('/add-product', checkAdmin, async (req, res, next) => {
    const categories = await Category.find()
    res.render('admin/add-product',{categories})
})

// 상품 추가 로직
router.post('/', checkAdmin, async (req, res, next) => {
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
        await fs.mkdirp('src/public/products-images/' + newProduct._id); // 이미지 폴더 생성
        await fs.mkdirp('src/public/products-images/' + newProduct._id + '/gallery'); // 이미지 폴더 안에 원본 이미지
        await fs.mkdirp('src/public/products-images/' + newProduct._id + '/gallery/thumbs'); // 이미지 폴더 안에 섬네일 이미지

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

// 상품 데이터 가져오기 render
router.get('/', checkAdmin, async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('admin/products',{products})
    } catch (err) {
        console.error(err);
        next(err)
    }
})

// 상품 삭제
router.delete('/:id', checkAdmin, async (req, res, next) => {
    const id = req.params.id;
    const path = 'src/public/products-images/' + id;

    try {
        await fs.remove(path);

        await Product.findByIdAndDelete(id);

        req.flash('success', ' 상품이 삭제 되었습니다.');
        res.redirect("back")
    } catch (err) {
        console.error(err);
        next(err);
    }
})

// 상품 수정 render
router.get('/:id/edit', checkAdmin, async (req, res, next) => {
    try {
    const categories = await Category.find();
    const { _id, title, desc, category, price, image } = await Product.findById(req.params.id);

    const galleryDir = 'src/public/products-images/' + _id + '/gallery';

    const galleryImages = await fs.readdir(galleryDir);

    res.render('admin/edit-product',{galleryImages, title, desc, categories, category: category.replace(/\s+/g, '-').toLowerCase(), price, image, id: _id})
    } catch (err) {
        console.error(err);
        next(err);
   }
})

// 상품 이미지 수정
router.post('/product-gallery/:id', checkAdmin, async (req, res, next) => {
    const { id } = req.params;

    const productImage = req.files.file; // req.files 사용가능한데 우리는 img tag name이 file이라 이렇게 해야된다.
    const path = 'src/public/products-images/' + id + '/gallery/' + req.files.file.name; // 원본 이미지 경로
    const thumbsPath = 'src/public/products-images/' + id + '/gallery/thumbs/' + req.files.file.name; // 섬네일 이미지 경로

    try {
        // 원본 이미지를 gallery 폴더에 넣어주기
        await productImage.mv(path);

        // 이미지를 리사이즈.
        const buf = await ResizeImg(fs.readFileSync(path), { width: 100, height: 100 });

        fs.writeFileSync(thumbsPath, buf);

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        next(err);
    }
})

// 상품 이미지 삭제
router.delete('/:id/image/:imageId', checkAdmin, async (req, res, next) => {
    const originalImage = 'src/public/products-images/' + req.params.id + '/gallery/' + req.params.imageId;
    const thumbImage = 'src/public/products-images/' + req.params.id + '/gallery/thumbs/' + req.params.imageId;

    try {
        console.log(originalImage)
        await fs.remove(originalImage); // 이미지 삭제
        await fs.remove(thumbImage);

        req.flash('success', '이미지 삭제')
        res.redirect('/admin/products/' + req.params.id + '/edit')
    } catch (err) {
        console.error(err);
        next(err);
    }
})

module.exports = router