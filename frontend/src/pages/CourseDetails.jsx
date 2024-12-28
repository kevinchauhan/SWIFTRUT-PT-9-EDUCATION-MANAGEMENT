import { Layout, Card, Button, Row, Col, Spin, notification, Collapse, List } from 'antd';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const { Content } = Layout;
const { Panel } = Collapse;

const CourseDetails = () => {
    const { id } = useParams(); // Get course ID from URL
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch course details on mount
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/courses/${id}`);
                setCourse(response.data);
            } catch (error) {
                setError('Failed to load course details.');
                notification.error({
                    message: 'Error',
                    description: error.response?.data?.message || 'Something went wrong!',
                    duration: 5,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id]);

    if (loading) {
        return <Spin size="large" style={{ marginTop: '20px' }} />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Layout style={{ marginLeft: 200, padding: '0 24px 24px' }}>
                <Content style={{ padding: 24 }}>
                    <Card title={course.name} bordered={false} style={{ marginBottom: '20px' }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <p><strong>Instructor:</strong> {course.instructor}</p>
                                <p><strong>Description:</strong> {course.description}</p>
                                <p><strong>Start Date:</strong> {course.startDate}</p>
                                <Button type="primary" onClick={() => {/* Enroll/Unenroll Logic */ }}>Enroll</Button>
                            </Col>
                            <Col span={12}>
                                <Collapse defaultActiveKey={['1']}>
                                    <Panel header="Syllabus" key="1">
                                        <p>{course.syllabus}</p>
                                    </Panel>
                                    <Panel header="Assignments" key="2">
                                        <List
                                            bordered
                                            dataSource={course.assignments}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <strong>{item.title}</strong> - {item.dueDate}
                                                </List.Item>
                                            )}
                                        />
                                    </Panel>
                                </Collapse>
                            </Col>
                        </Row>
                    </Card>
                </Content>
            </Layout>
        </Layout>
    );
};

export default CourseDetails;
