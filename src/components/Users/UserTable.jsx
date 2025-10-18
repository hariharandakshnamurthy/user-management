import {
  Table,
  Button,
  Space,
  Avatar,
  Popconfirm,
  Pagination,
  Row,
  Empty,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import avatar from "../../assets/users.png";
import "./Styles.css";

function UserTable({
  users,
  loading,
  pagination,
  onEdit,
  onDelete,
  onPageChange,
}) {
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
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => onDelete(record.id)}
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
    <>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        bordered={false}
        className="user-table"
        pagination={false}
        locale={{ emptyText: <Empty /> }}
      />
      {pagination && (
        <Row justify="center" className="user-pagination-row">
          <Pagination
            current={pagination.current}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </Row>
      )}
    </>
  );
}

export default UserTable;
