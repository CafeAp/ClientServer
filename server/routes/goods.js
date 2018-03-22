const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router(),
  upload = require(`${__basedir}/utils/multer.js`)

router.get('/list', (req, res) => {
  sequelize.models.Goods.all({include: [{all: true, nested: true}]}).then(goods => {
    res.send(goods);
  }, res.send)
})

router.get('/get', (req, res) => {
  sequelize.models.Goods.findById(req.query.id, {include: [{all: true, nested: true}]}).then(goods => {
    res.send(goods.get());
  }, res.send)
})


router.post('/add', upload.any(), (req, res) => {
  if (req.files[0]) req.body.image = `/static/upload/${req.files[0].originalname}`
  if (req.body.category) req.body.category = JSON.parse(req.body.category)
  sequelize.models.Goods.create(req.body).then(goods => {
    if (req.body.category) goods.setCategory(req.body.category.id)
    sequelize.models.WarehouseItem.create(
      {
        name: goods.getDataValue('name'),
        entityId: goods.getDataValue('id'),
        type: 'goods',
        amount: 0
      }
    ).then(warehouseItem => {
      sequelize.models.Warehouse.findById('1').then(warehouse => {
        warehouse.addWarehouseItem(warehouseItem.getDataValue('id'))
      })
    })
    res.send(goods);
  }, res.send);
});

router.post('/edit', upload.any(), (req, res) => {
  if (req.files[0]) req.body.image = `/static/upload/${req.files[0].originalname}`
  if (req.body.category) req.body.category = JSON.parse(req.body.category)
  sequelize.models.Goods.findById(req.body.id).then(goods => {
    goods.update(req.body).then(updatedGoods => {
      sequelize.models.WarehouseItem.find(
        {
          where: {
            entityId: req.body.id,
            type: 'goods'
          }
        }
      ).then(warehouseItem => {
        warehouseItem.update({name: req.body.name}, {fields: ['name']})
      })
      updatedGoods.setCategory(req.body.category ? req.body.category.id : null)
      res.send(updatedGoods);
    }, res.send)
  }, res.send)
});

router.delete('/delete', (req, res) => {
  sequelize.models.Goods.findById(req.query.id).then(goods => {
    goods.destroy(req.body).then(() => {
      res.sendStatus(200);
    }, res.send)
  }, res.send)
});

module.exports = router;
