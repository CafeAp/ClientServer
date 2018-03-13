const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router()

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


router.post('/add', (req, res) => {
  sequelize.models.Goods.create(req.body).then(goods => {
    if (req.body.category) goods.setCategory(req.body.category.id)
    res.send(goods);
  }, res.send);
});

router.post('/edit', (req, res) => {
  sequelize.models.Goods.findById(req.body.id).then(goods => {
    goods.update(req.body).then(updatedGoods => {
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
