import {
  BellOutlined,
  BoxPlotOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Badge, ConfigProvider, Layout, Menu, Space, Typography } from 'antd'
import '../../styles/Dashboard.css'

const { Header, Content, Sider } = Layout
const { Text, Title } = Typography

const pageTitles = { dashboard: 'Dashboard', products: 'Products', reports: 'Reports' }

export default function AppLayout({ activePage, onNavigate, children }) {
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
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[activePage]}
            items={menuItems}
            onClick={({ key }) => { if (key === 'dashboard' || key === 'products') onNavigate(key) }}
          />
        </Sider>
        <Layout>
          <Header className="topbar">
            <MenuFoldOutlined className="mobile-menu" />
            <Title level={2} className="header-title">{pageTitles[activePage] || 'Dashboard'}</Title>
            <div className="topbar-spacer" />
            <Space size={18} className="topbar-actions"><Badge dot><BellOutlined className="notification" /></Badge><span className="topbar-divider" /><Avatar size={36} icon={<UserOutlined />} /><div className="profile-copy"><Text strong>Alex Morgan</Text><br /><Text>Administrator</Text></div></Space>
          </Header>
          <Content className="dashboard-content">{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
