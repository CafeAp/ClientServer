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
    include: {
      association: sequelize.models.TechCard.TechCardIngredients
    },
  }).then(techCard => {
    techCard.techCardIngredients.forEach((techCardIngredient, i) => {
      techCardIngredient.update({ingredientId: req.body.techCardIngredients[i].ingredient.id}, {fields: ['ingredientId']})
    })
    res.sendStatus(200)
  }, res.send);
});

router.post('/edit', (req, res) => {
  sequelize.models.TechCard.findById(req.body.id).then(techCard => {
    techCard.update(req.body).then(updatedTechCard => {
      res.send(updatedTechCard.get());
    }, res.send)
  }, res.send)
});

router.delete('/delete', (req, res) => {
  sequelize.models.TechCard.findById(req.query.id).then(techCard => {
    techCard.destroy(req.body).then(() => {
      res.sendStatus(200);
    }, res.send)
  }, res.send)
});

module.exports = router;
