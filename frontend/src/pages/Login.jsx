// pages/Login.jsx
import { useState } from 'react';
import { Form, Input, Button, Checkbox, notification, Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/login`, values);
            login(response.data); // store user data in Zustand store
            notification.success({
                message: 'Login Successful',
            });
            navigate('/'); // redirect to dashboard
        } catch (error) {
            notification.error({
                message: 'Login Failed',
                description: error.response?.data?.message || 'An error occurred.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Card
                title="Login"
                bordered={false}
                style={{ width: '100%', maxWidth: 400 }}
            >
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    style={{ maxWidth: '100%' }}
                >
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Invalid email!' }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Log in
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Link to="/signup">Don't have an account? Sign Up</Link>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
