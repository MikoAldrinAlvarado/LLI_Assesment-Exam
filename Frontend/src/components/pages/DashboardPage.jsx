import { AlertOutlined, AppstoreOutlined, BoxPlotOutlined, RiseOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Alert, Card, Progress, Spin, Statistic, Table, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { getDashboardSummary, getLowStockProducts } from '../../services/dashboardService.js'
import { getWeeklySalesReport } from '../../services/reportService.js'

const { Text } = Typography

function MetricCard({ title, value, icon, iconClass }) {
  return (
    <Card className="metric-card" variant="borderless">
      <div className="metric-heading"><Text className="metric-title">{title}</Text><span className={`metric-icon ${iconClass}`}>{icon}</span></div>
      <Statistic value={value} styles={{ content: { fontSize: 28, fontWeight: 700, color: '#18243a' } }} />
    </Card>
  )
}

function getStockStatus(stock) {
  if (stock === 0) return { label: 'Out of stock', color: 'red' }
  return { label: 'Low stock', color: 'orange' }
}

export default function DashboardPage() {
  const [summary, setSummary] = useState({ totalProducts: 0, totalUnitsInStock: 0, lowStockItems: 0, outOfStockItems: 0 })
  const [attentionProducts, setAttentionProducts] = useState([])
  const [weeklyReport, setWeeklyReport] = useState({ summary: { revenue: 0, totalOrders: 0, averageDailyRevenue: 0 }, dailySales: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    Promise.all([getDashboardSummary(), getLowStockProducts(), getWeeklySalesReport()])
      .then(([summaryData, lowStockData, reportData]) => {
        if (isCurrent) {
          setSummary(summaryData)
          setAttentionProducts(lowStockData)
          setWeeklyReport(reportData)
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

  const highestRevenue = Math.max(1, ...weeklyReport.dailySales.map((sale) => Number(sale.revenue)))
  const inStockProducts = summary.totalProducts - summary.lowStockItems - summary.outOfStockItems
  const stockHealth = summary.totalProducts
    ? Math.round(((summary.totalProducts - summary.outOfStockItems) / summary.totalProducts) * 100)
    : 0

  const attentionColumns = [
    { title: 'PRODUCT', dataIndex: 'name', render: (name, product) => <div><Text strong>{name}</Text><div className="dashboard-sku">SKU: {product.sku}</div></div> },
    { title: 'STOCK', dataIndex: 'stock', render: (stock) => `${stock} units` },
    { title: 'STATUS', dataIndex: 'stock', render: (stock) => { const status = getStockStatus(stock); return <Tag color={status.color}>{status.label}</Tag> } },
  ]

  return (
    <section className="dashboard-page">
      <div className="dashboard-welcome"><div><Text className="eyebrow">INVENTORY OVERVIEW</Text><h1>Welcome back, Admin</h1><Text type="secondary">Here is the latest update on your stock and sales performance.</Text></div></div>
      {error && <Alert className="dashboard-error" message={error} type="error" showIcon />}
      {isLoading ? <div className="dashboard-loading"><Spin size="large" /></div> : <>
        <section className="metric-grid dashboard-metric-grid">
          <MetricCard title="TOTAL PRODUCTS" value={summary.totalProducts} icon={<BoxPlotOutlined />} iconClass="blue" />
          <MetricCard title="TOTAL UNITS IN STOCK" value={summary.totalUnitsInStock} icon={<ShoppingCartOutlined />} iconClass="purple" />
          <MetricCard title="LOW STOCK ITEMS" value={summary.lowStockItems} icon={<AlertOutlined />} iconClass="orange" />
          <MetricCard title="OUT OF STOCK" value={summary.outOfStockItems} icon={<AppstoreOutlined />} iconClass="red" />
        </section>
        <section className="dashboard-details-grid">
          <Card className="dashboard-revenue-card" title={<div><Text strong>Weekly sales revenue</Text><div className="card-subtitle">{weeklyReport.startDate} to {weeklyReport.endDate}</div></div>} extra={<Text className="revenue-total"><RiseOutlined /> ₱{Number(weeklyReport.summary.revenue).toLocaleString()}</Text>}>
            <div className="dashboard-sales-summary"><span><strong>{weeklyReport.summary.totalOrders}</strong> orders this week</span><span><strong>₱{Number(weeklyReport.summary.averageDailyRevenue).toLocaleString()}</strong> average daily revenue</span></div>
            <div className="dashboard-revenue-chart">{weeklyReport.dailySales.map((sale) => <div className="dashboard-bar-group" key={sale.date}><div className="dashboard-bar-track"><span style={{ height: `${Math.round((Number(sale.revenue) / highestRevenue) * 100)}%` }} /></div><Text>{new Date(`${String(sale.date).slice(0, 10)}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' })}</Text></div>)}</div>
          </Card>
          <Card className="stock-health-card" title={<div><Text strong>Inventory health</Text><div className="card-subtitle">Current availability status</div></div>}>
            <div className="stock-health-score"><Progress type="circle" percent={stockHealth} strokeColor="#4263eb" railColor="#edf0f7" format={(percent) => <span>{percent}%<small>available</small></span>} /></div>
            <div className="stock-health-list"><span>In stock <b>{inStockProducts}</b></span><span>Low stock <b>{summary.lowStockItems}</b></span><span>Out of stock <b>{summary.outOfStockItems}</b></span></div>
          </Card>
        </section>
        <Card className="attention-card" title={<div><Text strong>Products needing attention</Text><div className="card-subtitle">Low-stock and out-of-stock products</div></div>}>
          <Table columns={attentionColumns} dataSource={attentionProducts} rowKey="id" pagination={false} locale={{ emptyText: 'All products have sufficient stock.' }} />
        </Card>
      </>}
    </section>
  )
}
