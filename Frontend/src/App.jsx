import './styles/App.css'
import { useState } from 'react'
import AppLayout from './components/Layout/AppLayout.jsx'
import DashboardPage from './components/pages/DashboardPage.jsx'
import LoginPage from './components/pages/LoginPage.jsx'
import ProductsPage from './components/pages/ProductsPage.jsx'
import ReportsPage from './components/pages/ReportsPage.jsx'

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [token, setToken] = useState(() => localStorage.getItem('stockwise_token'))

  const handleLogout = () => {
    localStorage.removeItem('stockwise_token')
    setActivePage('dashboard')
    setToken(null)
  }

  if (!token) {
    return <LoginPage onLogin={setToken} />
  }

  const page = activePage === 'products'
    ? <ProductsPage />
    : activePage === 'reports'
      ? <ReportsPage />
      : <DashboardPage />

  return (
    <AppLayout activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout}>
      {page}
    </AppLayout>
  )
}

export default App
