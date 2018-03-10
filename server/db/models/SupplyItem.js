let Sequelize = require('sequelize')
module.exports = {
  name: {
    type: Sequelize.STRING
  },
  amount: {
    type: Sequelize.INTEGER
  },
  priceForOne: {
    type: Sequelize.INTEGER
  },
  totalPrice: {
    type: Sequelize.INTEGER
  }
}
