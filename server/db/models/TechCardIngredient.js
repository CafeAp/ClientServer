let Sequelize = require('sequelize')
module.exports = {
  grossWeight: {
    type: Sequelize.INTEGER
  },
  netWeight: {
    type: Sequelize.INTEGER
  },
  price: {
    type: Sequelize.INTEGER
  },
  cookingMethods: {
    type: Sequelize.STRING,
    get: function () {
      return this.getDataValue('cookingMethods').split(';')
    },
    set: function (val) {
      this.setDataValue('cookingMethods',val.join(';'));
    }
  }
}
