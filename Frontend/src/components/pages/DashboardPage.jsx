import { AlertOutlined, AppstoreOutlined, BoxPlotOutlined, RiseOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Card, Progress, Statistic, Table, Tag, Typography } from 'antd'
import { weeklySales } from '../../data/salesData.js'

const { Text } = Typography

function MetricCard({ title, value, icon, iconClass }) {
  return (
    <Card className="metric-card" bordered={false}>
      <div className="metric-heading"><Text className="metric-title">{title}</Text><span className={`metric-icon ${iconClass}`}>{icon}</span></div>
      <Statistic value={value} valueStyle={{ fontSize: 28, fontWeight: 700, color: '#18243a' }} />
    </Card>
  )
}

function getStockStatus(stock) {
  if (stock === 0) return { label: 'Out of stock', color: 'red' }
  if (stock <= 5) return { label: 'Low stock', color: 'orange' }
  return { label: 'In stock', color: 'green' }
}

export default function DashboardPage({ products }) {
  const totalUnits = products.reduce((total, product) => total + product.stock, 0)
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5).length
  const outOfStock = products.filter((product) => product.stock === 0).length
  const attentionProducts = products.filter((product) => product.stock <= 5)
  const weeklyRevenue = weeklySales.reduce((total, sale) => total + sale.revenue, 0)
  const weeklyOrders = weeklySales.reduce((total, sale) => total + sale.orders, 0)
  const highestRevenue = Math.max(...weeklySales.map((sale) => sale.revenue))
  const stockHealth = products.length ? Math.round(((products.length - outOfStock) / products.length) * 100) : 0

  const attentionColumns = [
    { title: 'PRODUCT', dataIndex: 'name', render: (name, product) => <div><Text strong>{name}</Text><div className="dashboard-sku">SKU: {product.sku}</div></div> },
    { title: 'STOCK', dataIndex: 'stock', render: (stock) => `${stock} units` },
    { title: 'STATUS', dataIndex: 'stock', render: (stock) => { const status = getStockStatus(stock); return <Tag color={status.color}>{status.label}</Tag> } },
  ]

  return (
    <section className="dashboard-page">
      <div className="dashboard-welcome"><div><Text className="eyebrow">INVENTORY OVERVIEW</Text><h1>Welcome back, Alex</h1><Text type="secondary">Here is the latest update on your stock and sales performance.</Text></div></div>
      <section className="metric-grid dashboard-metric-grid">
        <MetricCard title="TOTAL PRODUCTS" value={products.length} icon={<BoxPlotOutlined />} iconClass="blue" />
        <MetricCard title="TOTAL UNITS IN STOCK" value={totalUnits} icon={<ShoppingCartOutlined />} iconClass="purple" />
        <MetricCard title="LOW STOCK ITEMS" value={lowStock} icon={<AlertOutlined />} iconClass="orange" />
        <MetricCard title="OUT OF STOCK" value={outOfStock} icon={<AppstoreOutlined />} iconClass="red" />
      </section>
      <section className="dashboard-details-grid">
        <Card className="dashboard-revenue-card" title={<div><Text strong>Weekly sales revenue</Text><div className="card-subtitle">August 10–16, 2026</div></div>} extra={<Text className="revenue-total"><RiseOutlined /> ₱{weeklyRevenue.toLocaleString()}</Text>}>
          <div className="dashboard-sales-summary"><span><strong>{weeklyOrders}</strong> orders this week</span><span><strong>₱{Math.round(weeklyRevenue / weeklySales.length).toLocaleString()}</strong> average daily revenue</span></div>
          <div className="dashboard-revenue-chart">{weeklySales.map((sale) => <div className="dashboard-bar-group" key={sale.key}><div className="dashboard-bar-track"><span style={{ height: `${Math.round((sale.revenue / highestRevenue) * 100)}%` }} /></div><Text>{sale.day.slice(0, 3)}</Text></div>)}</div>
        </Card>
        <Card className="stock-health-card" title={<div><Text strong>Inventory health</Text><div className="card-subtitle">Current availability status</div></div>}>
          <div className="stock-health-score"><Progress type="circle" percent={stockHealth} strokeColor="#4263eb" trailColor="#edf0f7" format={(percent) => <span>{percent}%<small>available</small></span>} /></div>
          <div className="stock-health-list"><span>In stock <b>{products.length - lowStock - outOfStock}</b></span><span>Low stock <b>{lowStock}</b></span><span>Out of stock <b>{outOfStock}</b></span></div>
        </Card>
      </section>
      <Card className="attention-card" title={<div><Text strong>Products needing attention</Text><div className="card-subtitle">Low-stock and out-of-stock products</div></div>}>
        <Table columns={attentionColumns} dataSource={attentionProducts} rowKey="id" pagination={false} locale={{ emptyText: 'All products have sufficient stock.' }} />
      </Card>
    </section>
  )
}
