const dotenv = require("dotenv")

dotenv.config()

module.exports = {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD, 
}