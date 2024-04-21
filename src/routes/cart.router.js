const express = require('express');
const router = express.Router();
const Product = require('../models/products.model')

// 장바구니에 상품 추가
router.post('/:product', async (req, res, next) => {
    const productSlug = req.params.product;
    const product = await Product.findOne({ slug: productSlug});
    try {
        // 세션에 카트를 담아두고 장바구니에 새로운 상품이 담길 때
        if (req.session.cart.length === 0) {
            req.session.cart = [];
            req.session.cart.push({
                title: productSlug,
                qty: 1,
                price: product.price,
                image: '/products-images/' + product._id + '/' + product.image,
            });
            // 세션의 카트에 같은 상품이 있을때
        } else {
            let cart = req.session.cart;
            let newItem = true;

            // 이미 카트에 있는 상품이면 한 개 추가하고 loop break
            for (let i = 0; i < cart.length; i++){
                if (cart[i].title === productSlug) {
                    cart[i].qty += 1;
                    newItem = false;
                    break;
                }
            }
            // 새로운 상품이 담길 때
            if (newItem) {
                cart = [];
                cart.push({
                    title: productSlug,
                    qty: 1,
                    price: product.price,
                    image: '/products-images/' + product._id + '/' + product.image,
                });
            }
        }

        req.flash('success', '장바구니에 상품이 담겼습니다.');
        res.redirect('back');
    } catch (err) {
        console.error(err);
        next(err);
    }
})

module.exports = router