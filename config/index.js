const dotenv = require('dotenv')
dotenv.config()

const config = {
    JWT_SECRET  : process.env.JWT_SECRET,
    MONGODB_URL : process.env.MONGODB_URL,
    JWT_EXPIRY : process.env.JWT_EXPIRY,
    PORT : process.env.PORT
}

module.exports = config