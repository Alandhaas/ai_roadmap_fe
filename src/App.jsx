import { Routes, Route } from "react-router-dom"
import AppLayout from "./layout/AppLayout"

import Dashboard from "./pages/Dashboard"
import Users from "./pages/Users"
import Settings from "./pages/Settings"
import CreateUser from "./pages/CreateUser"

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/create" element={<CreateUser />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AppLayout>
  )
}
