import './styles/App.css'
import { useState } from 'react'
import AppLayout from './components/Layout/AppLayout.jsx'
import DashboardPage from './components/pages/DashboardPage.jsx'
import ProductsPage from './components/pages/ProductsPage.jsx'
import ReportsPage from './components/pages/ReportsPage.jsx'

const initialProducts = [
  { id: 1, name: 'Wireless Mouse', sku: 'WM-001', category: 'Electronics', stock: 24, price: 850 },
  { id: 2, name: 'Mechanical Keyboard', sku: 'MK-002', category: 'Electronics', stock: 8, price: 2450 },
  { id: 3, name: 'Laptop Stand', sku: 'LS-003', category: 'Accessories', stock: 15, price: 700 },
  { id: 4, name: 'USB-C Hub', sku: 'UH-004', category: 'Electronics', stock: 4, price: 1200 },
  { id: 5, name: 'Office Chair', sku: 'OC-005', category: 'Furniture', stock: 6, price: 5250 },
  { id: 6, name: 'Desk Lamp', sku: 'DL-006', category: 'Furniture', stock: 0, price: 950 },
  { id: 7, name: 'Notebook Set', sku: 'NS-007', category: 'Stationery', stock: 32, price: 180 },
  { id: 8, name: 'Ballpen Pack', sku: 'BP-008', category: 'Stationery', stock: 3, price: 120 },
  { id: 9, name: 'Monitor Arm', sku: 'MA-009', category: 'Accessories', stock: 10, price: 1850 },
  { id: 10, name: 'Webcam', sku: 'WC-010', category: 'Electronics', stock: 0, price: 1650 },
]

function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [products, setProducts] = useState(initialProducts)

  const page = activePage === 'products'
    ? <ProductsPage products={products} setProducts={setProducts} />
    : activePage === 'reports'
      ? <ReportsPage />
      : <DashboardPage products={products} />

  return (
    <AppLayout activePage={activePage} onNavigate={setActivePage}>
      {page}
    </AppLayout>
  )
}

export default App
