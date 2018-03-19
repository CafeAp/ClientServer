let Sequelize = require('sequelize')
module.exports = {
  name: {
    type: Sequelize.STRING
  },
  entityId: {
    type: Sequelize.INTEGER
  },
  type: {
    type: Sequelize.STRING
  },
  amount: {
    type: Sequelize.INTEGER
  }
}
