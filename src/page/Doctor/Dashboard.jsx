import React from "react";
import Calendar from "../../components/doctor/Calender";
import AppointmentList from "../../components/doctor/AppointmentList";
import { doctorAppointments } from "../../components/Data/Doctor"; // Import từ file có sẵn

const DoctorDashboard = () => {
  // Dữ liệu từ file có sẵn
  const mockAppointments = doctorAppointments || [];

  // Tính toán thống kê từ dữ liệu
  // Đếm lịch hẹn hôm nay
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = mockAppointments.filter((app) => {
    const appDate = new Date(app.startTime);
    return appDate >= today && appDate < tomorrow;
  });

  // Đếm lịch hẹn tuần này
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Chủ nhật là ngày đầu tuần
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const weeklyAppointments = mockAppointments.filter((app) => {
    const appDate = new Date(app.startTime);
    return appDate >= startOfWeek && appDate < endOfWeek;
  });

  // Đếm theo trạng thái
  const completedAppointments = mockAppointments.filter(
    (app) => app.status === "COMPLETED"
  );
  const pendingAppointments = mockAppointments.filter(
    (app) => app.status === "PENDING"
  );

  const stats = {
    todayAppointments: todayAppointments.length,
    weeklyAppointments: weeklyAppointments.length,
    completedAppointments: completedAppointments.length,
    pendingAppointments: pendingAppointments.length,
  };

  return (
    <div className="p-6 max-w-[85rem] mx-auto">
      <h1 className="text-2xl text-blue-600 font-medium mb-8">
        Xin chào, Bác sĩ Nguyễn Thị Minh
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card Lịch hẹn hôm nay */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center hover:translate-y-[-5px] transition-transform duration-200">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <i className="fas fa-calendar-day text-blue-600 text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {stats.todayAppointments}
            </h3>
            <p className="text-sm text-gray-600">Hôm nay</p>
          </div>
        </div>

        {/* Card Lịch hẹn tuần này */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center hover:translate-y-[-5px] transition-transform duration-200">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <i className="fas fa-calendar-week text-blue-600 text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {stats.weeklyAppointments}
            </h3>
            <p className="text-sm text-gray-600">Tuần này</p>
          </div>
        </div>

        {/* Card Lịch hẹn hoàn thành */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center hover:translate-y-[-5px] transition-transform duration-200">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <i className="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {stats.completedAppointments}
            </h3>
            <p className="text-sm text-gray-600">Đã hoàn thành</p>
          </div>
        </div>

        {/* Card Lịch hẹn đang chờ */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center hover:translate-y-[-5px] transition-transform duration-200">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
            <i className="fas fa-clock text-yellow-600 text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {stats.pendingAppointments}
            </h3>
            <p className="text-sm text-gray-600">Đang chờ</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1  gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200">
              Lịch làm việc của tôi
            </h2>
            <Calendar appointments={mockAppointments} />
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl text-gray-700 font-medium mb-4 pb-2 border-b border-gray-200">
              Lịch hẹn sắp tới
            </h2>
            <AppointmentList appointments={mockAppointments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
