import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header";
import ProtectedRoute from "./routes/ProtectedRoutes";
import UserList from "./components/UserList";

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
