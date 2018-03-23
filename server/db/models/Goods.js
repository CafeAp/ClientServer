let Sequelize = require('sequelize')
module.exports = {
  name: {
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
  measure: {
    type: Sequelize.STRING,
    defaultValue: 'шт',
  },
  supplyItemType: {
    type: Sequelize.STRING,
    defaultValue: 'goods',
  },
  type: {
    type: Sequelize.STRING,
    defaultValue: 'goods',
  },
  averagePrice: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}
