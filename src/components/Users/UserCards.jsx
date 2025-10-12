import { Row, Col, Avatar, Button, Space, Tooltip, Pagination, Empty, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import avatar from "../../assets/users.png";
import Loader from "../Loader.jsx";
import "./Styles.css";

function UserCards({ users, loading, pagination, onEdit, onDelete, onPageChange }) {
  if (loading) {
    return <Loader text="Loading users..." height="400px" />;
  }

  return (
    <>
      <Row gutter={[12, 12]} className="user-cards-row">
        {users.length === 0 ? (
          <Col span={24}>
            <div className="user-empty-container">
              <Empty />
            </div>
          </Col>
        ) : (
          users.map((user) => (
            <Col xs={24} sm={12} md={12} lg={8} key={user.id}>
              <div className="user-card-item">
                <div className="user-card-content">
                  <Avatar
                    src={!user.avatar ? avatar : user.avatar}
                    size={200}
                    className="user-card-avatar"
                  />
                  <h3 className="user-card-name">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="user-card-email">{user.email}</p>
                </div>
                <div className="user-card-overlay">
                  <Space>
                    <Tooltip title="Click to Edit user details">
                      <Button
                        shape="circle"
                        size="large"
                        icon={<EditOutlined />}
                        className="user-card-edit-btn"
                        onClick={() => onEdit(user)}
                      />
                    </Tooltip>
                    <Tooltip title="Click to Delete user">
                      <Popconfirm
                        placement={"bottom"}
                        title={"Are you sure to delete the user"}
                        onConfirm={ () => onDelete(user.id)}
                        okText="OK"
                        cancelText="Cancel"
                      >
                        <Button
                          shape={"circle"}
                          size={"large"}
                          icon={<DeleteOutlined />}
                          className="user-card-delete-btn"
                        />
                      </Popconfirm>
                    </Tooltip>
                  </Space>
                </div>
              </div>
            </Col>
          ))
        )}
      </Row>
      <Row justify="center" className="user-pagination-row">
        <Pagination
          current={pagination.current}
          total={pagination.total}
          pageSize={pagination.pageSize}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </Row>
    </>
  );
}

export default UserCards;