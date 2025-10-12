import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header/Header.jsx";
import ProtectedRoute from "./routes/ProtectedRoutes";
import UserList from "./components/Users/UserList.jsx";

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
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
