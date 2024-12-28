// pages/Signup.jsx
import { useState } from 'react';
import { Form, Input, Button, Checkbox, notification, Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/auth/signup`, values);
            notification.success({
                message: 'Signup Successful',
                description: 'You can now log in with your credentials.',
            });
            navigate('/login'); // Redirect to login page after successful signup
        } catch (error) {
            notification.error({
                message: 'Signup Failed',
                description: error.response?.data?.message || 'An error occurred.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Card
                title="Sign Up"
                bordered={false}
                style={{ width: '100%', maxWidth: 400 }}
            >
                <Form
                    name="signup"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    style={{ maxWidth: '100%' }}
                >
                    <Form.Item
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input placeholder="Full Name" />
                    </Form.Item>

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
                        <Checkbox>I agree to the terms and conditions</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Sign Up
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Link to="/login">Already have an account? Login</Link>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Signup;
