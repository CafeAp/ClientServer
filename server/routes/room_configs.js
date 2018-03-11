const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router()

router.get('/get', (req, res) => {
  sequelize.models.RoomConfig.all({include: [{all:true, nested: true}]}).then(roomConfigs => {
    res.send(roomConfigs);
  }, res.send)
})

router.post('/edit', (req, res) => {
  let tableIds = [],
    promises = []
  req.body.tables.forEach(tableData => {
    promises.push(new Promise(resolve => {
      tableData.id === null || tableData.id === undefined
        ? sequelize.models.TableConfig.create(tableData).then(createdTableConfig => {
          tableIds.push(createdTableConfig.getDataValue('id'))
          resolve()
        })
        : sequelize.models.TableConfig.update(tableData, {where: {id: tableData.id}}).then(() => {
          tableIds.push(tableData.id)
          resolve()
        })
    }))
  })
  Promise.all(promises).then(() => {
    sequelize.models.RoomConfig.findById(req.body.id).then(roomConfig => {
      roomConfig.update(req.body).then(updatedRoomConfig => {
        updatedRoomConfig.setTables(tableIds)
      })
      res.send(roomConfig);
    }, res.send)
  })
})

module.exports = router;
