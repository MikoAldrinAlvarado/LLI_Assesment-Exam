import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Alert, Button, Card, ConfigProvider, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import '../../styles/Login.css'
import { login } from '../../services/authService.js'

const { Text, Title } = Typography

export default function LoginPage({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async ({ username, password }) => {
    try {
      setIsLoading(true)
      setError('')
      const data = await login(username, password)
      localStorage.setItem('stockwise_token', data.token)
      onLogin(data.token)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#4263eb', borderRadius: 10 } }}>
      <main className="login-page">
        <Card className="login-card" variant="borderless">
          <div className="login-brand"><span className="login-brand-mark"><LockOutlined /></span><span>Stockwise</span></div>
          <Title level={2}>Welcome back</Title>
          <Text type="secondary">Sign in to manage your inventory.</Text>
          {error && <Alert className="login-error" message={error} type="error" showIcon />}
          <Form className="login-form" layout="vertical" onFinish={handleLogin}>
            <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Enter your username.' }]}><Input prefix={<UserOutlined />} placeholder="Enter your username" autoComplete="username" /></Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Enter your password.' }]}><Input.Password prefix={<LockOutlined />} placeholder="Enter your password" autoComplete="current-password" /></Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>Sign in</Button>
          </Form>
        </Card>
      </main>
    </ConfigProvider>
  )
}
