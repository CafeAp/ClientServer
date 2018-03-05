let fs = require('fs'),
  enumsDir = `${__basedir}/data_structures/enums`,
  enums = {}
fs.readdirSync(enumsDir).forEach(file => {
  let enumStructure = require(`${enumsDir}/${file}`),
    enumKey = file.substr(0, file.length - 3)
  enums[enumKey] = enumStructure
})
module.exports.enums = enums