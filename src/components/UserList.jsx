import {
  Table,
  Card,
  Input,
  Button,
  Space,
  Tabs,
  Row,
  Col,
  Avatar,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersRequest } from "../redux/users/userSlice";

const { Search } = Input;
const { Text } = Typography;

function UserList() {
  const dispatch = useDispatch();
  const { list, loading, pagination } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsersRequest(1));
  }, [dispatch]);

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (url) => <Avatar src={url} size={40} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <a href={`mailto:${email}`}>{email}</a>,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space>
          <Button type="primary" size="middle" icon={<EditOutlined />}>
            Edit
          </Button>
          <Button danger size="middle" icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleChange = (paginationInfo) => {
    dispatch(fetchUsersRequest(paginationInfo.current));
  };

  return (
    <Card
      style={{
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h2 style={{ margin: 0 }}>Users</h2>
        </Col>
        <Col>
          <Space>
            <Search
              placeholder="Search users..."
              allowClear
              enterButton
              style={{
                width: 250,
                borderRadius: "20px",
              }}
            />
            <Button type="primary">Create User</Button>
          </Space>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: (
              <Space align="center" size={6}>
                <TableOutlined />
                <Text strong>Table</Text>
              </Space>
            ),
          },
          {
            key: "2",
            label: (
              <Space align="center" size={6}>
                <UnorderedListOutlined />
                <Text strong>Card</Text>
              </Space>
            ),
          },
        ]}
      />

      <Table
        columns={columns}
        dataSource={list}
        loading={loading}
        pagination={{
          ...pagination,
          position: ["bottomCenter"],
          showSizeChanger: false,
        }}
        onChange={handleChange}
        rowKey="id"
        bordered={false}
        locale={{ emptyText: loading ? "Loading..." : "No users found" }}
        style={{ marginTop: 16 }}
      />
    </Card>
  );
}

export default UserList;
