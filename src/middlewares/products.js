
const Category = require('../models/categories.model');

// 이 미들웨어를 거쳐야 categories 사용 가능
async function getAllCategories(req, res, next) {
  try {
    const categories = await Category.find();
      res.locals.categories = categories;
      next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = {
    getAllCategories
}