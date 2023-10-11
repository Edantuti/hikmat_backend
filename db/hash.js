const bcrypt = require("bcrypt")
const { passwordHashValue } = require("../config.json")

module.exports.hash = async (value) => {
    try {
        return await bcrypt.hash(value, passwordHashValue)
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
