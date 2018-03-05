let Sequelize = require('sequelize')
module.exports = {
  name: {
    type: Sequelize.STRING
  },
  category: {
    type: Sequelize.STRING
  },
  image: {
    type: Sequelize.TEXT
  },
  price: {
    type: Sequelize.INTEGER
  }
}
