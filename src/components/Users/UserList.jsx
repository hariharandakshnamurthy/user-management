import { Card, Tabs, Space, Typography, message, Tooltip } from "antd";
import { TableOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersRequest, deleteUserRequest } from "../../redux/users/userSlice";
import UserModal from "../UserModal.jsx";
import UserHeader from "./UserHeader";
import UserTable from "./UserTable";
import UserCards from "./UserCards";
import "./Styles.css";

const { Text } = Typography;

function UserList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("table");

  const dispatch = useDispatch();
  const { list = [], loading, pagination = {} } = useSelector((state) => state.users);

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

  const closeModal = () => {
    setIsModalOpen(false)
    dispatch(fetchUsersRequest(1));
  };

  const handleDelete = (id) => {
    dispatch(deleteUserRequest(id));
    messageApi.success("User Deleted Successfully");
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    dispatch(fetchUsersRequest(1));
  };

  const handlePageChange = (page) => {
    dispatch(fetchUsersRequest(page));
  };

  return (
    <Card className="user-card-container">
      {contextHolder}

      <UserHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClick={openCreateModal}
      />

      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={[
          {
            key: "table",
            label: (
              <Space align="center" size={6}>
                <Tooltip title="Click to view users in table">
                  <TableOutlined />
                  <Text strong>Table</Text>
                </Tooltip>
              </Space>
            ),
          },
          {
            key: "card",
            label: (
              <Space align="center" size={6}>
                <Tooltip title="Click to view users in cards">
                  <AppstoreOutlined />
                  <Text strong>Card</Text>
                </Tooltip>
              </Space>
            ),
          },
        ]}
      />

      {activeTab === "table" && (
        <UserTable
          users={filteredUsers}
          loading={loading}
          pagination={pagination}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
        />
      )}

      {activeTab === "card" && (
        <UserCards
          users={filteredUsers}
          loading={loading}
          pagination={pagination}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
        />
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