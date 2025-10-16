import {
  Input,
  Form,
  Button,
  Card,
  Typography,
  Flex,
  Checkbox,
  message,
  Image,
  Tag,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../../redux/auth/authSlice.jsx";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/group.png";
import "./Styles.css";

const { Title, Text } = Typography;

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, token, error } = useSelector((state) => state.auth);

  const [messageApi, contextHolder] = message.useMessage();

  const VALIDATION_RULES = {
    email: [
      { required: true, message: "Email is required" },
      {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Enter a valid email address (e.g. user@gmail.com)",
      },
    ],
    password: [
      { required: true, message: "Password is required" },
      { min: 8, message: "Password must be at least 8 characters long" },
      {
        pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
        message:
          "Password must include uppercase, lowercase, number, and special character",
      },
    ],
  };

  const DEMO_CREDENTIALS = {
    email: "eve.holt@reqres.in",
    password: "cityslicka",
  };

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
      <div className="login-logo">
        <Image src={logo} alt="logo" preview={false} />
      </div>
      <Title level={1} className="login-title">
        User Management
      </Title>
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
          <Form.Item name="email" rules={VALIDATION_RULES.email}>
            <Input autoFocus prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item name="password" rules={VALIDATION_RULES.password}>
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
        <Tag bordered className={"demo-tag"}>
          <Text strong>Demo Credentials</Text>
          <br />
          Email: {DEMO_CREDENTIALS.email}
          <br />
          Password: {DEMO_CREDENTIALS.password}
        </Tag>
      </Card>
    </div>
  );
}

export default Login;
