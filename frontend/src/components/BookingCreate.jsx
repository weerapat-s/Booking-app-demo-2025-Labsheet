import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../config';

const inp = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent';

const BookingCreate = () => {
  const { token } = useAuth();
  const navigate  = useNavigate();
  const [rooms, setRooms]           = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [formData, setFormData]     = useState({
    fullname: '', email: '', phone: '',
    checkin: '', checkout: '', roomId: '', guests: 1, comment: '',
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/rooms`)
      .then(r => setRooms(r.data))
      .catch(() => setError('ไม่สามารถดึงข้อมูลห้องเรียนได้'))
      .finally(() => setLoadingRooms(false));
  }, []);

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
    if (!formData.roomId) return setError('กรุณาเลือกห้องเรียน');
    if (new Date(formData.checkout) <= new Date(formData.checkin))
      return setError('วันเช็คเอาท์ต้องมาหลังวันเช็คอิน');
    if (!/^[0-9]{10}$/.test(formData.phone))
      return setError('กรุณากรอกเบอร์โทรศัพท์ 10 หลัก');
    setSaving(true);
    try {
      await axios.post(`${API_URL}/api/bookings`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/admin/bookings');
    } catch (err) {
      setError(err.response?.data?.error || 'เกิดข้อผิดพลาด');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">เพิ่มรายการแจ้งซ่อม</h1>
        <p className="text-gray-500 text-sm mt-0.5">กรอกข้อมูลเพื่อสร้างรายการแจ้งซ่อม</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">⚠️ {error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">ข้อมูลผู้แจ้ง</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อ-นามสกุล <span className="text-red-400">*</span></label>
              <input type="text" name="fullname" value={formData.fullname} onChange={handleChange}
                placeholder="กรอกชื่อ-นามสกุล" className={inp} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">อีเมล <span className="text-red-400">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="example@email.com" className={inp} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">เบอร์โทรศัพท์ <span className="text-red-400">*</span></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="0812345678" className={inp} required />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">
            ข้อมูลการแจ้งซ่อม
            {nights > 0 && <span className="ml-2 text-sm font-normal text-blue-500">({nights} วัน)</span>}
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">วันที่แจ้ง <span className="text-red-400">*</span></label>
              <input type="date" name="checkin" value={formData.checkin} onChange={handleChange}
                min={new Date().toISOString().split('T')[0]} className={inp} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">วันที่กำหนดเสร็จ <span className="text-red-400">*</span></label>
              <input type="date" name="checkout" value={formData.checkout} onChange={handleChange}
                min={formData.checkin} className={inp} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ห้องเรียน <span className="text-red-400">*</span></label>
              <select name="roomId" value={formData.roomId} onChange={handleChange}
                className={inp} required disabled={loadingRooms}>
                <option value="">-- เลือกห้องเรียน --</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>{r.name} — ฿{r.price.toLocaleString()}/วัน ({r.capacity} คน)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                จำนวนผู้เกี่ยวข้อง {selectedRoom && <span className="text-gray-400">(สูงสุด {selectedRoom.capacity})</span>}
              </label>
              <input type="number" name="guests" value={formData.guests} onChange={handleChange}
                min="1" max={selectedRoom?.capacity || 10} className={inp} required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">หมายเหตุ</label>
              <textarea name="comment" value={formData.comment} onChange={handleChange}
                placeholder="หมายเหตุเพิ่มเติม..." rows={2} className={inp} />
            </div>
          </div>

          {selectedRoom && nights > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm flex items-center justify-between">
              <span className="text-gray-600">{selectedRoom.name} × {nights} วัน</span>
              <span className="font-bold text-blue-600">฿{(selectedRoom.price * nights).toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving || loadingRooms}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm">
            {saving ? 'กำลังบันทึก...' : 'บันทึกคำร้องแจ้งซ่อม'}
          </button>
          <button type="button" onClick={() => navigate('/admin/bookings')}
            className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl text-sm">
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingCreate;
