import React, { useState, useEffect } from "react";
import axiosClient from "../../services/axiosClient";

export const TestManagement = () => {
  const [testOrders, setTestOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Fetch test orders from API
  useEffect(() => {
    fetchTestOrders();
  }, []);

  const fetchTestOrders = async () => {
    try {
      setLoading(true);
      // Replace with actual API endpoint for test orders
      const response = await axiosClient.get("/v1/staff/test-orders");
      setTestOrders(response.data.data || []);
      setFilteredOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching test orders:", error);
      // Use mock data for development
      const mockData = [
        {
          id: "XN001",
          patientId: "BN001",
          patientName: "Nguyễn Văn A",
          testType: "Xét nghiệm máu tổng quát",
          date: "22/06/2025",
          time: "09:00",
          status: "Đang thực hiện",
          priority: "Bình thường",
          doctor: "Bác sĩ Minh",
          notes: "Xét nghiệm định kỳ",
        },
        {
          id: "XN002",
          patientId: "BN002",
          patientName: "Trần Thị B",
          testType: "Xét nghiệm hormone",
          date: "22/06/2025",
          time: "10:30",
          status: "Chờ xử lý",
          priority: "Khẩn cấp",
          doctor: "Bác sĩ Hương",
          notes: "Cần xử lý gấp",
        },
        {
          id: "XN003",
          patientId: "BN003",
          patientName: "Lê Văn C",
          testType: "Xét nghiệm nước tiểu",
          date: "22/06/2025",
          time: "14:00",
          status: "Hoàn thành",
          priority: "Bình thường",
          doctor: "Bác sĩ Nam",
          notes: "Hoàn thành xét nghiệm",
        },
      ];
      setTestOrders(mockData);
      setFilteredOrders(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search criteria
  useEffect(() => {
    let filtered = testOrders.filter((order) => {
      const matchesSearch =
        order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.testType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "" || order.status === statusFilter;
      const matchesPriority = priorityFilter === "" || order.priority === priorityFilter;
      const matchesDate = dateFilter === "" || order.date.includes(dateFilter);

      return matchesSearch && matchesStatus && matchesPriority && matchesDate;
    });

    setFilteredOrders(filtered);
  }, [testOrders, searchTerm, statusFilter, priorityFilter, dateFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đang thực hiện":
        return "bg-blue-100 text-blue-800";
      case "Chờ xử lý":
        return "bg-yellow-100 text-yellow-800";
      case "Đã hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Khẩn cấp":
        return "bg-red-100 text-red-800";
      case "Cao":
        return "bg-orange-100 text-orange-800";
      case "Bình thường":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // API call to update status
      await axiosClient.put(`/v1/staff/test-orders/${orderId}/status`, {
        status: newStatus,
      });
      
      // Update local state
      setTestOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Quản lý đơn xét nghiệm
            </h2>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded transition">
              + Thêm đơn xét nghiệm
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <input
              type="text"
              placeholder="Tìm theo tên, mã đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Chờ xử lý">Chờ xử lý</option>
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Tất cả độ ưu tiên</option>
              <option value="Bình thường">Bình thường</option>
              <option value="Cao">Cao</option>
              <option value="Khẩn cấp">Khẩn cấp</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setPriorityFilter("");
                setDateFilter("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Đặt lại
            </button>
          </div>

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Hiển thị {filteredOrders.length} / {testOrders.length} đơn xét nghiệm
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bệnh nhân
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại xét nghiệm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bác sĩ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày/Giờ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Độ ưu tiên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{order.patientName}</div>
                        <div className="text-xs text-gray-400">{order.patientId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.testType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.doctor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{order.date}</div>
                        <div className="text-xs text-gray-400">{order.time}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                          order.priority
                        )}`}
                      >
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-cyan-600 hover:text-cyan-900">
                          Xem
                        </button>
                        {order.status !== "Hoàn thành" && order.status !== "Đã hủy" && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(order.id, "Đang thực hiện")}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Bắt đầu
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(order.id, "Hoàn thành")}
                              className="text-green-600 hover:text-green-900"
                            >
                              Hoàn thành
                            </button>
                          </>
                        )}
                        {order.status !== "Hoàn thành" && order.status !== "Đã hủy" && (
                          <button 
                            onClick={() => handleUpdateStatus(order.id, "Đã hủy")}
                            className="text-red-600 hover:text-red-900"
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy đơn xét nghiệm nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
