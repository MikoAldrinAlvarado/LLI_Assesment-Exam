import { Router } from 'express'
import ProductController from '../Controllers/ProductController.js'
import authenticateToken from '../Middlewares/authenticateToken.js'

const router = Router()

router.use(authenticateToken)

router.get('/', ProductController.getAll.bind(ProductController))
router.get('/low-stock', ProductController.getLowStock.bind(ProductController))
router.get('/:id', ProductController.getById.bind(ProductController))
router.post('/', ProductController.create.bind(ProductController))
router.put('/:id', ProductController.update.bind(ProductController))
router.delete('/:id', ProductController.delete.bind(ProductController))

export default router
