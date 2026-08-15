import SalesModel from '../Models/SalesModel.js'

class SalesController {
  validateItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return null
    }

    const mergedItems = new Map()

    for (const item of items) {
      const productId = Number(item.productId)
      const quantity = Number(item.quantity)

      if (!Number.isInteger(productId) || productId <= 0 || !Number.isInteger(quantity) || quantity <= 0) {
        return null
      }

      mergedItems.set(productId, (mergedItems.get(productId) || 0) + quantity)
    }

    return [...mergedItems].map(([productId, quantity]) => ({ productId, quantity }))
  }

  async create(request, response) {
    try {
      const items = this.validateItems(request.body.items)

      if (!items) {
        return response.status(400).json({
          message: 'At least one item with a valid product ID and quantity is required.',
        })
      }

      const sale = await SalesModel.createSale(items, request.user.userId)
      return response.status(201).json({ message: 'Sale recorded successfully.', sale })
    } catch (error) {
      console.error('Create sale error:', error.message)
      return response.status(error.statusCode || 500).json({
        message: error.statusCode ? error.message : 'Unable to record the sale.',
      })
    }
  }
}

export default new SalesController()
