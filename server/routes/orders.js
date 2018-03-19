const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router(),
  _capitalize = require('lodash/capitalize')

router.get('/list', (req, res) => {
  sequelize.models.Order.all({include: [{all: true, nested: true}]}).then(orders => {
    res.send(orders);
  }, res.send)
})

router.get('/get', (req, res) => {
  sequelize.models.Order.findById(req.query.id, {include: [{all: true, nested: true}]}).then(order => {
    res.send(order.get());
  }, res.send)
})

function changeWarehouseItemAmount(orderItemData, isIncrease = true) {
  let type = orderItemData.goods ? 'goods' : 'techCard',
    change = function (name, type, isIncrease) {
      sequelize.models.WarehouseItem.find(
        {
          where: {name, type}
        }
      ).then(warehouseItem => {
        warehouseItem.update({amount: warehouseItem.getDataValue('amount') + (isIncrease ? 1 : -1)})
      })
    }
  type === 'goods'
    ? change(orderItemData.goods.name, 'goods', isIncrease)
    : orderItemData.techCard.techCardIngredients.forEach(d => change(d.ingredient.name, 'ingredient', isIncrease))
}

router.post('/orderItem/add', (req, res) => {
  let orderData = req.body.order,
    orderItemData = req.body.orderItem
  sequelize.models.OrderItem.create(orderItemData).then(orderItem => {
    let type = orderItemData.goods ? 'goods' : 'techCard'
    // Update warehouse
    changeWarehouseItemAmount(orderItemData, false)
    // Update OrderItem
    orderItem[`set${type[0].toUpperCase() + type.substring(1) }`](orderItemData[type].id)
    sequelize.models.Order.findById(orderData.id).then(order => {
      order.addOrderItem(orderItem.getDataValue('id'))
      sequelize.models.Order.findById(orderData.id, {include:{all: true, nested: true}}).then(order => res.send(order.get()))
    })
  })
})

router.post('/orderItem/increaseAmount', (req, res) => {
  sequelize.models.OrderItem.findById(req.body.id).then(orderItem => {
    orderItem.update({amount: orderItem.getDataValue('amount') + 1}, {fields: ['amount']}).then(updatedOrderItem => {
      changeWarehouseItemAmount(req.body, false)
      sequelize.models.OrderItem.findById(updatedOrderItem.getDataValue('id'), {include: [{all: true, nested: true}]}).then(orderItem => res.send(orderItem))
    })
  })
})

router.post('/orderItem/decreaseAmount', (req, res) => {
  sequelize.models.OrderItem.findById(req.body.id).then(orderItem => {
    orderItem.update({amount: orderItem.getDataValue('amount') - 1}, {fields: ['amount']}).then(updatedOrderItem => {
      changeWarehouseItemAmount(req.body)
      sequelize.models.OrderItem.findById(updatedOrderItem.getDataValue('id'), {include: [{all: true, nested: true}]}).then(orderItem => res.send(orderItem))
    })
  })
})

router.post('/orderItem/delete', (req, res) => {
  sequelize.models.OrderItem.findById(req.body.id).then(orderItem => {
    changeWarehouseItemAmount(req.body)
    orderItem.destroy().then(() => {
      res.sendStatus(200)
    })
  })
})

module.exports = router;
