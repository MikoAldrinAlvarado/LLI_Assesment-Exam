import './styles/App.css'
import { useState } from 'react'
import AppLayout from './components/Layout/AppLayout.jsx'
import DashboardPage from './components/pages/DashboardPage.jsx'
import ProductsPage from './components/pages/ProductsPage.jsx'
import ReportsPage from './components/pages/ReportsPage.jsx'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const page = activePage === 'products'
    ? <ProductsPage />
    : activePage === 'reports'
      ? <ReportsPage />
      : <DashboardPage products={[]} />

  return (
    <AppLayout activePage={activePage} onNavigate={setActivePage}>
      {page}
    </AppLayout>
  )
}

export default App
