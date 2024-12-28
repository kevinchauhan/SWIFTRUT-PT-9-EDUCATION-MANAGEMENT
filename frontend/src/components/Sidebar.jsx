import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
    const location = useLocation();

    return (
        <Sider
            width={200}
            className="site-layout-background"
            style={{ minHeight: '100%' }}
        >
            <Menu
                mode="inline"
                defaultSelectedKeys={[location.pathname]}
                selectedKeys={[location.pathname]}
                style={{ height: '100%', borderRight: 0 }}
            >
                <Menu.Item key="/dashboard">
                    <Link to="/dashboard">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="/profile">
                    <Link to="/profile">Profile</Link>
                </Menu.Item>
                <Menu.Item key="/courses">
                    <Link to="/courses">Courses</Link>
                </Menu.Item>

            </Menu>
        </Sider>
    );
};

export default Sidebar;
