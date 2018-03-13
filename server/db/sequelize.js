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

sequelize.models.Category.ParentCategory = sequelize.models.Category.belongsTo(sequelize.models.Category, {as: 'parentCategory'})

sequelize.models.TechCard.TechCardIngredients = sequelize.models.TechCard.hasMany(sequelize.models.TechCardIngredient, {as: 'techCardIngredients'})
sequelize.models.TechCard.Category = sequelize.models.TechCard.belongsTo(sequelize.models.Category, {as: 'category'})
sequelize.models.TechCardIngredient.Ingredient = sequelize.models.TechCardIngredient.belongsTo(sequelize.models.Ingredient, {as: 'ingredient'})

sequelize.models.Goods.Category = sequelize.models.Goods.belongsTo(sequelize.models.Category, {as: 'category'})

sequelize.models.Supply.SupplyItem = sequelize.models.Supply.hasMany(sequelize.models.SupplyItem, {as: 'supplyItems'})
sequelize.models.SupplyItem.Ingredient = sequelize.models.SupplyItem.belongsTo(sequelize.models.Ingredient, {as: 'ingredient'})
sequelize.models.SupplyItem.Goods = sequelize.models.SupplyItem.belongsTo(sequelize.models.Goods, {as: 'goods'})

sequelize.models.Room.hasMany(sequelize.models.Table, {as: 'tables'})

sequelize.models.Table.hasOne(sequelize.models.Order, {as: 'activeOrder'})
sequelize.models.Order.OrderItem = sequelize.models.Order.hasMany(sequelize.models.OrderItem, {as: 'orderItems'})
sequelize.models.OrderItem.belongsTo(sequelize.models.TechCard, {as: 'techCard'})
sequelize.models.OrderItem.belongsTo(sequelize.models.Goods, {as: 'goods'})

sequelize.sync().then(() => {
  sequelize.models.Room.findOrCreate({where: {id: 1}})
  sequelize.models.Category.create({name: 'Мясные'})
  sequelize.models.Category.create({name: 'Напитки'})
  sequelize.models.TechCard.create({name: 'Шашлык', categoryId: 1, price: 100})
  sequelize.models.Goods.create({name: 'Кока-кола', categoryId: 2, price: 50})
})

module.exports = sequelize

