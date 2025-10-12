import { Image, Space, Typography, Tooltip, Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import userLogo from "../assets/group.png";
import { logout } from "../redux/auth/authSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { Title } = Typography;
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login");
    messageApi.success("Logged out successfully");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100vw",
        padding: "16px 32px",
        boxSizing: "border-box",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      {contextHolder}
      <Space align="center">
        <Image
          src={userLogo}
          alt="user management logo"
          preview={false}
          style={{ height: "50px", overflow: "hidden" }}
        />
        <Title level={3} style={{ margin: 0 }}>
          User Management
        </Title>
      </Space>
      <div
        style={{
          cursor: "pointer",
          fontSize: "20px",
          color: "red",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#1677ff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "red")}
      >
        <Tooltip title="Click to Logout">
          <Button icon={<LogoutOutlined />} onClick={handleLogOut}>
            Log out
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default Header;
