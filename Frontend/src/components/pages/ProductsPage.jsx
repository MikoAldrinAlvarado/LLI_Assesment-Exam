import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Table, Tag, Typography } from 'antd'
import { useState } from 'react'
import '../../styles/Products.css'

const { Text } = Typography

function getStockStatus(stock) {
  if (stock === 0) return { label: 'Out of stock', color: 'red' }
  if (stock <= 5) return { label: 'Low stock', color: 'orange' }
  return { label: 'In stock', color: 'green' }
}

export default function ProductsPage({ products, setProducts }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form] = Form.useForm()

  const openCreateModal = () => { setEditingProduct(null); form.resetFields(); setIsModalOpen(true) }
  const openEditModal = (product) => { setEditingProduct(product); form.setFieldsValue(product); setIsModalOpen(true) }
  const deleteProduct = (id) => setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id))

  const saveProduct = (values) => {
    const productData = { ...values, stock: Number(values.stock), price: Number(values.price) }
    if (editingProduct) {
      setProducts((currentProducts) => currentProducts.map((product) => product.id === editingProduct.id ? { ...productData, id: product.id } : product))
    } else {
      setProducts((currentProducts) => [...currentProducts, { ...productData, id: Date.now() }])
    }
    setIsModalOpen(false)
    form.resetFields()
  }

  const columns = [
    { title: 'PRODUCT', dataIndex: 'name', render: (name, row) => <div><Text strong>{name}</Text><div className="product-sku">SKU: {row.sku}</div></div> },
    { title: 'PRICE', dataIndex: 'price', render: (price) => `₱${price.toLocaleString()}` },
    { title: 'STOCK', dataIndex: 'stock', render: (stock) => `${stock} units` },
    { title: 'STATUS', dataIndex: 'stock', render: (stock) => { const status = getStockStatus(stock); return <Tag color={status.color}>{status.label}</Tag> } },
    { title: 'ACTIONS', key: 'actions', render: (_, product) => <Space><Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(product)} aria-label={`Edit ${product.name}`} /><Popconfirm title="Delete this product?" description="This action cannot be undone." okText="Delete" okButtonProps={{ danger: true }} onConfirm={() => deleteProduct(product.id)}><Button danger type="text" icon={<DeleteOutlined />} aria-label={`Delete ${product.name}`} /></Popconfirm></Space> },
  ]

  return (
    <section className="products-page">
      <div className="products-page-heading"><div><Text className="eyebrow">INVENTORY</Text><Text type="secondary" className="products-description">Manage your inventory products and stock levels.</Text></div><Button type="primary" size="large" icon={<PlusOutlined />} onClick={openCreateModal}>Add product</Button></div>
      <Table className="products-table" columns={columns} dataSource={products} rowKey="id" pagination={{ pageSize: 8, showSizeChanger: false }} />
      <Modal title={editingProduct ? 'Edit product' : 'Add product'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()} okText={editingProduct ? 'Save changes' : 'Add product'}>
        <Form form={form} layout="vertical" onFinish={saveProduct}>
          <Form.Item name="name" label="Product name" rules={[{ required: true, message: 'Enter the product name.' }]}><Input /></Form.Item>
          <Form.Item name="sku" label="SKU" rules={[{ required: true, message: 'Enter the SKU.' }]}><Input /></Form.Item>
          <div className="product-form-row"><Form.Item name="price" label="Price (₱)" rules={[{ required: true, message: 'Enter the price.' }]}><InputNumber min={0} className="full-width" /></Form.Item><Form.Item name="stock" label="Stock quantity" rules={[{ required: true, message: 'Enter the stock quantity.' }]}><InputNumber min={0} className="full-width" /></Form.Item></div>
        </Form>
      </Modal>
    </section>
  )
}
