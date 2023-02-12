const Cart = require('../models/cart.model');
const ProductInCart = require('../models/productInCart.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validExistCart = catchAsync(async (req, res, nest) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: {
      userId: sessionUser.id,
      status: 'active',
    },
  });

  if (!cart) {
    cart = await Cart.create({ userId: sessionUser.id });
  }

  req.cart = cart;
  next();
});

exports.validExistProductInCart = catchAsync(async (req, res, next) => {
  const { product, cart } = req;

  const productInCart = await ProductInCart.findOne({
    where: {
      cartId: cart.id,
      productId: product.id,
    },
  });

  if (productInCart && productInCart.status === 'removed') {
    await productInCart.update({ status: 'active', quantity: 1 });
    return res.status(200).json({
      status: 'success',
      message: 'Product successfully added',
    });
  }
  if (productInCart) {
    return next(new AppError('this product already exists in the cart', 400));
  }
  req.productInCart = productInCart;
  next();
});