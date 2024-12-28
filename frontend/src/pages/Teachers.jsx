import React, { useEffect, useState } from 'react';
import { Layout, Table, Button, Modal, Form, Input, notification } from 'antd';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const { Content } = Layout;

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editTeacher, setEditTeacher] = useState(null);  // Store the teacher being edited
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/users?role=Teacher`);
                setTeachers(response.data.users);
            } catch (err) {
                notification.error({
                    message: 'Error Fetching Teachers',
                    description: err.response?.data?.message || 'Something went wrong!',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
        setEditTeacher(null); // Open the modal for creating a new teacher
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields(); // Reset the form
    };

    const handleAddTeacher = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/users`, { ...values, role: 'Teacher' });
            setTeachers((prevTeachers) => [...prevTeachers, response.data.user]);
            notification.success({
                message: 'Teacher Added',
                description: `Teacher "${response.data.user.name}" has been added successfully.`,
            });
            setIsModalVisible(false);
            form.resetFields();
        } catch (err) {
            console.log(err)
            notification.error({
                message: 'Error Adding Teacher',
                description: err.response?.data?.message || 'Something went wrong!',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEditTeacher = (teacher) => {
        setEditTeacher(teacher); // Pre-fill the form with existing teacher data
        setIsModalVisible(true);
    };

    const handleUpdateTeacher = async (values) => {
        setLoading(true);
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_API_URL}/api/users/${editTeacher.id}`, values);
            setTeachers((prevTeachers) =>
                prevTeachers.map((teacher) =>
                    teacher.id === editTeacher.id ? response.data.teacher : teacher
                )
            );
            notification.success({
                message: 'Teacher Updated',
                description: `Teacher "${response.data.teacher.name}" has been updated successfully.`,
            });
            setIsModalVisible(false);
            form.resetFields();
        } catch (err) {
            notification.error({
                message: 'Error Updating Teacher',
                description: err.response?.data?.message || 'Something went wrong!',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTeacher = async (teacherId) => {
        setLoading(true);
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/users/${teacherId}`);
            setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher._id !== teacherId));
            notification.success({
                message: 'Teacher Deleted',
                description: 'Teacher has been deleted successfully.',
            });
        } catch (err) {
            notification.error({
                message: 'Error Deleting Teacher',
                description: err.response?.data?.message || 'Something went wrong!',
            });
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        // {
        //     title: 'Assigned Courses',
        //     dataIndex: 'courses',
        //     key: 'courses',
        //     render: (courses) => courses.join(', '),
        // },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, teacher) => (
                <div>
                    <Button onClick={() => handleEditTeacher(teacher)} style={{ marginRight: '10px' }}>
                        Edit
                    </Button>
                    <Button onClick={() => handleDeleteTeacher(teacher._id)} danger>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content style={{ padding: 24 }}>
                    <Button type="primary" onClick={showModal} style={{ marginBottom: '20px' }}>
                        Add New Teacher
                    </Button>

                    <Table
                        dataSource={teachers}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={false}
                    />
                </Content>
            </Layout>

            {/* Modal for adding/editing teacher */}
            <Modal
                title={editTeacher ? 'Edit Teacher' : 'Add New Teacher'}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    initialValues={editTeacher || {}}
                    onFinish={editTeacher ? handleUpdateTeacher : handleAddTeacher}
                    layout="vertical"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the teacher name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input the teacher email!' }]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item

                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input the password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                            {loading ? 'Saving...' : editTeacher ? 'Update Teacher' : 'Add Teacher'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default Teachers;
