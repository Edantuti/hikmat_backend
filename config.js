require("dotenv").config()


module.exports = {
  port: process.env.PORT,
  debug: process.env.DEBUG,
  passwordHashValue: process.env.PASSWORDHASH,
  tokenHashValue: process.env.TOKENHASH,
  database_name: process.env.DBNAME,
  database_user: process.env.DBUSER,
  database_password: process.env.DBPASSWORD,
  database_url: process.env.DBURL,
  database_ssl: process.env.SSL,
  email_url: process.env.EMAILURL,
  email_port: process.env.EMAILPORT,
  email_stmp_user: process.env.EMAILUSER,
  email_stmp_password: process.env.EMAILPASSWORD,
  frontend_url: process.env.FRONTEND,
  backend_url: process.env.BACKEND
}
