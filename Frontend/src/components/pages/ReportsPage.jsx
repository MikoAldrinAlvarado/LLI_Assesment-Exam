import { DownloadOutlined, RiseOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Card, Statistic, Table, Typography } from 'antd'
import '../../styles/Reports.css'
import { weeklySales } from '../../data/salesData.js'

const { Text } = Typography

export default function ReportsPage() {
  const weeklyRevenue = weeklySales.reduce((total, sale) => total + sale.revenue, 0)
  const weeklyOrders = weeklySales.reduce((total, sale) => total + sale.orders, 0)
  const weeklyUnits = weeklySales.reduce((total, sale) => total + sale.unitsSold, 0)
  const averageDailyRevenue = Math.round(weeklyRevenue / weeklySales.length)
  const highestRevenue = Math.max(...weeklySales.map((sale) => sale.revenue))

  const downloadReport = () => {
    const reportText = [
      'STOCKWISE SALES AND REVENUE REPORT',
      'Week: August 10–16, 2026',
      `Generated: ${new Date().toLocaleString('en-PH')}`,
      '',
      'WEEKLY SUMMARY',
      `Weekly revenue: PHP ${weeklyRevenue.toLocaleString()}`,
      `Total orders: ${weeklyOrders}`,
      `Units sold: ${weeklyUnits}`,
      `Average daily revenue: PHP ${averageDailyRevenue.toLocaleString()}`,
      '',
      'DAILY SALES BREAKDOWN',
      ...weeklySales.map((sale) => `${sale.day} (${sale.date}) | Orders: ${sale.orders} | Units sold: ${sale.unitsSold} | Revenue: PHP ${sale.revenue.toLocaleString()}`),
    ].join('\n')
    const reportFile = new Blob([reportText], { type: 'text/plain;charset=utf-8' })
    const fileUrl = URL.createObjectURL(reportFile)
    const downloadLink = document.createElement('a')
    downloadLink.href = fileUrl
    downloadLink.download = 'stockwise-weekly-sales-report.txt'
    downloadLink.click()
    URL.revokeObjectURL(fileUrl)
  }

  const columns = [
    { title: 'DAY', dataIndex: 'day', render: (day, sale) => <div><Text strong>{day}</Text><div className="report-date">{sale.date}</div></div> },
    { title: 'ORDERS', dataIndex: 'orders' },
    { title: 'UNITS SOLD', dataIndex: 'unitsSold' },
    { title: 'REVENUE', dataIndex: 'revenue', render: (revenue) => <Text strong>₱{revenue.toLocaleString()}</Text> },
  ]

  return (
    <section className="reports-page">
      <div className="reports-intro"><div><Text className="eyebrow">SALES PERFORMANCE</Text><Text type="secondary" className="reports-description">Daily and weekly sales revenue overview.</Text></div><Button type="primary" size="large" icon={<DownloadOutlined />} onClick={downloadReport}>Download TXT report</Button></div>
      <div className="report-summary-grid">
        <Card className="report-summary-card revenue"><Statistic title="Weekly revenue" value={weeklyRevenue} prefix="₱" /></Card>
        <Card className="report-summary-card"><Statistic title="Total orders" value={weeklyOrders} prefix={<ShoppingCartOutlined />} /></Card>
        <Card className="report-summary-card"><Statistic title="Units sold" value={weeklyUnits} /></Card>
        <Card className="report-summary-card"><Statistic title="Average daily revenue" value={averageDailyRevenue} prefix="₱" /></Card>
      </div>
      <Card className="weekly-report-card" title={<div><Text strong>Weekly revenue</Text><div className="card-subtitle">August 10–16, 2026</div></div>} extra={<Text className="best-day"><RiseOutlined /> Highest: ₱{highestRevenue.toLocaleString()}</Text>}>
        <div className="revenue-chart">
          {weeklySales.map((sale) => <div className="revenue-bar-group" key={sale.key}><div className="revenue-value">₱{(sale.revenue / 1000).toFixed(1)}k</div><div className="revenue-bar-track"><span className="revenue-bar" style={{ height: `${Math.round((sale.revenue / highestRevenue) * 100)}%` }} /></div><Text>{sale.day.slice(0, 3)}</Text></div>)}
        </div>
      </Card>
      <Card className="report-table-card" title={<div><Text strong>Daily sales report</Text><div className="card-subtitle">Orders, units sold, and revenue per day</div></div>}>
        <Table columns={columns} dataSource={weeklySales} pagination={false} />
      </Card>
    </section>
  )
}
