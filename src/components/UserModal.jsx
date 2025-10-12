import { useEffect } from "react";
import { Modal, Form, Input, Button, message, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createUserRequest, updateUserRequest } from "../redux/users/userSlice";

const UserModal = ({ visible, onCancel, user, isEdit = false }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.users);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (visible && isEdit && user) {
      form.setFieldsValue({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    } else if (visible && !isEdit) {
      form.resetFields();
    }
  }, [visible, isEdit, user, form]);

  useEffect(() => {
    if (error) messageApi.error(error);
  }, [error, messageApi]);

  const handleSubmit = (values) => {
    if (isEdit) {
      dispatch(updateUserRequest({ id: user.id, ...values }));
      messageApi.success("User updated successfully!");
    } else {
      dispatch(createUserRequest(values));
      messageApi.success("User created successfully!");
    }
    form.resetFields();
    onCancel();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEdit ? "Edit User" : "Create New User"}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="first_name"
          label="First Name"
          rules={[{ required: true, message: "Please enter first name" }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Last Name"
          rules={[{ required: true, message: "Please enter last name" }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, type: "email", message: "Enter valid email" },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? "Update User" : "Create User"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
