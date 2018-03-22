let Sequelize = require('sequelize')
module.exports = {
  entityId: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  amount: {
    type: Sequelize.INTEGER
  },
  type: {
    type: Sequelize.STRING
  }
}
