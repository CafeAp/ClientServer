let Sequelize = require('sequelize'),
  enums = require(`${__basedir}/data_structures/index.js`).enums
module.exports = {
  name: {
    type: Sequelize.STRING
  },
  measure: {
    type: Sequelize.ENUM,
    values: enums['ingredient.measure']
  },
  lostClean: {
    type: Sequelize.INTEGER
  },
  lostBoil: {
    type: Sequelize.INTEGER
  },
  lostFry: {
    type: Sequelize.INTEGER
  },
  lostStew: {
    type: Sequelize.INTEGER
  },
  lostBake: {
    type: Sequelize.INTEGER
  },
  supplyItemType: {
    type: Sequelize.STRING,
    defaultValue: 'ingredient',
  }
}
