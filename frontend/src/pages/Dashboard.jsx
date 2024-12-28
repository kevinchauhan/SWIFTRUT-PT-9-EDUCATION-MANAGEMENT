// pages/Dashboard.jsx
import { Layout, Menu, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const { Content, Sider } = Layout;

const Dashboard = () => {
    const { user } = useAuthStore();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={200} className="site-layout-background">
                <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
                    <Menu.Item key="1">
                        <Link to="/profile">Profile</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to="/courses">Courses</Link>
                    </Menu.Item>
                    {/* More menu items */}
                </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card title="Welcome" bordered={false}>
                                Hello, {user?.name}.
                            </Card>
                        </Col>
                        {/* More Cards */}
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Dashboard;
