import { Layout, Card, Form, Input, Button, notification } from 'antd';
import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import axios from 'axios';

const { Content } = Layout;

const Profile = () => {
    const { user, login } = useAuthStore();

    const [form] = Form.useForm();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
            });
        }
    }, [user, form]);

    const handleUpdate = async (values) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_API_URL}/api/users/self`, values);
            login(response.data);
            notification.success({
                message: 'Success',
                description: 'Profile updated successfully!',
            });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response?.data?.message || 'Failed to update profile.',
            });
        }
    };

    return (
        <Content style={{ padding: '24px', margin: 0, minHeight: 'calc(100vh - 64px)' }}>
            <Card title="Profile" bordered={false} style={{ maxWidth: 600, margin: '0 auto' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdate}
                    initialValues={{ name: user?.name, email: user?.email }}
                >
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Content>
    );
};

export default Profile;
