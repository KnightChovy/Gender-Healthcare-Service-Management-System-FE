import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export const DashboardManager = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalDoctors: 0,
    totalReviews: 0,
    averageRating: 0,
    totalRevenue: 0,
    monthlyRevenue: [],
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setStats({
        totalAppointments: 157,
        pendingAppointments: 42,
        completedAppointments: 115,
        totalDoctors: 12,
        totalReviews: 89,
        averageRating: 4.7,
        totalRevenue: 45800000,
        monthlyRevenue: [
          { month: "Jan", revenue: 3200000 },
          { month: "Feb", revenue: 3800000 },
          { month: "Mar", revenue: 4200000 },
          { month: "Apr", revenue: 3900000 },
          { month: "May", revenue: 4500000 },
          { month: "Jun", revenue: 5100000 },
        ],
      });
    }, 1000);
  }, []);

  const mockAppointments = [
    {
      id: 1,
      patientName: "Nguyễn Văn A",
      service: "Tư vấn sức khỏe",
      doctor: "Bác sĩ Minh",
      date: "22/06/2025",
      time: "09:00",
      status: "Đã xác nhận",
    },
    {
      id: 2,
      patientName: "Trần Thị B",
      service: "Khám tổng quát",
      doctor: "Bác sĩ Hương",
      date: "22/06/2025",
      time: "10:30",
      status: "Chờ xác nhận",
    },
    {
      id: 3,
      patientName: "Lê Văn C",
      service: "Tư vấn dinh dưỡng",
      doctor: "Bác sĩ Nam",
      date: "23/06/2025",
      time: "14:00",
      status: "Đã xác nhận",
    },
    {
      id: 4,
      patientName: "Phạm Thị D",
      service: "Khám chuyên khoa",
      doctor: "Bác sĩ Linh",
      date: "24/06/2025",
      time: "11:00",
      status: "Đã hủy",
    },
  ];

  const mockSchedules = [
    {
      id: 1,
      doctorName: "Bác sĩ Minh",
      specialty: "Tim mạch",
      date: "22/06/2025",
      startTime: "08:00",
      endTime: "17:00",
    },
    {
      id: 2,
      doctorName: "Bác sĩ Hương",
      specialty: "Da liễu",
      date: "22/06/2025",
      startTime: "08:00",
      endTime: "12:00",
    },
    {
      id: 3,
      doctorName: "Bác sĩ Nam",
      specialty: "Dinh dưỡng",
      date: "23/06/2025",
      startTime: "13:00",
      endTime: "17:00",
    },
    {
      id: 4,
      doctorName: "Bác sĩ Linh",
      specialty: "Nội khoa",
      date: "22/06/2025",
      startTime: "08:00",
      endTime: "17:00",
    },
  ];

  const mockReviews = [
    {
      id: 1,
      patientName: "Nguyễn Văn A",
      doctor: "Bác sĩ Minh",
      rating: 5,
      comment: "Bác sĩ tư vấn rất tận tình, cảm ơn bác sĩ nhiều!",
      date: "20/06/2025",
    },
    {
      id: 2,
      patientName: "Trần Thị B",
      doctor: "Bác sĩ Hương",
      rating: 4,
      comment: "Dịch vụ tốt, nhưng thời gian chờ hơi lâu",
      date: "19/06/2025",
    },
    {
      id: 3,
      patientName: "Lê Văn C",
      doctor: "Bác sĩ Nam",
      rating: 5,
      comment: "Bác sĩ chuyên môn cao, giải thích rõ ràng",
      date: "18/06/2025",
    },
  ];

  const mockRevenueData = [
    { service: "Tư vấn sức khỏe", revenue: 15600000, percentage: 34 },
    { service: "Khám tổng quát", revenue: 12400000, percentage: 27 },
    { service: "Tư vấn dinh dưỡng", revenue: 8700000, percentage: 19 },
    { service: "Khám chuyên khoa", revenue: 9100000, percentage: 20 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <h1 className="text-gray-800 mb-5 border-b pb-4 text-2xl font-bold">
        Dashboard Quản Lý
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-lg p-5 shadow hover:shadow-lg transition duration-300 text-center">
          <h3 className="text-gray-500 text-base mb-2">Tổng số cuộc hẹn</h3>
          <p className="text-gray-800 text-2xl font-bold">
            {stats.totalAppointments}
          </p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow hover:shadow-lg transition duration-300 text-center">
          <h3 className="text-gray-500 text-base mb-2">Bác sĩ</h3>
          <p className="text-gray-800 text-2xl font-bold">
            {stats.totalDoctors}
          </p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow hover:shadow-lg transition duration-300 text-center">
          <h3 className="text-gray-500 text-base mb-2">Đánh giá</h3>
          <p className="text-gray-800 text-2xl font-bold">
            {stats.averageRating} ★ ({stats.totalReviews})
          </p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow hover:shadow-lg transition duration-300 text-center">
          <h3 className="text-gray-500 text-base mb-2">Doanh thu</h3>
          <p className="text-gray-800 text-2xl font-bold">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mb-5 border-b pb-3">
        <button
          className={`bg-transparent px-5 py-2 cursor-pointer text-base rounded-t transition ${
            activeTab === "overview"
              ? "border-b-2 border-blue-500 font-bold text-blue-500"
              : "hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Tổng quan
        </button>
        <button
          className={`bg-transparent px-5 py-2 cursor-pointer text-base rounded-t transition ${
            activeTab === "appointments"
              ? "border-b-2 border-blue-500 font-bold text-blue-500"
              : "hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("appointments")}
        >
          Quản lý đặt lịch
        </button>
        <button
          className={`bg-transparent px-5 py-2 cursor-pointer text-base rounded-t transition ${
            activeTab === "schedules"
              ? "border-b-2 border-blue-500 font-bold text-blue-500"
              : "hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("schedules")}
        >
          Quản lý lịch làm việc
        </button>
        <button
          className={`bg-transparent px-5 py-2 cursor-pointer text-base rounded-t transition ${
            activeTab === "reviews"
              ? "border-b-2 border-blue-500 font-bold text-blue-500"
              : "hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Quản lý đánh giá
        </button>
        <button
          className={`bg-transparent px-5 py-2 cursor-pointer text-base rounded-t transition ${
            activeTab === "revenue"
              ? "border-b-2 border-blue-500 font-bold text-blue-500"
              : "hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("revenue")}
        >
          Quản lý doanh thu
        </button>
      </div>

      <div className="bg-white rounded-lg p-5 shadow">
        {activeTab === "overview" && (
          <div>
            <div className="mb-8">
              <h2 className="text-gray-700 mb-4 text-xl">
                Doanh thu theo tháng
              </h2>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="w-full md:w-1/2 bg-white rounded-lg p-4 shadow-sm">
                <h2 className="text-gray-700 mb-4 text-lg">
                  Trạng thái cuộc hẹn
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Đã hoàn thành",
                            value: stats.completedAppointments,
                          },
                          {
                            name: "Đang chờ",
                            value: stats.pendingAppointments,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {[0, 1].map((index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="w-full md:w-1/2 bg-white rounded-lg p-4 shadow-sm">
                <h2 className="text-gray-700 mb-4 text-lg">
                  Doanh thu theo dịch vụ
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="service" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="revenue" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "appointments" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Quản lý đặt lịch tư vấn
              </h2>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition">
                + Thêm lịch hẹn mới
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Tìm theo tên bệnh nhân"
                className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Trạng thái</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bệnh nhân
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dịch vụ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bác sĩ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giờ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {appointment.patientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.doctor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            appointment.status === "Đã xác nhận"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "Chờ xác nhận"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded mr-2 text-xs">
                          Sửa
                        </button>
                        <button className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs">
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button className="py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  &laquo;
                </button>
                <button className="py-2 px-4 border border-gray-300 bg-blue-500 text-sm font-medium text-white">
                  1
                </button>
                <button className="py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  2
                </button>
                <button className="py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  3
                </button>
                <button className="py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  &raquo;
                </button>
              </nav>
            </div>
          </div>
        )}

        {activeTab === "schedules" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Quản lý lịch làm việc
              </h2>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition">
                + Thêm lịch làm việc mới
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Tìm theo tên bác sĩ"
                className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Chuyên khoa</option>
                <option value="cardiology">Tim mạch</option>
                <option value="dermatology">Da liễu</option>
                <option value="nutrition">Dinh dưỡng</option>
                <option value="internal">Nội khoa</option>
              </select>
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bác sĩ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chuyên khoa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giờ bắt đầu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giờ kết thúc
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockSchedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {schedule.doctorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.specialty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.startTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded mr-2 text-xs">
                          Sửa
                        </button>
                        <button className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs">
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button className="py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  &laquo;
                </button>
                <button className="py-2 px-4 border border-gray-300 bg-blue-500 text-sm font-medium text-white">
                  1
                </button>
                <button className="py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  2
                </button>
                <button className="py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  3
                </button>
                <button className="py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  &raquo;
                </button>
              </nav>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Quản lý đánh giá
              </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                placeholder="Tìm đánh giá"
                className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Đánh giá</option>
                <option value="5">5 sao</option>
                <option value="4">4 sao</option>
                <option value="3">3 sao</option>
                <option value="2">2 sao</option>
                <option value="1">1 sao</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Bác sĩ</option>
                <option value="dr1">Bác sĩ Minh</option>
                <option value="dr2">Bác sĩ Hương</option>
                <option value="dr3">Bác sĩ Nam</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockReviews.map((review) => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800">
                      {review.patientName}
                    </h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          } text-lg`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Bác sĩ: {review.doctor}
                  </p>
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{review.date}</span>
                    <button className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button className="py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  &laquo;
                </button>
                <button className="py-2 px-4 border border-gray-300 bg-blue-500 text-sm font-medium text-white">
                  1
                </button>
                <button className="py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  2
                </button>
                <button className="py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  3
                </button>
                <button className="py-2 px-4 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  &raquo;
                </button>
              </nav>
            </div>
          </div>
        )}

        {activeTab === "revenue" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Quản lý doanh thu
              </h2>
            </div>

            <div className="flex mb-6">
              <select className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm nay</option>
                <option value="custom">Tùy chỉnh</option>
              </select>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Doanh thu theo thời gian
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-full md:w-1/2">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Doanh thu theo dịch vụ
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockRevenueData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                        label={({ service, percentage }) =>
                          `${service}: ${percentage}%`
                        }
                      >
                        {mockRevenueData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="w-full md:w-1/2">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Doanh thu theo bác sĩ
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Bác sĩ Minh", revenue: 15200000 },
                        { name: "Bác sĩ Hương", revenue: 12800000 },
                        { name: "Bác sĩ Nam", revenue: 9500000 },
                        { name: "Bác sĩ Linh", revenue: 8300000 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Tổng kết doanh thu
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dịch vụ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doanh thu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tỷ lệ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockRevenueData.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          32
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(item.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.percentage}%
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td
                        colSpan="2"
                        className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900"
                      >
                        Tổng cộng
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(stats.totalRevenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        100%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
