import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { poolPromise } from './config/database.js'
import authRoutes from './Routers/authRoutes.js'
import dashboardRoutes from './Routers/dashboardRoutes.js'
import productRoutes from './Routers/productRoutes.js'
import reportRoutes from './Routers/reportRoutes.js'
import salesRoutes from './Routers/salesRoutes.js'

const app = express()
const port = process.env.PORT || 5000

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ message: 'Stockwise API is running.' })
})

app.use('/api/auth', authRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/products', productRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/reports', reportRoutes)

poolPromise
  .then(() => {
    console.log('Connected to MSSQL')
    app.listen(port, () => {
      console.log(`Stockwise API is running on http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message)
    process.exit(1)
  })
