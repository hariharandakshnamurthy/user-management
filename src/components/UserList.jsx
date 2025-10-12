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
  Popconfirm,
  Pagination,
  Tooltip,
  message,
  Empty
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  TableOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersRequest, deleteUserRequest } from "../redux/users/userSlice";
import UserModal from "./UserModal";

import avatar from '../assets/users.png'

const { Search } = Input;
const { Text } = Typography;

function UserList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("table");

  const dispatch = useDispatch();
  const { list, loading, pagination } = useSelector((state) => state.users);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(fetchUsersRequest(1));
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    return list.filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [list, searchTerm]);

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleDelete = (id) => {
    dispatch(deleteUserRequest(id));
    messageApi.success("User Deleted Successfully")
  };

  const handleTabChange = (key) => setActiveTab(key);

  const handlePageChange = (page) => {
    dispatch(fetchUsersRequest(page));
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (url) => <Avatar src={!url ? avatar : url} size={40} />,
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
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      style={{
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {contextHolder}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 300 }}
            />
            <Button type="primary" onClick={openCreateModal}>
              + Create User
            </Button>
          </Space>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={[
          {
            key: "table",
            label: (
              <Space align="center" size={6}>
                <TableOutlined />
                <Text strong>Table</Text>
              </Space>
            ),
          },
          {
            key: "card",
            label: (
              <Space align="center" size={6}>
                <AppstoreOutlined />
                <Text strong>Card</Text>
              </Space>
            ),
          },
        ]}
      />

      {activeTab === "table" ? (
        <>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            loading={loading}
            rowKey="id"
            bordered={false}
            style={{ marginTop: 16 }}
            pagination={false}
            locale={{ emptyText: <Empty /> }}
          />
          <Row justify="center" style={{ marginTop: 24 }}>
            <Pagination
              current={pagination.current}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onChange={(page) => dispatch(fetchUsersRequest(page))}
              showSizeChanger={false}
            />
          </Row>
        </>
      ) : (
        <>
          <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
            {filteredUsers.length === 0 ? (
              <Col span={24}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px'
                }}>
                  <Empty />
                </div>
              </Col>
            ) : (filteredUsers.map((user) => (
              <Col xs={24} sm={12} md={12} lg={8} key={user.id}>
                <div
                  style={{
                    position: "relative",
                    background: "#fff",
                    borderRadius: "10px",
                    width: "90%",
                    aspectRatio: "1 / 1.05",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.08)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    const overlay = e.currentTarget.querySelector(".overlay");
                    overlay.style.opacity = "1";
                    overlay.style.visibility = "visible";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    const overlay = e.currentTarget.querySelector(".overlay");
                    overlay.style.opacity = "0";
                    overlay.style.visibility = "hidden";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 3px 8px rgba(0,0,0,0.08)";
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <Avatar
                      src={!user.avatar ? avatar : user.avatar}
                      size={200}
                      style={{
                        marginBottom: 12,
                        border: "2px solid #f0f0f0",
                      }}
                    />
                    <h3
                      style={{
                        fontWeight: 600,
                        margin: 0,
                        fontSize: 16,
                        color: "#222",
                      }}
                    >
                      {user.first_name} {user.last_name}
                    </h3>
                    <p
                      style={{
                        color: "#666",
                        fontSize: 13,
                        marginTop: 6,
                        marginBottom: 0,
                      }}
                    >
                      {user.email}
                    </p>
                  </div>
                  <div
                    className="overlay"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: "100%",
                      background: "rgba(0, 0, 0, 0.4)",
                      opacity: 0,
                      visibility: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "opacity 0.3s ease, visibility 0.3s ease",
                      borderRadius: "10px",
                    }}
                  >
                    <Space>
                      <Tooltip title="Click to Edit user details">
                        <Button
                          shape="circle"
                          size="large"
                          icon={<EditOutlined />}
                          style={{
                            backgroundColor: "#7b7ff7",
                            color: "white",
                            border: "none",
                            width: 50,
                            height: 50,
                          }}
                          onClick={() => openEditModal(user)}
                        />
                      </Tooltip>
                      <Tooltip title="Click to Delete user">
                        <Button
                          shape="circle"
                          size="large"
                          icon={<DeleteOutlined />}
                          style={{
                            backgroundColor: "#ff4d4f",
                            color: "white",
                            border: "none",
                            width: 50,
                            height: 50,
                          }}
                          onClick={() => handleDelete(user.id)}
                        />
                      </Tooltip>
                    </Space>
                  </div>
                </div>
              </Col>)
            ))}
          </Row>
          <Row justify="center" style={{ marginTop: 24 }}>
            <Pagination
              current={pagination.current}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </Row>
        </>
      )}

      <UserModal
        visible={isModalOpen}
        onCancel={closeModal}
        user={selectedUser}
        isEdit={isEdit}
      />
    </Card>
  );
}

export default UserList;
