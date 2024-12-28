// components/Header.jsx
import { Layout, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';

const { Header } = Layout;

const AppHeader = () => {
    const { isAuthenticated, logout } = useAuthStore();
    const [current, setCurrent] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            setCurrent('dashboard');
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
    };

    return (
        <Header style={{ backgroundColor: '#fff', padding: '0 20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
                <div className="logo w-[300px]" style={{ color: '#2c493e', fontWeight: 'bold', fontSize: '20px' }}>
                    Education Management
                </div>
                <div className=''>
                    <Menu
                        theme="light"
                        mode="horizontal"
                        selectedKeys={[current]}
                        style={{

                            borderBottom: 'none',
                            margin: 0,
                            whiteSpace: 'nowrap', // Prevent items from wrapping
                        }}
                    >
                        {!isAuthenticated ? (
                            <>
                                <Menu.Item key="login">
                                    <Link to="/login">Login</Link>
                                </Menu.Item>
                                <Menu.Item key="signup">
                                    <Link to="/signup">Signup</Link>
                                </Menu.Item>
                            </>
                        ) : (
                            <>
                                <Menu.Item key="dashboard">
                                    <Link to="/dashboard">Dashboard</Link>
                                </Menu.Item>
                                <Menu.Item key="logout">
                                    <Button onClick={handleLogout} type="link">Logout</Button>
                                </Menu.Item>
                            </>
                        )}
                    </Menu>
                </div>
            </div>
        </Header>
    );
}

export default AppHeader;
