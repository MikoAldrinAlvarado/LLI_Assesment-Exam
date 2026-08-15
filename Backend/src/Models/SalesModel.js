import { sql, poolPromise } from '../config/database.js'

class SalesModel {
  async createSale(items, userId) {
    const pool = await poolPromise
    const transaction = new sql.Transaction(pool)

    try {
      await transaction.begin()

      const saleResult = await new sql.Request(transaction)
        .input('userId', sql.Int, userId)
        .query(`
          INSERT INTO dbo.Sales (CreatedByUserId)
          OUTPUT INSERTED.SaleId AS id, INSERTED.SaleDate AS saleDate
          VALUES (@userId)
        `)

      const sale = saleResult.recordset[0]
      let totalAmount = 0
      const saleItems = []

      for (const item of items) {
        const productResult = await new sql.Request(transaction)
          .input('productId', sql.Int, item.productId)
          .query(`
            SELECT ProductId, ProductName, UnitPrice, StockQuantity
            FROM dbo.Products WITH (UPDLOCK, ROWLOCK)
            WHERE ProductId = @productId AND IsActive = 1
          `)

        const product = productResult.recordset[0]

        if (!product) {
          const error = new Error(`Product ID ${item.productId} was not found.`)
          error.statusCode = 404
          throw error
        }

        if (product.StockQuantity < item.quantity) {
          const error = new Error(`Insufficient stock for ${product.ProductName}.`)
          error.statusCode = 400
          throw error
        }

        const lineTotal = Number(product.UnitPrice) * item.quantity
        totalAmount += lineTotal

        await new sql.Request(transaction)
          .input('saleId', sql.Int, sale.id)
          .input('productId', sql.Int, product.ProductId)
          .input('quantity', sql.Int, item.quantity)
          .input('unitPrice', sql.Decimal(18, 2), product.UnitPrice)
          .query(`
            INSERT INTO dbo.SaleItems (SaleId, ProductId, Quantity, UnitPrice)
            VALUES (@saleId, @productId, @quantity, @unitPrice)
          `)

        await new sql.Request(transaction)
          .input('productId', sql.Int, product.ProductId)
          .input('quantity', sql.Int, item.quantity)
          .query(`
            UPDATE dbo.Products
            SET StockQuantity = StockQuantity - @quantity, UpdatedAt = SYSDATETIME()
            WHERE ProductId = @productId
          `)

        saleItems.push({
          productId: product.ProductId,
          productName: product.ProductName,
          quantity: item.quantity,
          unitPrice: Number(product.UnitPrice),
          lineTotal,
        })
      }

      await new sql.Request(transaction)
        .input('saleId', sql.Int, sale.id)
        .input('totalAmount', sql.Decimal(18, 2), totalAmount)
        .query('UPDATE dbo.Sales SET TotalAmount = @totalAmount WHERE SaleId = @saleId')

      await transaction.commit()

      return { ...sale, totalAmount, items: saleItems }
    } catch (error) {
      try {
        await transaction.rollback()
      } catch {
        // The transaction may already have been rolled back by MSSQL.
      }

      throw error
    }
  }
}

export default new SalesModel()
