import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import BookingForm      from './components/BookingForm';
import BookingList      from './components/BookingList';
import BookingCreate    from './components/BookingCreate';
import BookingEdit      from './components/BookingEdit';
import AdminDashboard   from './components/AdminDashboard';
import AdminLayout      from './components/AdminLayout';
import RoomsManagement  from './components/RoomsManagement';
import Reports          from './components/Reports';
import ProtectedRoute   from './components/ProtectedRoute';
import Login            from './components/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <NavBar />
          <Routes>
            <Route path="/"       element={<HomePage />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/login"  element={<Login />} />
            <Route path="/admin"
              element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/bookings"
              element={<ProtectedRoute><AdminLayout><BookingList /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/bookings/new"
              element={<ProtectedRoute><AdminLayout><BookingCreate /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/bookings/edit/:id"
              element={<ProtectedRoute><AdminLayout><BookingEdit /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/rooms"
              element={<ProtectedRoute><AdminLayout><RoomsManagement /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/reports"
              element={<ProtectedRoute><AdminLayout><Reports /></AdminLayout></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const NavBar = () => {
  const { user } = useAuth();
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">🏨 ระบบจองห้องพัก</Link>
          <div className="flex items-center gap-4">
            <Link to="/"        className="text-sm text-gray-600 hover:text-gray-900">หน้าแรก</Link>
            <Link to="/booking" className="text-sm text-gray-600 hover:text-gray-900">จองห้องพัก</Link>
            {user ? (
              <Link to="/admin"
                className="text-sm bg-gray-800 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700">
                Admin Panel
              </Link>
            ) : (
              <Link to="/login"
                className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomePage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold text-center mb-8">ยินดีต้อนรับสู่ระบบจองห้องพัก</h1>
    <div className="text-center">
      <Link to="/booking"
        className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
        จองห้องพักเลย
      </Link>
    </div>
  </div>
);

export default App;