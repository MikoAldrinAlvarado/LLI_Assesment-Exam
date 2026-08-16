import {
  BoxPlotOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, ConfigProvider, Drawer, Layout, Menu, notification, Space, Typography } from 'antd'
import { useState } from 'react'
import '../../styles/Dashboard.css'

const { Header, Content, Sider } = Layout
const { Text, Title } = Typography

const pageTitles = { dashboard: 'Dashboard', products: 'Products', reports: 'Reports' }

export default function AppLayout({ activePage, onNavigate, onLogout, children }) {
  const [notificationApi, notificationContext] = notification.useNotification()
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)

  const showLogoutConfirmation = () => {
    notificationApi.open({
      key: 'logout-confirmation',
      title: 'Are you sure you want to log out?',
      description: 'Your current session will be ended.',
      placement: 'topRight',
      duration: 0,
      actions: <Space><Button danger onClick={() => { notificationApi.destroy('logout-confirmation'); onLogout() }}>Yes</Button><Button onClick={() => notificationApi.destroy('logout-confirmation')}>No</Button></Space>,
    })
  }

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'products', icon: <BoxPlotOutlined />, label: 'Products' },
    { type: 'divider' },
    { key: 'reports', icon: <FileTextOutlined />, label: 'Reports' },
  ]

  const handleNavigation = (key) => {
    if (key === 'dashboard' || key === 'products' || key === 'reports') {
      onNavigate(key)
      setIsNavigationOpen(false)
    }
  }

  const navigationContent = (
    <>
      <div className="brand"><span className="brand-mark"><BoxPlotOutlined /></span><span>Stockwise</span></div>
      <Menu theme="dark" mode="inline" selectedKeys={[activePage]} items={menuItems} onClick={({ key }) => handleNavigation(key)} />
      <Button className="logout-button" type="text" danger icon={<LogoutOutlined />} onClick={showLogoutConfirmation}>Logout</Button>
    </>
  )

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4263eb', borderRadius: 10, colorBgLayout: '#f6f8fb' } }}>
      {notificationContext}
      <Layout className="dashboard-shell">
        <Sider breakpoint="lg" collapsedWidth="0" width={248} className="dashboard-sider">
          {navigationContent}
        </Sider>
        <Drawer className="navigation-drawer" placement="left" width={260} open={isNavigationOpen} onClose={() => setIsNavigationOpen(false)} closable={false}>
          {navigationContent}
        </Drawer>
        <Layout>
          <Header className="topbar">
            <Button className="mobile-menu" type="text" icon={<MenuOutlined />} aria-label="Open navigation" onClick={() => setIsNavigationOpen(true)} />
            <Title level={2} className="header-title">{pageTitles[activePage] || 'Dashboard'}</Title>
            <div className="topbar-spacer" />
            <Space size={18} className="topbar-actions"><Avatar size={36} icon={<UserOutlined />} /><div className="profile-copy"><Text strong>Admin</Text></div></Space>
          </Header>
          <Content className="dashboard-content">{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
