import { Layout, Card, Button, Row, Col, Spin, Alert, Modal, Form, Input, DatePicker, notification, Select, List } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const { Content } = Layout;

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null); // To track the course being edited
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [studentModalVisible, setStudentModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const courseResponse = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/courses`);
                setCourses(courseResponse.data.courses);

                const teacherResponse = await axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/api/users?role=Teacher`);
                setTeachers(teacherResponse.data.users);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (courseId) => {
        setLoading(true);
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_API_URL}/api/courses/${courseId}`);
            setCourses(courses.filter(course => course._id !== courseId));
            notification.success({
                message: 'Course Deleted',
                description: 'The course has been successfully deleted.',
            });
        } catch (err) {
            notification.error({
                message: 'Error Deleting Course',
                description: err.response?.data?.message || 'Something went wrong!',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrEditCourse = async (values) => {
        setLoading(true);
        try {
            const courseData = {
                title: values.name,
                description: values.description,
                startDate: values.startDate,
                endDate: values.endDate,
                teacherId: values.teacher,
                syllabus: values.syllabus,
            };

            if (editingCourse) {
                // Update existing course
                const response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_API_URL}/api/courses/${editingCourse._id}`,
                    courseData
                );
                setCourses((prevCourses) =>
                    prevCourses.map((course) =>
                        course._id === editingCourse._id ? response.data.course : course
                    )
                );
                notification.success({
                    message: 'Course Updated',
                    description: `Course "${response.data.course.title}" has been updated successfully.`,
                });
            } else {
                // Add new course
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/courses`, courseData);
                setCourses((prevCourses) => [...prevCourses, response.data]);
                notification.success({
                    message: 'Course Added',
                    description: `Course "${response.data.course.title}" has been added successfully.`,
                });
            }

            setIsModalVisible(false);
            form.resetFields();
        } catch (err) {
            notification.error({
                message: 'Error',
                description: err.response?.data?.message || 'Something went wrong!',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course) => {
        const transformedCourse = {
            name: course.title,
            description: course.description,
            startDate: moment(course.startDate),
            endDate: moment(course.endDate),
            teacher: course.teacher?._id,
            syllabus: course.syllabus,
        };

        form.setFieldsValue(transformedCourse);
        setEditingCourse(course);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingCourse(null); // Reset editing course state
        form.resetFields(); // Reset form fields
    };

    const handleEnroll = async (courseId) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_API_URL}/api/enrollments/enroll`,
                { courseId }
            );
            notification.success({
                message: 'Enrolled Successfully',
                description: `You have been enrolled in the course.`,
            });
        } catch (err) {
            notification.error({
                message: 'Error Enrolling',
                description: err.response?.data?.message || 'Something went wrong!',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleViewStudents = async (course) => {
        setLoading(true);
        try {
            setSelectedCourse(course);
            setEnrolledStudents(course?.enrolledStudents);
            setStudentModalVisible(true);
        } catch (err) {
            notification.error({
                message: 'Error Fetching Students',
                description: err.response?.data?.message || 'Something went wrong!',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveStudent = async (studentId) => {
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/api/enrollments/remove`, { courseId: selectedCourse._id, studentId });
            setEnrolledStudents((prev) => prev.filter((student) => student._id !== studentId));
            notification.success({
                message: 'Student Removed',
                description: 'The student has been removed from the course.',
            });
        } catch (err) {
            notification.error({
                message: 'Error Removing Student',
                description: err.response?.data?.message || 'Something went wrong!',
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <Layout>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content style={{ padding: 24 }}>
                    {user?.role === 'Admin' && (
                        <Button
                            type="primary"
                            onClick={() => {
                                setEditingCourse(null); // Ensure the modal is for adding
                                setIsModalVisible(true);
                            }}
                            style={{ marginBottom: '20px' }}
                        >
                            Add New Course
                        </Button>
                    )}

                    <Row gutter={[16, 16]}>
                        {courses.map((course) => (
                            <Col
                                key={course._id}
                                xs={24}
                                sm={12}
                                md={8}
                                lg={8}
                                xxl={6}
                                style={{ paddingBottom: '16px' }}
                            >
                                <Card
                                    title={course.title}
                                    bordered={false}
                                    extra={
                                        user?.role === 'Student' && (
                                            <Button onClick={() => handleEnroll(course._id)}>Enroll</Button>
                                        )
                                    }
                                >
                                    <p>
                                        <strong>Teacher:</strong> {course.teacher ? course.teacher.name : 'Not Assigned'}
                                    </p>
                                    <p>
                                        <strong>Description:</strong> {course.description}
                                    </p>
                                    <p>
                                        <strong>Start Date:</strong>{' '}
                                        {new Date(course.startDate).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <strong>End Date:</strong> {new Date(course.endDate).toLocaleDateString()}
                                    </p>

                                    {user?.role === 'Admin' && (
                                        <div>
                                            <Button type="link" onClick={() => handleEdit(course)}>
                                                Edit
                                            </Button>
                                            <Button danger onClick={() => handleDelete(course._id)}>
                                                Delete
                                            </Button>
                                            <Button onClick={() => handleViewStudents(course)}>
                                                View Students
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Content>
            </Layout>

            {/* Modal for adding or editing a course */}
            <Modal
                title={editingCourse ? 'Edit Course' : 'Add New Course'}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose
            >
                <Form form={form} onFinish={handleAddOrEditCourse} layout="vertical">
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
                        label="Teacher"
                        name="teacher"
                        rules={[{ required: true, message: 'Please select the teacher!' }]}
                    >
                        <Select placeholder="Select teacher">
                            {teachers.map((teacher) => (
                                <Select.Option key={teacher._id} value={teacher._id}>
                                    {teacher.name}
                                </Select.Option>
                            ))}
                        </Select>
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



                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                            {editingCourse ? 'Update Course' : 'Add Course'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={`Enrolled Students - ${selectedCourse?.title || ''}`}
                visible={studentModalVisible}
                onCancel={() => setStudentModalVisible(false)}
                footer={null}
                destroyOnClose
            >
                <List
                    dataSource={enrolledStudents}
                    renderItem={(student, i) => (
                        <List.Item
                            actions={[
                                <Button size={'small'} key={i} danger onClick={() => handleRemoveStudent(student._id)}>
                                    Remove
                                </Button>,
                            ]}
                        >
                            {`${i + 1}. ${student.name}`}
                        </List.Item>
                    )}
                />

            </Modal>
        </Layout>
    );
};

export default Courses;
