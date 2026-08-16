import { DownloadOutlined, RiseOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Spin, Statistic, Table, Typography } from 'antd'
import { useEffect, useState } from 'react'
import '../../styles/Reports.css'
import { getWeeklySalesReport } from '../../services/reportService.js'

const { Text } = Typography

function formatDate(date) {
  return new Date(`${String(date).slice(0, 10)}T00:00:00`)
}

export default function ReportsPage() {
  const [report, setReport] = useState({ summary: { revenue: 0, totalOrders: 0, unitsSold: 0, averageDailyRevenue: 0 }, dailySales: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    getWeeklySalesReport()
      .then((data) => {
        if (isCurrent) {
          setReport(data)
          setError('')
        }
      })
      .catch((requestError) => {
        if (isCurrent) {
          setError(requestError.message)
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [])

  const highestRevenue = Math.max(1, ...report.dailySales.map((sale) => Number(sale.revenue)))

  const downloadReport = () => {
    const reportText = [
      'STOCKWISE SALES AND REVENUE REPORT',
      `Week: ${report.startDate} to ${report.endDate}`,
      `Generated: ${new Date().toLocaleString('en-PH')}`,
      '',
      'WEEKLY SUMMARY',
      `Weekly revenue: PHP ${Number(report.summary.revenue).toLocaleString()}`,
      `Total orders: ${report.summary.totalOrders}`,
      `Units sold: ${report.summary.unitsSold}`,
      `Average daily revenue: PHP ${Number(report.summary.averageDailyRevenue).toLocaleString()}`,
      '',
      'DAILY SALES BREAKDOWN',
      ...report.dailySales.map((sale) => `${formatDate(sale.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | Orders: ${sale.orders} | Units sold: ${sale.unitsSold} | Revenue: PHP ${Number(sale.revenue).toLocaleString()}`),
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
    { title: 'DAY', dataIndex: 'date', render: (date) => <div><Text strong>{formatDate(date).toLocaleDateString('en-US', { weekday: 'long' })}</Text><div className="report-date">{formatDate(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div></div> },
    { title: 'ORDERS', dataIndex: 'orders' },
    { title: 'UNITS SOLD', dataIndex: 'unitsSold' },
    { title: 'REVENUE', dataIndex: 'revenue', render: (revenue) => <Text strong>₱{Number(revenue).toLocaleString()}</Text> },
  ]

  return (
    <section className="reports-page">
      <div className="reports-intro"><div><Text className="eyebrow">SALES PERFORMANCE</Text><Text type="secondary" className="reports-description">Daily and weekly sales revenue overview.</Text></div><Button className="generate-report-button" size="large" icon={<DownloadOutlined />} onClick={downloadReport} disabled={isLoading || Boolean(error)}>Generate report</Button></div>
      {error && <Alert className="reports-error" message={error} type="error" showIcon />}
      {isLoading ? <div className="reports-loading"><Spin size="large" /></div> : <>
        <div className="report-summary-grid">
          <Card className="report-summary-card revenue"><Statistic title="Weekly revenue" value={Number(report.summary.revenue)} prefix="₱" /></Card>
          <Card className="report-summary-card"><Statistic title="Total orders" value={report.summary.totalOrders} prefix={<ShoppingCartOutlined />} /></Card>
          <Card className="report-summary-card"><Statistic title="Units sold" value={report.summary.unitsSold} /></Card>
          <Card className="report-summary-card"><Statistic title="Average daily revenue" value={Number(report.summary.averageDailyRevenue)} prefix="₱" /></Card>
        </div>
        <Card className="weekly-report-card" title={<div><Text strong>Weekly revenue</Text><div className="card-subtitle">{report.startDate} to {report.endDate}</div></div>} extra={<Text className="best-day"><RiseOutlined /> Highest: ₱{highestRevenue.toLocaleString()}</Text>}>
          <div className="revenue-chart">{report.dailySales.map((sale) => <div className="revenue-bar-group" key={sale.date}><div className="revenue-value">₱{(Number(sale.revenue) / 1000).toFixed(1)}k</div><div className="revenue-bar-track"><span className="revenue-bar" style={{ height: `${Math.round((Number(sale.revenue) / highestRevenue) * 100)}%` }} /></div><Text>{formatDate(sale.date).toLocaleDateString('en-US', { weekday: 'short' })}</Text></div>)}</div>
        </Card>
        <Card className="report-table-card" title={<div><Text strong>Daily sales report</Text><div className="card-subtitle">Orders, units sold, and revenue per day</div></div>}>
          <Table columns={columns} dataSource={report.dailySales} rowKey="date" pagination={false} />
        </Card>
      </>}
    </section>
  )
}
