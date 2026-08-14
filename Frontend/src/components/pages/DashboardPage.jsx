import { AlertOutlined, AppstoreOutlined, BoxPlotOutlined } from '@ant-design/icons'
import { Card, Statistic, Typography } from 'antd'

const { Text } = Typography

function MetricCard({ title, value, icon, iconClass }) {
  return (
    <Card className="metric-card" bordered={false}>
      <div className="metric-heading"><Text className="metric-title">{title}</Text><span className={`metric-icon ${iconClass}`}>{icon}</span></div>
      <Statistic value={value} valueStyle={{ fontSize: 28, fontWeight: 700, color: '#18243a' }} />
    </Card>
  )
}

export default function DashboardPage({ products }) {
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5).length
  const outOfStock = products.filter((product) => product.stock === 0).length

  return (
    <section className="metric-grid">
      <MetricCard title="TOTAL PRODUCTS" value={products.length} icon={<BoxPlotOutlined />} iconClass="blue" />
      <MetricCard title="LOW STOCK ITEMS" value={lowStock} icon={<AlertOutlined />} iconClass="orange" />
      <MetricCard title="OUT OF STOCK" value={outOfStock} icon={<AppstoreOutlined />} iconClass="red" />
    </section>
  )
}
