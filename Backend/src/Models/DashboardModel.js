import { poolPromise } from '../config/database.js'

class DashboardModel {
  async getSummary() {
    const pool = await poolPromise
    const result = await pool.request().query(`
      SELECT
        COUNT(*) AS totalProducts,
        COALESCE(SUM(StockQuantity), 0) AS totalUnitsInStock,
        SUM(CASE WHEN StockQuantity > 0 AND StockQuantity <= 5 THEN 1 ELSE 0 END) AS lowStockItems,
        SUM(CASE WHEN StockQuantity = 0 THEN 1 ELSE 0 END) AS outOfStockItems
      FROM dbo.Products
      WHERE IsActive = 1
    `)

    return result.recordset[0]
  }
}

export default new DashboardModel()
