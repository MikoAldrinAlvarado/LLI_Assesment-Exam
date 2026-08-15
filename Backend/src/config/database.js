import 'dotenv/config'
import sql from 'mssql'

const databaseConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
  },
}

const poolPromise = new sql.ConnectionPool(databaseConfig).connect()

export { sql, poolPromise }
