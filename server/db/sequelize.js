let fs = require('fs'),
  dbPath = `${__basedir}\\db\\main.db`,
  sqlite3 = require('sqlite3'),
  db = new sqlite3.Database(dbPath),
  Sequelize = require('sequelize'),
  sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: dbPath
  })

fs.readdirSync(`${__basedir}/db/models`).forEach(file => {
  let model = require(`${__basedir}/db/models/${file}`),
    modelName = file.substr(0, file.length - 3)
  sequelize.define(modelName, model)
})

sequelize.models.TechCard.TechCardIngredients = sequelize.models.TechCard.hasMany(sequelize.models.TechCardIngredient, {as: 'techCardIngredients'})
sequelize.models.TechCardIngredient.Ingredient = sequelize.models.TechCardIngredient.belongsTo(sequelize.models.Ingredient, {as: 'ingredient'})

sequelize.models.Supply.SupplyItem = sequelize.models.Supply.hasMany(sequelize.models.SupplyItem, {as: 'supplyItems'})
sequelize.models.SupplyItem.Ingredient = sequelize.models.SupplyItem.belongsTo(sequelize.models.Ingredient, {as: 'ingredient'})
sequelize.models.SupplyItem.Goods = sequelize.models.SupplyItem.belongsTo(sequelize.models.Goods, {as: 'goods'})
sequelize.sync()
module.exports = sequelize

