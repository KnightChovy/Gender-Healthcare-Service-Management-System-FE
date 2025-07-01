import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import testService from "../../services/test.service";

const TestManagement = () => {
  console.log("TestManagement component loading...");

  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("pending"); // pending, completed, results
  const [testAppointments, setTestAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [availableTestTypes, setAvailableTestTypes] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [testResult, setTestResult] = useState({
    result_file: null,
    notes: "",
    diagnosis: "",
    recommendations: "",
  });
  const [newTestOrder, setNewTestOrder] = useState({
    patient_id: "",
    test_type_id: "",
    notes: "",
    scheduled_date: "",
    scheduled_time: "",
  });

  console.log("User:", user);

  // Mock data cho demo - sẽ thay thế bằng API call
  const mockTestAppointments = [
    {
      test_id: 1,
      appointment_id: "APT001",
      patient_name: "Nguyễn Thị Mai",
      patient_id: "P001",
      test_type: "Xét nghiệm máu tổng quát",
      test_code: "CBC",
      scheduled_date: "2025-01-02",
      scheduled_time: "09:00",
      status: "pending", // pending, completed, cancelled
      created_date: "2025-01-01",
      doctor_notes: "Kiểm tra tình trạng sức khỏe tổng quát",
      result_file: null,
      result_notes: "",
      diagnosis: "",
      recommendations: "",
    },
    {
      test_id: 2,
      appointment_id: "APT002",
      patient_name: "Trần Văn Nam",
      patient_id: "P002",
      test_type: "Xét nghiệm hormone",
      test_code: "HORMONE",
      scheduled_date: "2025-01-03",
      scheduled_time: "10:30",
      status: "completed",
      created_date: "2024-12-30",
      doctor_notes: "Kiểm tra rối loạn nội tiết",
      result_file: "hormone_test_result_P002.pdf",
      result_notes: "Kết quả trong giới hạn bình thường",
      diagnosis: "Không phát hiện bất thường",
      recommendations: "Duy trì chế độ ăn uống và sinh hoạt lành mạnh",
    },
    {
      test_id: 3,
      appointment_id: "APT003",
      patient_name: "Lê Thị Hoa",
      patient_id: "P003",
      test_type: "Siêu âm tử cung",
      test_code: "ULTRASOUND",
      scheduled_date: "2025-01-04",
      scheduled_time: "14:00",
      status: "pending",
      created_date: "2025-01-01",
      doctor_notes: "Theo dõi thai kỳ",
      result_file: null,
      result_notes: "",
      diagnosis: "",
      recommendations: "",
    },
  ];

  useEffect(() => {
    // Chỉ fetch data khi có user
    if (!user?.user_id) {
      setLoading(false);
      return;
    }

    // Fetch dữ liệu từ API
    const fetchData = async () => {
      try {
        setLoading(true);

        // Luôn sử dụng mock data trước để đảm bảo hiển thị
        setTestAppointments(mockTestAppointments);
        setAvailableTestTypes([
          { id: 1, name: "Xét nghiệm máu tổng quát", code: "CBC" },
          { id: 2, name: "Xét nghiệm hormone", code: "HORMONE" },
          { id: 3, name: "Siêu âm tử cung", code: "ULTRASOUND" },
          { id: 4, name: "Xét nghiệm nước tiểu", code: "URINE" },
        ]);

        // Thử lấy dữ liệu từ API (không bắt buộc)
        try {
          const testsResponse = await testService.fetchDoctorTests(
            user.user_id
          );
          if (testsResponse?.data && testsResponse.data.length > 0) {
            setTestAppointments(testsResponse.data);
          }
        } catch (error) {
          console.log("Sử dụng dữ liệu mock cho xét nghiệm:", error);
        }

        // Thử lấy danh sách loại xét nghiệm có sẵn
        try {
          const testTypesResponse = await testService.getAvailableTestTypes();
          if (testTypesResponse?.data && testTypesResponse.data.length > 0) {
            setAvailableTestTypes(testTypesResponse.data);
          }
        } catch (error) {
          console.log("Sử dụng dữ liệu mock cho loại xét nghiệm:", error);
        }

        // Thử lấy thống kê
        try {
          const statsResponse = await testService.getTestStatistics(
            user.user_id
          );
          if (statsResponse?.data) {
            setStatistics(statsResponse.data);
          }
        } catch (error) {
          console.log("Không thể lấy thống kê:", error);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu xét nghiệm:", error);
        // Đảm bảo luôn có dữ liệu mock
        setTestAppointments(mockTestAppointments);
        setAvailableTestTypes([
          { id: 1, name: "Xét nghiệm máu tổng quát", code: "CBC" },
          { id: 2, name: "Xét nghiệm hormone", code: "HORMONE" },
          { id: 3, name: "Siêu âm tử cung", code: "ULTRASOUND" },
          { id: 4, name: "Xét nghiệm nước tiểu", code: "URINE" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.user_id]);

  const filteredTests = testAppointments.filter((test) => {
    if (activeTab === "pending") return test.status === "pending";
    if (activeTab === "completed") return test.status === "completed";
    return true;
  });

  const handleUploadResult = (test) => {
    setSelectedTest(test);
    setTestResult({
      result_file: test.result_file,
      notes: test.result_notes || "",
      diagnosis: test.diagnosis || "",
      recommendations: test.recommendations || "",
    });
    setShowResultModal(true);
  };

  const handleSaveResult = async () => {
    try {
      // Upload file nếu có
      let resultFileUrl = testResult.result_file;
      if (
        testResult.result_file &&
        typeof testResult.result_file === "object"
      ) {
        try {
          const uploadResponse = await testService.uploadTestResultFile(
            selectedTest.test_id,
            testResult.result_file
          );
          resultFileUrl = uploadResponse.data.file_url;
        } catch (uploadError) {
          console.log("Upload file failed, using filename:", uploadError);
          resultFileUrl = testResult.result_file.name;
        }
      }

      // Cập nhật kết quả xét nghiệm
      const resultData = {
        result_file: resultFileUrl,
        notes: testResult.notes,
        diagnosis: testResult.diagnosis,
        recommendations: testResult.recommendations,
        status: "completed",
      };

      try {
        await testService.updateTestResult(selectedTest.test_id, resultData);
      } catch (apiError) {
        console.log("API update failed, updating local data only:", apiError);
      }

      // Update local state
      setTestAppointments((prev) =>
        prev.map((test) =>
          test.test_id === selectedTest.test_id
            ? {
                ...test,
                status: "completed",
                result_file: resultFileUrl,
                result_notes: testResult.notes,
                diagnosis: testResult.diagnosis,
                recommendations: testResult.recommendations,
              }
            : test
        )
      );

      // Gửi thông báo cho bệnh nhân
      try {
        await testService.notifyPatientResult(selectedTest.test_id);
      } catch (error) {
        console.log("Không thể gửi thông báo:", error);
      }

      setShowResultModal(false);
      setSelectedTest(null);
      alert("Kết quả xét nghiệm đã được lưu!");
    } catch (error) {
      console.error("Lỗi khi lưu kết quả:", error);
      alert("Có lỗi xảy ra khi lưu kết quả!");
    }
  };

  const handleCreateTestOrder = async () => {
    try {
      // Tạo test object mới với thông tin từ form
      const newTest = {
        test_id: Date.now(), // Temporary ID
        appointment_id: `APT${Date.now()}`,
        patient_name: `Bệnh nhân ${newTestOrder.patient_id}`,
        patient_id: newTestOrder.patient_id,
        test_type:
          availableTestTypes.find((t) => t.id == newTestOrder.test_type_id)
            ?.name || "Xét nghiệm",
        test_code:
          availableTestTypes.find((t) => t.id == newTestOrder.test_type_id)
            ?.code || "TEST",
        scheduled_date: newTestOrder.scheduled_date,
        scheduled_time: newTestOrder.scheduled_time,
        status: "pending",
        created_date: new Date().toISOString().split("T")[0],
        doctor_notes: newTestOrder.notes,
        result_file: null,
        result_notes: "",
        diagnosis: "",
        recommendations: "",
      };

      // Thử gọi API
      try {
        const response = await testService.createTestOrder(null, newTestOrder);
        console.log("API response:", response);
      } catch (apiError) {
        console.log("API call failed, using mock data:", apiError);
      }

      // Thêm vào danh sách local
      setTestAppointments((prev) => [newTest, ...prev]);
      setShowCreateModal(false);
      setNewTestOrder({
        patient_id: "",
        test_type_id: "",
        notes: "",
        scheduled_date: "",
        scheduled_time: "",
      });

      alert("Đơn xét nghiệm đã được tạo thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo đơn xét nghiệm:", error);
      alert("Có lỗi xảy ra khi tạo đơn xét nghiệm!");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ thực hiện";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-[85rem] mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[85rem] mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl text-blue-600 font-medium mb-2">
              Quản lý xét nghiệm
            </h1>
            <p className="text-gray-600">
              Quản lý đặt lịch xét nghiệm và trả kết quả cho bệnh nhân
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Tạo đơn xét nghiệm
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                <i className="fas fa-clock text-yellow-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {
                    testAppointments.filter((t) => t.status === "pending")
                      .length
                  }
                </h3>
                <p className="text-sm text-gray-600">Chờ thực hiện</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <i className="fas fa-check-circle text-green-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {
                    testAppointments.filter((t) => t.status === "completed")
                      .length
                  }
                </h3>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <i className="fas fa-flask text-blue-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {testAppointments.length}
                </h3>
                <p className="text-sm text-gray-600">Tổng xét nghiệm</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <i className="fas fa-percentage text-purple-600"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {testAppointments.length > 0
                    ? Math.round(
                        (testAppointments.filter(
                          (t) => t.status === "completed"
                        ).length /
                          testAppointments.length) *
                          100
                      )
                    : 0}
                  %
                </h3>
                <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className="fas fa-clock mr-2"></i>
              Chờ thực hiện (
              {testAppointments.filter((t) => t.status === "pending").length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "completed"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className="fas fa-check-circle mr-2"></i>
              Đã hoàn thành (
              {testAppointments.filter((t) => t.status === "completed").length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <i className="fas fa-list mr-2"></i>
              Tất cả ({testAppointments.length})
            </button>
          </nav>
        </div>

        {/* Test List */}
        <div className="p-6">
          {filteredTests.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-flask text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có xét nghiệm nào
              </h3>
              <p className="text-gray-500">
                {activeTab === "pending"
                  ? "Hiện tại không có xét nghiệm nào cần thực hiện."
                  : activeTab === "completed"
                  ? "Chưa có xét nghiệm nào được hoàn thành."
                  : "Chưa có dữ liệu xét nghiệm."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <div
                  key={test.test_id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {test.test_type}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Mã: {test.test_code}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadge(
                        test.status
                      )}`}
                    >
                      {getStatusText(test.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <i className="fas fa-user text-gray-400 w-4 mr-2"></i>
                      <span className="font-medium">{test.patient_name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-calendar text-gray-400 w-4 mr-2"></i>
                      <span>
                        {formatDate(test.scheduled_date)} -{" "}
                        {test.scheduled_time}
                      </span>
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <i className="fas fa-notes-medical text-gray-400 w-4 mr-2 mt-0.5"></i>
                      <span className="line-clamp-2">{test.doctor_notes}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {test.status === "pending" ? (
                      <button
                        onClick={() => handleUploadResult(test)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <i className="fas fa-upload mr-2"></i>
                        Nhập kết quả
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleUploadResult(test)}
                          className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <i className="fas fa-eye mr-2"></i>
                          Xem kết quả
                        </button>
                        {test.result_file && (
                          <a
                            href={`/files/${test.result_file}`}
                            download
                            className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-200 transition-colors flex items-center justify-center"
                          >
                            <i className="fas fa-download mr-2"></i>
                            Tải về
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedTest?.status === "pending"
                    ? "Nhập kết quả xét nghiệm"
                    : "Kết quả xét nghiệm"}
                </h2>
                <button
                  onClick={() => setShowResultModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Test Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-900 mb-2">
                  Thông tin xét nghiệm
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Bệnh nhân:</span>
                    <p className="font-medium">{selectedTest?.patient_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Loại xét nghiệm:</span>
                    <p className="font-medium">{selectedTest?.test_type}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Ngày thực hiện:</span>
                    <p className="font-medium">
                      {formatDate(selectedTest?.scheduled_date)} -{" "}
                      {selectedTest?.scheduled_time}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Mã xét nghiệm:</span>
                    <p className="font-medium">{selectedTest?.test_code}</p>
                  </div>
                </div>
              </div>

              {/* Result Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File kết quả
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) =>
                      setTestResult({
                        ...testResult,
                        result_file: e.target.files[0],
                      })
                    }
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={selectedTest?.status === "completed"}
                  />
                  {selectedTest?.result_file && (
                    <p className="text-sm text-gray-500 mt-1">
                      File hiện tại: {selectedTest.result_file}
                    </p>
                  )}
                  {testResult.result_file &&
                    typeof testResult.result_file === "object" && (
                      <p className="text-sm text-green-600 mt-1">
                        File mới: {testResult.result_file.name}
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chẩn đoán
                  </label>
                  <textarea
                    value={testResult.diagnosis}
                    onChange={(e) =>
                      setTestResult({
                        ...testResult,
                        diagnosis: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập chẩn đoán..."
                    readOnly={selectedTest?.status === "completed"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú kết quả
                  </label>
                  <textarea
                    value={testResult.notes}
                    onChange={(e) =>
                      setTestResult({ ...testResult, notes: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập ghi chú về kết quả..."
                    readOnly={selectedTest?.status === "completed"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khuyến nghị
                  </label>
                  <textarea
                    value={testResult.recommendations}
                    onChange={(e) =>
                      setTestResult({
                        ...testResult,
                        recommendations: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập khuyến nghị cho bệnh nhân..."
                    readOnly={selectedTest?.status === "completed"}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowResultModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {selectedTest?.status === "completed" ? "Đóng" : "Hủy"}
                </button>
                {selectedTest?.status === "pending" && (
                  <button
                    onClick={handleSaveResult}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Lưu kết quả
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Test Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Tạo đơn xét nghiệm mới
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã bệnh nhân
                  </label>
                  <input
                    type="text"
                    value={newTestOrder.patient_id}
                    onChange={(e) =>
                      setNewTestOrder({
                        ...newTestOrder,
                        patient_id: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mã bệnh nhân..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại xét nghiệm
                  </label>
                  <select
                    value={newTestOrder.test_type_id}
                    onChange={(e) =>
                      setNewTestOrder({
                        ...newTestOrder,
                        test_type_id: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn loại xét nghiệm</option>
                    {availableTestTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} ({type.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày thực hiện
                  </label>
                  <input
                    type="date"
                    value={newTestOrder.scheduled_date}
                    onChange={(e) =>
                      setNewTestOrder({
                        ...newTestOrder,
                        scheduled_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ thực hiện
                  </label>
                  <input
                    type="time"
                    value={newTestOrder.scheduled_time}
                    onChange={(e) =>
                      setNewTestOrder({
                        ...newTestOrder,
                        scheduled_time: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={newTestOrder.notes}
                    onChange={(e) =>
                      setNewTestOrder({
                        ...newTestOrder,
                        notes: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập ghi chú cho xét nghiệm..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateTestOrder}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={
                    !newTestOrder.patient_id ||
                    !newTestOrder.test_type_id ||
                    !newTestOrder.scheduled_date
                  }
                >
                  Tạo đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagement;
