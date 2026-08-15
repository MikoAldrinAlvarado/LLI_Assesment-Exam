import './styles/App.css'
import { useState } from 'react'
import AppLayout from './components/Layout/AppLayout.jsx'
import DashboardPage from './components/pages/DashboardPage.jsx'
import ProductsPage from './components/pages/ProductsPage.jsx'
import ReportsPage from './components/pages/ReportsPage.jsx'

const initialProducts = [
  { id: 1, name: 'Samsung Galaxy S25', sku: 'SMS-S25', stock: 24, price: 51990 },
  { id: 2, name: 'Apple iPhone 16', sku: 'APL-IP16', stock: 8, price: 54990 },
  { id: 3, name: 'Xiaomi 15', sku: 'XMI-15', stock: 15, price: 39999 },
  { id: 4, name: 'Oppo Reno 13', sku: 'OPP-R13', stock: 4, price: 27999 },
  { id: 5, name: 'Vivo V50', sku: 'VVO-V50', stock: 6, price: 34999 },
  { id: 6, name: 'Google Pixel 9', sku: 'GGL-P9', stock: 0, price: 46990 },
  { id: 7, name: 'Samsung Galaxy A56', sku: 'SMS-A56', stock: 32, price: 23990 },
  { id: 8, name: 'Apple iPhone 15', sku: 'APL-IP15', stock: 3, price: 44990 },
  { id: 9, name: 'Nothing Phone (3a)', sku: 'NTH-P3A', stock: 10, price: 26990 },
  { id: 10, name: 'Huawei Pura 70', sku: 'HUA-P70', stock: 0, price: 49999 },
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
