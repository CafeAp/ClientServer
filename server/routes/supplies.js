const express = require('express'),
  app = require(`${__basedir}/app.js`),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router(),
  _cloneDeep = require('lodash/cloneDeep'),
  _capitalize = require('lodash/capitalize'),
  _concat = require('lodash/concat'),
  _sum = require('lodash/sum'),
  _omit = require('lodash/omit')

function updateAveragePrice(warehouseItem) {
  //Update average price of ingredient/goods
  let prices = [],
    amounts = []
  sequelize.models.SupplyItem.findAll(
    {
      order: [['updatedAt', 'DESC']],
      where: {
        [`${warehouseItem.type}Id`]: warehouseItem.entityId,
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
      i++
    }
    sequelize.models[warehouseItem.type === 'ingredient' ? 'Ingredient' : 'Goods'].findById(warehouseItem.entityId).then(entity => {
      entity.update({averagePrice: _sum(prices) / _sum(amounts)}, {fields: ['averagePrice']})
    })
  })
}

function getWarehouseItem(type, name) {
  return new Promise(resolve => {
    sequelize.models.WarehouseItem.find(
      {
        where: { name, type }
      }
    ).then(warehouseItem => resolve(warehouseItem))
  })
}

addSupply = (req, res) => {
  sequelize.models.Supply.create(
    req.body,
    {
      include: [
        {
          association: sequelize.models.Supply.SupplyItem
        }
      ]
    }
  ).then(supply => {
    supply.supplyItems.forEach((supplyItem, i) => {
      let type = req.body.supplyItems[i].ingredient ? 'ingredient' : 'goods',
        entity = req.body.supplyItems[i][type]
      supplyItem[`set${_capitalize(type)}`](entity.id).then(updatedSupplyItem => {
        //Update warehouseItem
        getWarehouseItem(type, entity.name).then(warehouseItem => {
          warehouseItem.update({amount: warehouseItem.getDataValue('amount') + updatedSupplyItem.amount}, {fields: ['amount']}).then(updatedWarehouseItem => {
            updateAveragePrice(updatedWarehouseItem)
          })
        })
      })
    })
    res.send(supply)
  })
}

deleteSupply = (req, res) => {
  sequelize.models.Supply.findById(req.query.id, {include: {all: true, nested: true}}).then(supply => {
    supply.supplyItems.forEach(supplyItem => {
      let type = supplyItem.ingredient ? 'ingredient' : 'goods'
      getWarehouseItem(type, supplyItem[type].name).then(warehouseItem => {
        warehouseItem.update({amount: warehouseItem.getDataValue('amount') - supplyItem.amount}, {fields: ['amount']}).then(updatedWarehouseItem => {
          supply.supplyItems.forEach(supplyItem => {
            supplyItem.destroy()
          })
          supply.destroy(req.body).then(() => {
            updateAveragePrice(updatedWarehouseItem)
            res.sendStatus(200);
          })
        })
      })
    })
  })
}

router.get('/list', (req, res) => {
  sequelize.models.Supply.all({include: [{all: true, nested: true}]}).then(supplies => {
    res.send(supplies);
  }, res.send)
})

router.get('/get', (req, res) => {
  sequelize.models.Supply.findById(req.query.id, {include: [{all: true, nested: true}]}).then(supplies => {
    res.send(supplies.get());
  }, res.send)
})


router.post('/add', addSupply);

router.post('/edit', (req, res) => {
  deleteSupply({query: {id: req.body.id}}, {
    sendStatus: () => {
      addSupply({body: req.body}, {
        send: () => res.sendStatus(200)
      })
    }
  })
});

router.delete('/delete', deleteSupply);

module.exports = router;
