const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router(),
  _concat = require('lodash/concat'),
  _cloneDeep = require('lodash/cloneDeep'),
  _sumBy = require('lodash/sumBy'),
  _sum = require('lodash/sum'),
  _flatten = require('lodash/flatten')

router.get('/get', (req, res) => {
  sequelize.models.Warehouse.findById('1', {include: [{all: true, nested: true}] }).then(warehouse => {
    let promises = [],
      warehouseData = warehouse.get()
      warehouse.warehouseItems.forEach((warehouseItem, i) => {
      let warehouseItemData = warehouseItem.get(),
        prices = [],
        amounts = []
      promises.push(new Promise(resolve => {
        sequelize.models.SupplyItem.findAll(
          {
            order: [['updatedAt', 'DESC']],
            where: {
              [`${warehouseItemData.type}Id`]: warehouseItemData.entityId,
            },
            limit: 100,
            include: {all: true, nested: true}
          }
        ).then(supplyItems => {
          let i = 0
          while (_sum(amounts) < warehouseItem.amount) {
            let sumAmounts = _sum(amounts),
              amount = sumAmounts + supplyItems[i].amount < warehouseItem.amount ? supplyItems[i].amount : warehouseItem.amount - sumAmounts
            amounts.push(amount)
            prices.push(supplyItems[i].getDataValue('totalPrice'))
          }
          warehouseData.warehouseItems[i].averagePrice = Math.round((_sum(prices.map((p, i) => p * amounts[i])) / _sum(amounts)) * 100) / 100
          resolve()
        })
      }))
    })
    Promise.all(promises).then(() => {
      res.send(warehouseData)
    })
  })
})

module.exports = router;
