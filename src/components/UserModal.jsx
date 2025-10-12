import { Modal, Form, Input } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserRequest, updateUserRequest } from "../redux/users/userSlice";

function UserModal({ visible, onCancel, user, isEdit }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.users);

  useEffect(() => {
    if (visible) {
      if (isEdit && user) {
        form.setFieldsValue({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          avatar: user.avatar,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, isEdit, user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEdit) {
        dispatch(updateUserRequest({ ...user, ...values }));
      } else {
        dispatch(createUserRequest(values));
      }

      form.resetFields();
      onCancel();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const validateEmail = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please input the email!"));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject(new Error("Please enter a valid email address!"));
    }

    const createdUsers = JSON.parse(localStorage.getItem("createdUsers") || "[]");
    const allUsers = [...createdUsers, ...list];

    const duplicateEmail = allUsers.some(
      (u) =>
        u.email.toLowerCase() === value.toLowerCase() &&
        (!isEdit || u.id !== user?.id)
    );

    if (duplicateEmail) {
      return Promise.reject(new Error("A user with this email already exists!"));
    }

    return Promise.resolve();
  };

  return (
    <Modal
      title={isEdit ? "Edit User" : "Create User"}
      open={visible}
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText={isEdit ? "Update" : "Create"}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: "Please input the first name!" }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: "Please input the last name!" }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, validator: validateEmail }]}
          validateTrigger="onBlur"
        >
          <Input placeholder="Enter email" type="email" />
        </Form.Item>

        <Form.Item label="Avatar URL" name="avatar">
          <Input placeholder="Enter avatar URL (optional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UserModal;