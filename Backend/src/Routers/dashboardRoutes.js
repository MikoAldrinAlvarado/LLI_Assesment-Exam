import { Router } from 'express'
import DashboardController from '../Controllers/DashboardController.js'
import authenticateToken from '../Middlewares/authenticateToken.js'

const router = Router()

router.get('/summary', authenticateToken, DashboardController.getSummary.bind(DashboardController))

export default router
