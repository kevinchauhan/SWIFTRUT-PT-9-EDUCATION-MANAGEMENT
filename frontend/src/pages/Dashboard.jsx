import { Layout, Card, Row, Col, Typography, Spin, notification } from 'antd';
import { useEffect } from 'react';
import useDashboardStore from '../store/dashboardStore';

const { Content } = Layout;
const { Title } = Typography;

const Dashboard = () => {
    const { user, courses, loading, error, fetchUserData, fetchCourses } = useDashboardStore();

    // Fetch user data and courses on component mount
    useEffect(() => {
        fetchUserData();
        fetchCourses();
    }, [fetchUserData, fetchCourses]);

    // Show error notification if there's an error
    useEffect(() => {
        if (error) {
            notification.error({
                message: 'Error',
                description: error,
                placement: 'topRight',
                duration: 5,
            });
        }
    }, [error]);

    // Show loading spinner while data is being fetched
    if (loading) {
        return <Spin size="large" style={{ marginTop: '20px' }} />;
    }

    return (
        <Content style={{ padding: '24px', margin: 0, }}>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Card title="Welcome" bordered={false}>
                        <Title level={4}>Hello, {user?.name}!</Title>
                        <p>Welcome to your dashboard.</p>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="User Information" bordered={false}>
                        <p>
                            <strong>Email:</strong> {user?.email}
                        </p>
                        <p>
                            <strong>Role:</strong> {user?.role}
                        </p>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Recent Courses" bordered={false}>
                        {courses.length > 0 ? (
                            courses.map((course, index) => <p key={index}>{course.name}</p>)
                        ) : (
                            <p>No courses found.</p>
                        )}
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export default Dashboard;
