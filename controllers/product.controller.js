const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../utils/firebase');
const ProductImg = require('../models/productImg.model');

exports.findProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: {
      status: true,
    },
    include: [
      {
        model: ProductImg,
      },
    ],
  });
  console.log(products);
  const productPromises = products.map(async product => {
    // console.log(first)
    const productImgsPromises = product.productsImgs.map(async productImg => {
      const imgRef = ref(storage, productImg.imgUrl);
      const url = await getDownloadURL(imgRef);
      console.log(url);
      productImg.imgUrl = url;
      return productImg;
    });
    await Promise.all(productImgsPromises);
  });

  await Promise.all(productPromises);

  res.status(200).json({
    status: 'success',
    message: 'the products found successfully',
    products,
  });
});

exports.findProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  const productImgsPromises = product.productsImgs.map(async productImg => {
    const imgRef = ref(storage, productImg.imgUrl);
    const url = await getDownloadURL(imgRef);

    productImg.imgUrl = url;
    return productImg;
  });

  await Promise.all(productImgsPromises);

  return res.status(200).json({
    status: 'success',
    message: 'Product found successfully',
    product,
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { title, description, quantity, price, categoryId, userId } = req.body;

  const newProduct = await Product.create({
    title: title.toLowerCase(),
    description: description.toLowerCase(),
    quantity,
    price,
    categoryId,
    userId,
  });

  const productImgsPromises = req.files.map(async file => {
    const imgRef = ref(storage, `products/${Date.now()}-${file.originalname}`);
    const imgUploaded = await uploadBytes(imgRef, file.buffer);
    console.log(imgUploaded.metadata.fullPath);
    return await ProductImg.create({
      imgUrl: imgUploaded.metadata.fullPath,
      productId: newProduct.id,
    });
  });

  await Promise.all(productImgsPromises);

  res.status(200).json({
    status: 'success',
    message: 'the product created successfully',
    newProduct,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { title, description, quantity, price } = req.body;

  const updatedProduct = await product.update({
    title,
    description,
    quantity,
    price,
  });

  res.status(200).json({
    status: 'success',
    message: 'THE PRODUCT WAS BEEEN UPDATED SUCCESSFULLY',
    updatedProduct,
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'THE PRODUCT HAS BEEN DELETED',
  });
});
