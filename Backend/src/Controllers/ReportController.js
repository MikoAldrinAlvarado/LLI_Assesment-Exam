import ReportModel from '../Models/ReportModel.js'

class ReportController {
  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  getWeekDates(startDateQuery) {
    const endDate = new Date()
    endDate.setHours(0, 0, 0, 0)

    const startDate = startDateQuery ? new Date(`${startDateQuery}T00:00:00`) : new Date(endDate)

    if (Number.isNaN(startDate.getTime())) {
      return null
    }

    if (!startDateQuery) {
      startDate.setDate(endDate.getDate() - 6)
    }

    const selectedEndDate = new Date(startDate)
    selectedEndDate.setDate(startDate.getDate() + 6)

    return { startDate, endDate: startDateQuery ? selectedEndDate : endDate }
  }

  async getWeeklySales(request, response) {
    try {
      const dates = this.getWeekDates(request.query.startDate)

      if (!dates) {
        return response.status(400).json({ message: 'startDate must use the YYYY-MM-DD format.' })
      }

      const dailySales = await ReportModel.getWeeklySales(dates.startDate, dates.endDate)
      const summary = dailySales.reduce((totals, sale) => ({
        totalOrders: totals.totalOrders + sale.orders,
        unitsSold: totals.unitsSold + sale.unitsSold,
        revenue: totals.revenue + Number(sale.revenue),
      }), { totalOrders: 0, unitsSold: 0, revenue: 0 })

      return response.status(200).json({
        startDate: this.formatDate(dates.startDate),
        endDate: this.formatDate(dates.endDate),
        summary: {
          ...summary,
          averageDailyRevenue: Math.round(summary.revenue / 7),
        },
        dailySales,
      })
    } catch (error) {
      console.error('Get weekly sales report error:', error.message)
      return response.status(500).json({ message: 'Unable to retrieve the weekly sales report.' })
    }
  }
}

export default new ReportController()
