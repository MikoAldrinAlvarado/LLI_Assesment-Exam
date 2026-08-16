import { DeleteOutlined, DownloadOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Spin, Table, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import '../../styles/Products.css'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../services/productService.js'

const { Text } = Typography

function getStockStatus(stock) {
  if (stock === 0) return { label: 'Out of stock', color: 'red' }
  if (stock <= 5) return { label: 'Low stock', color: 'orange' }
  return { label: 'In stock', color: 'green' }
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form] = Form.useForm()

  const refreshProducts = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await getProducts()
      setProducts(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isCurrent = true

    getProducts()
      .then((data) => {
        if (isCurrent) {
          setProducts(data)
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

  const openCreateModal = () => { setEditingProduct(null); form.resetFields(); setIsModalOpen(true) }
  const openEditModal = (product) => { setEditingProduct(product); form.setFieldsValue(product); setIsModalOpen(true) }

  const handleDelete = async (id) => {
    try {
      setError('')
      await deleteProduct(id)
      await refreshProducts()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const saveProduct = async (values) => {
    const productData = { ...values, stock: Number(values.stock), price: Number(values.price) }

    try {
      setIsSaving(true)
      setError('')

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
      } else {
        await createProduct(productData)
      }

      await refreshProducts()
      setIsModalOpen(false)
      form.resetFields()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  const generateProductReport = () => {
    const reportText = [
      'STOCKWISE PRODUCT INVENTORY REPORT',
      `Generated: ${new Date().toLocaleString('en-PH')}`,
      '',
      `Total products: ${products.length}`,
      '',
      'PRODUCT LIST',
      ...products.map((product) => `${product.name} | SKU: ${product.sku} | Price: PHP ${Number(product.price).toLocaleString()} | Stock: ${product.stock} | Status: ${getStockStatus(product.stock).label}`),
    ].join('\n')
    const reportFile = new Blob([reportText], { type: 'text/plain;charset=utf-8' })
    const fileUrl = URL.createObjectURL(reportFile)
    const downloadLink = document.createElement('a')
    downloadLink.href = fileUrl
    downloadLink.download = 'stockwise-product-inventory-report.txt'
    downloadLink.click()
    URL.revokeObjectURL(fileUrl)
  }

  const columns = [
    { title: 'PRODUCT', dataIndex: 'name', render: (name, row) => <div><Text strong>{name}</Text><div className="product-sku">SKU: {row.sku}</div></div> },
    { title: 'PRICE', dataIndex: 'price', render: (price) => `₱${price.toLocaleString()}` },
    { title: 'STOCK', dataIndex: 'stock', render: (stock) => `${stock} units` },
    { title: 'STATUS', dataIndex: 'stock', render: (stock) => { const status = getStockStatus(stock); return <Tag color={status.color}>{status.label}</Tag> } },
    { title: 'ACTIONS', key: 'actions', render: (_, product) => <Space><Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(product)} aria-label={`Edit ${product.name}`} /><Popconfirm title="Delete this product?" description="This product will no longer appear in your product list." okText="Delete" okButtonProps={{ danger: true }} onConfirm={() => handleDelete(product.id)}><Button danger type="text" icon={<DeleteOutlined />} aria-label={`Delete ${product.name}`} /></Popconfirm></Space> },
  ]

  return (
    <section className="products-page">
      <div className="products-page-heading"><div><Text className="eyebrow">INVENTORY</Text><Text type="secondary" className="products-description">Manage your inventory products and stock levels.</Text></div><div className="products-actions"><Button className="generate-report-button" size="large" icon={<DownloadOutlined />} onClick={generateProductReport} disabled={isLoading || Boolean(error)}>Generate report</Button><Button type="primary" size="large" icon={<PlusOutlined />} onClick={openCreateModal}>Add product</Button></div></div>
      {error && <Alert className="products-error" message={error} type="error" showIcon />}
      {isLoading ? <div className="products-loading"><Spin size="large" /></div> : <Table className="products-table" columns={columns} dataSource={products} rowKey="id" pagination={{ pageSize: 8, showSizeChanger: false }} />}
      <Modal title={editingProduct ? 'Edit product' : 'Add product'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} confirmLoading={isSaving} okText={editingProduct ? 'Save changes' : 'Add product'}>
        <Form form={form} layout="vertical" onFinish={saveProduct}>
          <Form.Item name="name" label="Product name" rules={[{ required: true, message: 'Enter the product name.' }]}><Input /></Form.Item>
          <Form.Item name="sku" label="SKU" rules={[{ required: true, message: 'Enter the SKU.' }]}><Input /></Form.Item>
          <div className="product-form-row"><Form.Item name="price" label="Price (₱)" rules={[{ required: true, message: 'Enter the price.' }]}><InputNumber min={0} controls={false} className="full-width" /></Form.Item><Form.Item name="stock" label="Stock quantity" rules={[{ required: true, message: 'Enter the stock quantity.' }]}><InputNumber min={0} className="full-width" /></Form.Item></div>
        </Form>
      </Modal>
    </section>
  )
}
