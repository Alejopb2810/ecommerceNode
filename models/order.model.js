const { DataTypes } = require('sequelize');
const { db } = require('../dataBase/db');

const Order = db.define('order', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Order;
