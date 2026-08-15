import DashboardModel from '../Models/DashboardModel.js'

class DashboardController {
  async getSummary(request, response) {
    try {
      const summary = await DashboardModel.getSummary()
      return response.status(200).json(summary)
    } catch (error) {
      console.error('Get dashboard summary error:', error.message)
      return response.status(500).json({ message: 'Unable to retrieve dashboard summary.' })
    }
  }
}

export default new DashboardController()
