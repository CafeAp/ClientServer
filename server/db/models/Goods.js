let Sequelize = require('sequelize')
module.exports = {
  name: {
    type: Sequelize.STRING
  },
  category: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.INTEGER
  },
  image: {
    type: Sequelize.TEXT
  },
  isWeighted: {
    type: Sequelize.BOOLEAN
  },
  supplyItemType: {
    type: Sequelize.STRING,
    defaultValue: 'goods',
  }
}
