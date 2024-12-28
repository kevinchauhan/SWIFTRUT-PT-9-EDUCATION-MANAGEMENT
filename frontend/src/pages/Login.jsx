import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { email, password } = values;
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/login`, { email, password });
            login(response.data.user);
            navigate('/dashboard');
        } catch (error) {
            message.error('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <Form name="login" onFinish={onFinish} initialValues={{ remember: true }} className="login-form">
                <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} className="login-form-button">
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Login;
