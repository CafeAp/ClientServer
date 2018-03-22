const express = require('express'),
  sequelize = require(`${__basedir}/db/sequelize.js`),
  router = express.Router(),
  upload = require(`${__basedir}/utils/multer.js`)

let setSubCategories = async function (categoriesData, categoriesWithSubs) {
  let promises = []
  categoriesData.forEach(categoryData => {
    promises.push(new Promise(resolve => {
      sequelize.models.Category.all(
        {
          where: {'parentCategoryId': categoryData.id},
          include: [{all: true, nested: true}]
        }
      ).then(subCategories => {
        categoryData.subCategories = subCategories ? subCategories.map(d => d.get()) : []
        if (categoriesWithSubs) categoriesWithSubs.push(categoryData)
        setSubCategories(categoryData.subCategories).then(() => resolve())
      })
    }))
  })
  await Promise.all(promises)
}

router.get('/tree', (req, res) => {
  sequelize.models.Category.all(
    {
      include: [{all: true, nested: true}],
      where: {parentCategoryId: null}
    }
  ).then(categories => {
    let categoriesWithSubs = []
    setSubCategories(categories.map(d => d.get()), categoriesWithSubs).then(() => {
      res.send(categoriesWithSubs)
    })
  }, res.send)
})

router.get('/list', (req, res) => {
  sequelize.models.Category.all(
    {
      include: [{all: true, nested: true}]
    }
  ).then(categories => {
    res.send(categories)
  }, res.send)
})

router.get('/get', (req, res) => {
  sequelize.models.Category.findById(
    req.query.id,
    {
      include: [{all: true, nested: true}]
    }
  ).then(category => {
    let categoriesWithSubs = []
    setSubCategories([category.get()], categoriesWithSubs).then(() => {
      res.send(categoriesWithSubs[0])
    })
  }, res.send)
})


router.post('/add', upload.any(), (req, res) => {
  if (req.files[0]) req.body.image = `/static/upload/${req.files[0].originalname}`
  sequelize.models.Category.create(req.body).then(createdCategory => {
    if (req.body.parentCategory) createdCategory.setParentCategory(req.body.parentCategory.id)
    res.send(createdCategory);
  }, res.send);
});

router.post('/edit', upload.any(), (req, res) => {
  if (req.files[0]) req.body.image = `/static/upload/${req.files[0].originalname}`
  sequelize.models.Category.findById(req.body.id).then(category => {
    category.update(req.body).then(updatedCategory => {
      updatedCategory.setParentCategory(req.body.parentCategory ? req.body.parentCategory.id : null)
      res.send(updatedCategory);
    }, res.send)
  }, res.send)
});

router.delete('/delete', (req, res) => {
  sequelize.models.Category.findById(req.query.id).then(category => {
    category.destroy(req.body).then(() => {
      res.sendStatus(200);
    }, res.send)
  }, res.send)
});

module.exports = router;
