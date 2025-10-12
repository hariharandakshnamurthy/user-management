import { Image, Space, Typography, Tooltip, Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import userLogo from "../../assets/group.png";
import { logout } from "../../redux/auth/authSlice";
import  './Styles.css'

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { Title } = Typography;
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogOut = () => {
    dispatch(logout());
    setTimeout(() => {
      navigate("/login")
      localStorage.removeItem("token");
    },100)
    void messageApi.success("Logged out successfully");
  };

  return (
    <div
      className="header"
    >
      {contextHolder}
      <Space align="center">
        <Image
          src={userLogo}
          alt="user management logo"
          preview={false}
          className={"logo"}
        />
        <Title level={3} className={"title"}>
          User Management
        </Title>
      </Space>
      <div
        className={"logout-button"}
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
