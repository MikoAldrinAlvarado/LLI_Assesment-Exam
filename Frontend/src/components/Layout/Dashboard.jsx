import {
  AlertOutlined,
  AppstoreOutlined,
  BellOutlined,
  BoxPlotOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Badge,
  Card,
  ConfigProvider,
  Layout,
  Menu,
  Space,
  Statistic,
  Typography,
} from 'antd'
import '../../styles/Dashboard.css'

const { Header, Content, Sider } = Layout
const { Text, Title } = Typography

function MetricCard({ title, value, icon, iconClass }) {
  return (
    <Card className="metric-card" bordered={false}>
      <div className="metric-heading">
        <Text className="metric-title">{title}</Text>
        <span className={`metric-icon ${iconClass}`}>{icon}</span>
      </div>
      <Statistic value={value} valueStyle={{ fontSize: 28, fontWeight: 700, color: '#18243a' }} />
    </Card>
  )
}

export default function Dashboard() {
  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'products', icon: <BoxPlotOutlined />, label: 'Products' },
    { type: 'divider' },
    { key: 'reports', icon: <FileTextOutlined />, label: 'Reports' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout' },
  ]

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4263eb', borderRadius: 10, colorBgLayout: '#f6f8fb' } }}>
      <Layout className="dashboard-shell">
        <Sider breakpoint="lg" collapsedWidth="0" width={248} className="dashboard-sider">
          <div className="brand"><span className="brand-mark"><BoxPlotOutlined /></span><span>Stockwise</span></div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['dashboard']} items={menuItems} />
        </Sider>
        <Layout>
          <Header className="topbar">
            <MenuFoldOutlined className="mobile-menu" />
            <Title level={2} className="header-title">Dashboard</Title>
            <div className="topbar-spacer" />
            <Space size={18} className="topbar-actions"><Badge dot><BellOutlined className="notification" /></Badge><span className="topbar-divider" /><Avatar size={36} icon={<UserOutlined />} /><div className="profile-copy"><Text strong>Alex Morgan</Text><br /><Text>Administrator</Text></div></Space>
          </Header>
          <Content className="dashboard-content">
            <section className="metric-grid">
              <MetricCard title="TOTAL PRODUCTS" value={0} icon={<BoxPlotOutlined />} iconClass="blue" />
              <MetricCard title="LOW STOCK ITEMS" value={0} icon={<AlertOutlined />} iconClass="orange" />
              <MetricCard title="OUT OF STOCK" value={0} icon={<AppstoreOutlined />} iconClass="red" />
            </section>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
