import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../config';

const inp = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent';

const statusConfig = {
  pending:   { label: 'รอดำเนินการ', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'ยืนยันแล้ว',  color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'ยกเลิก',      color: 'bg-red-100 text-red-700' },
  completed: { label: 'เสร็จสิ้น',   color: 'bg-blue-100 text-blue-700' },
};

const BookingEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [rooms, setRooms]     = useState([]);
  const [error, setError]     = useState('');
  const [formData, setFormData] = useState({
    fullname: '', email: '', phone: '',
    checkin: '', checkout: '', roomId: '', guests: 1, comment: '', status: 'pending',
  });

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      axios.get(`${API_URL}/api/rooms`, { headers }),
      axios.get(`${API_URL}/api/bookings/${id}`, { headers }),
    ]).then(([rRes, bRes]) => {
      setRooms(rRes.data);
      const b = bRes.data;
      setFormData({ ...b, checkin: b.checkin.split('T')[0], checkout: b.checkout.split('T')[0], roomId: b.roomId || '' });
    }).catch(() => {
      alert('ไม่สามารถดึงข้อมูลได้');
      navigate('/admin/bookings');
    }).finally(() => setLoading(false));
  }, [id]);

  const selectedRoom = rooms.find(r => r.id === Number(formData.roomId));
  const nights = formData.checkin && formData.checkout
    ? Math.max(0, Math.ceil((new Date(formData.checkout) - new Date(formData.checkin)) / 86400000))
    : 0;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await axios.put(`${API_URL}/api/bookings/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin/bookings');
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาด');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">กำลังโหลด...</div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">แก้ไขการจอง #{id}</h1>
          <p className="text-gray-500 text-sm mt-0.5">แก้ไขข้อมูลและสถานะการแจ้งซ่อม</p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig[formData.status]?.color}`}>
          {statusConfig[formData.status]?.label}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Status card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">สถานะการแจ้งซ่อม</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <label key={key}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                  formData.status === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
                }`}>
                <input type="radio" name="status" value={key}
                  checked={formData.status === key} onChange={handleChange}
                  className="accent-blue-600" />
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Guest info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">ข้อมูลผู้แจ้ง</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อ-นามสกุล</label>
              <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className={inp} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">อีเมล</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inp} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">เบอร์โทรศัพท์</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inp} required />
            </div>
          </div>
        </div>

        {/* Stay info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">
            ข้อมูลการแจ้งซ่อม
            {nights > 0 && <span className="ml-2 text-sm font-normal text-blue-500">({nights} วัน)</span>}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">วันที่แจ้ง</label>
              <input type="date" name="checkin" value={formData.checkin} onChange={handleChange} className={inp} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">วันที่กำหนดเสร็จ</label>
              <input type="date" name="checkout" value={formData.checkout} onChange={handleChange}
                min={formData.checkin} className={inp} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ห้องเรียน</label>
              <select name="roomId" value={formData.roomId} onChange={handleChange} className={inp} required>
                <option value="">เลือกห้องเรียน</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>{r.name} — ฿{r.price.toLocaleString()}/วัน</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                จำนวนผู้เกี่ยวข้อง {selectedRoom && <span className="text-gray-400">(สูงสุด {selectedRoom.capacity} คน)</span>}
              </label>
              <input type="number" name="guests" value={formData.guests} onChange={handleChange}
                min="1" max={selectedRoom?.capacity || 10} className={inp} required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">หมายเหตุ</label>
              <input type="text" name="comment" value={formData.comment || ''} onChange={handleChange}
                placeholder="หมายเหตุเพิ่มเติม..." className={inp} />
            </div>
          </div>

          {selectedRoom && nights > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm flex items-center justify-between">
              <span className="text-gray-600">{selectedRoom.name} × {nights} วัน</span>
              <span className="font-bold text-blue-600">฿{(selectedRoom.price * nights).toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
            {saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
          </button>
          <button type="button" onClick={() => navigate('/admin/bookings')}
            className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2.5 rounded-xl transition-colors text-sm">
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingEdit;
