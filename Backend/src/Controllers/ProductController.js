import ProductModel from '../Models/ProductModel.js'

class ProductController {
  validateProductInput(body) {
    const name = body.name?.trim()
    const sku = body.sku?.trim()
    const price = Number(body.price)
    const stock = Number(body.stock)

    if (!name || !sku || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      return null
    }

    return { name, sku, price, stock }
  }

  async getAll(request, response) {
    try {
      const products = await ProductModel.findAll()
      return response.status(200).json(products)
    } catch (error) {
      console.error('Get products error:', error.message)
      return response.status(500).json({ message: 'Unable to retrieve products.' })
    }
  }

  async getById(request, response) {
    try {
      const id = Number(request.params.id)

      if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ message: 'A valid product ID is required.' })
      }

      const product = await ProductModel.findById(id)

      if (!product) {
        return response.status(404).json({ message: 'Product not found.' })
      }

      return response.status(200).json(product)
    } catch (error) {
      console.error('Get product error:', error.message)
      return response.status(500).json({ message: 'Unable to retrieve the product.' })
    }
  }

  async getLowStock(request, response) {
    try {
      const products = await ProductModel.findLowStock()
      return response.status(200).json(products)
    } catch (error) {
      console.error('Get low-stock products error:', error.message)
      return response.status(500).json({ message: 'Unable to retrieve low-stock products.' })
    }
  }

  async create(request, response) {
    try {
      const productInput = this.validateProductInput(request.body)

      if (!productInput) {
        return response.status(400).json({ message: 'Name, SKU, non-negative price, and whole-number stock are required.' })
      }

      const product = await ProductModel.create(productInput)
      return response.status(201).json({ message: 'Product created successfully.', product })
    } catch (error) {
      console.error('Create product error:', error.message)

      if (error.number === 2601 || error.number === 2627) {
        return response.status(409).json({ message: 'A product with this SKU already exists.' })
      }

      return response.status(500).json({ message: 'Unable to create the product.' })
    }
  }

  async update(request, response) {
    try {
      const id = Number(request.params.id)
      const productInput = this.validateProductInput(request.body)

      if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ message: 'A valid product ID is required.' })
      }

      if (!productInput) {
        return response.status(400).json({ message: 'Name, SKU, non-negative price, and whole-number stock are required.' })
      }

      const product = await ProductModel.update(id, productInput)

      if (!product) {
        return response.status(404).json({ message: 'Product not found.' })
      }

      return response.status(200).json({ message: 'Product updated successfully.', product })
    } catch (error) {
      console.error('Update product error:', error.message)

      if (error.number === 2601 || error.number === 2627) {
        return response.status(409).json({ message: 'A product with this SKU already exists.' })
      }

      return response.status(500).json({ message: 'Unable to update the product.' })
    }
  }

  async delete(request, response) {
    try {
      const id = Number(request.params.id)

      if (!Number.isInteger(id) || id <= 0) {
        return response.status(400).json({ message: 'A valid product ID is required.' })
      }

      const wasDeleted = await ProductModel.delete(id)

      if (!wasDeleted) {
        return response.status(404).json({ message: 'Product not found.' })
      }

      return response.status(200).json({ message: 'Product deleted successfully.' })
    } catch (error) {
      console.error('Delete product error:', error.message)
      return response.status(500).json({ message: 'Unable to delete the product.' })
    }
  }
}

export default new ProductController()
