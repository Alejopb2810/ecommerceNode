const { DataTypes } = require('sequelize');
const { db } = require('../dataBase/db');
const ProductImg = db.define('productsImg', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },

  imgUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = ProductImg;
