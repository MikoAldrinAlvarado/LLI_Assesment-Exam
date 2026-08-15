import { Router } from 'express'
import ReportController from '../Controllers/ReportController.js'
import authenticateToken from '../Middlewares/authenticateToken.js'

const router = Router()

router.get('/sales/weekly', authenticateToken, ReportController.getWeeklySales.bind(ReportController))

export default router
