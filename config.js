import dotenv from "dotenv"

dotenv.config()


export const port = process.env.PORT
export const debug = process.env.DEBUG
export const bucket = process.env.STORAGE
export const passwordHashValue = process.env.PASSWORDHASH
export const tokenHashValue = process.env.TOKENHASH
export const database_name = process.env.DBNAME
export const database_user = process.env.DBUSER
export const database_password = process.env.DBPASSWORD
export const database_url = process.env.DBURL
export const database_ssl = process.env.SSL
export const email_url = process.env.EMAILURL
export const email_port = process.env.EMAILPORT
export const email_stmp_user = process.env.EMAILUSER
export const email_stmp_password = process.env.EMAILPASSWORD
export const frontend_url = process.env.FRONTEND
export const backend_url = process.env.BACKEND
export const sender_email = process.env.SENDER
