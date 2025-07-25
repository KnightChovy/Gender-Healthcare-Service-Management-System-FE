import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "react-toastify";
import axiosClient from "../../services/axiosClient";

export const DashboardStaff = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalPatients: 0,
    todayOrders: 0,
    totalRevenue: 0,
    weeklyOrders: [],
    serviceTypes: [],
    ordersByStatus: []
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');

      const response = await axiosClient.get('/v1/staff/getAllOrder', {
        headers: {
          'x-access-token': accessToken,
        }
      });

      if (response.data?.status === 'success' && response.data?.data?.orders) {
        const ordersData = response.data.data.orders;
        setOrders(ordersData);
        calculateStats(ordersData);
        
        toast.success(`Tải thành công ${ordersData.length} đơn hàng`, {
          autoClose: 1000,
          position: "top-right",
        });
      } else {
        console.error('Invalid API response format:', response.data);
        toast.error('Định dạng dữ liệu không hợp lệ', {
          autoClose: 1000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else if (error.response?.status === 403) {
        toast.error("Bạn không có quyền truy cập dữ liệu này.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else {
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.", {
          autoClose: 1000,
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    if (!ordersData || ordersData.length === 0) return;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Basic stats
    const totalOrders = ordersData.length;
    const completedOrders = ordersData.filter(item => item.order.order_status === 'completed').length;
    const cancelledOrders = ordersData.filter(item => item.order.order_status === 'cancelled').length;
    const todayOrders = ordersData.filter(item => {
      const orderDate = new Date(item.order.created_at).toISOString().split('T')[0];
      return orderDate === todayStr;
    }).length;

    // Total revenue (from completed orders only)
    const totalRevenue = ordersData
      .filter(item => item.order.order_status === 'completed')
      .reduce((sum, item) => sum + (item.order.total_amount || 0), 0);

    // Unique patients
    const uniquePatients = new Set(ordersData.map(item => item.order.user_id)).size;

    // Weekly orders (last 7 days)
    const weeklyOrders = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const ordersCount = ordersData.filter(item => {
        const orderDate = new Date(item.order.created_at).toISOString().split('T')[0];
        return orderDate === dateStr;
      }).length;

      weeklyOrders.push({
        day: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
        date: dateStr,
        orders: ordersCount
      });
    }

    // Service types statistics
    const serviceStats = {};
    ordersData.forEach(item => {
      if (item.services && item.services.length > 0) {
        item.services.forEach(service => {
          if (serviceStats[service.name]) {
            serviceStats[service.name]++;
          } else {
            serviceStats[service.name] = 1;
          }
        });
      }
    });

    const serviceTypes = Object.entries(serviceStats)
      .map(([name, count]) => ({ name, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 services

    // Orders by status
    const ordersByStatus = [
      { name: 'Hoàn thành', value: completedOrders, color: '#10b981' },
      { name: 'Đã hủy', value: cancelledOrders, color: '#ef4444' },
      { name: 'Khác', value: totalOrders - completedOrders - cancelledOrders, color: '#6b7280' }
    ].filter(item => item.value > 0);

    setStats({
      totalOrders,
      completedOrders,
      cancelledOrders,
      totalPatients: uniquePatients,
      todayOrders,
      totalRevenue,
      weeklyOrders,
      serviceTypes,
      ordersByStatus
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const tabs = [
    { id: "overview", name: "Tổng quan", icon: "📊" },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00c49f'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Staff Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Quản lý đơn hàng và thống kê dịch vụ
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchOrders}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                🔄 Làm mới
              </button>
              <div className="text-sm text-gray-500">
                Hôm nay: {new Date().toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">📋</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Tổng đơn hàng
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalOrders}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">✅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Hoàn thành
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.completedOrders}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">❌</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Đã hủy
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.cancelledOrders}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">👥</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Khách hàng
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.totalPatients}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <span className="text-white font-bold">📅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Hôm nay
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.todayOrders}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Orders Chart */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Đơn hàng theo tuần
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.weeklyOrders}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Service Types Distribution */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Top 5 dịch vụ phổ biến
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.serviceTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {stats.serviceTypes.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Orders by Status */}
              <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Phân bố trạng thái đơn hàng
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.ordersByStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {stats.ordersByStatus.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};