import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import Header from "./components/Header/Header.jsx";
import ProtectedRoute from "./routes/ProtectedRoutes";
import UserList from "./components/Users/UserList.jsx";
import { Result } from "antd";

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
      <Route path="*" element={<Result status="404" title="404" subTitle="Page Not Found" />} />
    </Routes>
  );
}

export default App;
