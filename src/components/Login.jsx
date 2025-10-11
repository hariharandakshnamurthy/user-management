import { Input, Form, Button, Card, Typography, Flex, Checkbox } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../redux/auth/authSlice.jsx";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

function Login() {
  const userRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, token, error } = useSelector((state) => state.auth);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    if (token) navigate("/users");
  }, [token, navigate]);

  const handleSubmit = (values) => {
    dispatch(loginRequest(values));
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "left",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Title level={3} style={{ marginBottom: 32 }}>
        Sign in
      </Title>
      <Card
        style={{
          width: 500,
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "12px",
        }}
      >
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
            <Input
              ref={userRef}
              prefix={<UserOutlined />}
              placeholder="Email"
            />
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
              style={{ width: "100%" }}
              loading={loading}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>

        {error && (
          <Typography.Text
            type="danger"
            style={{ display: "block", textAlign: "center", marginTop: 12 }}
          >
            {error}
          </Typography.Text>
        )}
      </Card>
    </div>
  );
}

export default Login;
