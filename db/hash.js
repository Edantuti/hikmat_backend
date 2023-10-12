const bcrypt = require("bcrypt")
const { passwordHashValue } = require("../config")

module.exports.hash = async (value) => {
  try {
    return bcrypt.hash(value, parseInt(passwordHashValue))
  } catch (error) {

    console.error(error)
  }
}

module.exports.check = async (value, encryptedValue) => {
  try {
    return await bcrypt.compare(value, encryptedValue)
  } catch (error) {
    console.error(error)
  }
}
