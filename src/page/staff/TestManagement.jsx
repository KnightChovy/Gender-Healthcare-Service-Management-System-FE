import React, { useState, useEffect } from "react";
import axiosClient from "../../services/axiosClient";
import { toast } from "react-toastify";

export const TestManagement = () => {
  const [testOrders, setTestOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch test orders from API
  useEffect(() => {
    fetchTestOrders();
  }, []);

  const fetchTestOrders = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');

      // Use the staff API endpoint to get all orders
      const response = await axiosClient.get('/v1/staff/getAllOrder', {
        headers: {
          'x-access-token': accessToken,
        }
      });

      if (response.data?.status === 'success' && response.data?.data?.orders) {
        console.log('Fetched test orders:', response.data.data.orders);
        
        // Transform API data to component format
        const transformedData = response.data.data.orders.map((item) => {
          const order = item.order;
          const services = item.services;
          
          return {
            id: order.order_id,
            order_id: order.order_id,
            user_id: order.user_id,
            patientId: order.user_id,
            patientName: `${order.user.last_name} ${order.user.first_name}`,
            patientPhone: order.user.phone,
            patientEmail: order.user.email,
            testType: services && services.length > 0 
              ? services.map(service => service.name).join(', ')
              : 'Xét nghiệm tổng quát',
            date: new Date(order.created_at).toLocaleDateString('vi-VN'),
            time: new Date(order.created_at).toLocaleTimeString('vi-VN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            status: mapOrderStatusToTestStatus(order.order_status),
            original_status: order.order_status,
            notes: order.notes || '',
            total_amount: order.total_amount || 0,
            payment_method: order.payment_method || 'cash',
            order_type: order.order_type || 'online',
            services: services || [],
            created_at: order.created_at,
            updated_at: order.updated_at
          };
        });

        setTestOrders(transformedData);
        setFilteredOrders(transformedData);
      } else {
        console.error('Invalid API response format:', response.data);
        setTestOrders([]);
        setFilteredOrders([]);
      }
    } catch (error) {
      console.error("Error fetching test orders:", error);
      
      // Show user-friendly error message
      if (error.response?.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (error.response?.status === 403) {
        alert("Bạn không có quyền truy cập dữ liệu này.");
      } else {
        alert("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      }
      
      // Set empty arrays on error
      setTestOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Map order status to test status
  const mapOrderStatusToTestStatus = (orderStatus) => {
    const statusMap = {
      'pending': 'Chờ thanh toán',
      'paid': 'Đã thanh toán, chờ xét nghiệm', 
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return statusMap[orderStatus] || 'Chờ thanh toán';
  };

  // Filter orders based on search criteria
  useEffect(() => {
    let filtered = testOrders.filter((order) => {
      const matchesSearch =
        order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.testType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "" || order.status === statusFilter;
      
      // Simple date filter - check if order date includes the filter date
      const matchesDate = dateFilter === "" || order.date.includes(dateFilter);

      return matchesSearch && matchesStatus && matchesDate;
    });

    setFilteredOrders(filtered);
  }, [testOrders, searchTerm, statusFilter, dateFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đã thanh toán":
        return "bg-blue-100 text-blue-800";
      case "Chờ thanh toán":
        return "bg-yellow-100 text-yellow-800";
      case "Đã hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (orderId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      console.log("Updating status for order ID:", orderId);
      const data = {
        "order_id": orderId,
      }

      // API call to update order status
      const response = await axiosClient.patch('/v1/staff/update-order', data, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': accessToken,
        }
      });

      if (response.data?.success) {
        const updatedOrder = response.data.data;
        setTestOrders(prev => 
          prev.map(order => 
            order.id === updatedOrder.order_id ? { ...order, status: updatedOrder.order_status } : order
          )
        );

        alert(`Cập nhật trạng thái thành công!`);
      } else {
        throw new Error(response.data?.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error("Error updating status:", error);
      
      if (error.response?.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else if (error.response?.status === 403) {
        alert("Bạn không có quyền cập nhật trạng thái đơn này.");
      } else if (error.response?.status === 404) {
        alert("Không tìm thấy đơn xét nghiệm này.");
      } else {
        alert("Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.");
      }
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
            <div className="flex space-x-2">
              <button 
                onClick={fetchTestOrders}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Tải lại</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{testOrders.length}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">Tổng đơn</p>
                  <p className="text-xs text-blue-600">Tất cả đơn xét nghiệm</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testOrders.filter(order => order.status === "pending").length}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-900">Chờ thanh toán</p>
                  <p className="text-xs text-yellow-600">Cần xác nhận</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testOrders.filter(order => order.status === "paid").length}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">Đã thanh toán, chờ xét nghiệm</p>
                  <p className="text-xs text-blue-600">Sẵn sàng xét nghiệm</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testOrders.filter(order => order.status === "completed").length}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-900">Hoàn thành</p>
                  <p className="text-xs text-green-600">Đã xong</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <option value="Chờ thanh toán">Chờ thanh toán</option>
              <option value="Đã thanh toán, chờ xét nghiệm">Đã thanh toán, chờ xét nghiệm</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
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
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày/Giờ
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
                      {order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{order.patientName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs">
                        {order.testType}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-medium text-green-600">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{order.date}</div>
                        <div className="text-xs text-gray-400">{order.time}</div>
                      </div>
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
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="text-cyan-600 hover:text-cyan-900"
                        >
                          Xem
                        </button>
                        {order.status !== "Hoàn thành" && order.status !== "Đã hủy" && (
                          <>
                            {order.status === "Chờ thanh toán" && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Xác nhận thanh toán
                              </button>
                            )}
                            {order.status === "Đã thanh toán" && (
                              <button 
                                onClick={() => handleUpdateStatus(order.id, "Hoàn thành")}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Hoàn thành xét nghiệm
                              </button>
                            )}
                            <button 
                              onClick={() => handleUpdateStatus(order.id, "Đã hủy")}
                              className="text-red-600 hover:text-red-900"
                            >
                              Hủy
                            </button>
                          </>
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

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết đơn xét nghiệm #{selectedOrder.order_id}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Thông tin bệnh nhân</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Tên:</span> {selectedOrder.patientName}</p>
                    <p><span className="font-medium">SĐT:</span> {selectedOrder.patientPhone}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.patientEmail}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Thông tin đơn hàng</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Ngày đặt:</span> {selectedOrder.date}</p>
                    <p><span className="font-medium">Giờ đặt:</span> {selectedOrder.time}</p>
                    <p><span className="font-medium">Loại đơn:</span> {selectedOrder.order_type === 'directly' ? 'Trực tiếp' : 'Online'}</p>
                    <p><span className="font-medium">Thanh toán:</span> {selectedOrder.payment_method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Dịch vụ xét nghiệm</h4>
                <div className="bg-gray-50 p-3 rounded">
                  {selectedOrder.services && selectedOrder.services.length > 0 ? (
                    <div className="space-y-2">
                      {selectedOrder.services.map((service, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <div>
                            <p className="text-sm font-medium">{service.name}</p>
                            {service.description && (
                              <p className="text-xs text-gray-600">{service.description}</p>
                            )}
                          </div>
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(parseFloat(service.price))}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">{selectedOrder.testType}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                  <div className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Tổng tiền:</span>
                  <div className="mt-1">
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(selectedOrder.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
              
              {selectedOrder.notes && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Ghi chú</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-gray-600">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Đóng
                </button>
                {selectedOrder.status !== "Hoàn thành" && selectedOrder.status !== "Đã hủy" && (
                  <div className="flex space-x-2">
                    {selectedOrder.status === "Chờ thanh toán" && (
                      <button 
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, "Đã thanh toán");
                          handleCloseModal();
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                      >
                        Xác nhận thanh toán
                      </button>
                    )}
                    {selectedOrder.status === "Đã thanh toán" && (
                      <button 
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, "Hoàn thành");
                          handleCloseModal();
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Hoàn thành xét nghiệm
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        handleUpdateStatus(selectedOrder.id, "Đã hủy");
                        handleCloseModal();
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Hủy đơn
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
