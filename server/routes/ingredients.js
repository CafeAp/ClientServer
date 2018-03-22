const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router(),
  upload = require(`${__basedir}/utils/multer.js`)

router.get('/list', (req, res) => {
  sequelize.models.Ingredient.all().then(ingredients => {
    res.send(ingredients);
  }, res.send)
})

router.get('/get', (req, res) => {
  sequelize.models.Ingredient.findById(req.query.id).then(ingredient => {
    res.send(ingredient.get());
  }, res.send)
})


router.post('/add', (req, res) => {
  sequelize.models.Ingredient.create(req.body).then(ingredient => {
    sequelize.models.WarehouseItem.create(
      {
        name: ingredient.getDataValue('name'),
        entityId: ingredient.getDataValue('id'),
        type: 'ingredient',
        amount: 0
      }
    ).then(warehouseItem => {
      sequelize.models.Warehouse.findById('1').then(warehouse => {
        warehouse.addWarehouseItem(warehouseItem.getDataValue('id'))
      })
    })
    res.send(ingredient);
  }, res.send);
});

router.post('/edit', (req, res) => {
  sequelize.models.Ingredient.findById(req.body.id).then(ingredient => {
    ingredient.update(req.body).then(updatedIngredient => {
      sequelize.models.WarehouseItem.find(
        {
          where: {
            entityId: req.body.id,
            type: 'ingredient'
          }
        }
      ).then(warehouseItem => {
        warehouseItem.update({name: req.body.name}, {fields: ['name']})
      })
      res.send(updatedIngredient);
    }, res.send)
  }, res.send)
});

router.delete('/delete', (req, res) => {
  sequelize.models.Ingredient.findById(req.query.id).then(ingredient => {
    ingredient.destroy(req.body).then(() => {
      res.sendStatus(200);
    }, res.send)
  }, res.send)
});

module.exports = router;
