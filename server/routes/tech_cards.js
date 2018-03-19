const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router()

router.get('/list', (req, res) => {
  sequelize.models.TechCard.all({include: [{all: true, nested: true}]}).then(techCards => {
    res.send(techCards);
  }, res.send)
})

router.get('/get', (req, res) => {
  sequelize.models.TechCard.findById(req.query.id, {include: [{all: true, nested: true}]}).then(techCard => {
    res.send(techCard.get());
  }, res.send)
})


router.post('/add', (req, res) => {
  sequelize.models.TechCard.create(req.body, {
    include: [sequelize.models.TechCard.TechCardIngredients],
  }).then(techCard => {
    if (req.body.category) techCard.setCategory(req.body.category.id)
    techCard.techCardIngredients.forEach((techCardIngredient, i) => {
      techCardIngredient.update({ingredientId: req.body.techCardIngredients[i].ingredient.id}, {fields: ['ingredientId']})
    })
    res.sendStatus(200)
  }, res.send);
});

router.post('/edit', (req, res) => {
  let techCardIngredientIds = [],
    promises = []
  req.body.techCardIngredients.forEach(techCardIngredientData => {
    promises.push(new Promise(resolve => {
      techCardIngredientData.id === null  || techCardIngredientData.id === undefined
        ? sequelize.models.TechCardIngredient.create(techCardIngredientData).then(techCardIngredient => {
          techCardIngredient.update({ingredientId: techCardIngredientData.ingredient.id}, {fields: ['ingredientId']})
          techCardIngredientIds.push(techCardIngredient.getDataValue('id'))
          resolve()
        })
        : sequelize.models.TechCardIngredient.findById(techCardIngredientData.id).then(techCardIngredient => {
          techCardIngredient.update(techCardIngredientData)
          techCardIngredient.update({ingredientId: techCardIngredientData.ingredient.id}, {fields: ['ingredientId']})
          techCardIngredientIds.push(techCardIngredientData.id)
          resolve()
        })
    }))
  })
  Promise.all(promises).then(() => {
    sequelize.models.TechCard.findById(req.body.id, {include: {all: true}}).then(techCard => {
      techCard.update(req.body).then(updatedTechCard => {
        updatedTechCard.setCategory(req.body.category ? req.body.category.id : null)
        updatedTechCard.setTechCardIngredients(techCardIngredientIds)
        res.send(updatedTechCard.get());
      }, res.send)
    }, res.send)
  })
});

router.delete('/delete', (req, res) => {
  sequelize.models.TechCard.findById(req.query.id).then(techCard => {
    techCard.destroy(req.body).then(() => {
      res.sendStatus(200);
    }, res.send)
  }, res.send)
});

module.exports = router;
