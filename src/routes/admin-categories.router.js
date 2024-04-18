const express = require('express')
const router = express.Router()
const { checkAdmin } = require('../middlewares/auth')
const Category = require('../models/categories.model')

router.get('/add-category', checkAdmin, (req, res) => {
    res.render('admin/add-category')
})

router.post('/add-category', checkAdmin, async (req, res) => {
    try {
        const title = req.body.title;
        const slug = title.replace(/\s+/g, '-').toLowerCase();
        const category = await Category.findOne({ slug: slug });
        if (category) {
            req.flash('error', '이미 존재하는 카테고리입니다.');
            res.redirect('back');
        }

        const newCategory = new Category({
            title,
            slug
        })
        
        await newCategory.save();

        req.flash('success', '카테고리가 생성되었습니다.');
        res.redirect('/admin/categories')
    } catch {
        console.error(error);
        next(error);
    }
})



module.exports = router