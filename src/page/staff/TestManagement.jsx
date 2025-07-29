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
  const [showResultModal, setShowResultModal] = useState(false);
  const [testResultsData, setTestResultsData] = useState([]);
  const [resultLoading, setResultLoading] = useState(false);

  const ServicesList = ({ services, isInModal = false }) => {
    const [showAll, setShowAll] = useState(false);
    const maxDisplayItems = 3;
    
    if (!services || services.length === 0) {
      return <span className="text-gray-500 text-xs">Không có dịch vụ</span>;
    }

    const displayServices = showAll ? services : services.slice(0, maxDisplayItems);
    const hasMore = services.length > maxDisplayItems;

    if (isInModal) {
      return (
        <div className="space-y-2">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h5 className="font-medium text-gray-800 text-sm">{service.name}</h5>
                    <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      ID: {service.id || service.service_id || 'N/A'}
                    </span>
                  </div>
                  {service.description && (
                    <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                  )}
                  <div className="flex items-center text-xs">
                    <div className="flex items-center text-orange-600">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Thời gian chờ:</span>
                      <span className="ml-1 bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-medium">
                        {service.result_wait_time || 'Không xác định'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    {formatCurrency(parseFloat(service.price))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="max-w-xs">
        <div className="space-y-1">
          {displayServices.map((service, index) => (
            <div key={index} className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded border">
              <div className="font-medium truncate" title={service.name}>
                {service.name}
              </div>
            </div>
          ))}
        </div>
        
        {hasMore && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAll(!showAll);
            }}
            className="mt-1 text-xs text-blue-600 hover:text-blue-800 font-medium underline focus:outline-none"
          >
            {showAll ? `Ẩn bớt` : `Xem thêm (${services.length - maxDisplayItems})`}
          </button>
        )}
      </div>
    );
  };

  const WaitTimesList = ({ waitTimes, services }) => {
    const [showAll, setShowAll] = useState(false);
    const maxDisplayItems = 3;
    
    if (!waitTimes || waitTimes.length === 0) {
      return <span className="text-gray-500 text-xs">Không xác định</span>;
    }

    const actualWaitTimes = services && services.length > 0 
      ? services.map(service => service.result_wait_time || "Không xác định")
      : waitTimes;

    const displayWaitTimes = showAll ? actualWaitTimes : actualWaitTimes.slice(0, maxDisplayItems);
    const hasMore = actualWaitTimes.length > maxDisplayItems;

    return (
      <div className="max-w-xs">
        <div className="space-y-1">
          {displayWaitTimes.map((time, index) => (
            <div key={index} className="text-xs bg-orange-50 text-orange-800 px-2 py-1 rounded border">
              <div className="flex items-center">
                <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="truncate" title={time}>
                  {time}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {hasMore && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAll(!showAll);
            }}
            className="mt-1 text-xs text-orange-600 hover:text-orange-800 font-medium underline focus:outline-none"
          >
            {showAll ? `Ẩn bớt` : `Xem thêm (${actualWaitTimes.length - maxDisplayItems})`}
          </button>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchTestOrders();
  }, []);

  const fetchTestOrders = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');

      const response = await axiosClient.get('/v1/staff/getAllOrder', {
        headers: {
          'x-access-token': accessToken,
        }
      });

      if (response.data?.status === 'success' && response.data?.data?.orders) {
        console.log('Fetched test orders:', response.data.data.orders);

        const transformedData = response.data.data.orders.map((item) => {
          const order = item.order;
          const services = item.services;
          const details = item.details || [];

          const firstDetail = details.length > 0 ? details[0] : null;
          const examDate = firstDetail?.exam_date;
          const examTime = firstDetail?.exam_time;

          let displayDate = examDate ? new Date(examDate).toLocaleDateString('vi-VN') : null;
          let displayTime = examTime ? examTime : null;
          let sortableDate = null;

          if (examDate && examTime) {
            const examDateTime = new Date(`${examDate}T${examTime}`);
            sortableDate = examDateTime;
          } else if (examDate) {
            sortableDate = new Date(examDate);
          }

          return {
            id: order.order_id,
            order_id: order.order_id,
            user_id: order.user_id,
            patientId: order.user_id,
            patientName: `${order.user.last_name} ${order.user.first_name}`,
            patientPhone: order.user.phone,
            patientEmail: order.user.email,
            testType: services && services.length > 0
              ? services.map(service => service.name)
              : ['Xét nghiệm tổng quát'],
            testResultWaitTime: services && services.length > 0
              ? services.map(service => service.result_wait_time || "Không xác định")
              : ['Không xác định'],
            date: displayDate,
            time: displayTime,
            sortableDate: sortableDate,
            examDate: examDate,
            examTime: examTime,
            status: mapOrderStatusToTestStatus(order.order_status),
            original_status: order.order_status,
            notes: order.notes || '',
            total_amount: order.total_amount || 0,
            payment_method: order.payment_method || 'cash',
            order_type: order.order_type || 'online',
            services: services || [],
            details: details || [],
            created_at: order.created_at,
            updated_at: order.updated_at
          };
        });

        setTestOrders(transformedData);
        setFilteredOrders(transformedData);
        toast.success(`Tải thành công ${transformedData.length} đơn xét nghiệm`, {
          autoClose: 1000,
          position: "top-right",
        });
      } else {
        console.error('Invalid API response format:', response.data);
        setTestOrders([]);
        setFilteredOrders([]);
        toast.error('Định dạng dữ liệu không hợp lệ', {
          autoClose: 1000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error fetching test orders:", error);

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

      setTestOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const mapOrderStatusToTestStatus = (orderStatus) => {
    const statusMap = {
      'pending': 'Chờ thanh toán',
      'paid': 'Đã thanh toán, chờ xét nghiệm',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy'
    };
    return statusMap[orderStatus] || 'Chờ thanh toán';
  };

  useEffect(() => {
    let filtered = testOrders.filter((order) => {
      const matchesSearch =
        order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(order.testType) 
          ? order.testType.some(test => test.toLowerCase().includes(searchTerm.toLowerCase()))
          : order.testType.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "" || order.status === statusFilter;

      let matchesDate = true;
      if (dateFilter !== "" && order.examDate) {
        const filterDate = new Date(dateFilter);
        const filterDateString = filterDate.toISOString().split('T')[0];
        matchesDate = order.examDate === filterDateString;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    setFilteredOrders(filtered);
  }, [testOrders, searchTerm, statusFilter, dateFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đã thanh toán, chờ xét nghiệm":
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

      const toastId = toast.loading("Đang cập nhật trạng thái...");

      const data = {
        order_id: orderId,
      };

      const response = await axiosClient.patch('/v1/staff/update-order', data, {
        headers: {
          'x-access-token': accessToken,
        }
      });

      if (response.data?.success) {
        const updatedOrder = response.data.data;
        const newDisplayStatus = mapOrderStatusToTestStatus(updatedOrder.order_status);

        setTestOrders(prev =>
          prev.map(order =>
            order.id === updatedOrder.order_id
              ? { ...order, status: newDisplayStatus, original_status: updatedOrder.order_status }
              : order
          )
        );

        toast.dismiss(toastId);
        toast.success(`Cập nhật trạng thái thành "${newDisplayStatus}" thành công!`, {
          autoClose: 1000,
          position: "top-right",
        });

        fetchTestOrders()
      } else {
        toast.dismiss(toastId);
        throw new Error(response.data?.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error("Error updating status:", error);

      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else if (error.response?.status === 403) {
        toast.error("Bạn không có quyền cập nhật trạng thái đơn này.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else if (error.response?.status === 404) {
        toast.error("Không tìm thấy đơn xét nghiệm này.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Yêu cầu không hợp lệ.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.", {
          autoClose: 1000,
          position: "top-right",
        });
      }
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      console.log("Completing order ID:", orderId);

      const toastId = toast.loading("Đang hoàn thành xét nghiệm...");

      const response = await axiosClient.patch(`/v1/staff/orders/${orderId}/complete`, {}, {
        headers: {
          'x-access-token': accessToken,
        }
      });

      if (response.data?.success) {
        const updatedOrder = response.data.data;
        const newDisplayStatus = mapOrderStatusToTestStatus(updatedOrder.order_status);

        setTestOrders(prev =>
          prev.map(order =>
            order.id === updatedOrder.order_id
              ? { ...order, status: newDisplayStatus, original_status: updatedOrder.order_status }
              : order
          )
        );

        toast.dismiss(toastId);
        toast.success(`Hoàn thành xét nghiệm thành công!`, {
          autoClose: 1000,
          position: "top-right",
        });

        fetchTestOrders()
      } else {
        toast.dismiss(toastId);
        throw new Error(response.data?.message || 'Hoàn thành xét nghiệm thất bại');
      }
    } catch (error) {
      console.error("Error completing order:", error);

      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else if (error.response?.status === 403) {
        toast.error("Bạn không có quyền hoàn thành đơn này.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else if (error.response?.status === 404) {
        toast.error("Không tìm thấy đơn xét nghiệm này.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Yêu cầu không hợp lệ.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else {
        toast.error("Có lỗi xảy ra khi hoàn thành xét nghiệm. Vui lòng thử lại.", {
          autoClose: 1000,
          position: "top-right",
        });
      }
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      console.log("Cancelling order ID:", orderId);

      const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy đơn xét nghiệm này không?");
      if (!confirmCancel) return;

      const toastId = toast.loading("Đang hủy đơn xét nghiệm...");

      const response = await axiosClient.patch(`/v1/staff/orders/${orderId}/cancel`, {}, {
        headers: {
          'x-access-token': accessToken,
        }
      });

      if (response.data?.success) {
        const updatedOrder = response.data.data;
        const newDisplayStatus = mapOrderStatusToTestStatus(updatedOrder.order_status);

        setTestOrders(prev =>
          prev.map(order =>
            order.id === updatedOrder.order_id
              ? { ...order, status: newDisplayStatus, original_status: updatedOrder.order_status }
              : order
          )
        );

        toast.dismiss(toastId);
        toast.success(`Hủy đơn xét nghiệm thành công!`, {
          autoClose: 1000,
          position: "top-right",
        });

        fetchTestOrders()
      } else {
        toast.dismiss(toastId);
        throw new Error(response.data?.message || 'Hủy đơn xét nghiệm thất bại');
      }
    } catch (error) {
      console.error("Error cancelling order:", error);

      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else if (error.response?.status === 403) {
        toast.error("Bạn không có quyền hủy đơn này.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else if (error.response?.status === 404) {
        toast.error("Không tìm thấy đơn xét nghiệm này.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Yêu cầu không hợp lệ.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else {
        toast.error("Có lỗi xảy ra khi hủy đơn xét nghiệm. Vui lòng thử lại.", {
          autoClose: 1000,
          position: "top-right",
        });
      }
    }
  };

  const handleRefresh = () => {
    toast.info("Đang tải lại dữ liệu...", {
      autoClose: 1000,
      position: "top-right",
    });
    fetchTestOrders();
  };

  const fetchTestResults = async () => {
    try {
      setResultLoading(true);
      const accessToken = localStorage.getItem('accessToken');

      const response = await axiosClient.get('/v1/test-results', {
        headers: {
          'x-access-token': accessToken,
        }
      });

      if (response.data && Array.isArray(response.data)) {
        setTestResultsData(response.data);
        console.log('Fetched test results:', response.data);
      } else {
        setTestResultsData([]);
        toast.error('Không thể tải danh sách kết quả xét nghiệm', {
          autoClose: 1000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error fetching test results:", error);
      setTestResultsData([]);
      
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else {
        toast.error("Không thể tải danh sách kết quả xét nghiệm. Vui lòng thử lại.", {
          autoClose: 1000,
          position: "top-right",
        });
      }
    } finally {
      setResultLoading(false);
    }
  };

  const handleSaveTestResults = async (orderResults) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      toast.warn("Đang lưu kết quả xét nghiệm...", {
        autoClose: 2000,
        position: "top-right",
      });

      const testResultsToSave = Object.entries(orderResults).map(([testId, resultData]) => {
        const testInfo = testResultsData.find(test => test._id === testId);
        
        const matchingService = selectedOrder.services?.find(
          service => service.name.toLowerCase().trim() === testInfo?.name.toLowerCase().trim()
        );
        
        return {
          service_id: matchingService?.id || matchingService?.service_id || testInfo?._id || '',
          order_id: selectedOrder.order_id,
          result: resultData.result === 'good' ? 
            (testInfo?.good_result || 'Kết quả bình thường') : 
            (testInfo?.bad_result || 'Kết quả bất thường'),
          conclusion: resultData.result === 'good' ? 
            (testInfo?.good_title || 'Tốt') : 
            (testInfo?.bad_title || 'Xấu'),
          normal_range: resultData.result || '',
          recommendations: resultData.note || '',
          created_at: new Date().toISOString(),
          image: resultData.image?.name || null
        };
      });

      console.log("Test results to save:", testResultsToSave);

      const hasImages = testResultsToSave.some(result => result.image_name);

      const data = {
        order_id: selectedOrder.order_id,
        test_results: testResultsToSave
      };

      console.log("Dữ liệu gửi xuống (chỉ có tên hình ảnh): ", data);
      const response = await axiosClient.post('/v1/test-results/create-testResult', data, {
        headers: {
          'x-access-token': accessToken,
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.success) {
        const successMessage = hasImages ? "Lưu kết quả xét nghiệm và tên hình ảnh thành công!" : "Lưu kết quả xét nghiệm thành công!";
        toast.success(successMessage, {
          autoClose: 2000,
          position: "top-right",
        });
        
        setShowResultModal(false);
        setSelectedOrder(null);
        setTestResultsData([]);
        
        fetchTestOrders();
      } else {
        throw new Error(response.data?.message || 'Lưu kết quả thất bại');
      }

    } catch (error) {
      console.error("Error saving test results:", error);
      
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else if (error.response?.status === 403) {
        toast.error("Bạn không có quyền lưu kết quả xét nghiệm.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else if (error.response?.status === 400) {
        toast.error(error.response.data?.message || "Dữ liệu không hợp lệ.", {
          autoClose: 1000,
          position: "top-right",
        });
      } else {
        toast.error("Không thể lưu kết quả xét nghiệm. Vui lòng thử lại.", {
          autoClose: 1000,
          position: "top-right",
        });
      }
    }
  };

  const handleOpenResultModal = (order) => {
    setSelectedOrder(order);
    setShowResultModal(true);
    fetchTestResults();
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setSelectedOrder(null);
    setTestResultsData([]);
  };

  const TestResultsInput = () => {
    const [results, setResults] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [uploadedImages, setUploadedImages] = useState({});

    const handleResultChange = (testId, field, value) => {
      setResults(prev => ({
        ...prev,
        [testId]: {
          ...prev[testId],
          [field]: value
        }
      }));

      if (validationErrors[testId]) {
        setValidationErrors(prev => ({
          ...prev,
          [testId]: {
            ...prev[testId],
            [field]: ''
          }
        }));
      }
    };

    const handleImageUpload = (testId, files) => {
      if (files && files.length > 0) {
        const file = files[0];
        
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          toast.error('Chỉ chấp nhận file hình ảnh (JPG, PNG, GIF)', {
            autoClose: 3000,
            position: "top-right",
          });
          return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          toast.error('Kích thước file không được vượt quá 5MB', {
            autoClose: 3000,
            position: "top-right",
          });
          return;
        }

        const imageUrl = URL.createObjectURL(file);
        
        setUploadedImages(prev => ({
          ...prev,
          [testId]: {
            file: file,
            preview: imageUrl,
            name: file.name,
            type: file.type,
            url: imageUrl
          }
        }));

        toast.success('Tải lên hình ảnh thành công', {
          autoClose: 2000,
          position: "top-right",
        });
      }
    };

    const removeImage = (testId) => {
      if (uploadedImages[testId]?.preview) {
        URL.revokeObjectURL(uploadedImages[testId].preview);
      }

      setUploadedImages(prev => {
        const newImages = { ...prev };
        delete newImages[testId];
        return newImages;
      });

      toast.info('Đã xóa hình ảnh', {
        autoClose: 1500,
        position: "top-right",
      });
    };

    const validateForm = () => {
      const errors = {};
      let hasErrors = false;

      const hasAnyResult = Object.values(results).some(result => result.result);
      if (!hasAnyResult) {
        toast.error("Vui lòng chọn kết quả cho ít nhất một xét nghiệm");
        return false;
      }

      Object.entries(results).forEach(([testId, resultData]) => {
        if (resultData.result && !resultData.result.trim()) {
          errors[testId] = { result: 'Vui lòng chọn kết quả' };
          hasErrors = true;
        }
      });

      setValidationErrors(errors);
      return !hasErrors;
    };

    const handleSubmit = () => {
      if (!validateForm()) {
        return;
      }

      const filteredResults = Object.entries(results)
        .filter(([, resultData]) => resultData.result && resultData.result.trim())
        .reduce((acc, [testId, resultData]) => {
          acc[testId] = {
            ...resultData,
            image: uploadedImages[testId] || null
          };
          return acc;
        }, {});

      if (Object.keys(filteredResults).length === 0) {
        toast.error("Vui lòng nhập ít nhất một kết quả xét nghiệm");
        return;
      }

      const resultCount = Object.keys(filteredResults).length;
      const serviceNames = Object.entries(filteredResults)
        .map(([testId]) => {
          const testInfo = testResultsData.find(test => test._id === testId);
          return testInfo?.name || 'Unknown';
        })
        .join(', ');

      const hasImages = Object.values(filteredResults).some(result => result.image);
      const imageCount = Object.values(filteredResults).filter(result => result.image).length;

      const confirmMessage = `Bạn có chắc chắn muốn lưu kết quả xét nghiệm cho ${resultCount} dịch vụ không?\n\nDịch vụ: ${serviceNames}${
        hasImages ? `\n\nHình ảnh: ${imageCount} file` : ''
      }`;

      const confirmSave = window.confirm(confirmMessage);
      
      if (confirmSave) {
        handleSaveTestResults(filteredResults);
      }
    };

    const getMatchingTestResults = () => {
      if (!selectedOrder?.services || !testResultsData) return [];
      
      const orderedServiceNames = selectedOrder.services.map(service => 
        service.name.toLowerCase().trim()
      );
      
      const matchingResults = testResultsData.filter(test => 
        orderedServiceNames.includes(test.name.toLowerCase().trim())
      );
      
      return matchingResults;
    };

    const matchingTestResults = getMatchingTestResults();

    React.useEffect(() => {
      return () => {
        Object.values(uploadedImages).forEach(imageData => {
          if (imageData.preview) {
            URL.revokeObjectURL(imageData.preview);
          }
        });
      };
    }, [uploadedImages]);

    return (
      <div className="space-y-6">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">Thông tin bệnh nhân</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800">Tên bệnh nhân:</span>
              <p className="text-blue-700 mt-1">{selectedOrder?.patientName}</p>
            </div>
            <div>
              <span className="font-medium text-blue-800">Số điện thoại:</span>
              <p className="text-blue-700 mt-1">{selectedOrder?.patientPhone}</p>
            </div>
            <div>
              <span className="font-medium text-blue-800">Mã đơn hàng:</span>
              <p className="text-blue-700 mt-1">{selectedOrder?.order_id}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-3">Dịch vụ đã đặt</h4>
          <div className="space-y-3">
            {selectedOrder?.services?.map((service, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h5 className="font-medium text-green-800">{service.name}</h5>
                      <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        ID: {service.id || service.service_id || 'N/A'}
                      </span>
                    </div>
                    {service.description && (
                      <p className="text-sm text-green-600 mb-2">{service.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center text-orange-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Thời gian chờ kết quả:</span>
                        <span className="ml-1 bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">
                          {service.result_wait_time || 'Không xác định'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                      {formatCurrency(parseFloat(service.price))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {resultLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {matchingTestResults.length > 0 ? (
              <>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Kết quả xét nghiệm ({matchingTestResults.length} dịch vụ)
                  </h4>
                  <p className="text-sm text-gray-600">
                    Chỉ hiển thị các xét nghiệm có trong đơn hàng
                  </p>
                </div>

                {matchingTestResults.map((test, index) => {
                  const matchingService = selectedOrder.services.find(
                    service => service.name.toLowerCase().trim() === test.name.toLowerCase().trim()
                  );

                  return (
                    <div key={test._id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              <h5 className="font-semibold text-gray-900 text-lg">{test.name}</h5>
                              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                Service ID: {matchingService?.id || matchingService?.service_id || 'N/A'}
                              </span>
                            </div>
                            {matchingService && (
                              <div className="flex items-center mt-2 text-sm text-orange-600">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Thời gian chờ kết quả: </span>
                                <span className="ml-1 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                                  {matchingService.result_wait_time || 'Không xác định'}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Kết quả xét nghiệm *
                            </label>
                            <select
                              value={results[test._id]?.result || ''}
                              onChange={(e) => handleResultChange(test._id, 'result', e.target.value)}
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                validationErrors[test._id]?.result ? 'border-red-500' : 'border-gray-300'
                              }`}
                            >
                              <option value="">-- Chọn kết quả --</option>
                              <option value="good">✅ Tốt</option>
                              <option value="bad">❌ Xấu</option>
                            </select>
                            {validationErrors[test._id]?.result && (
                              <p className="text-red-500 text-xs mt-1">{validationErrors[test._id].result}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hình ảnh kết quả
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                              <div className="space-y-1 text-center">
                                {uploadedImages[test._id] ? (
                                  <div className="relative">
                                    <img
                                      src={uploadedImages[test._id].preview}
                                      alt="Preview"
                                      className="mx-auto h-32 w-32 object-cover rounded-lg border border-gray-300"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeImage(test._id)}
                                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                    >
                                      ×
                                    </button>
                                    <p className="text-xs text-gray-600 mt-2 truncate max-w-32">
                                      {uploadedImages[test._id].name}
                                    </p>
                                  </div>
                                ) : (
                                  <>
                                    <svg
                                      className="mx-auto h-12 w-12 text-gray-400"
                                      stroke="currentColor"
                                      fill="none"
                                      viewBox="0 0 48 48"
                                    >
                                      <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                      <label
                                        htmlFor={`image-upload-${test._id}`}
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                      >
                                        <span>Tải lên hình ảnh</span>
                                        <input
                                          id={`image-upload-${test._id}`}
                                          type="file"
                                          className="sr-only"
                                          accept="image/*"
                                          onChange={(e) => handleImageUpload(test._id, e.target.files)}
                                        />
                                      </label>
                                      <p className="pl-1">hoặc kéo thả</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 5MB</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ghi chú bổ sung
                          </label>
                          <textarea
                            value={results[test._id]?.note || ''}
                            onChange={(e) => handleResultChange(test._id, 'note', e.target.value)}
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập ghi chú thêm về kết quả xét nghiệm..."
                          />
                        </div>

                        {results[test._id]?.result && (
                          <div className={`mt-6 p-4 rounded-lg border-l-4 ${
                            results[test._id]?.result === 'good' 
                              ? 'bg-green-50 border-green-500' 
                              : 'bg-red-50 border-red-500'
                          }`}>
                            <div className="flex items-start">
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                results[test._id]?.result === 'good' ? 'bg-green-500' : 'bg-red-500'
                              }`}>
                                {results[test._id]?.result === 'good' ? '✓' : '✗'}
                              </div>
                              <div className="ml-3">
                                <p className={`font-semibold ${
                                  results[test._id]?.result === 'good' ? 'text-green-900' : 'text-red-900'
                                }`}>
                                  {results[test._id]?.result === 'good' ? test.good_title : test.bad_title}
                                </p>
                                <p className={`text-sm mt-1 ${
                                  results[test._id]?.result === 'good' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {results[test._id]?.result === 'good' ? test.good_result : test.bad_result}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <div className="max-w-md mx-auto">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                    <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không tìm thấy kết quả xét nghiệm phù hợp
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Các dịch vụ trong đơn hàng chưa có mẫu kết quả xét nghiệm tương ứng trong hệ thống.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Dịch vụ đã đặt:</strong></p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {selectedOrder?.services?.map((service, index) => (
                        <span key={index} className="bg-gray-200 px-2 py-1 rounded text-xs">
                          {service.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            onClick={handleCloseResultModal}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={resultLoading || matchingTestResults.length === 0}
          >
            {resultLoading ? 'Đang xử lý...' : 'Lưu kết quả xét nghiệm'}
          </button>
        </div>
      </div>
    );
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
                onClick={handleRefresh}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Tải lại</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testOrders.filter(order => order.status === "Chờ thanh toán").length}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-900">Chờ thanh toán</p>
                  <p className="text-xs text-yellow-600">Cần xác nhận</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testOrders.filter(order => order.status === "Đã thanh toán, chờ xét nghiệm").length}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">Đã thanh toán, chờ xét nghiệm</p>
                  <p className="text-xs text-blue-600">Sẵn sàng xét nghiệm</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testOrders.filter(order => order.status === "Hoàn thành").length}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-900">Hoàn thành</p>
                  <p className="text-xs text-green-600">Đã xong</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testOrders.filter(order => order.status === "Đã hủy").length}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-900">Đã hủy</p>
                  <p className="text-xs text-red-600">Hủy bỏ</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
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
              title="Lọc theo ngày xét nghiệm"
            />

            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setDateFilter("");
                toast.info("Đã đặt lại bộ lọc");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              Đặt lại
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Hiển thị {filteredOrders.length} / {testOrders.length} đơn xét nghiệm
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bệnh nhân
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại xét nghiệm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian chờ kết quả
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày/Giờ xét nghiệm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.order_id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{order.patientName}</div>
                        <div className="text-xs text-gray-400">{order.patientPhone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {order.services && order.services.length > 0 ? (
                        <ServicesList 
                          services={order.services}
                        />
                      ) : (
                        <div className="max-w-xs">
                          {Array.isArray(order.testType) ? (
                            <div className="space-y-1">
                              {order.testType.slice(0, 3).map((test, index) => (
                                <div key={index} className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded">
                                  {test}
                                </div>
                              ))}
                              {order.testType.length > 3 && (
                                <div className="text-xs text-blue-600 font-medium">
                                  +{order.testType.length - 3} khác
                                </div>
                              )}
                            </div>
                          ) : (
                            order.testType
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <WaitTimesList 
                        waitTimes={order.testResultWaitTime}
                        services={order.services}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-medium text-green-600">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">
                          {order.date || 'Chưa xác định'}
                        </div>
                        <div className="text-xs text-gray-600">
                          {order.time || 'Chưa xác định'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
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
                              <>
                                <button
                                  onClick={() => handleUpdateStatus(order.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Xác nhận thanh toán
                                </button>
                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Hủy
                                </button>
                              </>
                            )}
                            {order.status === "Đã thanh toán, chờ xét nghiệm" && (
                              <button
                                onClick={() => handleCompleteOrder(order.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Hoàn thành xét nghiệm
                              </button>
                            )}
                          </>
                        )}
                        {order.status === "Hoàn thành" && (
                          <button
                            onClick={() => handleOpenResultModal(order)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Nhập kết quả xét nghiệm"
                          >
                            Nhập kết quả
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                        <p><span className="font-medium">Ngày đặt:</span> {new Date(selectedOrder.created_at).toLocaleDateString('vi-VN')}</p>
                        <p><span className="font-medium">Giờ đặt:</span> {new Date(selectedOrder.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                        <p><span className="font-medium">Ngày xét nghiệm:</span> {selectedOrder.date || 'Chưa xác định'}</p>
                        <p><span className="font-medium">Giờ xét nghiệm:</span> {selectedOrder.time || 'Chưa xác định'}</p>
                        <p><span className="font-medium">Loại đơn:</span> {selectedOrder.order_type === 'directly' ? 'Trực tiếp' : 'Online'}</p>
                        <p><span className="font-medium">Thanh toán:</span> {selectedOrder.payment_method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Dịch vụ xét nghiệm</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      {selectedOrder.services && selectedOrder.services.length > 0 ? (
                        <ServicesList 
                          services={selectedOrder.services}
                          isInModal={true}
                        />
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
                          <>
                            <button
                              onClick={() => handleUpdateStatus(selectedOrder.id)}
                              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            >
                              Xác nhận thanh toán
                            </button>
                            <button
                              onClick={() => handleCancelOrder(selectedOrder.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                              Hủy đơn
                            </button>
                          </>
                        )}
                        {selectedOrder.status === "Đã thanh toán, chờ xét nghiệm" && (
                          <button
                            onClick={() => handleCompleteOrder(selectedOrder.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                          >
                            Hoàn thành xét nghiệm
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {showResultModal && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-8 mt-8">
              <div className="relative w-full max-w-4xl bg-white shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Nhập kết quả xét nghiệm
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Mã đơn: #{selectedOrder.order_id}
                      </p>
                    </div>
                    <button
                      onClick={handleCloseResultModal}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <TestResultsInput />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
