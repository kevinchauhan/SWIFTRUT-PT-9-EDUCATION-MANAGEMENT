import { Layout, Card, Button, Row, Col, Spin, Alert, Modal, Form, Input, DatePicker, notification } from 'antd';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const { Content } = Layout;

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Fetch courses
    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/courses`);
                setCourses(response.data.courses);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Add a course
    const handleAddCourse = async (values) => {
        setLoading(true);
        try {
            const courseData = {
                title: values.name,            // Matching backend property
                description: values.description,
                startDate: values.startDate,
                endDate: values.endDate,        // Adding endDate to match controller
                teacherId: values.instructor,  // Ensure you're passing the teacherId here
            };

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/courses`, courseData);
            notification.success({
                message: 'Course Added',
                description: `Course "${response.data.name}" has been added successfully.`,
            });
            setCourses((prevCourses) => [...prevCourses, response.data]); // Add the new course to the list
            setIsModalVisible(false); // Close the modal
            form.resetFields(); // Reset the form fields
        } catch (err) {
            notification.error({
                message: 'Error Adding Course',
                description: err.response?.data?.message || 'Something went wrong!',
            });
        } finally {
            setLoading(false);
        }
    };

    // Show modal to add a course
    const showModal = () => {
        setIsModalVisible(true);
    };

    // Cancel modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    if (loading) {
        return <Spin size="large" />;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" />;
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout style={{ marginLeft: 200, padding: '0 24px 24px' }}>
                <Content style={{ padding: 24 }}>
                    <Button type="primary" onClick={showModal} style={{ marginBottom: '20px' }}>
                        Add New Course
                    </Button>

                    <Row gutter={16}>
                        {courses.map((course) => (
                            <Col span={8} key={course.id}>
                                <Card
                                    title={course.name}
                                    bordered={false}
                                    extra={<Button>Enroll</Button>}
                                >
                                    <p><strong>Instructor:</strong> {course.instructor}</p>
                                    <p>{course.description}</p>
                                    <Link to={`/courses/${course.id}`}>View Details</Link>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Content>
            </Layout>

            {/* Modal for adding a course */}
            <Modal
                title="Add New Course"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
            >
                <Form form={form} onFinish={handleAddCourse} layout="vertical">
                    <Form.Item
                        label="Course Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the course name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the course description!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="Instructor"
                        name="instructor"
                        rules={[{ required: true, message: 'Please input the instructor name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Start Date"
                        name="startDate"
                        rules={[{ required: true, message: 'Please select the start date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="End Date"
                        name="endDate"
                        rules={[{ required: true, message: 'Please select the end date!' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Syllabus"
                        name="syllabus"
                        rules={[{ required: true, message: 'Please input the syllabus!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                            {loading ? 'Adding...' : 'Add Course'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default Courses;
