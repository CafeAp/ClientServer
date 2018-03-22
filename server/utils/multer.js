let multer  = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${__staticDir}`)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  }),
  upload = multer({ storage })

module.exports = upload