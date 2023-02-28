const { Router } = require('express');
const { check } = require('express-validator');
const {
  addProductToCart,
  updateCart,
  removeProductInCart,
  buyProductOnCart,
} = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  validExistCart,
  validExistProductInCart,
  validExistProductInCartOrUpdate,
  validExistProductInCartByParamsForUpdate,
} = require('../middlewares/cart.middleware');
const {
  validBodyProductById,
  validIfExistProductsInStock,
  validExistProductInStockForUpdate,
  validExistProductIdByParams,
} = require('../middlewares/products.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.use(protect);

router.post(
  '/add-product',
  [
    check('productId', 'The productId is required').not().isEmpty(),
    check('productId', 'The productId must be a number').isNumeric(),
    check('quantity', 'The quantity is required').not().isEmpty(),
    check('quantity', 'The quantity must be a number').isNumeric(),
    validateFields,
    validBodyProductById,
    validIfExistProductsInStock,
    validExistCart,
    validExistProductInCart,
  ],
  addProductToCart
);

router.patch(
  '/update-cart',
  [
    check('productId', 'The productId is required').not().isEmpty(),
    check('productId', 'The productId must be a number').isNumeric(),
    check('newQty', 'The quantity is required').not().isEmpty(),
    check('newQty', 'The quantity must be a number').isNumeric(),
    validateFields,
    validBodyProductById,
    validExistProductInStockForUpdate,
    validExistProductInCartOrUpdate,
  ],
  updateCart
);

router.delete(
  '/:productId',
  validExistProductIdByParams,
  validExistProductInCartByParamsForUpdate,
  removeProductInCart
);

router.post('/purchase', buyProductOnCart);

module.exports = {
  cartRouter: router,
};
