const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router()

router.get('/list', (req, res) => {
  sequelize.models.Ingredient.all().then(ingredients => {
    res.send(ingredients);
  }, res.send)
})

router.get('/get', (req, res) => {
  sequelize.models.Ingredient.findById(req.query.id).then(ingredient => {
    res.send(ingredient.get());
  }, res.send)
})


router.post('/add', (req, res) => {
  sequelize.models.Ingredient.create(req.body).then(ingredient => {
    res.send(ingredient);
  }, res.send);
});

router.post('/edit', (req, res) => {
  sequelize.models.Ingredient.findById(req.body.id).then(ingredient => {
    ingredient.update(req.body).then(updatedIngredient => {
      res.send(updatedIngredient);
    }, res.send)
  }, res.send)
});

router.delete('/delete', (req, res) => {
  sequelize.models.Ingredient.findById(req.query.id).then(ingredient => {
    ingredient.destroy(req.body).then(() => {
      res.sendStatus(200);
    }, res.send)
  }, res.send)
});

module.exports = router;
