import { sql, poolPromise } from '../config/database.js'

class ProductModel {
  async findAll() {
    const pool = await poolPromise
    const result = await pool.request().query(`
      SELECT
        ProductId AS id,
        ProductName AS name,
        SKU AS sku,
        UnitPrice AS price,
        StockQuantity AS stock
      FROM dbo.Products
      WHERE IsActive = 1
      ORDER BY ProductId DESC
    `)

    return result.recordset
  }

  async findById(id) {
    const pool = await poolPromise
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        SELECT
          ProductId AS id,
          ProductName AS name,
          SKU AS sku,
          UnitPrice AS price,
          StockQuantity AS stock
        FROM dbo.Products
        WHERE ProductId = @id AND IsActive = 1
      `)

    return result.recordset[0] || null
  }

  async findLowStock() {
    const pool = await poolPromise
    const result = await pool.request().query(`
      SELECT
        ProductId AS id,
        ProductName AS name,
        SKU AS sku,
        UnitPrice AS price,
        StockQuantity AS stock,
        CASE
          WHEN StockQuantity = 0 THEN 'Out of stock'
          ELSE 'Low stock'
        END AS status
      FROM dbo.Products
      WHERE IsActive = 1 AND StockQuantity <= 5
      ORDER BY StockQuantity ASC, ProductName ASC
    `)

    return result.recordset
  }

  async create({ name, sku, price, stock }) {
    const pool = await poolPromise
    const result = await pool
      .request()
      .input('name', sql.NVarChar(150), name)
      .input('sku', sql.NVarChar(50), sku)
      .input('price', sql.Decimal(18, 2), price)
      .input('stock', sql.Int, stock)
      .query(`
        INSERT INTO dbo.Products (ProductName, SKU, UnitPrice, StockQuantity)
        OUTPUT
          INSERTED.ProductId AS id,
          INSERTED.ProductName AS name,
          INSERTED.SKU AS sku,
          INSERTED.UnitPrice AS price,
          INSERTED.StockQuantity AS stock
        VALUES (@name, @sku, @price, @stock)
      `)

    return result.recordset[0]
  }

  async update(id, { name, sku, price, stock }) {
    const pool = await poolPromise
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .input('name', sql.NVarChar(150), name)
      .input('sku', sql.NVarChar(50), sku)
      .input('price', sql.Decimal(18, 2), price)
      .input('stock', sql.Int, stock)
      .query(`
        UPDATE dbo.Products
        SET
          ProductName = @name,
          SKU = @sku,
          UnitPrice = @price,
          StockQuantity = @stock,
          UpdatedAt = SYSDATETIME()
        OUTPUT
          INSERTED.ProductId AS id,
          INSERTED.ProductName AS name,
          INSERTED.SKU AS sku,
          INSERTED.UnitPrice AS price,
          INSERTED.StockQuantity AS stock
        WHERE ProductId = @id AND IsActive = 1
      `)

    return result.recordset[0] || null
  }

  async delete(id) {
    const pool = await poolPromise
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query(`
        UPDATE dbo.Products
        SET IsActive = 0, UpdatedAt = SYSDATETIME()
        WHERE ProductId = @id AND IsActive = 1
      `)

    return result.rowsAffected[0] > 0
  }
}

export default new ProductModel()
