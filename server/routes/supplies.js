const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router(),
  _cloneDeep = require('lodash/cloneDeep'),
  _capitalize = require('lodash/capitalize')

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


router.post('/add', (req, res) => {
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
      let entity = req.body.supplyItems[i].ingredient ? 'ingredient' : 'goods'
      supplyItem[`set${_capitalize(entity)}`](req.body.supplyItems[i][entity].id)
    })
    res.send(supply)
  })
});

router.post('/edit', (req, res) => {
  // Upsert supplyItems
  let supplyItemsIds = [],
    promises = []
  req.body.supplyItems.forEach(supplyItemData => {
    let isNew = supplyItemData.id === null || supplyItemData.id === undefined,
      entity = supplyItemData.ingredient ? 'ingredient' : 'goods'
    promises.push(new Promise((resolve, reject) => {
      isNew
        ? sequelize.models.SupplyItem.create(supplyItemData).then(supplyItem => {
          supplyItemsIds.push(supplyItem.get().id)
          let entity = supplyItemData.ingredient ? 'ingredient' : 'goods'
          supplyItem[`set${_capitalize(entity)}`](supplyItemData[entity].id)
          resolve()
        })
        : sequelize.models.SupplyItem.update(supplyItemData, {where: {id: supplyItemData.id}}).then(() => {
          sequelize.models.SupplyItem.findById(supplyItemData.id).then(supplyItem => {
            supplyItemsIds.push(supplyItemData.id)
            let entity = supplyItemData.ingredient ? 'ingredient' : 'goods'
            supplyItem[`set${_capitalize(entity)}`](supplyItemData[entity].id)
            resolve()
          })
        })
    }))
  })
  Promise.all(promises).then(() => {
    //Update supply
    sequelize.models.Supply.findById(req.body.id).then(supply => {
      supply.update(req.body).then(updatedSupply => {
        updatedSupply.setSupplyItems(supplyItemsIds)
      })
      res.sendStatus(200)
    }, res.send)
  })
});

router.delete('/delete', (req, res) => {
  sequelize.models.Supply.findById(req.query.id).then(supply => {
    supply.destroy(req.body).then(() => {
      res.sendStatus(200);
    }, res.send)
  }, res.send)
});

module.exports = router;
