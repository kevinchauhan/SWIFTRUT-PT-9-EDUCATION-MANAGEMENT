// pages/Signup.jsx
import { Form, Input, Button, message } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { name, email, password } = values;
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/signup`, { name, email, password });
            message.success('Signup successful! Please log in.');
            navigate('/login');
        } catch (error) {
            message.error('Error during signup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>Signup</h2>
            <Form name="signup" onFinish={onFinish} className="signup-form">
                <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                    <Input placeholder="Name" />
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} className="signup-form-button">
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Signup;
