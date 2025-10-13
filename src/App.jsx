import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import Header from "./components/Header/Header.jsx";
import ProtectedRoute from "./routes/ProtectedRoutes";
import UserList from "./components/Users/UserList.jsx";
import { Result } from "antd";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => navigate("/users")}>
            Back Home
          </Button>
        }
      />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Header />
            <UserList />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <NotFoundPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;