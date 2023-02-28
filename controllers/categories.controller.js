const Category = require('../models/category.model');
const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');

exports.findCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({
    // attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
    attributes: ['id', 'name'],
    where: {
      status: true,
    },
    include: [
      {
        model: Product,
        attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
        where: {
          status: true,
        },
        // required: false, para que me traiga todas las categorias sin importar que no hallan productos
        // include: [{ model: User }],
      },
    ],
    // include: [
    //   {
    //     model: Product,
    //     attributes: [
    //       'id',
    //       'title',
    //       'description',
    //       'quantity',
    //       'price',
    //       'categoryId',
    //       'userId',
    //     ],
    //   },
    // ],
  });

  res.status(200).json({
    status: 'success',
    message: 'the categories are sucessfully',
    categories,
  });
});

exports.findCategory = catchAsync(async (req, res, next) => {
  const { category } = req;

  res.status(200).json({
    status: 'success',
    message: 'The category fetched successfully',
    category,
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const newCategory = await Category.create({
    name: name.toLowerCase(),
  });

  res.status(200).json({
    status: 'success',
    message: 'The category created successfully',
    newCategory,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { category } = req;
  const { name } = req.body;

  await category.update({ name });

  res.status(200).json({
    status: 'success',
    message: 'THE CATEGORY UPDATED SUCCESSFULLY',
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { category } = req;

  await category.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'THE CATEGORY DELETED SUCCESSFULLY',
  });
});
