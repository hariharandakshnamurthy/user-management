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
  AppstoreOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Text } = Typography;

function UserList() {
  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (text) => <Avatar src={text} size={40} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a href={`mailto:${text}`}>{text}</a>,
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
      render: (_, record) => (
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

  const data = [
    {
      key: "1",
      email: "george.bluth@reqres.in",
      first_name: "George",
      last_name: "Bluth",
      avatar: "https://reqres.in/img/faces/1-image.jpg",
    },
    {
      key: "2",
      email: "janet.weaver@reqres.in",
      first_name: "Janet",
      last_name: "Weaver",
      avatar: "https://reqres.in/img/faces/2-image.jpg",
    },
    {
      key: "3",
      email: "emma.wong@reqres.in",
      first_name: "Emma",
      last_name: "Wong",
      avatar: "https://reqres.in/img/faces/3-image.jpg",
    },
  ];

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
              placeholder="Search"
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
                <Text strong>Cards</Text>
              </Space>
            ),
          },
        ]}
      />

      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 10,
          position: ["bottomCenter"],
          showSizeChanger: false,
        }}
        bordered={false}
      />
    </Card>
  );
}

export default UserList;
