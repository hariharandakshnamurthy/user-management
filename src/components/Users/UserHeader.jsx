import { Input, Button, Space, Row, Col } from "antd";
import "./styles.css";

const { Search } = Input;

function UserHeader({ searchTerm, onSearchChange, onCreateClick }) {
  return (
    <Row justify="space-between" align="middle" className="user-header-row">
      <Col>
        <h2 className="user-header-title">Users</h2>
      </Col>
      <Col>
        <Space>
          <Search
            placeholder="Search users..."
            allowClear
            enterButton
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="user-search-input"
          />
          <Button type="primary" onClick={onCreateClick}>
            Create User
          </Button>
        </Space>
      </Col>
    </Row>
  );
}

export default UserHeader;