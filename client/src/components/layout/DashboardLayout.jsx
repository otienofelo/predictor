import { Outlet } from "react-router-dom";
import { Sidebar } from "lucide-react";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
  <Sidebar />

  <div className="flex flex-col flex-1">
    <Navbar />

    <main className="flex-1 p-6 overflow-y-auto">
      <Outlet />
    </main>
  </div>
</div>
  )
}

export default DashboardLayout;