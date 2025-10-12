import {
  Input,
  Form,
  Button,
  Card,
  Typography,
  Flex,
  Checkbox,
  message,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../../redux/auth/authSlice.jsx";
import { useNavigate } from "react-router-dom";
import "./styles.css";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, token, error } = useSelector((state) => state.auth);

  const { Title } = Typography;
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (error) {
      void messageApi.error(error);
    }
  }, [error, messageApi]);

  useEffect(() => {
    if (token) {
      void messageApi.success("Login successful!");
      navigate("/users");
    }
  }, [token, navigate, messageApi]);

  const handleSubmit = (values) => {
    dispatch(loginRequest(values));
  };

  return (
    <div className="login-container">
      {contextHolder}
      <Title level={3} className="login-title">
        Sign in
      </Title>
      <Card className="login-card">
        <Form
          name="login"
          layout="vertical"
          size="large"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { type: "email", message: "Enter a valid email" },
              { required: true, message: "Email is required" },
            ]}
          >
            <Input autoFocus prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="login-submit-btn"
              loading={loading}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;