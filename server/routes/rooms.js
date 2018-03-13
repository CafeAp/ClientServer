const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router()

router.get('/list', (req, res) => {
  sequelize.models.Room.all({include: [{all:true, nested: true}]}).then(rooms => {
    res.send(rooms);
  }, res.send)
})

router.post('/edit', (req, res) => {
  let tableIds = [],
    promises = []
  req.body.tables.forEach(tableData => {
    promises.push(new Promise(resolve => {
      tableData.id === null || tableData.id === undefined
        ? sequelize.models.Table.create(tableData).then(createdTable => {
          tableIds.push(createdTable.getDataValue('id'))
          resolve()
        })
        : sequelize.models.Table.update(tableData, {where: {id: tableData.id}}).then(() => {
          tableIds.push(tableData.id)
          resolve()
        })
    }))
  })
  Promise.all(promises).then(() => {
    sequelize.models.Room.findById(req.body.id).then(room => {
      room.update(req.body).then(updatedRoom => {
        updatedRoom.setTables(tableIds)
      })
      res.send(room);
    }, res.send)
  })
})

module.exports = router;
