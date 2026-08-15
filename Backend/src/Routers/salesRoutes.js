import { Router } from 'express'
import SalesController from '../Controllers/SalesController.js'
import authenticateToken from '../Middlewares/authenticateToken.js'

const router = Router()

router.post('/', authenticateToken, SalesController.create.bind(SalesController))

export default router
