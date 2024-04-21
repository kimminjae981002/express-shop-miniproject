const express = require('express');
const router = express.Router();
const Product = require('../models/products.model');

// user model cart를 심엇을  거 같다.

// 장바구니에 상품 추가
router.post('/:product', async (req, res, next) => {
    const productSlug = req.params.product;
    const product = await Product.findOne({ slug: productSlug});
    try {
        // 세션에 카트를 담아두고 장바구니에 새로운 상품이 담길 때
        if (!req.session.cart) {
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

router.get('/checkout', async (req, res, next) => {
    res.render('checkout')
})

router.get('/update/:product', async (req, res, next) => {
    try {
         const slug = req.params.product;
         let cart = req.session.cart;
         const operator = req.query.action;
        for (let i = 0; i < cart.length; i++){
            if (cart[i].title === slug) {
                if (operator === 'add') {
                    cart[i].qty += 1;
                    req.flash('success', '상품 개수가 추가되었습니다.');
                } else if (operator === 'remove') {
                    cart[i].qty -= 1;
                    if (cart[i].qty <= 0) {
                        cart.splice(i, 1);
                    };
                    req.flash('success', '상품 개수가 제거되었습니다.');
                } else if (operator === 'clear') {
                    cart.splice(i, 1);
                    req.flash('success', '상품이 제거되었습니다.');
                }
            }
            break;
        }
        res.redirect('/cart/checkout'); // 변경된 카트를 다시 표시하기 위해 리디렉션합니다.
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.delete('/', async (req, res, next) => {
    let cart = req.session.cart;
    try {
        if (cart.length > 0) {
            delete req.session.cart;
            // req.session.cart = [];
            req.flash('success','장바구니가 비어졌습니다.')
        } else {
            req.flash('error','장바구니가 비어있습니다.')
        }

        res.redirect('/cart/checkout')
    } catch (err) {
        console.error(err);
        next(err);
    }
})


module.exports = router