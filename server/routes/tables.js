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
  let orderPromise,
     orderItemsPromise
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
  // Update OrderItems
  orderItemsPromise = new Promise(resolveCommon => {
    orderPromise.then(order => {
      if (req.body.activeOrder && req.body.activeOrder.orderItems) {
        let promises = [],
          orderItemIds = []
        req.body.activeOrder.orderItems.forEach(orderItemData => {
          promises.push(new Promise(resolve => {
            orderItemData.id === null || orderItemData.id === undefined
              ? sequelize.models.OrderItem.create(orderItemData).then(orderItem => {
                orderItem.setGoods(orderItemData.goods ? orderItemData.goods.id : null)
                orderItem.setTechCard(orderItemData.techCard ? orderItemData.techCard.id : null)
                orderItemIds.push(orderItem.getDataValue('id'))
                resolve()
              })
              : sequelize.models.OrderItem.findById(orderItemData.id).then(orderItem => {
                orderItem.update(orderItemData).then(updatedOrderItem => {
                  updatedOrderItem.setGoods(orderItemData.goods ? orderItemData.goods.id : null)
                  updatedOrderItem.setTechCard(orderItemData.techCard ? orderItemData.techCard.id : null)
                  orderItemIds.push(orderItemData.id)
                  resolve()
                })
              })
          }))
        })
        Promise.all(promises).then(() => {
          order.setOrderItems(orderItemIds).then(() => resolveCommon(order))
        })
      } else {
        resolveCommon(order)
      }
    })
  })
  // Update table
  orderItemsPromise.then(order => {
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
