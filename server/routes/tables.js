const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router()

router.get('/list', (req, res) => {
  sequelize.models.Table.all({include: [{all:true, nested: true}]}).then(tables => {
    res.send(tables);
  }, res.send)
})

router.get('/get', (req, res) => {
  sequelize.models.Table.findById(
    req.query.id,
    {
      include: [{all:true, nested: true}]
    }
  ).then(table => {
    res.send(table);
  }, res.send)
})


router.post('/edit', (req, res) => {
  let orderPromise
  // Update order
  orderPromise = new Promise(resolve => {
    if (req.body.activeOrder) {
      req.body.activeOrder.id === null || req.body.activeOrder.id === undefined
        ? sequelize.models.Order.create(req.body.activeOrder).then(order => {
            resolve(order)
          })
        : sequelize.models.Order.findById(req.body.activeOrder.id).then(order => {
            order.update(req.body).then(updatedOrder => resolve(updatedOrder) )
          })
    } else {
      resolve()
    }
  })
  // Update table
  orderPromise.then(order => {
    sequelize.models.Table.findById(req.body.id).then(table => {
      table.update(req.body).then(updatedTable => {
        updatedTable.setActiveOrder(order ? order.getDataValue('id') : null).then(() => {
          sequelize.models.Table.findById(req.body.id, {include: [{all: true, nested: true}]}).then(table => res.send(table))
        })
      })
    }, res.send)
  })
})

module.exports = router;
