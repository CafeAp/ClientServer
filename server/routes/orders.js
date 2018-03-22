const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router(),
  _capitalize = require('lodash/capitalize')

router.get('/list', (req, res) => {
  let where = {}
  if (req.query.dateRange) where.createdAt = { [sequelize.Op.between]: req.query.dateRange }
  sequelize.models.Order.all(
    {
      include: {all: true, nested: true},
      where
    }
  ).then(orders => {
    res.send(orders);
  }, res.send)
})

router.get('/today/list', (req, res) => {
  let now = new Date(Date.now()),
    month = now.getMonth(),
    day = now.getDate(),
    year = now.getFullYear()
  sequelize.models.Order.all(
    {
      include: {all: true, nested: true},
      where: {
        createdAt: {
          [sequelize.Op.between]: [new Date(year, month, day), new Date(year, month, day, 23, 59)]
        }
      }
    }
  ).then(orders => {
    res.send(orders);
  }, res.send)
})

router.get('/get', (req, res) => {
  sequelize.models.Order.findById(req.query.id, {include: [{all: true, nested: true}]}).then(order => {
    res.send(order.get());
  }, res.send)
})

function changeWarehouseItemAmount(itemsForWriteOff, isIncrease = true) {
  itemsForWriteOff.forEach(item => {
    sequelize.models.WarehouseItem.find(
      {
        where: {entityId: item.entityId, type: item.type}
      }
    ).then(warehouseItem => {
      warehouseItem.update({amount: warehouseItem.getDataValue('amount') + (isIncrease ? item.amount : -item.amount)})
    })
  })
}

router.post('/orderItem/add', (req, res) => {
  let orderData = req.body.order,
    orderItemData = req.body.orderItem
  sequelize.models.OrderItem.create(
    orderItemData,
    {
      include: [sequelize.models.OrderItem.ItemForWriteOff]
    }
  ).then(orderItem => {
    // Update warehouse
    changeWarehouseItemAmount(req.body.orderItem.itemsForWriteOff, false)
    // Update OrderItem
    sequelize.models.Order.findById(orderData.id).then(order => {
      order.addOrderItem(orderItem.getDataValue('id'))
      sequelize.models.Order.findById(orderData.id, {include:{all: true, nested: true}}).then(order => res.send(order.get()))
    })
  })
})

router.post('/orderItem/increaseAmount', (req, res) => {
  sequelize.models.OrderItem.findById(req.body.id).then(orderItem => {
    orderItem.update({amount: orderItem.getDataValue('amount') + 1}, {fields: ['amount']}).then(updatedOrderItem => {
      changeWarehouseItemAmount(req.body.itemsForWriteOff, false)
      sequelize.models.OrderItem.findById(updatedOrderItem.getDataValue('id'), {include: [{all: true, nested: true}]}).then(orderItem => res.send(orderItem))
    })
  })
})

router.post('/orderItem/decreaseAmount', (req, res) => {
  sequelize.models.OrderItem.findById(req.body.id).then(orderItem => {
    orderItem.update({amount: orderItem.getDataValue('amount') - 1}, {fields: ['amount']}).then(updatedOrderItem => {
      changeWarehouseItemAmount(req.body.itemsForWriteOff)
      sequelize.models.OrderItem.findById(updatedOrderItem.getDataValue('id'), {include: [{all: true, nested: true}]}).then(orderItem => res.send(orderItem))
    })
  })
})

router.post('/orderItem/delete', (req, res) => {
  sequelize.models.OrderItem.findById(req.body.id).then(orderItem => {
    changeWarehouseItemAmount(req.body.itemsForWriteOff)
    orderItem.destroy().then(() => {
      res.sendStatus(200)
    })
  })
})

module.exports = router;
