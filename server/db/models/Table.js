let Sequelize = require('sequelize'),
  enums = require(`${__basedir}/data_structures/index.js`).enums

module.exports = {
  name: {
    type: Sequelize.STRING
  },
  x: {
    type: Sequelize.INTEGER
  },
  y: {
    type: Sequelize.INTEGER
  },
  height: {
    type: Sequelize.INTEGER
  },
  width: {
    type: Sequelize.INTEGER
  },
  status: {
    type: Sequelize.ENUM,
    values: enums['table.status']
  }
}
