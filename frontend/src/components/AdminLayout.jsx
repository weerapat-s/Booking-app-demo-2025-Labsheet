import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/admin',          icon: '🏠', label: 'ภาพรวม' },
  { path: '/admin/bookings', icon: '📋', label: 'การจองทั้งหมด' },
  { path: '/admin/rooms',    icon: '🏨', label: 'จัดการห้องพัก' },
  { path: '/admin/reports',  icon: '📊', label: 'รายงาน' },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full bg-gray-900 text-white ${mobile ? 'w-64' : 'w-64'}`}>
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <span className="text-2xl">🏨</span>
        <div>
          <div className="font-bold text-sm leading-tight">Hotel Admin</div>
          <div className="text-xs text-gray-400">ระบบจัดการโรงแรม</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium">{user?.username}</div>
            <div className="text-xs text-gray-400">{user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้'}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 rounded-lg transition-colors">
          <span>🚪</span> ออกจากระบบ
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full z-50">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
            <div className="text-sm text-gray-500">
              {navItems.find(n => n.path === location.pathname)?.label || 'Admin'}
            </div>
          </div>
          <Link to="/" className="text-xs text-blue-500 hover:underline">← กลับหน้าหลัก</Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
