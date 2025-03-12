import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin/components/Login";
import AdminRegister from "./pages/admin/components/Register";
import AdminHome from "./pages/admin/components/AdminHome";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/create-user" element={<AdminRegister />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
