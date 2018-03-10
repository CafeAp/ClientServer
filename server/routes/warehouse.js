const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router(),
  _concat = require('lodash/concat'),
  _cloneDeep = require('lodash/cloneDeep'),
  _sumBy = require('lodash/sumBy')

router.get('/get', (req, res) => {
  let ingredientsPromise,
    goodsPromise,
    ingredients,
    goods
  ingredientsPromise = new Promise(resolve => {
    sequelize.models.Ingredient.all(
      {
        raw: true
      }
    ).then(ingredientsRows => {
      ingredients = ingredientsRows
      resolve()
    });
  })
  goodsPromise = new Promise(resolve => {
    sequelize.models.Goods.all({raw: true}).then(goodsRows => {
      goods = goodsRows
      resolve()
    })
  })
  Promise.all([ingredientsPromise, goodsPromise]).then(() => {
    let warehouseItems = _concat(ingredients, goods),
      warehouse = [],
      promises = []
    warehouseItems.forEach(warehouseItem => {
      let itemInfo = _cloneDeep(warehouseItem)
      itemInfo.metrics = {}
      promises.push(new Promise(resolve => {
        sequelize.models.SupplyItem.all(
          {
            where: {[`${warehouseItem.supplyItemType}Id`]: warehouseItem.id},
            raw: true,
            include: [{all: true}]
          }
        ).then(supplyItemsData => {
          itemInfo.metrics.totalAmount = _sumBy(supplyItemsData, 'amount')
          itemInfo.metrics.totalPrice = _sumBy(supplyItemsData, 'totalPrice')
          itemInfo.metrics.averagePrice = (itemInfo.metrics.totalPrice / itemInfo.metrics.totalAmount) / 1000
          warehouse.push(itemInfo)
          resolve()
        })
      }))
    })
    Promise.all(promises).then(() => {
      res.send(warehouse)
    })
  })
})

module.exports = router;
