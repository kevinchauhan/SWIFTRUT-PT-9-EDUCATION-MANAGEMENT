import { Layout, Card, Button, Row, Col, Spin, Alert } from 'antd';
import { Link } from 'react-router-dom';
import coursesStore from '../store/courseStore';
import { useEffect } from 'react';

const { Content } = Layout;

const Courses = () => {
    const { courses, loading, error, fetchCourses, enrollInCourse } = coursesStore();

    // Fetch courses on component mount
    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // Show loading spinner while data is being fetched
    if (loading) {
        return <Spin size="large" style={{ marginTop: '20px' }} />;
    }

    // Show an alert if there's an error
    if (error) {
        return <Alert message="Error" description={error} type="error" />;
    }

    return (
        <Content style={{ padding: '24px', margin: 0, minHeight: 'calc(100vh - 64px)' }}>
            <Row gutter={[16, 16]}>
                {courses.map((course) => (
                    <Col span={8} key={course.id}>
                        <Card
                            title={course.name}
                            bordered={false}
                            extra={
                                <Button type="primary" onClick={() => enrollInCourse(course.id)}>
                                    Enroll
                                </Button>
                            }
                        >
                            <p>
                                <strong>Instructor:</strong> {course.instructor}
                            </p>
                            <p>{course.description}</p>
                            <Link to={`/courses/${course.id}`}>View Details</Link>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Content>
    );
};

export default Courses;
