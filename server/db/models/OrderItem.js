let Sequelize = require('sequelize')
module.exports = {
  name: {
    type: Sequelize.STRING
  },
  amount: {
    type: Sequelize.INTEGER
  },
  itemType: {
    type: Sequelize.STRING
  },
  itemId: {
    type: Sequelize.INTEGER
  },
  selfPrice: {
    type: Sequelize.INTEGER
  },
  price: {
    type: Sequelize.INTEGER
  },
  isWeighted: {
    type: Sequelize.BOOLEAN
  }
}
