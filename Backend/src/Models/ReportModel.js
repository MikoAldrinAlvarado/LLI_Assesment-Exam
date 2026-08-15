import { sql, poolPromise } from '../config/database.js'

class ReportModel {
  async getWeeklySales(startDate, endDate) {
    const pool = await poolPromise
    const result = await pool
      .request()
      .input('startDate', sql.Date, startDate)
      .input('endDate', sql.Date, endDate)
      .query(`
        WITH DateRange AS (
          SELECT @startDate AS SaleDay
          UNION ALL
          SELECT DATEADD(DAY, 1, SaleDay)
          FROM DateRange
          WHERE SaleDay < @endDate
        ),
        SalesSummary AS (
          SELECT
            CAST(SaleDate AS DATE) AS SaleDay,
            COUNT(*) AS totalOrders,
            COALESCE(SUM(TotalAmount), 0) AS revenue
          FROM dbo.Sales
          WHERE Status = 'Completed'
            AND SaleDate >= @startDate
            AND SaleDate < DATEADD(DAY, 1, @endDate)
          GROUP BY CAST(SaleDate AS DATE)
        ),
        UnitsSummary AS (
          SELECT
            CAST(s.SaleDate AS DATE) AS SaleDay,
            COALESCE(SUM(si.Quantity), 0) AS unitsSold
          FROM dbo.Sales s
          INNER JOIN dbo.SaleItems si ON si.SaleId = s.SaleId
          WHERE s.Status = 'Completed'
            AND s.SaleDate >= @startDate
            AND s.SaleDate < DATEADD(DAY, 1, @endDate)
          GROUP BY CAST(s.SaleDate AS DATE)
        )
        SELECT
          d.SaleDay AS date,
          COALESCE(s.totalOrders, 0) AS orders,
          COALESCE(u.unitsSold, 0) AS unitsSold,
          COALESCE(s.revenue, 0) AS revenue
        FROM DateRange d
        LEFT JOIN SalesSummary s ON s.SaleDay = d.SaleDay
        LEFT JOIN UnitsSummary u ON u.SaleDay = d.SaleDay
        ORDER BY d.SaleDay
        OPTION (MAXRECURSION 7)
      `)

    return result.recordset
  }
}

export default new ReportModel()
